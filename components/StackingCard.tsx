"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Package, Truck, Megaphone, Handshake, LucideIcon } from "lucide-react"

// Interface untuk Card Data
interface CardData {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
}

// Interface untuk Card Props
interface CardProps {
  card: CardData;
  index: number;
  totalCards: number;
}

export default function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  const cards: CardData[] = [
    {
      icon: Package,
      title: "Brand Distribution",
      description: "Penyaluran produk brand ke seluruh jaringan ritel & marketplace dengan sistem terintegrasi.",
      color: "from-blue-600 to-blue-800",
      index: 1
    },
    {
      icon: Truck,
      title: "Supply Chain",
      description: "Layanan manajemen rantai pasok yang efisien, cepat, dan terpercaya untuk bisnis Anda.",
      color: "from-indigo-600 to-indigo-800",
      index: 2
    },
    {
      icon: Megaphone,
      title: "Marketing Support",
      description: "Dukungan promosi lengkap untuk meningkatkan brand awareness dan penjualan produk.",
      color: "from-purple-600 to-purple-800",
      index: 3
    },
    {
      icon: Handshake,
      title: "Partnership",
      description: "Kolaborasi strategis dengan brand baru untuk berkembang dan sukses bersama.",
      color: "from-pink-600 to-pink-800",
      index: 4
    }
  ]

  return (
    <section className="relative bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-montserrat">
            Layanan terbaik untuk mendukung pertumbuhan bisnis Anda
          </p>
        </div>

        {/* Stacking Cards Container */}
        <div ref={containerRef} className="relative">
          {cards.map((card, index) => (
            <Card 
              key={index} 
              card={card} 
              index={index}
              totalCards={cards.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Individual Card Component
function Card({ card, index, totalCards }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  })

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [0.85, 1]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.5, 1]
  )

  // Sticky positioning with progressive top values
  const topValue = index * 20
  const isLastCard = (index === totalCards - 1)

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        top: `${topValue}px`,
        marginBottom: isLastCard ? 0 : "400px"
      }}
      className="sticky rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
    >
      <div className={`bg-gradient-to-br ${card.color} p-8 md:p-12 min-h-[400px] flex flex-col justify-between relative`}>
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm mb-6">
          <card.icon size={32} className="text-white" strokeWidth={2} />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-4">
            {card.title}
          </h3>
          <p className="text-white/90 text-lg leading-relaxed font-montserrat">
            {card.description}
          </p>
        </div>

        {/* Card Number */}
        <div className="text-white/30 font-poppins font-bold text-8xl absolute bottom-8 right-8">
          0{card.index}
        </div>
      </div>
    </motion.div>
  )
}
