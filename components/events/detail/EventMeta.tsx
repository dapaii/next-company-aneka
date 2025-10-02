// components/events/detail/EventMeta.tsx
import { CalendarRange, Clock4, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/time/format-datetime";

export default function EventMeta({
  startsAt,
  endsAt,
  durationHours,
  location,
}: {
  startsAt: string;
  endsAt: string;
  durationHours: number;
  location?: string | null;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <CalendarRange className="h-5 w-5 text-primary mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Waktu</div>
            <div className="text-sm">
              {formatDateTime(startsAt)} — {formatDateTime(endsAt)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock4 className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-xs text-muted-foreground">Durasi</div>
            <div className="text-sm">{durationHours} jam</div>
          </div>
        </div>

        {location ? (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Lokasi</div>
              <div className="text-sm truncate">{location}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 opacity-60">
            <MapPin className="h-5 w-5 mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Lokasi</div>
              <div className="text-sm">—</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
