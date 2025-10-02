// components/events/detail/EventGallery.tsx
import Image from "next/image";

export default function EventGallery({
  title,
  photos,
}: {
  title: string;
  photos: string[];
}) {
  if (photos.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Galeri</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
          >
            <Image
              src={src}
              alt={`${title} - photo ${i + 2}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
