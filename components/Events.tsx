"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableDemo() {
  return (
    <section
      id="event"
      className="relative w-full bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/papi-4.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Konten Events */}
      <div className="relative w-full max-w-7xl mx-auto py-16 px-6">
        {/* Judul Section */}
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
            Kami aktif berpartisipasi dalam berbagai event untuk memperkuat kemitraan dan memperkenalkan inovasi produk di pasar nasional maupun regional
          </p>
        </motion.div>

        {/* Kotak-kotak Event */}
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full max-w-7xl mx-auto rounded-lg min-h-[500px]"
        >
          {/* Event 1 */}
          <ResizablePanel defaultSize={65}>
            <motion.div 
              className="relative h-[500px] w-full overflow-hidden rounded-lg group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="relative h-full w-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src="/papi-3.jpg"
                  alt="Event 1"
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay dengan animasi */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-start justify-end text-left text-white p-6"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3 
                  className="text-2xl font-poppins font-bold"
                  initial={{ y: 10, opacity: 0.8 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Event 1
                </motion.h3>
                <motion.p 
                  className="text-sm font-montserrat font-semibold mt-2"
                  initial={{ y: 10, opacity: 0.8 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  Event terakhir dengan highlight perusahaan.
                </motion.p>

                {/* Decorative line dengan animasi */}
                <motion.div
                  className="mt-4 h-1 bg-white rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100px" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>

              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-white rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={35}>
            <ResizablePanelGroup direction="vertical">
              {/* Event 2 */}
              <ResizablePanel defaultSize={40}>
                <motion.div 
                  className="relative h-full w-full overflow-hidden rounded-lg group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Image
                      src="/papi-3.jpg"
                      alt="Event 2"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-start justify-end text-left text-white p-4"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3 
                      className="text-xl font-poppins font-bold"
                      initial={{ y: 10, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      Event 2
                    </motion.h3>
                    <motion.p 
                      className="text-sm font-montserrat font-semibold mt-2"
                      initial={{ y: 10, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                    >
                      Event highlight kedua perusahaan.
                    </motion.p>

                    <motion.div
                      className="mt-3 h-1 bg-white rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "80px" }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 bg-white rounded-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Event 3 */}
              <ResizablePanel defaultSize={60}>
                <motion.div 
                  className="relative h-full w-full overflow-hidden rounded-lg group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Image
                      src="/papi-3.jpg"
                      alt="Event 3"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-start justify-end text-left text-white p-4"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.h3 
                      className="text-xl font-poppins font-bold"
                      initial={{ y: 10, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      Event 3
                    </motion.h3>
                    <motion.p 
                      className="text-sm font-montserrat font-semibold mt-2"
                      initial={{ y: 10, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                    >
                      Event highlight ketiga perusahaan.
                    </motion.p>

                    <motion.div
                      className="mt-3 h-1 bg-white rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "80px" }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 bg-white rounded-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  )
}
