import HeroMedia from "@/components/Heromedia";
import Brands from "@/components/Brands";
import AboutUs from "@/components/AboutUs";
import { ResizableDemo } from "@/components/Events";
import Maps from "@/components/Maps";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import CTA from "@/components/CTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Navbar } from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll"; // ← TAMBAH INI

export default function Home() {
  return (
    <SmoothScroll> {/* ← WRAP semua content dengan SmoothScroll */}
      <main>
        <Navbar />
        <HeroMedia />
        <div className="w-full h-[1px] bg-white/40"></div>
        <Brands />
        <div className="w-full h-[1px] bg-white/40"></div>
        <AboutUs />
        <div className="w-full h-[1px] bg-white/40"></div>
        <Services />
        <div className="w-full h-[1px] bg-white/40"></div>
        <ResizableDemo />
        <div className="w-full h-[1px] bg-white/40"></div>
        <CTA />
        <div className="w-full h-[1px] bg-white/40"></div>
        <WhatsAppButton />
        <Maps />
        <Footer />
      </main>
    </SmoothScroll> 
  )
}
