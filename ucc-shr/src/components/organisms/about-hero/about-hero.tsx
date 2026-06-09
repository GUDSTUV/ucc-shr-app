"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    alt: "University Campus",
    caption: "UCC Campus - Empowering the community"
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    alt: "Students studying",
    caption: "Fostering a safe and inclusive environment"
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    alt: "Group discussion",
    caption: "Working together for gender equality"
  }
]

export function AboutHero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const timer = setInterval(handleNext, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-4xl">
            About CEGRAD
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 lg:text-lg">
            The Centre for Gender Research, Advocacy and Documentation (CEGRAD) at the University of Cape Coast is dedicated to promoting gender equality and women&apos;s rights through research, advocacy, and action.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-xl sm:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl font-semibold text-white sm:text-2xl"
              >
                {images[currentIndex].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-3 sm:bottom-8 sm:right-8">
            <button
              onClick={handlePrev}
              className="grid h-10 w-10 place-content-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="grid h-10 w-10 place-content-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
