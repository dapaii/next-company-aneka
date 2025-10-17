"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const images = ["/tesss.jpg", "/gudang2.jpg", "/gudang3.jpg"];

export default function HeroMedia() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const prevWidth = parseInt(document.documentElement.style.getPropertyValue('--vw') || '0');
        
        if (Math.abs(currentWidth - prevWidth) > 50) {
          setVh();
          document.documentElement.style.setProperty('--vw', `${currentWidth}`);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth}`);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="home"
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Background Images Layer */}
      <div className="absolute inset-0 z-0">
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
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-[6000ms] ease-in-out ${
                index === currentIndex ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <div className="absolute inset-0 z-20 flex items-end justify-start pb-32 md:pb-60 px-6 md:px-20">
        <div>
          <motion.h1 
            className="text-white text-3xl md:text-4xl lg:text-5xl font-poppins font-extrabold drop-shadow-lg max-w-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Selamat Datang di PT Aneka Distribusi Indonesia
          </motion.h1>
          
          <motion.p 
            className="text-white text-sm md:text-base font-montserrat mt-4 md:mt-6 drop-shadow-lg max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            PT Aneka Distribusi Indonesia merupakan mitra strategis dalam penyediaan layanan distribusi dan jasa makloon (OEM & ODM) di kawasan Asia Tenggara. Dengan jaringan logistik yang luas dan fasilitas produksi berstandar tinggi, kami membantu brand dan perusahaan memperluas pasar serta menghadirkan produk berkualitas ke seluruh wilayah regional.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
