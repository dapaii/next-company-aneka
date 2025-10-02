// components/events/calendar/parts/CalendarHeader.tsx
"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { HEADER_TEXT } from "@/lib/eventCalendar/constants";

type Props = {
  year: number;
  month: number; // 0-11
  onPrev: () => void;
  onNext: () => void;
};

export const CalendarHeader: React.FC<Props> = ({ year, month, onPrev, onNext }) => {
  const monthLabel = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    return firstOfMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  }, [year, month]);

  return (
    <div className="flex items-center justify-between">
      <div className={`flex items-center gap-1.5 ${HEADER_TEXT}`}>
        <CalendarDays className="h-3.5 w-3.5" />
        <span className="font-medium leading-none">{monthLabel}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onPrev}
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onNext}
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
