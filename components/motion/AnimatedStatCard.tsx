"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import CountUp from "./CountUp";

type Props = {
  icon: ReactNode;
  label: string;
  value: number;
  borderClass?: string; // custom border color nuance
  hint?: string;
};

export default function AnimatedStatCard({ icon, label, value, borderClass, hint }: Props) {
  return (
    <div className="relative">
      {/* gradient ring subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-lg"
      />
      <motion.div
        whileHover={{
          scale: 1.01,
          rotateX: 2,
          rotateY: -2,
          boxShadow:
            "0 8px 30px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ transformPerspective: 900 }}
        className={`relative rounded-xl border bg-card ${borderClass ?? ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground/90">{label}</div>
            <div className="opacity-80">{icon}</div>
          </div>
          <div className="mt-1 text-4xl font-semibold tracking-tight">
            <CountUp value={value} />
          </div>
          {hint ? (
            <div className="mt-1 text-xs text-muted-foreground">
              {hint}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
