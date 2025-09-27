// components/motion/AnimatedStatCardMagnetic.tsx
"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// util sederhana biar aman kalau tidak pakai "@/lib/utils"
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  borderClass?: string;
  /** Tambahan: bisa kirim kelas dari luar (mis. "h-full") */
  className?: string;
};

export default function AnimatedStatCardMagnetic({
  icon,
  label,
  value,
  hint,
  borderClass,
  className,
}: Props) {
  // --- Magnetic tilt ---
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 12 });
  const sry = useSpring(ry, { stiffness: 150, damping: 12 });
  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    // skala kecil agar tidak berlebihan
    const maxTilt = 6; // derajat
    ry.set(((x - midX) / midX) * maxTilt); // horizontal -> rotateY
    rx.set(-((y - midY) / midY) * maxTilt); // vertical -> rotateX (negatif biar arah terasa natural)
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      className={cn("group", className)}
    >
      <Card
        className={cn(
          "relative h-full border bg-card transition-shadow will-change-transform",
          "hover:shadow-lg",
          borderClass
        )}
        // memberi sedikit depth untuk anak
        style={{ transformStyle: "preserve-3d" }}
      >
        <CardHeader className="pb-2" style={{ transform: "translateZ(25px)" }}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <div className="rounded-md bg-muted p-1.5">{icon}</div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-1.5" style={{ transform: "translateZ(18px)" }}>
          <div className="text-3xl font-semibold">{value}</div>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </CardContent>

        {/* glow halus saat hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgb(99 102 241 / 0.12), transparent 40%)",
          }}
        />
      </Card>
    </motion.div>
  );
}
