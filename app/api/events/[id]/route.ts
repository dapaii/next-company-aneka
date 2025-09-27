import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import type { Event as EventModel } from "@prisma/client";
import { mkdir, writeFile, unlink } from "fs/promises";
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

function sanitizeFilename(name: string): string {
  const base = path.basename((name || "photo").split("?")[0]);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

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

function resolveUploadsDir(eventId: string): string {
  return path.join(process.cwd(), "public", "uploads", "events", eventId);
}

function isSafeEventFilePath(eventId: string, publicRelPath: string): boolean {
  if (!publicRelPath.startsWith(`/uploads/events/${eventId}/`)) return false;
  const full = path.resolve(process.cwd(), "public", "." + publicRelPath);
  const base = path.resolve(resolveUploadsDir(eventId));
  return full.startsWith(base + path.sep) || full === base;
}

/* =========================
 * Schemas
 * ========================= */
const EventStatusZ = z.enum(["draft", "published", "archived"]);

const EventUpdateJsonZ = z.object({
  title: z.string().min(3).optional(),
  slug: z
    .string()
    .optional()
    .transform((val) => slugify(val ?? "")) // normalize dulu
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

/* =========================
 * GET
 * ========================= */
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const ev = await prisma.event.findUnique({ where: { id: params.id } });
  if (!ev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = !!(await requireAdmin().catch(() => null));
  if (!isAdmin && ev.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const dto = EventDtoZ.parse(toDto(ev));
  return NextResponse.json({ event: dto });
}

/* =========================
 * PUT (JSON)
 * ========================= */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();

  const bodyUnknown: unknown = await req.json();
  const payload = EventUpdateJsonZ.parse(bodyUnknown);

  const current = await prisma.event.findUnique({ where: { id: params.id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStartsAt = payload.startsAt ?? current.startsAt;
  const newEndsAt = payload.endsAt ?? current.endsAt;

  // VALIDASI strict
  if (newEndsAt <= newStartsAt) {
    return NextResponse.json({ error: "endsAt must be greater than startsAt" }, { status: 400 });
  }

  const slug =
    payload.slug && payload.slug.length > 0
      ? await ensureUniqueSlug(payload.slug, params.id)
      : current.slug;

  const updated = await prisma.event.update({
    where: { id: params.id },
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
 * PATCH (multipart cover replace)
 * ========================= */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 415 });
  }

  const current = await prisma.event.findUnique({ where: { id: params.id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();
  const rawText = {
    title: form.get("title") ?? undefined,
    slug: form.get("slug") ?? undefined,
    description: form.get("description") ?? undefined,
    location: form.get("location") ?? undefined,
    startsAt: form.get("startsAt") ?? undefined,
    endsAt: form.get("endsAt") ?? undefined,
    status: form.get("status") ?? undefined,
  } as const;

  const parsed = EventUpdateJsonZ.safeParse(rawText);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const newStartsAt = data.startsAt ?? current.startsAt;
  const newEndsAt = data.endsAt ?? current.endsAt;

  // VALIDASI strict
  if (newEndsAt <= newStartsAt) {
    return NextResponse.json({ error: "endsAt must be greater than startsAt" }, { status: 400 });
  }

  const slug =
    data.slug && data.slug.length > 0
      ? await ensureUniqueSlug(data.slug, params.id)
      : current.slug;

  const first = form.get("photos");
  const file: File | null = first instanceof File ? first : null;
  const oldCoverVal = form.get("oldCover");
  const oldCover: string | null = typeof oldCoverVal === "string" ? oldCoverVal : null;

  let nextPhotos: string[] | undefined;

  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File ${file.name} terlalu besar (max 5MB)` },
        { status: 400 }
      );
    }
    const mime = (file.type || "").toLowerCase();
    if (!ALLOWED_MIME.has(mime)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung: ${file.type}` },
        { status: 400 }
      );
    }

    const uploadDir = resolveUploadsDir(params.id);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const clean = sanitizeFilename(file.name || "photo");
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
    const newPath = `/uploads/events/${params.id}/${fileName}`;

    const existing = current.photos ?? [];
    nextPhotos = existing.length > 0 ? [...existing] : [];
    nextPhotos[0] = newPath;

    if (oldCover && isSafeEventFilePath(params.id, oldCover) && oldCover !== newPath) {
      const full = path.resolve(process.cwd(), "public", "." + oldCover);
      try {
        await unlink(full);
      } catch {
        // ignore
      }
    }
  }

  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: data.title,
      slug,
      description: data.description,
      location: data.location,
      startsAt: newStartsAt,
      endsAt: newEndsAt,
      status: data.status,
      ...(nextPhotos ? { photos: nextPhotos } : {}),
    },
  });

  const dto = EventDtoZ.parse(toDto(updated));
  return NextResponse.json({ event: dto });
}

/* =========================
 * DELETE
 * ========================= */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();

  try {
    const ev = await prisma.event.findUnique({ where: { id: params.id } });
    if (ev?.photos?.length) {
      for (const p of ev.photos) {
        if (!isSafeEventFilePath(params.id, p)) continue;
        const full = path.resolve(process.cwd(), "public", "." + p);
        try {
          await unlink(full);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
