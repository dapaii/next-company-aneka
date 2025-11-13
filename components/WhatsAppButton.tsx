import React from "react";
import Image from "next/image";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/+62811222334" // ✅ ganti dengan nomor WhatsApp PT Aneka
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Image
        src="/whatsapp.jpg" // ✅ letakkan logo WhatsApp di folder public
        alt="WhatsApp"
        width={60}
        height={60}
        className="rounded-full hover:scale-110 transition-transform duration-300"
      />
    </a>
  );
}
