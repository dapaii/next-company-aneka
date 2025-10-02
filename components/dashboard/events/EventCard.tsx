// components/dashboard/events/EventCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StatusDropdown from "@/components/StatusDropdown";
import { CalendarRange, Edit, ImageIcon, MapPin, MoreHorizontal, Trash2 } from "lucide-react";

import type { EventDto } from "@/types/events";
import { statusVariant } from "@/lib/events/status-variant";
import { formatRange } from "@/lib/time/format-range";
import { toSafeImageSrc } from "@/lib/image/safe-src";

export default function EventCard({
  ev, idx, deleteFormId, onDeleteAction,
}: {
  ev: EventDto;
  idx: number;
  deleteFormId: string;
  onDeleteAction: (formData: FormData) => Promise<void>;
}) {
  const cover = Array.isArray(ev.photos) ? ev.photos.map(toSafeImageSrc).find(Boolean) ?? null : null;

  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={ev.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={idx === 0}
            fetchPriority={idx === 0 ? "high" : "auto"}
            loading={idx === 0 ? "eager" : "lazy"}
            quality={70}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-7 w-7 text-muted-foreground" />
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base leading-tight line-clamp-2">{ev.title}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(ev.status)} className="capitalize">{ev.status}</Badge>
              <span className="text-xs text-muted-foreground truncate">@{ev.slug}</span>
            </div>
          </div>

          {/* Actions: Edit di atas Delete */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {/* EDIT (di atas) */}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events/${ev.id}/edit`} className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit detail
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* DELETE */}
              <form id={deleteFormId} action={onDeleteAction} data-delete-form="true">
                <input type="hidden" name="id" value={ev.id} />
                <input type="hidden" name="title" value={ev.title} />
              </form>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full px-2 py-1.5 text-left text-sm flex items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak bisa dibatalkan. Event akan dihapus permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <button
                      form={deleteFormId}
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                    >
                      Hapus
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Waktu & Lokasi */}
        <div className="mt-1 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarRange className="h-3.5 w-3.5" />
            <span>{formatRange(ev.startsAt, ev.endsAt)}</span>
          </div>
          {ev.location ? (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{ev.location}</span>
            </div>
          ) : null}
        </div>
      </CardHeader>

      {ev.description ? (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3">{ev.description}</p>
        </CardContent>
      ) : null}

      <CardFooter className="mt-auto flex items-center justify-between">
        <StatusDropdown id={ev.id} current={ev.status} />
        <div className="text-xs text-muted-foreground">{ev.photos?.length ?? 0} foto</div>
      </CardFooter>
    </Card>
  );
}
