// app/dashboard/events/[id]/edit/page.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import UpdateButtons from "@/components/forms/UpdateButtons"; // client sudah ada
import CoverUpload from "@/components/forms/CoverUpload";     // client sudah ada
import DateValidator from "@/components/forms/DateValidator"; // client sudah ada

import type { EventDto } from "@/lib/events/schemas";
import { fetchEventById } from "@/services/events";
import { toSafeImageSrc } from "@/lib/image/safe-src";
import { toLocalInput } from "@/lib/time/html-input";

/** Next 15: params bisa Promise — helper kecil */
const resolveParams = <T,>(v: T | Promise<T>) => Promise.resolve(v);

export default async function EditEventPage({
  params,
}: { params: { id: string } | Promise<{ id: string }> }) {
  const { id } = await resolveParams(params);
  const ev: EventDto = await fetchEventById(id);

  const cover = toSafeImageSrc(ev.photos?.[0] ?? null);
  const extraCount = Math.max(0, (ev.photos?.length ?? 0) - 1);

  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">✏️ Edit Event</h1>
        <p className="text-sm text-muted-foreground">
          Perbarui detail event. Gambar hanya bisa diganti (replace cover).
        </p>
      </header>

      <form
        id="editForm"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        encType="multipart/form-data"
      >
        {/* Kolom kiri: field text */}
        <section className="space-y-5">
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
            <Textarea id="description" name="description" rows={3} defaultValue={ev.description ?? ""} />
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
        </section>

        {/* Kolom kanan: cover + aksi */}
        <section className="space-y-5">
          <CoverUpload defaultCover={cover} />

          {extraCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Ada {extraCount} foto lain tersimpan (tidak dapat ditambah/hapus di sini).
            </p>
          )}

          {cover && <input type="hidden" name="oldCover" value={cover} />}
          <input type="hidden" name="replaceMode" value="cover" />

          <div className="pt-10">
            <UpdateButtons id={ev.id} />
          </div>

          {/* Validasi realtime tanggal (client) */}
          <DateValidator />
        </section>
      </form>
    </main>
  );
}
