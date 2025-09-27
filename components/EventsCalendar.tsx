// components/events/EventsCalendar.tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

type EventStatus = "draft" | "published" | "archived";

type EventDto = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  photos: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  events: EventDto[];
};

type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
  key: string; // "YYYY-MM-DD"
};

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function getMondayBasedWeekday(jsDay: number): number {
  return (jsDay + 6) % 7; // 0=Mon..6=Sun
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addDays(d: Date, days: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
function expandDateKeysLocal(startIso: string, endIso: string): string[] {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const keys: string[] = [];
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  for (let d = s; d <= e; d = addDays(d, 1)) keys.push(toKey(d));
  return keys;
}
function statusVariant(status: EventStatus): "default" | "secondary" | "destructive" {
  switch (status) {
    case "published": return "default";
    case "draft": return "secondary";
    case "archived": return "destructive";
  }
}

// ——— SUPER COMPACT SIZING ———
const CELL_H = "h-7 sm:h-8";            // ~28–32px tinggi cell
const DOT = "h-1 w-1";                  // titik mini
const DAY_TEXT = "text-[10.5px] sm:text-[11px]"; // angka hari
const HEADER_TEXT = "text-[12px]";      // judul bulan
const WEEKDAY_TEXT = "text-[9.5px] sm:text-[10px]"; // header hari

export default function EventsCalendar({ events }: Props) {
  const today = new Date();
  const [ym, setYm] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selected, setSelected] = useState<Date>(today);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventDto[]>();
    for (const ev of events) {
      for (const k of expandDateKeysLocal(ev.startsAt, ev.endsAt)) {
        const arr = map.get(k);
        if (arr) arr.push(ev);
        else map.set(k, [ev]);
      }
    }
    return map;
  }, [events]);

  const grid = useMemo<DayCell[]>(() => {
    const base = new Date(ym.year, ym.month, 1);
    const first = startOfMonth(base);
    const firstWeekday = getMondayBasedWeekday(first.getDay()); // 0..6
    const gridStart = addDays(first, -firstWeekday);

    const cells: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(gridStart, i);
      cells.push({ date: d, inCurrentMonth: d.getMonth() === ym.month, key: toKey(d) });
    }
    return cells;
  }, [ym.year, ym.month]);

  const firstOfMonth = new Date(ym.year, ym.month, 1);
  const monthLabel = firstOfMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const selectedKey = toKey(selected);
  const selectedEvents = eventsByDay.get(selectedKey) ?? [];

  function gotoPrevMonth(): void {
    setYm((cur) => (cur.month === 0 ? { year: cur.year - 1, month: 11 } : { year: cur.year, month: cur.month - 1 }));
  }
  function gotoNextMonth(): void {
    setYm((cur) => (cur.month === 11 ? { year: cur.year + 1, month: 0 } : { year: cur.year, month: cur.month + 1 }));
  }

  return (
    <div className="grid gap-2.5 sm:gap-3">
      {/* Header kalender (super compact) */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 ${HEADER_TEXT}`}>
          <CalendarDays className="h-3.5 w-3.5" />
          <span className="font-medium leading-none">{monthLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-6 w-6" onClick={gotoPrevMonth} aria-label="Bulan sebelumnya">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-6 w-6" onClick={gotoNextMonth} aria-label="Bulan berikutnya">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Weekday header (mini) */}
      <div className={`grid grid-cols-7 ${WEEKDAY_TEXT} text-muted-foreground`}>
        {weekdays.map((w) => (
          <div key={w} className="py-0.5 text-center leading-none">{w}</div>
        ))}
      </div>

      {/* Grid tanggal */}
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((cell) => {
          const isToday = isSameDay(cell.date, new Date());
          const isSelected = isSameDay(cell.date, selected);
          const dayNum = cell.date.getDate();
          const dayEvents = eventsByDay.get(cell.key) ?? [];

          // Ambil sampai 3 status unik sebagai titik
          const statusSet = new Set<EventStatus>();
          for (const ev of dayEvents) { statusSet.add(ev.status); if (statusSet.size >= 3) break; }
          const statuses = Array.from(statusSet);

          return (
            <button
              key={cell.key}
              onClick={() => setSelected(cell.date)}
              className={[
                "relative rounded-[5px] px-1 pt-0.5 transition",
                DAY_TEXT,
                "leading-none text-left",
                CELL_H,
                cell.inCurrentMonth ? "bg-background" : "bg-muted/40",
                isSelected ? "ring-1 ring-primary" : "hover:bg-muted",
              ].join(" ")}
              aria-label={`Tanggal ${dayNum}`}
            >
              <div className="flex items-center justify-between">
                <span className={isToday ? "font-semibold" : undefined}>{dayNum}</span>
                {/* label hari ini dihilangkan biar hemat ruang */}
              </div>

              {/* Dots penanda status (mini) */}
              <div className="absolute left-0.5 bottom-0.5 flex gap-0.5">
                {statuses.map((s) => (
                  <span
                    key={s}
                    title={`${dayEvents.length} event`}
                    className={[
                      "rounded-full",
                      DOT,
                      s === "published" ? "bg-emerald-500" : s === "draft" ? "bg-slate-400" : "bg-rose-500",
                    ].join(" ")}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* List event terpilih (super ringkas) */}
      <div className="grid gap-1">
        <div className="text-[11px] text-muted-foreground">
          {selected.toLocaleDateString("id-ID", { dateStyle: "full" })}
        </div>
        {selectedEvents.length === 0 ? (
          <div className="text-[11px] text-muted-foreground">Tidak ada event.</div>
        ) : (
          <ul className="space-y-1">
            {selectedEvents.map((ev) => {
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
        )}
      </div>
    </div>
  );
}
