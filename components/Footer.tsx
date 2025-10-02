"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Github, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-white py-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-6">
        {/* Navigation Links */}
        <div className="flex space-x-6 text-[#193764] text-sm font-poppins font-semibold">
          <Link href="#">About</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Jobs</Link>
          <Link href="#">Press</Link>
          <Link href="#">Accessibility</Link>
          <Link href="#">Partners</Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 text-[#193764]">
          <Link href="#"><Facebook className="h-5 w-5" /></Link>
          <Link href="#"><Instagram className="h-5 w-5" /></Link>
          <Link href="#"><Twitter className="h-5 w-5" /></Link>
          <Link href="#"><Github className="h-5 w-5" /></Link>
          <Link href="#"><Youtube className="h-5 w-5" /></Link>
        </div>

        {/* Copyright */}
        <p className="text-[#193764] font-montserrat text-xs">
          © 2024 PT.Aneka Distribusi Indonesia | All rights reserved.
        </p>
      </div>
    </footer>
  )
}
