"use client"
import { useRef } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Brands() {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }) // 2 detik auto geser
  )

  return (
    <section
      className="w-full bg-[#193764] py-10 pb-0"
      style={{
        backgroundImage: "url('/bg-wave.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {["/Remov.png", "/Supernova.png", "/Ipro.png", "/Remov.png", "/Supernova.png", "/Ipro.png"].map(
            (src, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Image
                        src={src}
                        alt={`Brand ${index + 1}`}
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="max-w-3xl mx-auto px-4 pb-10 text-center py-10">
        <h2 className="text-white text-4xl font-poppins font-extrabold drop-shadow-lg">
          Our Brands
        </h2>
        <p className="text-white text-base mt-6 font-montserrat drop-shadow-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </div>
    </section>
  )
}
