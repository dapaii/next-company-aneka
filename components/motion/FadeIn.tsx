"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type FadeInProps = {
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
};

export default function FadeIn({
  children,
  delay = 0,
  y = 12,
  duration = 0.5,
  once = true,
  className,
}: PropsWithChildren<FadeInProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-20% 0px -10% 0px" }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
