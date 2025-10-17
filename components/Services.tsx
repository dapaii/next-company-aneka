"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, Megaphone, Handshake, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

interface CardData {
  icon: LucideIcon;
  title: string;
  description: string;
  from: string;
  to: string;
  index: number;
}

export default function ServicesHorizontal() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const cards: CardData[] = [
    {
      icon: Package,
      title: "Brand Distribution",
      description:
        "Distribusi profesional untuk menjangkau pasar lebih cepat, efisien, dan terukur—modern trade, general trade, hingga marketplace.",
      from: "from-sky-700",
      to: "to-sky-900",
      index: 1,
    },
    {
      icon: Truck,
      title: "Supply Chain Management",
      description:
        "Pengelolaan end-to-end: perencanaan, warehouse, hingga last-mile dengan SLA dan visibilitas real-time.",
      from: "from-slate-700",
      to: "to-slate-900",
      index: 2,
    },
    {
      icon: Megaphone,
      title: "Makloon (OEM/ODM)",
      description:
        "Formulasi, produksi, pengemasan—fasilitas tersertifikasi dan QC ketat untuk brand yang siap bersaing.",
      from: "from-indigo-700",
      to: "to-indigo-900",
      index: 3,
    },
    {
      icon: Handshake,
      title: "Partnership & Marketing",
      description:
        "Kemitraan strategis plus dukungan pemasaran & riset untuk mendorong awareness dan pertumbuhan penjualan.",
      from: "from-cyan-700",
      to: "to-cyan-900",
      index: 4,
    },
  ];

  const syncEdges = () => {
    const el = railRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    syncEdges();
    const onScroll = () => syncEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (dir: "prev" | "next") => {
    const el = railRef.current;
    if (!el) return;
    const cardWidth = Math.min(520, Math.round(el.clientWidth * 0.86));
    const gap = 20;
    const step = cardWidth + gap;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(15,23,42,0.06),rgba(15,23,42,0)_70%)]"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
              Layanan Kami
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Our Services
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Horizontal, ringkas, responsif, dan tampak profesional.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              aria-label="Previous"
              onClick={() => scroll("prev")}
              disabled={atStart}
              className={`rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:border-slate-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <button
              aria-label="Next"
              onClick={() => scroll("next")}
              disabled={atEnd}
              className={`rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:border-slate-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent"
          />

          <div
            ref={railRef}
            style={{ scrollSnapType: "x mandatory", scrollPadding: "0 24px" }}
            className="hide-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-2"
          >
            {cards.map((c) => (
              <ServiceCard key={c.title} card={c} />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function ServiceCard({ card }: { card: CardData }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 56 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="snap-start"
    >
      <div
        className={`relative flex h-full w-[86vw] min-w-[86vw] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${card.from} ${card.to} p-6 shadow-2xl ring-1 ring-black/10 md:w-[520px] md:min-w-[520px] md:p-8`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12),transparent_35%)]"
        />
        <div className="relative z-10 flex items-start gap-4">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 md:h-14 md:w-14">
            <card.icon className="h-6 w-6 text-white md:h-7 md:w-7" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white md:text-2xl">
              {card.title}
            </h3>
            <p className="mt-2 line-clamp-5 max-w-prose text-white/85 md:line-clamp-4 md:text-base">
              {card.description}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-white/70">
            Learn more
          </div>
          <div
            aria-hidden
            className="select-none text-5xl font-black leading-none text-white/10 md:text-6xl"
          >
            {String(card.index).padStart(2, "0")}
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-10"
        >
          <card.icon className="h-56 w-56 md:h-64 md:w-64" />
        </div>
      </div>
    </motion.article>
  );
}
