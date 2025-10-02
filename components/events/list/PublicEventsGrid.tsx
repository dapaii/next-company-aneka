import type { EventDto } from "@/types/events";
import EventCard from "./EventCard";

export default function PublicEventsGrid({ items, page }: { items: EventDto[]; page: number }) {
  const now = Date.now();
  return (
    <div id="events-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((ev, idx) => (
        <EventCard key={ev.id} ev={ev} idx={idx} now={now} priority={page === 1 && idx === 0} />
      ))}
    </div>
  );
}
