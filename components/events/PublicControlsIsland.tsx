"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import PublicControls from "./PublicControls"; // ini harus 'use client'

type Scope = "all" | "upcoming" | "ongoing" | "past";
type Sort = "soonest" | "latest";

type Props = {
  initialQuery: string;
  initialScope: Scope;
  initialSort: Sort;
  total: number;
} & Omit<ComponentProps<typeof PublicControls>, "initialQuery" | "initialScope" | "initialSort" | "total">;

export default function PublicControlsIsland(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    // Skeleton sementara agar layout stabil
    return <div className="h-[92px] rounded-xl border bg-card animate-pulse" />;
  }
  return <PublicControls {...props} />;
}
