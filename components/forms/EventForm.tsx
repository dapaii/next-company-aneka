"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type EventStatus = "draft" | "published" | "archived";

function isEventStatus(v: string): v is EventStatus {
  return v === "draft" || v === "published" || v === "archived";
}

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<EventStatus>("draft");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ realtime validasi tanggal
  function validateDates(start: string, end: string) {
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      if (e <= s) {
        toast.error("⏳ End date harus lebih besar dari start date");
        return false;
      }
    }
    return true;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setLoading(true);

  const form = e.currentTarget;
  const fd = new FormData(form);
  fd.set("status", status);

  if (!validateDates(startsAt, endsAt)) {
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      body: fd,
      credentials: "include", // ✅ kirim cookie ke server
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error ?? "Gagal simpan event");
      throw new Error(message);
    }

    toast.success("🎉 Event berhasil disimpan");
    setTimeout(() => (window.location.href = "/dashboard/events"), 800);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Gagal simpan event:", msg);
    toast.error(msg);
  } finally {
    setLoading(false);
  }
}

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto bg-card shadow-sm rounded-xl p-6 border"
    >
      {/* Kolom kiri */}
      <div className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight">📅 Tambah Event Baru</h2>
        <p className="text-sm text-muted-foreground">
          Lengkapi detail event dengan benar, lalu simpan.
        </p>

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            disabled={loading}
            placeholder="Masukkan judul event"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (kebab-case)</Label>
          <Input
            id="slug"
            name="slug"
            required
            placeholder="contoh: seminar-ai-bandung"
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            disabled={loading}
            placeholder="Tuliskan deskripsi event..."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Aula Gedung A, Kampus Widyatama"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="startsAt">Starts At</Label>
            <Input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              required
              disabled={loading}
              value={startsAt}
              onChange={(e) => {
                setStartsAt(e.target.value);
                validateDates(e.target.value, endsAt);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endsAt">Ends At</Label>
            <Input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              required
              disabled={loading}
              value={endsAt}
              onChange={(e) => {
                setEndsAt(e.target.value);
                validateDates(startsAt, e.target.value);
              }}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v: string) => {
              if (isEventStatus(v)) setStatus(v);
            }}
            disabled={loading}
          >
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">📝 Draft</SelectItem>
              <SelectItem value="published">🚀 Published</SelectItem>
              <SelectItem value="archived">📦 Archived</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
        </div>
      </div>

      {/* Kolom kanan */}
      <div className="space-y-5 flex flex-col">
        <div className="grid gap-2">
          <Label htmlFor="photos">Photos (PNG/JPG/WEBP)</Label>
          <Input
            id="photos"
            name="photos"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            disabled={loading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              } else {
                setPreview(null);
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            Maks 5MB per file. Preview ditampilkan otomatis.
          </p>
        </div>

        {/* Live Preview */}
        {preview && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
            <Image
              src={preview}
              alt="Preview cover"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Sticky action */}
        <div className="mt-auto">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </span>
            ) : (
              "Save Event"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
