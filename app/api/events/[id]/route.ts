// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import type { Event as EventModel } from "@prisma/client";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// ---------- Schemas ----------
const EventStatusZ = z.enum(["draft", "published", "archived"]);

const EventUpdateJsonZ = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  // NOTE: via PUT JSON boleh replace seluruh array (walau UI tidak memakainya)
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

type EventDto = z.infer<typeof EventDtoZ>;

// ---------- Helpers ----------
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

function sanitizeFilename(name: string): string {
  const base = path.basename((name || "photo").split("?")[0]);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function toDto(ev: EventModel): EventDto {
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

// ---------- GET ----------
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

// ---------- PUT (JSON) ----------
// Update field text/status. Jika `photos` dikirim, akan replace total array.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();

  const bodyUnknown: unknown = await req.json();
  const payload = EventUpdateJsonZ.parse(bodyUnknown);

  const current = await prisma.event.findUnique({ where: { id: params.id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStartsAt = payload.startsAt ?? current.startsAt;
  const newEndsAt = payload.endsAt ?? current.endsAt;
  if (newEndsAt < newStartsAt) {
    return NextResponse.json({ error: "endsAt must be >= startsAt" }, { status: 400 });
  }

  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      location: payload.location,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      status: payload.status,
      photos: payload.photos, // jika undefined, tidak disentuh
    },
  });

  const dto = EventDtoZ.parse(toDto(updated));
  return NextResponse.json({ event: dto });
}

// ---------- PATCH (multipart) ----------
// HANYA untuk "ganti cover" (replace index 0). Tidak mendukung delete/add multiple.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 415 });
  }

  const current = await prisma.event.findUnique({ where: { id: params.id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();

  // text fields
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
  if (newEndsAt < newStartsAt) {
    return NextResponse.json({ error: "endsAt must be >= startsAt" }, { status: 400 });
  }

  // file (hanya 1, opsional)
  const first = form.get("photos");
  const file: File | null = first instanceof File ? first : null;

  // optional: old cover (untuk cleanup)
  const oldCoverVal = form.get("oldCover");
  const oldCover: string | null = typeof oldCoverVal === "string" ? oldCoverVal : null;

  let nextPhotos: string[] | undefined;

  // Jika ada file → simpan & replace index 0
  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File ${file.name} terlalu besar (max 5MB)` }, { status: 400 });
    }
    const mime = (file.type || "").toLowerCase();
    if (!ALLOWED_MIME.has(mime)) {
      return NextResponse.json({ error: `Tipe file tidak didukung: ${file.type}` }, { status: 400 });
    }

    const uploadDir = resolveUploadsDir(params.id);
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

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
    if (existing.length > 0) {
      // replace index 0
      nextPhotos = [...existing];
      nextPhotos[0] = newPath;
    } else {
      // belum ada cover → jadikan elemen pertama
      nextPhotos = [newPath];
    }

    // optional cleanup: hapus file cover lama kalau valid dan berbeda
    if (oldCover && isSafeEventFilePath(params.id, oldCover) && oldCover !== newPath) {
      const full = path.resolve(process.cwd(), "public", "." + oldCover);
      try {
        await unlink(full);
      } catch {
        // ignore jika file tidak ada
      }
    }
  }

  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      location: data.location,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      status: data.status,
      // hanya set photos jika kita memang ganti cover
      ...(nextPhotos ? { photos: nextPhotos } : {}),
    },
  });

  const dto = EventDtoZ.parse(toDto(updated));
  return NextResponse.json({ event: dto });
}

// ---------- DELETE (hapus event) ----------
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();

  // optional: bersihkan file-file yang terkait (cover & lainnya)
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
