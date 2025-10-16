// components/events/detail/EventCover.tsx
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export default function EventCover({
  src,
  alt,
  blurDataURL,
  priority = true,
}: {
  src: string | null;
  alt: string;
  /** Optional: kalau punya blurDataURL untuk efek blur-up */
  blurDataURL?: string | null;
  /** Optional: default true agar cepat LCP di halaman detail */
  priority?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
      {/* Aspect ratio responsif: 16:9 di mobile, 21:9 di >=sm */}
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {src ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              fetchPriority={priority ? "high" : "auto"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              // smooth zoom micro-interaction saat hover
              className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.01]"
              // blur-up kalau tersedia
              placeholder={blurDataURL ? "blur" : "empty"}
              blurDataURL={blurDataURL ?? undefined}
            />
            {/* Vignette/gradient lembut agar teks di atas (kalau ada) lebih kontras */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-background/10 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">Tidak ada gambar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
