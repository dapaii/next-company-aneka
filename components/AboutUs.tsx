"use client"
import React from "react"

export default function AboutUs() {
  return (
    <section
      className="relative w-full h-[700px] bg-fixed bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: "url('/aboutusbg.webp')" }} // 🔹 pakai bg-fixed
    >
      {/* Overlay biar teks lebih jelas */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Konten */}
      <div className="relative z-10 max-w-4xl text-center px-6 text-white">
        <h2 className="text-4xl font-poppins font-bold mb-6">About Us</h2>
        <p className="text-base mb-8 font-montserrat leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full bg-transparent transition-all duration-300 ease-in-out hover:bg-[#0346ff] hover:text-white hover:scale-105 font-poppins">
          Learn More
        </button>
      </div>
    </section>
  )
}
