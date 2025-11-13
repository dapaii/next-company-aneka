"use client"

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis - KURANGI MOMENTUM/INERTIA
    lenisRef.current = new Lenis({
      duration: 0.2,        // ✅ Lebih cepat berhenti: 1.8 → 0.8
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.5,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.50,           // ✅ KUNCI: Kurangi slide effect (default 0.1, naik ke 0.15)
    })

    // Animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  return <>{children}</>
}
