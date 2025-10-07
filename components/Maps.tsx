"use client"

export default function Maps() {
  return (
    <section className="w-full py-20 bg-[#193764]"
      style={{
        backgroundImage:
          "url('/bg-wave.png')", // ✅ bikin file SVG motif wave lalu simpan di /public
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Judul Section */}
        <div className="text-start mb-8">
          <h2 className="text-3xl font-poppins font-bold text-white">Our Maps Location</h2>
          <p className="text-white font-montserrat mt-2">
            Visit the PT Aneka Distribusi Indonesia office in person
          </p>
        </div>

        {/* Embed Google Maps */}
        <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.4399832797717!2d107.68722417475742!3d-6.9573126930430504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e93f59a60c93%3A0xda912377d45d9136!2sPT.%20ANEKA%20DISTRIBUSI%20INDONESIA!5e0!3m2!1sid!2sid!4v1758942364906!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
