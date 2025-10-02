import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, MapPin } from "lucide-react";
import type { EventDto } from "@/types/events";
import { toSafeImageSrc } from "@/lib/image/safe-src";
import { formatRange } from "@/lib/time/format";

export default function EventCard({ ev, idx = 0, now = Date.now(), priority = false }: { ev: EventDto; idx?: number; now?: number; priority?: boolean }) {
  const cover =
    Array.isArray(ev.photos)
      ? ev.photos.map(toSafeImageSrc).find((s): s is string => !!s) ?? null
      : null;

  const live =
    new Date(ev.startsAt).getTime() <= now &&
    now <= new Date(ev.endsAt).getTime();

  return (
    <Card className="overflow-hidden transition hover:shadow-md">
      <Link href={`/events/${ev.slug}`} className="block" aria-label={ev.title}>
        <div className="relative aspect-[16/9] bg-muted">
          {cover ? (
            <Image
              src={cover}
              alt={ev.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              fetchPriority={idx === 0 ? "high" : undefined}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
              <ImageIcon className="h-7 w-7" />
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-tight line-clamp-2">
            <Link
              href={`/events/${ev.slug}`}
              className="hover:underline underline-offset-4"
            >
              {ev.title}
            </Link>
          </CardTitle>
          {live ? (
            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">Live</Badge>
          ) : null}
        </div>

        <div className="text-xs text-muted-foreground">
          {formatRange(ev.startsAt, ev.endsAt)}
        </div>

        {ev.location ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{ev.location}</span>
          </div>
        ) : null}
      </CardHeader>

      {ev.description ? (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {ev.description}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
