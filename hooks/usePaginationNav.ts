"use client";

import { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildPagerUrl } from "@/lib/url/build-pager-url";
import type { PaginationInput } from "@/types/pagination";

export function usePaginationNav({ page, per, total }: PaginationInput) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastPage = useMemo(() => Math.max(1, Math.ceil(total / per)), [total, per]);
  const canPrev = page > 1;
  const canNext = page < lastPage;

  const clamp = useCallback(
    (p: number) => Math.min(Math.max(p, 1), lastPage),
    [lastPage]
  );

  const go = useCallback(
    (to: number) => {
      const safe = clamp(to);
      const url = buildPagerUrl(pathname || "/", searchParams?.toString(), safe);
      router.replace(url, { scroll: false });
    },
    [clamp, pathname, router, searchParams]
  );

  const goPrev = useCallback(() => { if (canPrev) go(page - 1); }, [canPrev, go, page]);
  const goNext = useCallback(() => { if (canNext) go(page + 1); }, [canNext, go, page]);

  return { lastPage, canPrev, canNext, go, goPrev, goNext };
}
