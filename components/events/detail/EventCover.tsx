// components/events/detail/EventCover.tsx
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export default function EventCover({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-muted">
      <div className="relative aspect-[16/9] w-full">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
    </div>
  );
}
