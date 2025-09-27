// components/forms/CoverUpload.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultCover?: string | null;
};

export default function CoverUpload({ defaultCover }: Props) {
  const [preview, setPreview] = useState<string | null>(defaultCover ?? null);

  return (
    <div className="grid gap-2">
      <Label htmlFor="photo">Ganti Cover (PNG/JPG/WEBP)</Label>
      <Input
        id="photo"
        name="photos"
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
          } else {
            setPreview(defaultCover ?? null);
          }
        }}
      />
      <p className="text-xs text-muted-foreground">
        Mengunggah file baru akan menggantikan cover saat ini.
      </p>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
        {preview ? (
          <img
            src={preview}
            alt="Preview cover"
            className="object-cover w-full h-full"
          />
        ) : (
          <p className="text-sm text-muted-foreground flex items-center justify-center h-full">
            Belum ada cover
          </p>
        )}
      </div>
    </div>
  );
}
