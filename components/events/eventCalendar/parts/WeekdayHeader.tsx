// components/events/calendar/parts/WeekdayHeader.tsx
"use client";

import { memo } from "react";
import { WEEKDAY_TEXT, WEEKDAYS_ID } from "@/lib/eventCalendar/constants";

export const WeekdayHeader = memo(function WeekdayHeader() {
  return (
    <div className={`grid grid-cols-7 ${WEEKDAY_TEXT} text-muted-foreground`}>
      {WEEKDAYS_ID.map((w) => (
        <div key={w} className="py-0.5 text-center leading-none">
          {w}
        </div>
      ))}
    </div>
  );
});
