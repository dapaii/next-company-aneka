// components/events/detail/BackBar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { EventStatus } from "@/types/events";
import { statusBadgeVariant } from "@/lib/events/status-variant";

export default function BackBar({
  isLive,
  status,
}: {
  isLive: boolean;
  status: EventStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Event
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        {isLive ? (
          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">Live</Badge>
        ) : null}
        <Badge variant={statusBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      </div>
    </div>
  );
}
