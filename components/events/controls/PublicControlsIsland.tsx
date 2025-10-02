"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type PublicControls from "./PublicControls"; // type-only import (no runtime)
import ControlsSkeleton from "./ControlsSkeleton";

// Props diambil dari komponen target, jadi gak duplikasi tipe
type Props = ComponentProps<typeof PublicControls>;

// Client-only dynamic import dengan fallback skeleton
const PublicControlsIsland = dynamic<Props>(() => import("./PublicControls"), {
  ssr: false,
  loading: () => <ControlsSkeleton />,
});

export default PublicControlsIsland;
