import Image from "next/image"

export default function Blog() {
  const blogs = [
    {
      id: 1,
      title: "Strategi Distribusi Efektif di Era Digital",
      date: "15 Jan 2025",
      author: "Admin",
      desc: "Membahas bagaimana perusahaan distribusi beradaptasi dengan era digital untuk meningkatkan efisiensi...",
      img: "/blog1.jpg",
    },
    {
      id: 2,
      title: "Inovasi Brand Lokal yang Mendunia",
      date: "10 Jan 2025",
      author: "Admin",
      desc: "Cerita brand lokal yang berhasil bersaing di pasar global dengan strategi pemasaran tepat...",
      img: "/blog2.jpg",
    },
    {
      id: 3,
      title: "Tips Membangun Jaringan Distribusi Modern",
      date: "02 Jan 2025",
      author: "Admin",
      desc: "Bagaimana cara membangun jaringan distribusi yang solid, efisien, dan terintegrasi di Indonesia...",
      img: "/blog3.jpg",
    },
  ]

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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-poppins font-bold text-white">
            Our Blog
          </h2>
          <p className="text-white mt-4 font-montserrat">
            Berita & Artikel Terbaru dari PT Aneka Distribusi Indonesia
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-56">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-poppins font-bold text-gray-900 mb-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  📅 {blog.date} · ✍️ {blog.author}
                </p>
                <p className="text-gray-700 text-sm mb-4 font-montserrat">
                  {blog.desc}
                </p>
                <a
                  href="#"
                  className="text-[#0346ff] font-semibold hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full bg-transparent transition-all duration-300 ease-in-out hover:bg-[#0346ff] hover:text-white hover:scale-105 font-poppins">
          View All Article
        </button>
        </div>
      </div>
    </section>
  )
}
