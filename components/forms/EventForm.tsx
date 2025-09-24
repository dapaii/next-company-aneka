// components/forms/EventForm.tsx
"use client";

import { useState } from "react";
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

type EventStatus = "draft" | "published" | "archived";

function isEventStatus(v: string): v is EventStatus {
  return v === "draft" || v === "published" || v === "archived";
}

export default function EventForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<EventStatus>("draft");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    // sinkronkan status dari shadcn Select -> hidden input
    fd.set("status", status);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: fd, // penting: jangan set Content-Type manual
      });

      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null);

        let message = "Gagal simpan event";
        if (body && typeof body === "object" && "error" in body) {
          const errVal = (body as { error: unknown }).error;
          message =
            typeof errVal === "string"
              ? errVal
              : (() => {
                  try {
                    return JSON.stringify(errVal);
                  } catch {
                    return "Gagal simpan event";
                  }
                })();
        }
        throw new Error(message);
      }

      window.location.href = "/dashboard/events";
    } catch (err) {
      // err bertipe unknown di TS; aman dikirim ke console & alert sebagai string
      const msg =
        err instanceof Error ? err.message : "Gagal simpan event";
      // eslint-disable-next-line no-console
      console.error(err);
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-2xl">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required disabled={loading} />
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
        <Textarea id="description" name="description" rows={4} disabled={loading} />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="startsAt">Starts At</Label>
          <Input id="startsAt" name="startsAt" type="datetime-local" required disabled={loading} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endsAt">Ends At</Label>
          <Input id="endsAt" name="endsAt" type="datetime-local" required disabled={loading} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="photos">Photos (PNG/JPG/WEBP) — multiple</Label>
        <Input
          id="photos"
          name="photos"
          type="file"
          multiple
          // samakan dengan whitelist di API biar gak “false hope”
          accept="image/png,image/jpeg,image/jpg,image/webp"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Maks 5MB per file.</p>
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
            <SelectItem value="draft">draft</SelectItem>
            <SelectItem value="published">published</SelectItem>
            <SelectItem value="archived">archived</SelectItem>
          </SelectContent>
        </Select>
        {/* Hidden untuk ikut terkirim via FormData (fallback kalau JS di-disable) */}
        <input type="hidden" name="status" value={status} />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
