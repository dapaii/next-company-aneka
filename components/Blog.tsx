"use client"

import { motion } from "framer-motion"
import { FileText, Calendar, TrendingUp, Clock } from "lucide-react"

export default function Blog() {
  return (
    <section 
      id="blog"
      className="relative w-full py-24 overflow-hidden bg-[#193764] bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-wave.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#193764]/10 via-[#193764]/10 to-[#193764]/10" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Clock className="w-4 h-4 text-blue-300" />
            <span className="text-white/90 text-sm font-medium">In Development</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
            Blog & Articles
          </h2>
          
          <p className="text-white/80 text-lg font-montserrat max-w-2xl mx-auto">
            Insights and updates about distribution industry
          </p>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
            >
              <FileText size={48} className="text-white" strokeWidth={1.5} />
            </motion.div>
          </div>

          <div className="text-center mb-12">
            <motion.h3 
              className="text-3xl font-poppins font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Coming Soon
            </motion.h3>
            <motion.p 
              className="text-white/80 font-montserrat leading-relaxed max-w-xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              We are currently preparing valuable content about distribution strategies, 
              industry insights, and business development to help our partners grow.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: FileText,
                title: "Industry News",
                desc: "Latest distribution trends & updates"
              },
              {
                icon: TrendingUp,
                title: "Business Insights",
                desc: "Strategic analysis & expert tips"
              },
              {
                icon: Calendar,
                title: "Regular Updates",
                desc: "Weekly publication schedule"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <item.icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                </div>
                <h4 className="text-white font-semibold font-poppins mb-2 text-lg">
                  {item.title}
                </h4>
                <p className="text-white/70 text-sm font-montserrat">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-white/20 my-10" />

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Calendar className="w-5 h-5 text-blue-300" />
              <span className="text-white/90 font-medium">
                Expected Launch: <span className="font-bold text-white">Q1 2025</span>
              </span>
            </div>
            
            <p className="text-white/70 font-montserrat">
              For inquiries, please contact us at{" "}
              <a 
                href="mailto:hello@anekadistribusi.com" 
                className="text-blue-300 hover:text-blue-200 font-semibold underline transition-colors"
              >
                hello@anekadistribusi.com
              </a>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
        >
        </motion.div>

      </div>
    </section>
  )
}
