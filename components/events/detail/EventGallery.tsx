// components/events/detail/EventGallery.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

type Props = {
  title: string;
  photos: string[];
};

export default function EventGallery({ title, photos }: Props) {
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);

  const hasPhotos = (photos?.length ?? 0) > 0;

  const openAt = React.useCallback((i: number) => {
    setIdx(i);
    setOpen(true);
  }, []);

  const prev = React.useCallback(() => {
    if (!hasPhotos) return;
    setIdx((n) => (n - 1 + photos.length) % photos.length);
  }, [hasPhotos, photos.length]);

  const next = React.useCallback(() => {
    if (!hasPhotos) return;
    setIdx((n) => (n + 1) % photos.length);
  }, [hasPhotos, photos.length]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Galeri</h2>
        {hasPhotos && (
          <span className="text-xs text-muted-foreground">{photos.length} foto</span>
        )}
      </div>

      {hasPhotos ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted transition hover:scale-[1.01] focus:outline-none hover:ring-2 hover:ring-primary/40"
              aria-label={`Buka foto ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} — foto ${i + 1}`}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
                <ZoomIn className="h-6 w-6 text-white drop-shadow" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
          Belum ada foto untuk event ini.
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[95vw] sm:max-w-[88vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70"
        >
          {/* ✅ A11y: required title (visually hidden) */}
          <DialogHeader className="sr-only">
            <DialogTitle>Pratinjau gambar untuk {title}</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <div className="relative aspect-[16/10] w-full bg-black/5">
              {hasPhotos && (
                <Image
                  src={photos[idx]}
                  alt={`${title} — foto ${idx + 1} dari ${photos.length}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              )}
            </div>

            {/* Top bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2 sm:p-3">
              <div className="pointer-events-auto rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                {hasPhotos ? `${idx + 1} / ${photos.length}` : "0 / 0"}
              </div>
              <button
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Controls */}
            {hasPhotos && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 sm:px-2">
                <button
                  className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md bg-background/80"
                  onClick={prev}
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex-1" />
                <button
                  className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md bg-background/80"
                  onClick={next}
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Bottom bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 sm:p-3">
              <div className="max-w-[80%] truncate rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                {title}
              </div>
              {hasPhotos && (
                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80"
                    onClick={prev}
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80"
                    onClick={next}
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {hasPhotos && photos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto p-2 sm:p-3">
              {photos.map((thumb, i) => (
                <button
                  key={`thumb-${i}`}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded border ${i === idx ? "ring-2 ring-primary" : "ring-0"}`}
                  aria-label={`Pilih foto ${i + 1}`}
                >
                  <Image src={thumb} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="120px" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
