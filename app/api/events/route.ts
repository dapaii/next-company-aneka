import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/auth";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
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
    .transform((val) => slugify(val ?? ""))
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
const BUCKET = process.env.SUPABASE_BUCKET_NAME!;

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
  let sess;
  try {
    sess = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ct = req.headers.get("content-type") ?? "";

  // ---------- JSON mode ----------
  if (ct.includes("application/json")) {
    const body = await req.json();
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

    // 1️⃣ Buat event tanpa foto dulu
    const created = await prisma.event.create({
      data: { ...parsed.data, slug, createdById: sess.sub, photos: [] },
    });

    // 2️⃣ Upload file ke Supabase Storage
    const entries = form.getAll("photos");
    const files = entries.filter(isFile);
    const savedUrls: string[] = [];

    for (const f of files) {
      if (f.size === 0) continue;
      if (f.size > MAX_FILE_SIZE)
        return NextResponse.json(
          { error: `File ${f.name} terlalu besar (max 5MB)` },
          { status: 400 }
        );

      const mime = (f.type || "").toLowerCase();
      if (!ALLOWED_MIME.has(mime))
        return NextResponse.json(
          { error: `Tipe file tidak didukung: ${f.type}` },
          { status: 400 }
        );

      const ext = path.extname(f.name) || ".jpg";
      const fileName = `${Date.now()}-${slug}${ext}`;
      const arrayBuffer = await f.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload ke Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(`events/${created.id}/${fileName}`, buffer, {
          contentType: f.type,
          upsert: true,
        });

      if (error || !data?.path) {
        console.error("Upload gagal:", error);
        continue;
      }

      // Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      const url = publicUrlData?.publicUrl ?? null;
      if (url) savedUrls.push(url);
    }

    // 3️⃣ Update event dengan URL foto
    const updated = await prisma.event.update({
      where: { id: created.id },
      data: { photos: savedUrls },
    });

    return NextResponse.json({ event: updated }, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
}
