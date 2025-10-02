"use client"
import React from "react"
import { Package, Truck, Megaphone, Handshake } from "lucide-react"

export default function Services() {
  return (
    <section
      className="w-full relative py-20 text-center text-white"
      style={{
        backgroundImage:
          "url('/bg-wave.png')", // ✅ bikin file SVG motif wave lalu simpan di /public
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Judul */}
        <h2 className="text-4xl font-poppins font-bold mb-4">Our Services</h2>
        <p className="font-montserrat mb-12 max-w-2xl mx-auto">
          Kami hadir memberikan solusi distribusi, supply chain, dan dukungan
          promosi untuk brand yang bekerja sama dengan PT Aneka Distribusi Indonesia.
        </p>

        {/* Grid Services */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2">
          {/* Service 1 */}
          <div className="bg-white/90 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
            <Package className="h-12 w-12 text-[#0346ff] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black font-poppins">
              Brand Distribution
            </h3>
            <p className="text-sm text-gray-700 font-montserrat">
              Penyaluran produk brand ke seluruh jaringan ritel & marketplace.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
            <Truck className="h-12 w-12 text-[#0346ff] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black font-poppins">
              Supply Chain
            </h3>
            <p className="text-sm text-gray-700 font-montserrat">
              Layanan manajemen rantai pasok yang efisien dan terpercaya.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white/90 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
            <Megaphone className="h-12 w-12 text-[#0346ff] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black font-poppins">
              Marketing Support
            </h3>
            <p className="text-sm text-gray-700 font-montserrat">
              Dukungan promosi untuk meningkatkan awareness produk brand.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform">
            <Handshake className="h-12 w-12 text-[#0346ff] mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black font-poppins">
              Partnership
            </h3>
            <p className="text-sm text-gray-700 font-montserrat">
              Kolaborasi strategis dengan brand baru untuk berkembang bersama.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
