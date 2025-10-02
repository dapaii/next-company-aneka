"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = ["/tesss.jpg", "/gudang2.jpg", "/gudang3.jpg"]; // daftar gambar di /public

export default function HeroMedia() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000); // ganti tiap 6 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Hero ${index}`}
            width={1920}
            height={1080}
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-in-out ${
              index === currentIndex ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Teks Hero */}
      <div className="absolute left-15 bottom-40 w-full flex items-end justify-start pb-20 pl-8">
        <div className="max-w-xl">
          <h1 className="text-white text-4xl font-poppins font-extrabold drop-shadow-lg">
            Selamat Datang di PT Aneka Distribusi Indonesia
          </h1>
          <p className="text-white text-base font-montserrat mt-9 drop-shadow-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
}
