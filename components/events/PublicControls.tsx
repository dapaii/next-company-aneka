"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { X, Search, Filter } from "lucide-react";

type Scope = "all" | "upcoming" | "ongoing" | "past";
type Sort = "soonest" | "latest";

type Props = {
  initialQuery: string;
  initialScope: Scope;
  initialSort: Sort;
  total: number;
};

function useDebouncedReplace(router: ReturnType<typeof useRouter>, ms = 350) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedReplace = useCallback(
    (url: string) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        router.replace(url);
      }, ms);
    },
    [ms, router]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return debouncedReplace;
}

export default function PublicControls({
  initialQuery,
  initialScope,
  initialSort,
  total,
}: Props) {
  const router = useRouter(); // ✅ panggil hook di level komponen
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initialQuery);
  const [scope, setScope] = useState<Scope>(initialScope);
  const [sort, setSort] = useState<Sort>(initialSort);

  const debouncedReplace = useDebouncedReplace(router, 300);

  const buildUrl = useCallback(
    (next: { q?: string; scope?: Scope; sort?: Sort }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      if (typeof next.q === "string") {
        const trimmed = next.q.trim();
        if (trimmed) params.set("q", trimmed);
        else params.delete("q");
      }

      if (next.scope) params.set("scope", next.scope);
      if (next.sort) params.set("sort", next.sort);

      const base = pathname || "/events";
      const qs = params.toString();
      return qs ? `${base}?${qs}` : base;
    },
    [pathname, searchParams]
  );

  const apply = useCallback(
    (
      next: Partial<{ q: string; scope: Scope; sort: Sort }>,
      debounce = true
    ) => {
      const url = buildUrl({
        q: next.q ?? q,
        scope: next.scope ?? scope,
        sort: next.sort ?? sort,
      });
      if (debounce) debouncedReplace(url);
      else router.replace(url); // ✅ pakai router dari atas
    },
    [buildUrl, q, scope, sort, debouncedReplace, router]
  );

  const hasActiveFilter = useMemo(
    () => q.trim().length > 0 || scope !== "all" || sort !== "soonest",
    [q, scope, sort]
  );

  function onClear() {
    setQ("");
    setScope("all");
    setSort("soonest");
    router.replace(pathname || "/events"); // ✅ langsung pakai router; no hook di sini
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4">
      {/* Top row: search + count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              const val = e.target.value;
              setQ(val);
              apply({ q: val }); // debounced live search
            }}
            placeholder="Cari judul, lokasi, atau deskripsi…"
            className="pl-9"
          />
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                apply({ q: "" }); // debounced reset query
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ) : null}
        </div>

        <div className="ml-0 sm:ml-auto">
          <Badge variant="secondary" className="text-[11px]">
            {total} event
          </Badge>
        </div>
      </div>

      {/* Bottom row: filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Filter</span>
        </div>

        {/* Scope */}
        <Select
          value={scope}
          onValueChange={(v) => {
            const next = v as Scope;
            setScope(next);
            apply({ scope: next });
          }}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="upcoming">Mendatang</SelectItem>
            <SelectItem value="ongoing">Sedang berlangsung</SelectItem>
            <SelectItem value="past">Selesai</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sort}
          onValueChange={(v) => {
            const next = v as Sort;
            setSort(next);
            apply({ sort: next });
          }}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soonest">Paling dekat</SelectItem>
            <SelectItem value="latest">Terbaru dibuat</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasActiveFilter ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={onClear}
          >
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
