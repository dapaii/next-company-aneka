"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Package, Truck, Megaphone, Handshake, LucideIcon } from "lucide-react";

// Types
interface CardData {
  icon: LucideIcon;
  title: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  index: number;
}

interface CardProps {
  card: CardData;
  index: number;
  totalCards: number;
}

// Component
export default function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  const cards: CardData[] = [
    {
      icon: Package,
      title: "Brand Distribution",
      description:
        "Penyaluran produk brand ke jaringan ritel & marketplace dengan sistem yang terintegrasi end‑to‑end.",
      colorFrom: "from-blue-600",
      colorTo: "to-blue-800",
      index: 1,
    },
    {
      icon: Truck,
      title: "Supply Chain",
      description:
        "Manajemen rantai pasok yang efisien, reliabel, dan terukur—mulai dari gudang hingga last‑mile.",
      colorFrom: "from-indigo-600",
      colorTo: "to-indigo-800",
      index: 2,
    },
    {
      icon: Megaphone,
      title: "Marketing Support",
      description:
        "Aktivasi promosi dan campaign untuk mendorong brand awareness sekaligus pertumbuhan penjualan.",
      colorFrom: "from-purple-600",
      colorTo: "to-purple-800",
      index: 3,
    },
    {
      icon: Handshake,
      title: "Partnership",
      description:
        "Kolaborasi strategis bersama brand untuk memperluas jangkauan dan akselerasi pertumbuhan.",
      colorFrom: "from-pink-600",
      colorTo: "to-pink-800",
      index: 4,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(59,130,246,0.10),rgba(59,130,246,0)_70%)]"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <span className="inline-block rounded-full border border-black/10 bg-white px-3 py-1 text-xs/5 font-medium text-gray-600 shadow-sm">
            Layanan Kami
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 text-base/7 text-gray-600 md:text-lg/8">
            Layanan profesional untuk mendukung pertumbuhan bisnis Anda—dirancang dengan fokus pada
            efisiensi, kualitas, dan hasil.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          {cards.map((card, i) => (
            <Card key={card.title} card={card} index={i} totalCards={cards.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Card
function Card({ card, index, totalCards }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  const spacer = 320;
  const topValue = index * 18;
  const isLast = index === totalCards - 1;

  return (
    <motion.article
      ref={cardRef}
      role="article"
      aria-label={card.title}
      style={{ scale, opacity, y, top: `${topValue}px`, marginBottom: isLast ? 0 : `${spacer}px` }}
      className="sticky will-change-transform"
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.colorFrom} ${card.colorTo} p-7 shadow-2xl ring-1 ring-black/10 md:p-12`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12),transparent_30%)]" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/30">
            <card.icon size={28} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white md:text-3xl">{card.title}</h3>
            <p className="mt-2 max-w-3xl text-white/85 md:text-lg/8">{card.description}</p>
          </div>
        </div>

        <div className="relative z-10 mt-10 flex items-center justify-between">
          <div className="text-sm font-medium uppercase tracking-wider text-white/70">Learn more</div>
          <div aria-hidden className="select-none text-7xl font-black leading-none text-white/15 md:text-8xl">
            {String(card.index).padStart(2, "0")}
          </div>
        </div>

        <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    </motion.article>
  );
}
