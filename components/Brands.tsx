"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Brands() {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  const title = "Our Brands"
  const titleWords = title.split(" ")

  const description = "Kami menaungi beragam merek unggulan yang tumbuh bersama pelanggan di Asia Tenggara. Melalui Supernova, iPro, dan Remov, kami menyediakan produk dan layanan yang inovatif, terpercaya, dan sesuai dengan kebutuhan pasar modern. Komitmen kami adalah menghadirkan nilai tambah melalui kolaborasi, kualitas, dan inovasi berkelanjutan."

  return (
    <section
      id="brands"
      className="w-full bg-[#193764] py-10 pb-0 relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg-wave.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* Carousel Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full max-w-4xl mx-auto relative z-10"
        >
          <CarouselContent>
            {["/Remov.png", "/Supernova.png", "/Ipro.png", "/Remov.png", "/Supernova.png", "/Ipro.png"].map(
              (src, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image
                          src={src}
                          alt={`Brand ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-contain"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.div>

      {/* Text Section with Elegant Animations */}
      <div className="max-w-3xl mx-auto px-4 pb-10 text-center py-10 relative z-10">
        
        {/* Animated Title - SIMPLIFIED */}
        <motion.h2 
          className="text-white text-4xl md:text-5xl font-poppins font-extrabold drop-shadow-lg mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Animated Divider Line */}
        <motion.div
          className="w-24 h-1 bg-white/50 mx-auto mb-8 rounded-full"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 96, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Animated Description */}
        <motion.p 
          className="text-white text-base md:text-lg leading-relaxed font-montserrat drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {description}
        </motion.p>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -left-8 top-1/2 w-16 h-16 border-2 border-white/10 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          animate={{
            rotate: 360,
          }}
          transition={{
            scale: { duration: 0.8, delay: 0.8 },
            opacity: { duration: 0.8, delay: 0.8 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />

        <motion.div
          className="absolute -right-8 top-1/4 w-12 h-12 border-2 border-white/10 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          animate={{
            rotate: -360,
          }}
          transition={{
            scale: { duration: 0.8, delay: 1 },
            opacity: { duration: 0.8, delay: 1 },
            rotate: { duration: 15, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>
    </section>
  )
}
