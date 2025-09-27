// components/events/PublicPager.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PublicPager({
  page,
  per,
  total,
}: {
  page: number;
  per: number;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastPage = Math.max(1, Math.ceil(total / per));
  const canPrev = page > 1;
  const canNext = page < lastPage;

  function go(to: number) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", String(to));
    // keep other q/scope/sort/per
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (total <= per) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => go(page - 1)}
        disabled={!canPrev}
      >
        Prev
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {lastPage}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => go(page + 1)}
        disabled={!canNext}
      >
        Next
      </Button>
    </div>
  );
}
