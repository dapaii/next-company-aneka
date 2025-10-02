"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import EventsCalendar from "@/components/events/eventCalendar/EventsCalendar";
import type { EventDto } from "@/lib/dashboard/types";

export const CalendarCard: React.FC<{ events: EventDto[]; total: number }> = ({ events, total }) => (
  <Card className="h-full">
    <CardHeader className="p-5 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Kalender Event</CardTitle>
        </div>
        <Badge variant="secondary" className="text-[11px] px-2 py-0.5">{total} total event</Badge>
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-0">
      <EventsCalendar events={events} />
    </CardContent>
  </Card>
);
