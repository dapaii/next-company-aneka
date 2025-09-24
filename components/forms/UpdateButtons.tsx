"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { id: string };
type EventStatus = "draft" | "published" | "archived";

function isEventStatus(v: string): v is EventStatus {
  return v === "draft" || v === "published" || v === "archived";
}

type UpdateJsonPayload = {
  title?: string;
  slug?: string;
  description?: string;
  location?: string;
  startsAt?: string; // "YYYY-MM-DDTHH:mm"
  endsAt?: string;
  status?: EventStatus;
  // TIDAK ADA photos di JSON PUT
};

export default function UpdateButtons({ id }: Props) {
  const [loading, setLoading] = useState(false);

  async function onSave() {
    const form = document.getElementById("editForm") as HTMLFormElement | null;
    if (!form) return;
    setLoading(true);

    try {
      const fileInput = form.querySelector<HTMLInputElement>("#photo");
      const file = fileInput?.files?.[0] ?? null;

      if (file) {
        // === with file: PATCH multipart ===
        const fd = new FormData(form);
        // NOTE: Jangan set headers Content-Type manual, biarkan browser yang set boundary.
        const res = await fetch(`/api/events/${id}`, {
          method: "PATCH",
          body: fd,
        });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j && typeof j === "object" && "error" in j ? String((j as { error: unknown }).error) : "Gagal menyimpan (PATCH)");
        }
      } else {
        // === no file: PUT JSON (text fields only) ===
        const fd = new FormData(form);

        // helper
        const str = (name: string): string => {
          const v = fd.get(name);
          return typeof v === "string" ? v : "";
        };

        const payload: UpdateJsonPayload = {
          title: str("title"),
          slug: str("slug"),
          description: str("description"),
          location: str("location"),
          startsAt: str("startsAt"),
          endsAt: str("endsAt"),
        };

        const statusVal = str("status");
        if (isEventStatus(statusVal)) payload.status = statusVal;

        // Penting: JANGAN tambah field "photos" ke payload JSON
        const res = await fetch(`/api/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j && typeof j === "object" && "error" in j ? String((j as { error: unknown }).error) : "Gagal menyimpan (PUT)");
        }
      }

      // selesai
      window.location.href = "/dashboard/events";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      // eslint-disable-next-line no-alert
      alert(msg);
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function onCancel() {
    window.history.back();
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={onSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
      <Button variant="outline" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
    </div>
  );
}
