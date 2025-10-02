"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Scope, Sort } from "@/types/filters";
import { useDebouncedReplace } from "@/hooks/useDebouncedReplace";
import { buildEventsUrl } from "@/lib/url/build-events-url";

type Init = {
  initialQuery: string;
  initialScope: Scope;
  initialSort:  Sort;
  basePath?: string; // default "/events"
};

export function useEventsFilters({
  initialQuery,
  initialScope,
  initialSort,
  basePath = "/events",
}: Init) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ]         = useState(initialQuery);
  const [scope, setScope] = useState<Scope>(initialScope);
  const [sort, setSort]   = useState<Sort>(initialSort);

  const debouncedReplace = useDebouncedReplace(router, 300);

  const apply = useCallback((
    next: Partial<{ q: string; scope: Scope; sort: Sort }>,
    { debounce = true }: { debounce?: boolean } = {}
  ) => {
    const url = buildEventsUrl(
      pathname || basePath,
      searchParams?.toString() ?? "",
      {
        q:     next.q     ?? q,
        scope: next.scope ?? scope,
        sort:  next.sort  ?? sort,
      }
    );

    if (debounce) {
      debouncedReplace(url);
    } else {
      router.replace(url);
    }
  }, [pathname, basePath, searchParams, q, scope, sort, debouncedReplace, router]);

  const clearAll = useCallback(() => {
    setQ("");
    setScope("all");
    setSort("soonest");
    router.replace(pathname || basePath);
  }, [pathname, basePath, router]);

  const hasActive = useMemo(
    () => q.trim().length > 0 || scope !== "all" || sort !== "soonest",
    [q, scope, sort]
  );

  return { q, setQ, scope, setScope, sort, setSort, hasActive, apply, clearAll };
}
