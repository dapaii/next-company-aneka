"use client";

import { useEffect } from "react";

export const useHitEvent = (slug: string, enabled: boolean = true): void => {
  useEffect(() => {
    if (!enabled || !slug) return;
    void fetch(`/api/events/${encodeURIComponent(slug)}/hit`, { method: "POST" });
  }, [slug, enabled]);
};
