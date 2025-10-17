"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Package, Truck, Megaphone, Handshake, LucideIcon } from "lucide-react"

interface CardData {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const cards: CardData[] = [
    {
      icon: Package,
      title: "Brand Distribution",
      description: "Layanan distribusi profesional yang memastikan produk Anda menjangkau pasar dengan cepat, efisien, dan terukur. Kami mendukung berbagai jalur distribusi modern trade, general trade, hingga online marketplace di seluruh wilayah Asia Tenggara.",
      color: "from-blue-600 to-blue-800",
      index: 1
    },
    {
      icon: Truck,
      title: "Supply Chain Management",
      description: "Kami mengelola rantai pasok secara end-to-end untuk memastikan kelancaran arus barang dari pabrik hingga konsumen. Sistem logistik kami dirancang untuk efisiensi, keandalan, dan transparansi.",
      color: "from-indigo-600 to-indigo-800",
      index: 2
    },
    {
      icon: Megaphone,
      title: "Makloon (OEM & ODM)",
      description: "Kami menyediakan layanan makloon lengkap mulai dari formulasi, produksi, hingga pengemasan produk sesuai kebutuhan klien. Didukung oleh fasilitas produksi bersertifikasi dan tim ahli, kami membantu Anda membangun brand yang kuat dan kompetitif di pasar regional.",
      color: "from-purple-600 to-purple-800",
      index: 3
    },
    {
      icon: Handshake,
      title: "Partnership & Marketing Support",
      description: "Kami tidak hanya mendistribusikan produk, tetapi juga membangun kemitraan strategis dengan klien. Melalui dukungan pemasaran, riset pasar, dan strategi promosi, kami membantu meningkatkan visibilitas dan performa brand di pasar Asia Tenggara.",
      color: "from-pink-600 to-pink-800",
      index: 4
    }
  ]

  return (
    <section 
      id="services"
      ref={sectionRef} 
      className="relative py-12 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/bg-wave.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
      
      {/* ✨ LEFT SIDE DECORATIONS */}
      <div className="absolute left-0 top-0 bottom-0 w-40 hidden lg:flex flex-col justify-center gap-32 pl-8 pointer-events-none">
        {cards.map((card, index) => (
          <motion.div
            key={`left-${index}`}
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Number */}
            <motion.div
              className="text-8xl font-black text-white/5 font-poppins"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              0{index + 1}
            </motion.div>
            
            {/* Animated Line */}
            <motion.div
              className="absolute top-1/2 -right-4 w-12 h-[2px] bg-gradient-to-r from-white/20 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* ✨ RIGHT SIDE DECORATIONS */}
      <div className="absolute right-0 top-0 bottom-0 w-40 hidden lg:flex flex-col justify-center gap-32 pr-8 pointer-events-none">
        {cards.map((card, index) => (
          <motion.div
            key={`right-${index}`}
            className="relative flex flex-col items-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Animated Dots */}
            <div className="flex gap-2 mb-4">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2 h-2 rounded-full bg-white/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: dot * 0.3 + index * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Icon Shadow */}
            <motion.div
              className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <card.icon size={28} className="text-white/30" strokeWidth={2} />
            </motion.div>

            {/* Vertical Line */}
            <motion.div
              className="absolute top-0 -left-4 w-[2px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-2">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-poppins font-bold text-white mb-6">
            Our Services
          </h2>
          <p className="text-white text-xl max-w-2xl mx-auto font-montserrat">
            Layanan yang kami tawarkan untuk mendukung pertumbuhan bisnis Anda.
          </p>
        </motion.div>

        {/* Stacking Cards Container */}
        <div className="relative">
          {cards.map((card, index) => (
            <StackingCard 
              key={index}
              card={card}
              index={index}
              totalCards={cards.length}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="h-[10vh]" />
      </div>
    </section>
  )
}

interface StackingCardProps {
  card: CardData;
  index: number;
  totalCards: number;
}

function StackingCard({ card, index }: StackingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center", "end start"]
  })

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.75, 1, 0.75]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.6, 1, 1, 0.6]
  )

  const stickyTop = 80 + (index * 15)
  const zIndex = 10 + index

  return (
    <div
      ref={cardRef}
      className="sticky mb-4"
      style={{
        top: `${stickyTop}px`,
        zIndex: zIndex,
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className={`bg-gradient-to-br ${card.color} rounded-3xl p-8 md:p-12 min-h-[300px] flex flex-col justify-between relative shadow-2xl overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>

          {/* Background Icon */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            <card.icon 
              size={300}
              strokeWidth={1.5} 
              className="text-white"
            />
          </div>

          {/* Icon dengan circle background */}
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md mb-6 relative z-10"
            whileHover={{ scale: 1.15, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <card.icon size={40} className="text-white" strokeWidth={2.5} />
          </motion.div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-poppins font-black text-white mb-4 leading-tight">
              {card.title}
            </h3>
            <p className="text-white/95 text-lg leading-relaxed font-montserrat max-w-2xl">
              {card.description}
            </p>
          </div>

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  )
}
