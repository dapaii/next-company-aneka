"use client";

import { useCallback, useEffect, useRef } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useDebouncedReplace(router: AppRouterInstance, ms = 300) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedReplace = useCallback((url: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => router.replace(url), ms);
  }, [router, ms]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return debouncedReplace;
}
