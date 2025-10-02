import { useMemo } from "react";
import { addDays, getMondayBasedWeekday, startOfMonth, toKey } from "../lib/eventCalendar/date";
import type { DayCell } from "../types/calendar";

export const useMonthGrid = (year: number, month: number): DayCell[] => {
  return useMemo<DayCell[]>(() => {
    const base = new Date(year, month, 1);
    const first = startOfMonth(base);
    const firstWeekday = getMondayBasedWeekday(first.getDay()); // 0..6
    const gridStart = addDays(first, -firstWeekday);

    const cells: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(gridStart, i);
      cells.push({ date: d, inCurrentMonth: d.getMonth() === month, key: toKey(d) });
    }
    return cells;
  }, [year, month]);
};
