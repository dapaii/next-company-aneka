"use client";

import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

type Props = {
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
} & ButtonProps;

function toICSDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export default function AddToCalendar({
  title,
  description,
  location,
  startsAt,
  endsAt,
  ...btn
}: Props) {
  const onClick = () => {
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//cat-events//id",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `DTSTART:${toICSDate(startsAt)}`,
      `DTEND:${toICSDate(endsAt)}`,
      `SUMMARY:${title.replace(/\n/g, " ")}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
      location ? `LOCATION:${location}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={onClick} {...btn}>
      <CalendarPlus className="mr-2 h-4 w-4" />
      Tambah ke Kalender
    </Button>
  );
}
