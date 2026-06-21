"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Heading } from "../../atoms/heading/heading"
import { Text } from "../../atoms/text/text"
import { Button } from "../../atoms/button/button"

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

type CarouselImage = { url: string; caption: string; alt?: string }

export function AboutHero({ customImages }: { customImages?: CarouselImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const activeImages = customImages && customImages.length > 0 ? customImages : images

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length)
  }

  useEffect(() => {
    const timer = setInterval(handleNext, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[80vh] sm:min-h-[600px] w-full overflow-hidden bg-navy text-white flex flex-col justify-center">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={activeImages[currentIndex]?.url || images[0].url}
          alt={activeImages[currentIndex]?.alt || activeImages[currentIndex]?.caption || 'Carousel image'}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/50 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/50 lg:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />

      {/* Main Content Overlay */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 lg:px-8 py-24">
        <div className="max-w-3xl text-left">
          <Heading as="h1" size={{ base: '4xl', sm: '5xl', lg: '6xl' }} tone="white" weight="bold" className="tracking-tight drop-shadow-md">
            About CEGRAD
          </Heading>
          <Text size={{ base: 'base', sm: 'lg', lg: 'xl' }} tone="white" className="mt-6 leading-relaxed opacity-95 drop-shadow">
            The Centre for Gender Research, Advocacy and Documentation (CEGRAD) at the University of Cape Coast is dedicated to promoting gender equality and women&apos;s rights through research, advocacy, and action.
          </Text>
        </div>
      </div>

      {/* Bottom bar with caption and controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full pb-6 sm:pb-8 lg:pb-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-8">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <Heading
                as={motion.p}
                key={currentIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                size={{ base: 'lg', sm: 'xl' }}
                weight="semibold"
                tone="white"
                className="drop-shadow-md"
              >
                {activeImages[currentIndex]?.caption}
              </Heading>
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 gap-3">
            <Button
              variant="unstyled"
              onClick={handlePrev}
              className="grid h-12 w-12 place-content-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/30"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="unstyled"
              onClick={handleNext}
              className="grid h-12 w-12 place-content-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/30"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
