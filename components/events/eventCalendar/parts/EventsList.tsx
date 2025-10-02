// components/events/calendar/parts/EventsList.tsx
import { Badge } from "@/components/ui/badge";
import { statusVariant } from "@/lib/eventCalendar/status";
import type { EventDto } from "@/types/events";

type Props = {
  selected: Date;
  events: EventDto[];
};

export const EventsList: React.FC<Props> = ({ selected, events }) => {
  const selectedLabel = selected.toLocaleDateString("id-ID", { dateStyle: "full" });

  if (events.length === 0) {
    return (
      <div className="grid gap-1">
        <div className="text-[11px] text-muted-foreground">{selectedLabel}</div>
        <div className="text-[11px] text-muted-foreground">Tidak ada event.</div>
      </div>
    );
  }

  return (
    <div className="grid gap-1">
      <div className="text-[11px] text-muted-foreground">{selectedLabel}</div>
      <ul className="space-y-1">
        {events.map((ev) => {
          const s = new Date(ev.startsAt);
          const e = new Date(ev.endsAt);
          const time = `${s.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}–${e.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;

          return (
            <li key={ev.id} className="rounded-md border p-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[12px] font-medium leading-tight truncate">{ev.title}</div>
                <Badge
                  variant={statusVariant(ev.status)}
                  className="capitalize h-5 px-1 text-[10px] rounded"
                >
                  {ev.status}
                </Badge>
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground truncate">
                {time}{ev.location ? ` • ${ev.location}` : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
