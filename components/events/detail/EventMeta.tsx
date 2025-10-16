// components/events/detail/EventMeta.tsx
import { CalendarRange, Clock4, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/time/format-datetime";

type Props = {
  startsAt: string;
  endsAt: string;
  durationHours: number;
  location?: string | null;
};

export default function EventMeta({
  startsAt,
  endsAt,
  durationHours,
  location,
}: Props) {
  // Hitung status waktu (server-safe, tanpa hooks)
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const now = new Date();

  const isLive = start <= now && now <= end;
  const isPast = now > end;

  const statusText = isLive ? "Sedang Berlangsung" : isPast ? "Sudah Berakhir" : "Akan Datang";
  const statusClass = isLive
    ? "bg-emerald-600 text-white"
    : isPast
    ? "bg-slate-500 text-white"
    : "bg-sky-600 text-white";

  // Render lokasi yang “pintar”: URL -> tampilkan host; teks -> link ke Google Maps
  const renderLocation = () => {
    if (!location) return <span className="text-sm">—</span>;

    const trimmed = location.trim();
    const isUrl = /^https?:\/\//i.test(trimmed);

    if (isUrl) {
      try {
        const u = new URL(trimmed);
        return (
          <a
            href={trimmed}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline underline-offset-4 hover:opacity-90"
            title={trimmed}
          >
            {u.hostname} — Kunjungi
          </a>
        );
      } catch {
        // fallback ke Google Maps bila URL gagal di-parse
      }
    }

    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
    return (
      <a
        href={maps}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline underline-offset-4 hover:opacity-90"
        title={`Buka di Google Maps: ${trimmed}`}
      >
        {trimmed}
      </a>
    );
  };

  return (
    <section
      className="rounded-xl border bg-card p-4 sm:p-5 shadow-sm"
      aria-label="Detail informasi event"
    >
      {/* Header status */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge className={`capitalize ${statusClass}`}>
          {statusText}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {isLive
            ? "Sedang berlangsung sekarang"
            : isPast
            ? "Event telah selesai"
            : "Event belum dimulai"}
        </span>
      </div>

      {/* Detail list */}
      <dl className="grid gap-4 sm:grid-cols-3">
        {/* Waktu */}
        <div className="flex items-start gap-3">
          <CalendarRange aria-hidden className="h-5 w-5 text-primary mt-0.5" />
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Waktu</dt>
            <dd className="text-sm leading-snug">
              <span className="block sm:inline">{formatDateTime(startsAt)}</span>
              <span className="hidden sm:inline"> — </span>
              <span className="block sm:inline">{formatDateTime(endsAt)}</span>
            </dd>
          </div>
        </div>

        {/* Durasi */}
        <div className="flex items-start gap-3">
          <Clock4 aria-hidden className="h-5 w-5 text-primary mt-0.5" />
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Durasi</dt>
            <dd className="text-sm">{durationHours} jam</dd>
          </div>
        </div>

        {/* Lokasi */}
        <div className="flex items-start gap-3">
          <MapPin aria-hidden className="h-5 w-5 text-primary mt-0.5" />
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Lokasi</dt>
            <dd className="truncate">{renderLocation()}</dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
