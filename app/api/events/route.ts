// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/auth";
import { z } from "zod";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

/* =========================
 * Utils
 * ========================= */
function slugify(input: string): string {
  return (input ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name.split("?")[0]);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isFile(v: FormDataEntryValue): v is File {
  return v instanceof File;
}

/* =========================
 * Schemas
 * ========================= */
const StatusEnum = z.enum(["draft", "published", "archived"]);

const EventBase = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .optional()
    .transform((val) => slugify(val ?? "")) // normalize dulu
    .refine((val) => /^[a-z0-9-]+$/.test(val), {
      message: "Slug hanya boleh huruf kecil, angka, dan strip",
    }),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  status: StatusEnum.default("draft"),
});

const EventCreateJson = EventBase.extend({
  photos: z.array(z.string()).optional().default([]),
});

/* =========================
 * Constants
 * ========================= */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME: ReadonlySet<string> = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

/* =========================
 * GET: list events
 * ========================= */
export async function GET(_req: NextRequest) {
  const isAdmin = !!(await requireAdmin().catch(() => null));
  const where = isAdmin ? {} : { status: "published" as const };
  const events = await prisma.event.findMany({
    where,
    orderBy: { startsAt: "desc" },
  });
  return NextResponse.json({ events });
}

/* =========================
 * POST: create (JSON or multipart)
 * ========================= */
export async function POST(req: NextRequest) {
  const sess = (await requireAdmin()) as { sub: string };
  const ct = req.headers.get("content-type") ?? "";

  // ---------- JSON mode ----------
  if (ct.includes("application/json")) {
    const body = (await req.json()) as unknown;
    const parsed = EventCreateJson.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(
      parsed.data.slug && parsed.data.slug.length > 0
        ? parsed.data.slug
        : slugify(parsed.data.title)
    );

    if (parsed.data.endsAt < parsed.data.startsAt) {
      return NextResponse.json(
        { error: "endsAt must be >= startsAt" },
        { status: 400 }
      );
    }

    const created = await prisma.event.create({
      data: { ...parsed.data, slug, createdById: sess.sub },
    });

    return NextResponse.json({ event: created }, { status: 201 });
  }

  // ---------- Multipart mode ----------
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();

    const raw = {
      title: form.get("title"),
      slug: (form.get("slug") as string | null) ?? undefined,
      description: (form.get("description") as string | null) ?? undefined,
      location: (form.get("location") as string | null) ?? undefined,
      startsAt: form.get("startsAt"),
      endsAt: form.get("endsAt"),
      status: (form.get("status") as string | null) ?? undefined,
    };

    const parsed = EventBase.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(
      parsed.data.slug && parsed.data.slug.length > 0
        ? parsed.data.slug
        : slugify(parsed.data.title)
    );

    if (parsed.data.endsAt < parsed.data.startsAt) {
      return NextResponse.json(
        { error: "endsAt must be >= startsAt" },
        { status: 400 }
      );
    }

    // 1) Buat event dulu (tanpa photos)
    const created = await prisma.event.create({
      data: { ...parsed.data, slug, createdById: sess.sub, photos: [] },
    });

    // 2) Simpan file
    const entries = form.getAll("photos");
    const files = entries.filter(isFile);

    const savedPaths: string[] = [];
    if (files.length > 0) {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "events",
        created.id
      );
      await mkdir(uploadDir, { recursive: true });

      for (const f of files) {
        if (f.size === 0) continue;
        if (f.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File ${f.name} terlalu besar (max 5MB)` },
            { status: 400 }
          );
        }
        const mime = (f.type || "").toLowerCase();
        if (!ALLOWED_MIME.has(mime)) {
          return NextResponse.json(
            { error: `Tipe file tidak didukung: ${f.type}` },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await f.arrayBuffer());
        const clean = sanitizeFilename(f.name || "photo");
        const ext = clean.includes(".")
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

    const updated = await prisma.event.update({
      where: { id: created.id },
      data: { photos: savedPaths },
    });

    return NextResponse.json({ event: updated }, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
}
