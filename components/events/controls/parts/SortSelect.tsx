"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { Sort } from "@/types/filters";

export const SortSelect: React.FC<{
  value: Sort;
  onChange: (v: Sort) => void;
}> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(v) => onChange(v as Sort)}>
    <SelectTrigger className="h-8 w-[140px]" aria-label="Urutkan">
      <SelectValue placeholder="Urutkan" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="soonest">Paling dekat</SelectItem>
      <SelectItem value="latest">Terbaru dibuat</SelectItem>
    </SelectContent>
  </Select>
);
