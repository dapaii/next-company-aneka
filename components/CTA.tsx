export default function CTA() {
  return (
    <section
      className="relative w-full py-20 bg-center bg-cover"
      style={{ backgroundImage: "url('/jabat-tangan.jpg')" }} // ganti sesuai gambar kamu
    >
      {/* Overlay biar teks jelas */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Konten */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        {/* Judul CTA */}
        <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
          Siap Bekerja Sama dengan PT Aneka Distribusi Indonesia?
        </h2>
        <p className="text-lg font-montserrat mb-10 max-w-2xl mx-auto">
          Kami hadir untuk mendukung brand Anda menjangkau pasar yang lebih luas
          dengan jaringan distribusi yang terpercaya dan modern.
        </p>

        {/* Tombol CTA */}
        <div className="flex justify-center gap-6">
          <a
            href="#contact"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full bg-transparent transition-all duration-300 ease-in-out hover:bg-[#0346ff] hover:text-white hover:scale-105 font-poppins"
          >
            Hubungi Kami
          </a>
          <a
            href="#services"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full bg-transparent transition-all duration-300 ease-in-out hover:bg-[#0346ff] hover:text-white hover:scale-105 font-poppins"
          >
            Lihat Layanan
          </a>
        </div>
      </div>
    </section>
  )
}
