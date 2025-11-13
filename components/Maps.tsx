"use client"

import { motion } from "framer-motion"
import { Navigation, MapPin, Clock } from "lucide-react"

export default function Maps() {
  // Contact info - HANYA 2 cards (kiri-kanan)
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Jl. Gedebage Selatan No.41, Bandung",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Sat : 08:00 - 17:00",
      color: "text-green-400"
    },
  ]

  return (
    <section 
      className="w-full py-20 bg-[#193764] relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg-wave.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Animated Header Section */}
        <div className="text-start mb-12">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Navigation className="w-4 h-4 text-blue-300" />
            <span className="text-white/80 text-sm font-semibold">Find Us</span>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Location
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-white/80 font-montserrat text-lg max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Kunjungi kami dan temukan lokasi kantor serta fasilitas operasional PT Aneka Distribusi Indonesia. 
          </motion.p>
        </div>

        {/* ✨ Contact Info Cards - 2 Cards (Left & Right) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className={`w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 ${info.color}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <info.icon size={28} />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold font-poppins mb-1 text-lg">{info.title}</h3>
                  <p className="text-white/80 font-montserrat">{info.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Google Maps Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Decorative corners */}
          <motion.div
            className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-blue-400/50 rounded-tl-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-cyan-400/50 rounded-br-3xl pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />

          {/* Map with shadow and border */}
          <motion.div 
            className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Pulse effect on hover */}
            <motion.div
              className="absolute inset-0 bg-blue-400/10 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1 }}
            />

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3959187123814!2d107.68659989999999!3d-6.9625348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c35aa17ceae1%3A0x816a3ff27fd05557!2sLucky%20Bundle!5e0!3m2!1sid!2sid!4v1760357955580!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Floating Action Button */}
          <motion.a
            href="https://maps.google.com/?q=-6.9625348,107.68659989999999"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-6 bg-white text-blue-900 px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2 hover:bg-blue-50 transition-colors font-poppins"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Navigation size={18} />
            Open in Maps
          </motion.a>
        </motion.div>

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-20 right-10 w-16 h-16 border-2 border-white/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-10 w-12 h-12 border-2 border-white/10 rounded-full"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  )
}
