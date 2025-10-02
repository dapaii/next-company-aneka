"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";

export const SearchBox: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  total: number;
}> = ({ value, onChange, onClear, total }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0">
    <div className="relative w-full sm:max-w-md min-w-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari judul, lokasi, atau deskripsi…"
        className="pl-9"
        aria-label="Cari event"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
          aria-label="Hapus kata kunci"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      ) : null}
    </div>
    <div className="ml-0 sm:ml-auto">
      <Badge variant="secondary" className="text-[11px]">{total} event</Badge>
    </div>
  </div>
);
