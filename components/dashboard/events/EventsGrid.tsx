// components/dashboard/events/EventsGrid.tsx
import EventCard from "./EventCard";
import type { EventDto } from "@/types/events";

export default function EventsGrid({
  items,
  onDeleteAction,
}: {
  items: EventDto[];
  onDeleteAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <div id="events-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((ev, idx) => (
        <EventCard
          key={ev.id}
          ev={ev}
          idx={idx}
          deleteFormId={`delete-form-${ev.id}`}
          onDeleteAction={onDeleteAction}
        />
      ))}
    </div>
  );
}
