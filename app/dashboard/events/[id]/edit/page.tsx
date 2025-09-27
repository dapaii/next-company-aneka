// app/dashboard/events/[id]/edit/page.tsx
// ❌ TIDAK ada "use client" di file ini (server component)
import { headers, cookies } from "next/headers";
import { z } from "zod";
import Image from "next/image";
import UpdateButtons from "@/components/forms/UpdateButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CoverUpload from "@/components/forms/CoverUpload"; // client component
import DateValidator from "@/components/forms/DateValidator"; // client component

const EventStatusZ = z.enum(["draft", "published", "archived"]);
const EventDtoZ = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  photos: z.array(z.string()),
  status: EventStatusZ,
  createdAt: z.string(),
  updatedAt: z.string(),
  createdById: z.string().nullable().optional(),
});
type EventDto = z.infer<typeof EventDtoZ>;

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

async function fetchEvent(id: string): Promise<EventDto> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const cookie = (await cookies()).toString();
  const url = new URL(`/api/events/${id}`, base).toString();

  const res = await fetch(url, { cache: "no-store", headers: { cookie } });
  if (!res.ok) throw new Error("Failed to fetch event");

  const json: unknown = await res.json();
  const parsed = z.object({ event: EventDtoZ }).parse(json);
  return parsed.event;
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function isValidRemoteUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
function isValidLocalPath(s: string): boolean {
  return s.startsWith("/uploads/");
}
function toSafeImageSrc(src?: string | null): string | null {
  if (!src) return null;
  const s = src.trim();
  if (s.length === 0) return null;
  if (isValidLocalPath(s) || isValidRemoteUrl(s)) return s;
  return null;
}

/** ✅ Perbaikan utama: params adalah Promise, jadi harus di-await */
export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // <- ini yang memperbaiki error
  const ev = await fetchEvent(id);

  const cover = toSafeImageSrc(ev.photos[0] ?? null);
  const extraCount = Math.max(0, (ev.photos?.length ?? 0) - 1);

  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">✏️ Edit Event</h1>
        <p className="text-sm text-muted-foreground">
          Perbarui detail event. Gambar hanya bisa diganti (replace cover).
        </p>
      </div>

      <form
        id="editForm"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        encType="multipart/form-data"
      >
        {/* Kolom kiri */}
        <div className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={ev.title} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (kebab-case)</Label>
            <Input id="slug" name="slug" defaultValue={ev.slug} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={ev.description ?? ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={ev.location ?? ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startsAt">Starts At</Label>
              <Input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                defaultValue={toLocalInput(ev.startsAt)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endsAt">Ends At</Label>
              <Input
                id="endsAt"
                name="endsAt"
                type="datetime-local"
                defaultValue={toLocalInput(ev.endsAt)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={ev.status}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="draft">📝 Draft</option>
              <option value="published">🚀 Published</option>
              <option value="archived">📦 Archived</option>
            </select>
          </div>
        </div>

        {/* Kolom kanan */}
        <div className="space-y-5">
          <CoverUpload defaultCover={cover} />
          {extraCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              Ada {extraCount} foto lain tersimpan (tidak dapat ditambah/hapus di sini).
            </p>
          ) : null}

          {cover ? <input type="hidden" name="oldCover" value={cover} /> : null}
          <input type="hidden" name="replaceMode" value="cover" />

          <div className="pt-10">
            <UpdateButtons id={ev.id} />
          </div>

          {/* Client component: validasi realtime tanggal */}
          <DateValidator />
        </div>
      </form>
    </main>
  );
}
