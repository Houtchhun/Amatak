"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

const bannerImages = [
  {
    src: "https://www.streetwearofficial.com/cdn/shop/files/MAIN-BANNER-1_ae7257f8-debb-4fa2-897e-8bd4bfc4dacd.jpg?v=1752880064&width=1400",
    title: "Summer Styles are Here",
    description: "Feel the heat with our latest summer collection. Bright, bold, and ready for sunshine.",
  },
  {
    src: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "New Arrivals Daily",
    description: "Fresh looks, delivered daily. Discover the latest trends in fashion.",
  },
  {
    src: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Accessorize Your Look",
    description: "Find the perfect finishing touch. Shop our collection of accessories.",
  },
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  return (
  <section className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl mx-4 my-8 min-h-[400px] max-h-[900px]">
      {bannerImages.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner.src || "/placeholder.svg"}
            alt={banner.title}
            fill
            className="object-cover "
            priority={index === 0}
          />
          <div className="absolute inset-0  bg-opacity-10" />
          <div className="absolute bottom-12 left-12 text-black max-w-lg">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{banner.title}</h2>
            <p className="text-lg md:text-xl mb-6 drop-shadow-md">{banner.description}</p>
            <Link href="/shop" passHref legacyBehavior>
              <a className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
                SHOP NOW
                <ArrowRight size={20} />
              </a>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ArrowRight size={24} className="rotate-180" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
      >
        <ArrowRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
