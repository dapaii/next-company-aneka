"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { Scope, Sort } from "@/types/filters";
import { useEventsFilters } from "@/hooks/useEventsFilters";
import { SearchBox } from "./parts/SearchBox";
import { ScopeSelect } from "./parts/ScopeSelect";
import { SortSelect } from "./parts/SortSelect";

type Props = {
  initialQuery: string;
  initialScope: Scope;
  initialSort:  Sort;
  total: number;
  basePath?: string; // opsional kalau bukan /events
};

export default function PublicControls({ initialQuery, initialScope, initialSort, total, basePath }: Props) {
  const { q, setQ, scope, setScope, sort, setSort, hasActive, apply, clearAll } =
    useEventsFilters({ initialQuery, initialScope, initialSort, basePath });

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4">
      {/* Top row */}
      <SearchBox
        value={q}
        onChange={(val) => { setQ(val); apply({ q: val }); }}
        onClear={() => { setQ(""); apply({ q: "" }); }}
        total={total}
      />

      {/* Bottom row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Filter</span>
        </div>

        <ScopeSelect
          value={scope}
          onChange={(next) => { setScope(next); apply({ scope: next }); }}
        />

        <SortSelect
          value={sort}
          onChange={(next) => { setSort(next); apply({ sort: next }); }}
        />

        {hasActive ? (
          <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={clearAll}>
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
