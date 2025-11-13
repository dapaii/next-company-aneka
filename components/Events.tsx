"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

type EventItem = {
  id: string
  title: string
  photos: string[]
  startsAt: string
}

export function ResizableDemo() {
  const [latest, setLatest] = useState<EventItem[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/events", { cache: "no-store" })
      const json = await res.json()

      // API returns { events: [...] }
      const events: EventItem[] = json.events ?? []

      // filter published (API already handles it)
      const published = events

      // sort by startsAt DESC (terbaru)
      const sorted = [...published].sort(
        (a, b) =>
          new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
      )

      // ambil 3 event terbaru
      setLatest(sorted.slice(0, 3))
    }

    load()
  }, [])

  // helper
  const img = (i: number) => latest[i]?.photos?.[0] || "/papi-3.jpg"
  const title = (i: number) => latest[i]?.title || `Event ${i + 1}`

  return (
    <section
      id="event"
      className="relative w-full bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/papi-4.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto py-16 px-6">
        
        {/* Title */}
        <motion.div
          className="text-start mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-poppins font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            Events
          </h2>
          <p className="text-white font-montserrat font-semibold mt-2 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
            Kami aktif berpartisipasi dalam berbagai event untuk memperkuat kemitraan 
            dan memperkenalkan inovasi produk di pasar nasional maupun regional
          </p>
        </motion.div>

        {/* Event Panels */}
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full max-w-7xl mx-auto min-h-[500px]"
        >
          {/* EVENT 1 */}
          <ResizablePanel defaultSize={65}>
            <Link href="/events" className="block h-[500px] w-full">
              <motion.div
                className="relative h-full w-full overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.div
                  className="relative h-full w-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={img(0)}
                    alt={title(0)}
                    fill
                    priority
                    className="object-cover"
                  />
                </motion.div>

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                  flex flex-col items-start justify-end text-left text-white p-6"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.h3
                    className="text-2xl font-poppins font-bold"
                    initial={{ y: 10, opacity: 0.8 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    {title(0)}
                  </motion.h3>

                  <motion.p
                    className="text-sm font-montserrat font-semibold mt-2"
                    initial={{ y: 10, opacity: 0.8 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    Event highlight terbaru kami.
                  </motion.p>

                  <motion.div
                    className="mt-4 h-1 bg-white"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100px" }}
                  />
                </motion.div>

                {/* Glow */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
              </motion.div>
            </Link>
          </ResizablePanel>

          <ResizableHandle />

          {/* EVENT 2 & 3 GROUP */}
          <ResizablePanel defaultSize={35}>
            <ResizablePanelGroup direction="vertical">

              {/* EVENT 2 */}
              <ResizablePanel defaultSize={40}>
                <Link href="/events" className="block h-full">
                  <motion.div
                    className="relative h-full w-full overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="relative h-full w-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image
                        src={img(1)}
                        alt={title(1)}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                      flex flex-col items-start justify-end text-left text-white p-4"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.h3
                        className="text-xl font-poppins font-bold"
                        initial={{ y: 10, opacity: 0.8 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        {title(1)}
                      </motion.h3>

                      <motion.p
                        className="text-sm font-montserrat font-semibold mt-2"
                        initial={{ y: 10, opacity: 0.8 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        Sorotan event kedua terbaru.
                      </motion.p>

                      <motion.div
                        className="mt-3 h-1 bg-white"
                        initial={{ width: 0 }}
                        whileHover={{ width: "80px" }}
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                    />
                  </motion.div>
                </Link>
              </ResizablePanel>

              <ResizableHandle />

              {/* EVENT 3 */}
              <ResizablePanel defaultSize={60}>
                <Link href="/events" className="block h-full">
                  <motion.div
                    className="relative h-full w-full overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="relative h-full w-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image
                        src={img(2)}
                        alt={title(2)}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                      flex flex-col items-start justify-end text-left text-white p-4"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.h3
                        className="text-xl font-poppins font-bold"
                        initial={{ y: 10, opacity: 0.8 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        {title(2)}
                      </motion.h3>

                      <motion.p
                        className="text-sm font-montserrat font-semibold mt-2"
                        initial={{ y: 10, opacity: 0.8 }}
                        whileHover={{ y: 0, opacity: 1 }}
                      >
                        Sorotan event ketiga terbaru.
                      </motion.p>

                      <motion.div
                        className="mt-3 h-1 bg-white"
                        initial={{ width: 0 }}
                        whileHover={{ width: "80px" }}
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                    />
                  </motion.div>
                </Link>
              </ResizablePanel>

            </ResizablePanelGroup>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </section>
  )
}
