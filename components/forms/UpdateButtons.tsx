"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  startsAt?: string;
  endsAt?: string;
  status?: EventStatus;
};

export default function UpdateButtons({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSave() {
    const form = document.getElementById("editForm") as HTMLFormElement | null;
    if (!form) return;
    setLoading(true);

    try {
      const fileInput = form.querySelector<HTMLInputElement>("#photo");
      const file = fileInput?.files?.[0] ?? null;

      if (file) {
        // === PATCH multipart ===
        const fd = new FormData(form);

        // validasi tanggal
        const startsAt = fd.get("startsAt");
        const endsAt = fd.get("endsAt");
        if (typeof startsAt === "string" && typeof endsAt === "string") {
          const startDate = new Date(startsAt);
          const endDate = new Date(endsAt);
          if (endDate <= startDate) {
            toast.error("End date harus lebih besar dari start date");
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`/api/events/${id}`, {
          method: "PATCH",
          body: fd,
        });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(
            j && typeof j === "object" && "error" in j
              ? String((j as { error: unknown }).error)
              : "Gagal menyimpan (PATCH)"
          );
        }
      } else {
        // === PUT JSON ===
        const fd = new FormData(form);
        const str = (name: string): string => {
          const v = fd.get(name);
          return typeof v === "string" ? v : "";
        };

        const startsAt = str("startsAt");
        const endsAt = str("endsAt");

        if (startsAt && endsAt) {
          const startDate = new Date(startsAt);
          const endDate = new Date(endsAt);
          if (endDate <= startDate) {
            toast.error("End date harus lebih besar dari start date");
            setLoading(false);
            return;
          }
        }

        const payload: UpdateJsonPayload = {
          title: str("title"),
          slug: str("slug"),
          description: str("description"),
          location: str("location"),
          startsAt,
          endsAt,
        };

        const statusVal = str("status");
        if (isEventStatus(statusVal)) payload.status = statusVal;

        const res = await fetch(`/api/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(
            j && typeof j === "object" && "error" in j
              ? String((j as { error: unknown }).error)
              : "Gagal menyimpan (PUT)"
          );
        }
      }

      toast.success("Event berhasil disimpan");
      router.replace("/dashboard/events");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      toast.error(msg);
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function onCancel() {
    // Jangan submit form; langsung navigate
    if (typeof window !== "undefined" && window.history.length > 1) {
      // coba back; kasih fallback untuk direct-open case
      window.history.back();
      setTimeout(() => {
        // kalau masih di halaman yg sama (mis. nggak punya history), fallback
        if (window.location.pathname.includes("/dashboard/events/") && window.location.pathname.endsWith("/edit")) {
          router.replace("/dashboard/events");
        }
      }, 150);
      return;
    }
    router.replace("/dashboard/events");
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" onClick={onSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
    </div>
  );
}
