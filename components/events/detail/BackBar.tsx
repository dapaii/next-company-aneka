// components/events/detail/BackBar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { EventStatus } from "@/types/events";
import { statusBadgeVariant } from "@/lib/events/status-variant";

/**
 * BackBar: bar navigasi atas untuk halaman detail event
 * - Tombol kembali ke /events
 * - Badge "Live" (bila isLive true) dengan indikator pulsing
 * - Badge status (draft/published/archived) menggunakan variant dari statusBadgeVariant()
 */
export default function BackBar({
  isLive,
  status,
}: {
  isLive: boolean;
  status: EventStatus;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Tombol kembali */}
      <div className="flex items-center">
        <Button variant="outline" asChild aria-label="Kembali ke daftar event">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Event
          </Link>
        </Button>
      </div>

      {/* Kanan: status badges */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        {isLive ? (
          <Badge
            className="relative pr-2.5 pl-6 bg-emerald-600 text-white hover:bg-emerald-600"
            aria-label="Event sedang berlangsung"
          >
            {/* pulsing dot */}
            <span className="absolute left-2.5 top-1/2 size-2 -translate-y-1/2 rounded-full bg-white/90">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
            </span>
            Live
          </Badge>
        ) : null}

        <Badge
          variant={statusBadgeVariant(status)}
          className="capitalize"
          aria-label={`Status event: ${status}`}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}
