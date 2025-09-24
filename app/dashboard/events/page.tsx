// app/dashboard/events/page.tsx
import Link from "next/link";
import Image from "next/image";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  CalendarRange,
  Edit,
  ImageIcon,
  MapPin,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import StatusDropdown from "@/components/StatusDropdown";

type Event = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt: string;
  photos: string[];
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
};

type EventStatus = Event["status"];
function isEventStatus(v: string): v is EventStatus {
  return v === "draft" || v === "published" || v === "archived";
}

/** Server Action: hapus event */
async function deleteEvent(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/dashboard/events");
}

// ---------- Helpers (server) ----------
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

async function fetchEvents(): Promise<Event[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const cookie = (await cookies()).toString();
  const url = new URL("/api/events", base).toString();

  const res = await fetch(url, {
    cache: "no-store",
    headers: { cookie },
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  const json: unknown = await res.json();
  const events = (json as { events?: unknown })?.events;
  if (!Array.isArray(events)) return [];
  return events as Event[];
}

function statusVariant(s: Event["status"]) {
  switch (s) {
    case "published":
      return "default" as const;
    case "draft":
      return "secondary" as const;
    case "archived":
      return "destructive" as const;
  }
}

function formatRange(startsAt: string, endsAt: string) {
  const fmt: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" };
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  return `${s.toLocaleString("id-ID", fmt)} — ${e.toLocaleString("id-ID", fmt)}`;
}

// ---------- Image src guards ----------
function isValidRemoteUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
function normalizeLocalPath(s: string): string {
  const t = s.trim();
  if (t.startsWith("uploads/")) return "/" + t;
  return t;
}
function isValidLocalPath(s: string): boolean {
  return s.startsWith("/uploads/");
}
function toSafeImageSrc(src?: string | null): string | null {
  if (!src) return null;
  const s = normalizeLocalPath(src);
  if (s.length === 0) return null;
  if (isValidLocalPath(s)) return s;
  if (isValidRemoteUrl(s)) return s;
  return null;
}
function isNonEmptyString(x: string | null): x is string {
  return typeof x === "string" && x.length > 0;
}

// ---------- Page ----------
export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">Kelola event yang tampil di website kamu.</p>
        </div>

        <Button asChild size="sm" className="gap-2">
          <Link href="/dashboard/events/new">
            <Plus className="h-4 w-4" />
            Tambah Event
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Belum ada event</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Kamu belum membuat event. Klik tombol “Tambah Event” untuk mulai.
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/events/new">
                <Plus className="h-4 w-4 mr-2" />
                Buat Event Pertama
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((ev) => {
            const cover =
              Array.isArray(ev.photos)
                ? ev.photos.map(toSafeImageSrc).find(isNonEmptyString) ?? null
                : null;

            const delFormId = `delete-form-${ev.id}`;

            return (
              <Card key={ev.id} className="flex flex-col overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] bg-muted">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={ev.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      <CardTitle className="text-base leading-tight line-clamp-2">
                        {ev.title}
                      </CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant={statusVariant(ev.status)} className="capitalize">
                          {ev.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">@{ev.slug}</span>
                      </div>
                    </div>

                    {/* Menu kanan atas: Edit detail + Delete */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/events/${ev.id}/edit`} className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit detail
                          </Link>
                        </DropdownMenuItem>

                        {/* FORM delete terpisah */}
                        <form id={delFormId} action={deleteEvent}>
                          <input type="hidden" name="id" value={ev.id} />
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
                                Tindakan ini tidak bisa dibatalkan. Event akan dihapus permanen dari database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <button
                                form={delFormId}
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

                {/* Footer: Dropdown ganti status */}
                <CardFooter className="mt-auto flex items-center justify-between">
                  <StatusDropdown id={ev.id} current={ev.status} />
                  <div className="text-xs text-muted-foreground">
                    {ev.photos?.length ?? 0} foto
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
