"use client"

import React from "react"
import { motion } from "framer-motion"

export default function AboutUs() {
  return (
    <section
      id="aboutus"
      className="relative w-full min-h-[700px] bg-scroll md:bg-fixed bg-center bg-cover flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/papi-1.jpg')" }}
    >
      {/* Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Content - DIPERLEBAR */}
      <div className="relative z-20 max-w-6xl text-center px-6 text-white">
        {/* ↑ max-w-3xl → max-w-6xl (lebih lebar) */}
        
        {/* Heading dengan animasi fade + slide up */}
        <motion.h2 
          className="text-4xl md:text-5xl font-poppins font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          About Us
        </motion.h2>

        {/* Divider line */}
        <motion.div
          className="w-20 h-1 bg-blue-500 mx-auto mb-8"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Description - TEXT DIPERLEBAR */}
        <motion.p 
          className="text-base md:text-lg mb-10 font-montserrat leading-relaxed text-white/90"
          // ↑ Hapus max-w-5xl mx-auto agar full width sesuai container
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          PT Aneka Distribusi Indonesia adalah perusahaan yang bergerak di bidang distribusi dan jasa makloon (OEM & ODM) dengan jangkauan pasar di seluruh Asia Tenggara. Kami berkomitmen menjadi mitra terpercaya bagi berbagai brand dalam mengembangkan produk berkualitas dan memperluas jangkauan bisnisnya. Dengan pengalaman, jaringan logistik yang kuat, serta fasilitas produksi yang modern, kami siap memberikan solusi menyeluruh dari proses manufaktur hingga distribusi.
        </motion.p>

        {/* Button dengan hover effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <motion.button 
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full bg-transparent font-poppins relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute inset-0 bg-blue-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Learn More</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
