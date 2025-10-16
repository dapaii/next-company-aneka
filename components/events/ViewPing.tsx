// components/events/ViewPing.tsx
"use client";

import { useEffect, useRef } from "react";

type Props = { slug: string };

const ViewPing = ({ slug }: Props) => {
  const fired = useRef(false);
  const timer = useRef<number | null>(null);

  const doPing = () => {
    if (fired.current) return;
    fired.current = true;

    // kirim ping; keepalive agar tetap terkirim walau user cepat navigate/close
    fetch(`/api/event-views/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      cache: "no-store",
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      // optional: bisa log ke Sentry dsb
    });
  };

  useEffect(() => {
    // 1) Jika halaman sudah visible, ping setelah render microtask
    if (document.visibilityState === "visible") {
      // kecilkan jeda agar tidak race dengan hydration
      timer.current = window.setTimeout(doPing, 50);
    }

    // 2) Kalau datang lewat client navigation & masih hidden, tunggu sampai visible
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        doPing();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 3) Fallback saat halaman “pageshow” (mis. dari bfcache/back-forward)
    const onPageShow = () => doPing();
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      if (timer.current) window.clearTimeout(timer.current);
    };
    // hanya tergantung slug, jangan ubah fired
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
};

export default ViewPing;
