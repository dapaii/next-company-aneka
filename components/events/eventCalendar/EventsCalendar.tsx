// components/events/calendar/EventsCalendar.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { CalendarHeader } from "./parts/CalendarHeader";
import { WeekdayHeader } from "./parts/WeekdayHeader";
import { DayCell } from "./parts/DayCell";
import { EventsList } from "./parts/EventsList";

import { useMonthGrid } from "@/hooks/useMonthGrid";
import { expandDateKeysLocal, toKey } from "@/lib/eventCalendar/date";
import type { EventDto } from "@/types/events";

type Props = Readonly<{ events: EventDto[] }>;

function expandKeysSafe(startsAt: string, endsAt: string) {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return [];
  if (e < s) return expandDateKeysLocal(startsAt, startsAt);
  return expandDateKeysLocal(startsAt, endsAt);
}

export default function EventsCalendar({ events }: Props) {
  const today = useMemo(() => new Date(), []);
  const [ym, setYm] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState<Date>(today);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventDto[]>();
    for (const ev of events) {
      for (const k of expandKeysSafe(ev.startsAt, ev.endsAt)) {
        const arr = map.get(k);
        if (arr) arr.push(ev);
        else map.set(k, [ev]);
      }
    }
    return map;
  }, [events]);

  const grid = useMonthGrid(ym.year, ym.month);

  const selectedKey = useMemo(() => toKey(selected), [selected]);
  const selectedEvents = useMemo(
    () => eventsByDay.get(selectedKey) ?? [],
    [eventsByDay, selectedKey]
  );

  const gotoPrevMonth = useCallback(() => {
    setYm(cur => (cur.month === 0 ? { year: cur.year - 1, month: 11 } : { year: cur.year, month: cur.month - 1 }));
  }, []);
  const gotoNextMonth = useCallback(() => {
    setYm(cur => (cur.month === 11 ? { year: cur.year + 1, month: 0 } : { year: cur.year, month: cur.month + 1 }));
  }, []);

  return (
    <div className="grid gap-2.5 sm:gap-3">
      <CalendarHeader year={ym.year} month={ym.month} onPrev={gotoPrevMonth} onNext={gotoNextMonth} />
      <WeekdayHeader />

      <div className="grid grid-cols-7 gap-0.5">
        {grid.map(cell => (
          <DayCell
            key={cell.key}
            cell={cell}
            selected={selected}
            onSelect={setSelected}
            dayEvents={eventsByDay.get(cell.key) ?? []}
          />
        ))}
      </div>

      <EventsList selected={selected} events={selectedEvents} />
    </div>
  );
}
