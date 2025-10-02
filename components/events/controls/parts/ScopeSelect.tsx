"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { Scope } from "@/types/filters";

export const ScopeSelect: React.FC<{
  value: Scope;
  onChange: (v: Scope) => void;
}> = ({ value, onChange }) => (
  <Select value={value} onValueChange={(v) => onChange(v as Scope)}>
    <SelectTrigger className="h-8 w-[140px]" aria-label="Pilih lingkup waktu">
      <SelectValue placeholder="Scope" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Semua</SelectItem>
      <SelectItem value="upcoming">Mendatang</SelectItem>
      <SelectItem value="ongoing">Sedang berlangsung</SelectItem>
      <SelectItem value="past">Selesai</SelectItem>
    </SelectContent>
  </Select>
);
