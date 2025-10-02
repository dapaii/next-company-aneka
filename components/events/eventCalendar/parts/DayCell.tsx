// components/events/calendar/DayCell.tsx
"use client";

import { CELL_H, DAY_TEXT, DOT } from "@/lib/eventCalendar/constants";
import { isSameDay } from "@/lib/eventCalendar/date";
import { statusDotClass } from "@/lib/eventCalendar/status";

import type { EventDto, EventStatus } from "@/types/events";
import type { DayCell as DayCellType } from "@/types/calendar";

type Props = {
  cell: DayCellType;
  selected: Date;
  onSelect: (d: Date) => void;
  dayEvents: EventDto[];
};

export const DayCell: React.FC<Props> = ({ cell, selected, onSelect, dayEvents }) => {
  const isToday = isSameDay(cell.date, new Date());
  const isSelected = isSameDay(cell.date, selected);
  const dayNum = cell.date.getDate();

  // Ambil sampai 3 status unik sebagai titik
  const statusSet = new Set<EventStatus>();
  for (const ev of dayEvents) {
    statusSet.add(ev.status);
    if (statusSet.size >= 3) break;
  }
  const statuses = Array.from(statusSet);

  const className = [
    "relative rounded-[5px] px-1 pt-0.5 transition",
    DAY_TEXT,
    "leading-none text-left",
    CELL_H,
    cell.inCurrentMonth ? "bg-background" : "bg-muted/40",
    isSelected ? "ring-1 ring-primary" : "hover:bg-muted",
  ].join(" ");

  return (
    <button
      onClick={() => onSelect(cell.date)}
      className={className}
      aria-label={`Tanggal ${dayNum}`}
    >
      <div className="flex items-center justify-between">
        <span className={isToday ? "font-semibold" : undefined}>{dayNum}</span>
      </div>

      {/* Dots penanda status (mini) */}
      <div className="absolute left-0.5 bottom-0.5 flex gap-0.5">
        {statuses.map((s) => (
          <span
            key={s}
            title={`${dayEvents.length} event`}
            className={["rounded-full", DOT, statusDotClass(s)].join(" ")}
          />
        ))}
      </div>
    </button>
  );
};
