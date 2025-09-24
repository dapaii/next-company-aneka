// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Pastikan Node runtime (butuh fs)
export const runtime = "nodejs";

// ----- Schemas -----
const EventBase = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
});

// JSON mode: izinkan photos (string path), default []
const EventCreateJson = EventBase.extend({
  photos: z.array(z.string().min(1)).optional().default([]),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

function sanitizeFilename(name: string): string {
  const noQuery = name.split("?")[0];
  const base = path.basename(noQuery);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// ----- GET: list events -----
export async function GET(_req: NextRequest) {
  const isAdmin = !!(await requireAdmin().catch(() => null));
  const where = isAdmin ? {} : { status: "published" as const };
  const events = await prisma.event.findMany({
    where,
    orderBy: { startsAt: "desc" },
  });
  return NextResponse.json({ events });
}

// ----- POST: create (JSON or multipart) -----
export async function POST(req: NextRequest) {
  // Sesuaikan tipe session kalau fungsi requireAdmin returnnya berbeda
  const sess: { sub: string } = await requireAdmin();

  const ct = req.headers.get("content-type") ?? "";

  // JSON mode
  if (ct.includes("application/json")) {
    const body: unknown = await req.json();
    const data = EventCreateJson.parse(body);

    if (data.endsAt < data.startsAt) {
      return NextResponse.json({ error: "endsAt must be >= startsAt" }, { status: 400 });
    }

    const created = await prisma.event.create({
      data: { ...data, createdById: sess.sub },
    });

    return NextResponse.json({ event: created }, { status: 201 });
  }

  // Multipart mode (upload file lokal)
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();

    const raw = {
      title: form.get("title"),
      slug: form.get("slug"),
      description: form.get("description") || undefined,
      location: form.get("location") || undefined,
      startsAt: form.get("startsAt"),
      endsAt: form.get("endsAt"),
      status: form.get("status") || "draft",
    } as const;

    const parsed = EventBase.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    if (data.endsAt < data.startsAt) {
      return NextResponse.json({ error: "endsAt must be >= startsAt" }, { status: 400 });
    }

    // 1) Buat event dulu (tanpa photos)
    const created = await prisma.event.create({
      data: { ...data, createdById: sess.sub, photos: [] },
    });

    // 2) Simpan file ke /public/uploads/events/{id}/
    const entries = form.getAll("photos");
    const files: File[] = entries.filter((v): v is File => v instanceof File);

    const savedPaths: string[] = [];
    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "events", created.id);
      await mkdir(uploadDir, { recursive: true });

      for (const f of files) {
        if (f.size === 0) continue;
        if (f.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: `File ${f.name} terlalu besar (max 5MB)` }, { status: 400 });
        }
        const mime: string = (f.type || "").toLowerCase();
        if (!ALLOWED_MIME.has(mime)) {
          return NextResponse.json({ error: `Tipe file tidak didukung: ${f.type}` }, { status: 400 });
        }

        const bytes = await f.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const clean = sanitizeFilename(f.name || "photo");
        const ext =
          clean.includes(".")
            ? ""
            : mime === "image/png"
            ? ".png"
            : mime.includes("jpeg")
            ? ".jpg"
            : ".webp";
        const fileName = `${Date.now()}-${clean}${ext}`;

        await writeFile(path.join(uploadDir, fileName), buffer);
        savedPaths.push(`/uploads/events/${created.id}/${fileName}`);
      }
    }

    // 3) Update kolom photos
    const updated = await prisma.event.update({
      where: { id: created.id },
      data: { photos: savedPaths },
    });

    return NextResponse.json({ event: updated }, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
}
