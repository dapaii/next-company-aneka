"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"  // ✅ TAMBAH INI
import { motion } from "framer-motion"
import { Mail, MapPin, Phone } from "lucide-react"
import { RiInstagramFill, RiTiktokFill } from "react-icons/ri"

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const quickLinks = [
    { label: "Home", sectionId: null },
    { label: "About ADI", sectionId: "aboutus" },
    { label: "Our Brand", sectionId: "brands" },
    { label: "Services", sectionId: "services" },
    { label: "Event", sectionId: "event" },
    { label: "Blog", sectionId: "blog" },
  ]

  return (
    <footer 
      id="contact"
      className="bg-gradient-to-b from-[#0f172a] to-[#020617] text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* Column 1: Company Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center gap-2">
              {/* ✅ HANYA FIX INI: <img> → <Image> */}
              <Image 
                src="/PT ADI.png" 
                alt="ADI Logo" 
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
              PT Aneka Distribusi Indonesia - Mitra terpercaya untuk solusi distribusi berkualitas di Indonesia.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { 
                  icon: RiInstagramFill, 
                  href: "https://www.instagram.com/remov.id?igsh=ZDNzZWIyenF5NXM0", 
                  color: "hover:bg-pink-600",
                  label: "Instagram" 
                },
                { 
                  icon: RiTiktokFill, 
                  href: "https://www.tiktok.com/@remov.id?_t=ZS-90VLIq6Iek0&_r=1", 
                  color: "hover:bg-black",
                  label: "TikTok" 
                }
              ].map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${social.color} transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-poppins font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={() => {
                      if (item.sectionId === null) {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      } else {
                        scrollToSection(item.sectionId)
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Our Brands - EXTERNAL LINKS */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-poppins font-bold text-white">Our Brands</h3>
            <ul className="space-y-3">
              {[
                { name: "Remov", url: "https://remov.co.id/" },
                { name: "Supernova", url: "https://remov.co.id/" },
                { name: "Ipro", url: "https://remov.co.id/" },
                { name: "Seri Glow", url: "https://remov.co.id/" }
              ].map((brand, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link 
                    href={brand.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200 inline-block text-sm"
                  >
                    {brand.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-poppins font-bold text-white">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-blue-400" />
                <span>Jl. Gedebage Selatan No.41, Bodogol, Derwati, Kec. Rancasari, Kota Bandung, Jawa Barat 40295</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="flex-shrink-0 text-green-400" />
                <a href="tel:+62811222334" className="hover:text-white transition-colors">
                  +62 811-222-334
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="flex-shrink-0 text-red-400" />
                <a href="mailto:Hello@anekadistribusi.com" className="hover:text-white transition-colors">
                  Hello@anekadistribusi.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left font-montserrat">
              © {new Date().getFullYear()} PT Aneka Distribusi Indonesia. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <span className="text-gray-400">Privacy Policy</span>
              <span className="text-gray-400">Terms of Service</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
