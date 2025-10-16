import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/auth";
import { z } from "zod";
import type { Event as EventModel } from "@prisma/client";
import { supabase } from "@/lib/supabase";

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

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (true) {
    const found = await prisma.event.findUnique({ where: { slug } });
    if (!found || (excludeId && found.id === excludeId)) break;
    slug = `${base}-${n++}`;
  }
  return slug;
}

const EventStatusZ = z.enum(["draft", "published", "archived"]);

function toDto(ev: EventModel) {
  return {
    id: ev.id,
    title: ev.title,
    slug: ev.slug,
    description: ev.description ?? null,
    location: ev.location ?? null,
    startsAt: ev.startsAt.toISOString(),
    endsAt: ev.endsAt.toISOString(),
    photos: ev.photos ?? [],
    status: ev.status as z.infer<typeof EventStatusZ>,
    createdAt: ev.createdAt.toISOString(),
    updatedAt: ev.updatedAt.toISOString(),
    createdById: ev.createdById ?? null,
  };
}

/* =========================
 * Schemas
 * ========================= */
const EventUpdateJsonZ = z.object({
  title: z.string().min(3).optional(),
  slug: z
    .string()
    .optional()
    .transform((val) => slugify(val ?? ""))
    .refine((val) => val === "" || /^[a-z0-9-]+$/.test(val), {
      message: "Slug hanya boleh huruf kecil, angka, dan strip",
    }),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  photos: z.array(z.string().min(1)).optional(),
  status: EventStatusZ.optional(),
});

const EventDtoZ = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  photos: z.array(z.string()),
  status: EventStatusZ,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdById: z.string().nullable().optional(),
});

/* =========================
 * Constants
 * ========================= */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const BUCKET = process.env.SUPABASE_BUCKET_NAME!;

/* =========================
 * GET
 * ========================= */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = await prisma.event.findUnique({ where: { id } });
  if (!ev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = !!(await requireAdmin().catch(() => null));
  if (!isAdmin && ev.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const dto = EventDtoZ.parse(toDto(ev));
  return NextResponse.json({ event: dto });
}

/* =========================
 * PUT (JSON update)
 * ========================= */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const bodyUnknown: unknown = await req.json();
  const payload = EventUpdateJsonZ.parse(bodyUnknown);

  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStartsAt = payload.startsAt ?? current.startsAt;
  const newEndsAt = payload.endsAt ?? current.endsAt;
  if (newEndsAt <= newStartsAt) {
    return NextResponse.json({ error: "endsAt must be greater than startsAt" }, { status: 400 });
  }

  const slug =
    payload.slug && payload.slug.length > 0
      ? await ensureUniqueSlug(payload.slug, id)
      : current.slug;

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: payload.title,
      slug,
      description: payload.description,
      location: payload.location,
      startsAt: newStartsAt,
      endsAt: newEndsAt,
      status: payload.status,
      photos: payload.photos,
    },
  });

  const dto = EventDtoZ.parse(toDto(updated));
  return NextResponse.json({ event: dto });
}

/* =========================
 * PATCH (upload & replace cover)
 * ========================= */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ct = req.headers.get("content-type") ?? "";

  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 415 });
  }

  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("photos");
  const photo = file instanceof File ? file : null;

  if (!photo) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (photo.size > MAX_FILE_SIZE)
    return NextResponse.json({ error: `File terlalu besar (max 5MB)` }, { status: 400 });

  const mime = (photo.type || "").toLowerCase();
  if (!ALLOWED_MIME.has(mime))
    return NextResponse.json({ error: `Tipe file tidak didukung: ${photo.type}` }, { status: 400 });

  const ext = photo.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${id}.${ext}`;
  const arrayBuffer = await photo.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Upload ke Supabase
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(`events/${id}/${fileName}`, buffer, { contentType: photo.type, upsert: true });

  if (error || !data?.path) {
    console.error("Upload gagal:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Dapatkan URL publik
  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  const newUrl = publicData?.publicUrl ?? null;
  if (!newUrl) {
    return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 });
  }

  // Hapus foto lama
  if (current.photos?.length) {
    try {
      for (const url of current.photos) {
        const u = new URL(url);
        const relPath = u.pathname.split(`/storage/v1/object/public/${BUCKET}/`)[1];
        if (relPath) await supabase.storage.from(BUCKET).remove([relPath]);
      }
    } catch (err) {
      console.warn("Gagal hapus file lama:", err);
    }
  }

  const updated = await prisma.event.update({
    where: { id },
    data: { photos: [newUrl] },
  });

  return NextResponse.json({ event: toDto(updated) });
}

/* =========================
 * DELETE
 * ========================= */
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ev = await prisma.event.findUnique({ where: { id } });
  if (!ev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (ev.photos?.length) {
    try {
      const paths: string[] = [];
      for (const url of ev.photos) {
        const u = new URL(url);
        const relPath = u.pathname.split(`/storage/v1/object/public/${BUCKET}/`)[1];
        if (relPath) paths.push(relPath);
      }
      if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
    } catch (err) {
      console.warn("Gagal hapus foto dari Supabase:", err);
    }
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
