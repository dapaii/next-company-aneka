"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventDto } from "@/lib/dashboard/types";
import { formatDateTime } from "@/lib/dashboard/time";

export const WeekListCard: React.FC<{ weekly: EventDto[] }> = ({ weekly }) => (
  <Card className="h-full">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-medium">Minggu ini</CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0">
      {weekly.length ? (
        <ul className="divide-y">
          {weekly.map((ev) => (
            <li key={ev.id} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-sm leading-tight line-clamp-1">{ev.title}</span>
                <span className="text-xs text-muted-foreground shrink-0">{formatDateTime(ev.startsAt)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada event dalam 7 hari ke depan.</p>
      )}
    </CardContent>
  </Card>
);
