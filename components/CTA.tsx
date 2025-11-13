"use client"

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

// Tipe untuk props AnimatedCounter
type AnimatedCounterProps = {
  target: number
  suffix?: string
}

// Komponen counter animasi
function AnimatedCounter({ target, suffix = "" }: AnimatedCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: "easeOut" })
      const unsubscribe = rounded.on("change", (latest) => {
        setDisplayValue(latest)
      })
      return () => {
        controls.stop()
        unsubscribe()
      }
    }
  }, [isInView, count, target, rounded])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black text-black mb-2 font-poppins">
      {displayValue}{suffix}
    </div>
  )
}

// Tipe data stat
type StatNumber = { value: number, suffix: string, label: string, type: "number" }
type StatText = { text: string, label: string, type: "text" }
type Stat = StatNumber | StatText

export default function CTA() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const features = [
    "Jaringan Distribusi Luas",
    "Partner Terpercaya",
    "Teknologi Modern",
    "Dukungan Penuh"
  ]

  const particlePositions = [
    { x: 100, y: 200 }, { x: 300, y: 100 }, { x: 500, y: 300 },
    { x: 700, y: 150 }, { x: 200, y: 400 }, { x: 600, y: 250 },
    { x: 800, y: 350 }, { x: 150, y: 500 }, { x: 450, y: 180 },
    { x: 750, y: 450 }, { x: 50, y: 320 }, { x: 550, y: 500 },
    { x: 350, y: 80 }, { x: 650, y: 420 }, { x: 250, y: 380 },
    { x: 850, y: 120 }, { x: 400, y: 480 }, { x: 900, y: 280 },
    { x: 180, y: 160 }, { x: 680, y: 380 }
  ]

  const stats: Stat[] = [
    { value: 24, suffix: "/7", label: "Customer Support", type: "number" },
    { value: 100, suffix: "%", label: "Komitmen Kualitas", type: "number" },
    { text: "Fast", label: "Response Time", type: "text" },
  ]

  return (
    <section className="relative w-full py-32 bg-white overflow-hidden">
      {/* Particle */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-black/20 rounded-full"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
              }}
              animate={{
                y: [-10, -40, -10],
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Badge - updated color */}
        <motion.div className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 bg-black/10 backdrop-blur-md rounded-full border border-black"
            whileHover={{ scale: 1.05 }}>
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span className="text-black font-semibold text-sm">Partner Distribusi Terpercaya</span>
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          <h2 className="text-4xl md:text-6xl font-poppins font-black text-black mb-6 leading-tight">
            Siap Membawa Brand Anda
            <br />
            <span className="text-black bg-clip-text">
              Ke Level Berikutnya?
            </span>
          </h2>
          <motion.p
            className="text-lg md:text-xl font-montserrat text-black max-w-5xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
            Mari wujudkan peluang bisnis Anda bersama kami.
            Dengan pengalaman, jaringan luas, dan layanan makloon serta distribusi terpadu, kami siap menjadi mitra strategis dalam mengembangkan brand Anda di pasar Asia Tenggara.
            Hubungi kami untuk konsultasi dan kolaborasi lebih lanjut.
          </motion.p>
        </motion.div>

        {/* Features Grid - updated color */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto"
          initial="hidden" whileInView="visible"
          viewport={{ once: true }} variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
          }}>
          {features.map((feature, index) => (
            <motion.div key={index}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-2 justify-center bg-black/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-black"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-black text-sm font-semibold">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.7 }}>
          {/* Primary */}
          <motion.a
            href="#contact"
            className="group relative px-8 py-4 bg-black text-white font-bold rounded-full overflow-hidden font-poppins text-center"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
              Mulai Kerja Sama
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
          {/* Secondary */}
          <motion.a
            href="#services"
            className="group px-8 py-4 border-2 border-black text-black font-bold rounded-full backdrop-blur-sm hover:bg-black hover:text-white transition-all duration-300 font-poppins text-center"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="flex items-center justify-center gap-2">
              Lihat Layanan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-black/20"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.9 }}>
          {stats.map((stat, index) => (
            <motion.div key={index} className="text-center" whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}>
              {"value" in stat && stat.type === "number" ? (
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              ) : (
                <div className="text-3xl md:text-4xl font-black text-black mb-2 font-poppins">
                  {"text" in stat ? stat.text : ""}
                </div>
              )}
              <div className="text-black/80 text-sm font-montserrat">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  )
}
