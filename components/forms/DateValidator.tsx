// components/forms/DateValidator.tsx
"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function DateValidator() {
  useEffect(() => {
    const form = document.getElementById("editForm") as HTMLFormElement | null;
    if (!form) return;

    const startEl = form.querySelector<HTMLInputElement>("#startsAt");
    const endEl = form.querySelector<HTMLInputElement>("#endsAt");

    // kalau salah satu null → langsung stop
    if (!startEl || !endEl) return;

    function checkDates() {
      if (startEl?.value && endEl?.value) {
        const start = new Date(startEl.value);
        const end = new Date(endEl.value);
        if (end <= start) {
          toast.error("⏳ End date harus lebih besar dari Start date");
        }
      }
    }

    startEl.addEventListener("change", checkDates);
    endEl.addEventListener("change", checkDates);

    return () => {
      startEl?.removeEventListener("change", checkDates);
      endEl?.removeEventListener("change", checkDates);
    };
  }, []);

  return null;
}
