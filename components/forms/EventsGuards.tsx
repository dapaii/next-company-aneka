"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type EventStatus = "draft" | "published" | "archived";

export type EventGuardItem = {
  id: string;
  title: string;
  startsAt: string; 
  endsAt: string;   
  status: EventStatus;
  cover: string | null;
};

export default function EventsGuards({ events }: { events: EventGuardItem[] }) {
  useEffect(() => {
    for (const ev of events) {
      const s = new Date(ev.startsAt);
      const e = new Date(ev.endsAt);

      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
        toast.error(`Tanggal invalid pada "${ev.title}"`, {
          description: "Periksa startsAt/endsAt event ini.",
        });
        continue;
      }

      if (e <= s) {
        toast.error(`Rentang waktu tidak valid: "${ev.title}"`, {
          description: "Ends At harus lebih besar daripada Starts At.",
        });
      }

      if (ev.status === "published" && !ev.cover) {
        toast.warning(`"${ev.title}" dipublish tanpa cover`, {
          description: "Sebaiknya tambahkan cover image agar tampilannya maksimal.",
        });
      }
    }

    const forms = document.querySelectorAll<HTMLFormElement>('form[data-delete-form="true"]');

    const handlers: Array<[(e: Event) => void, HTMLFormElement]> = [];

    forms.forEach((form) => {
      const onSubmit = (e: Event) => {
        e.preventDefault();
        const btn = form.querySelector("button[type=submit]") as HTMLButtonElement | null;
        const title =
          (form.querySelector('input[name="title"]') as HTMLInputElement | null)?.value || "Event";

        const tId = toast.loading(`Menghapus ${title}...`);

        setTimeout(() => {
          toast.dismiss(tId);
          toast.success(`${title} terhapus`);
        }, 1200);

        if (btn) btn.disabled = true;
      };

      form.addEventListener("submit", onSubmit);
      handlers.push([onSubmit, form]);
    });

    return () => {
      for (const [fn, f] of handlers) {
        f.removeEventListener("submit", fn);
      }
    };
  }, [events]);

  return null;
}
