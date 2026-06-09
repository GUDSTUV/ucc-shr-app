'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Flag, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl: string | null
}

interface HeroCarouselProps {
  banners: Banner[]
}

const DEFAULT_BANNER: Banner = {
  id: 'default',
  title: 'Awareness Hub',
  imageUrl: '', // Will fall back to a gradient if empty
  linkUrl: null,
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const displayBanners = banners.length > 0 ? banners : [DEFAULT_BANNER]

  useEffect(() => {
    if (displayBanners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
    }, 6000) // Change slide every 6 seconds

    return () => clearInterval(timer)
  }, [displayBanners.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1))
  }

  const currentBanner = displayBanners[currentIndex]

  return (
    <section className="relative w-full overflow-hidden bg-navy">
      {/* Background/Image wrapper */}
      <div className="absolute inset-0 z-0">
        {displayBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {banner.imageUrl ? (
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-navy to-navy-light" />
            )}
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-navy/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl flex-col items-center justify-center px-6 py-14 text-center lg:px-8 lg:py-24">
        <motion.div 
          key={currentIndex} 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-white/80 drop-shadow-sm">
            CEGRAD — University of Cape Coast
          </span>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
            {currentBanner.title}
          </h1>
          
          {/* Action Buttons always present */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {currentBanner.linkUrl ? (
              <Link
                href={currentBanner.linkUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-navy shadow-lg transition-all hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98]"
              >
                Learn More
              </Link>
            ) : (
              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-xl bg-red px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98]"
              >
                <Flag size={18} />
                Report an Incident
              </Link>
            )}
            <Link
              href="/help"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98]"
            >
              <Phone size={18} />
              Get Help Now
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/40 hover:text-white sm:left-8"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/40 hover:text-white sm:right-8"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
