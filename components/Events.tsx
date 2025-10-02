import Image from "next/image"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableDemo() {
  return (
    <section
      className="relative w-full bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/bgevent.webp')" }} // ✅ background tetap pakai style
    >
      {/* Overlay biar teks lebih jelas */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Konten Events */}
      <div className="relative w-full max-w-7xl mx-auto py-16 px-6">
        {/* Judul Section */}
        <div className="text-start mb-12">
  <h2 className="text-4xl font-poppins font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
    Events
  </h2>
  <p className="text-white font-montserrat font-semibold mt-2 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
    Ikuti berbagai event dari PT Aneka Distribusi Indonesia.
  </p>
</div>


        {/* Kotak-kotak Event */}
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full max-w-7xl mx-auto rounded-lg min-h-[500px]"
        >
          {/* Event 1 */}
          <ResizablePanel defaultSize={65}>
            <div className="relative h-[500px] w-full">
              <Image
                src="/event1.webp"
                alt="Event 1"
                fill
                priority
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end text-left text-white p-6 rounded-lg">
                <h3 className="text-2xl font-poppins font-bold">Event 1</h3>
                <p className="text-sm font-montserrat font-semibold mt-2">
                  Event terakhir dengan highlight perusahaan.
                </p>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={35}>
            <ResizablePanelGroup direction="vertical">
              {/* Event 2 */}
              <ResizablePanel defaultSize={40}>
                <div className="relative h-full w-full">
                  <Image
                    src="/event2.jpeg"
                    alt="Event 2"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end text-left text-white p-4 rounded-lg">
                    <h3 className="text-xl font-poppins font-bold">Event 2</h3>
                    <p className="text-sm font-montserrat font-semibold mt-2">
                      Event highlight kedua perusahaan.
                    </p>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Event 3 */}
              <ResizablePanel defaultSize={60}>
                <div className="relative h-full w-full">
                  <Image
                    src="/event3.jpeg"
                    alt="Event 3"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end text-left text-white p-4 rounded-lg">
                    <h3 className="text-xl font-poppins font-bold">Event 3</h3>
                    <p className="text-sm font-montserrat font-semibold mt-2">
                      Event highlight ketiga perusahaan.
                    </p>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  )
}
