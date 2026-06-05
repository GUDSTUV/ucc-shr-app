'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookOpen, Flag, ShieldCheck } from 'lucide-react'

interface HeroSectionProps {
  reportHref: string
}

const slides = [
  {
    image: '/images/hero/campus.jpg',
    tag: 'Creating a Safe and Respectful Campus Environment',
  },
  {
    image: '/images/hero/campus-2.jpg',
    headline: "Don't Stay Silent",
    tag: 'Report sexual harassment today. Help is here. You deserve to be heard and supported.',
  },
  {
    image: '/images/hero/campus-3.jpg',
    headline: 'Report Sexual Harassment',
    tag: 'Safely report harassment, intimidation, unwanted behaviour, and boundary violations with full confidence.',
  },
]

const INTERVAL_MS = 30000

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function HeroSection({ reportHref }: HeroSectionProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-140 overflow-hidden bg-navy text-white lg:grid lg:min-h-160 lg:grid-cols-2 lg:items-center">

      {/* ══ LEFT: text content ══ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col justify-center px-6 py-14 text-center sm:px-10 lg:px-14 lg:py-24 lg:text-left"
      >
        {/* Subtle decorative circle */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5"
          aria-hidden="true"
        />

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          You Are Heard.
          <br />
          <span className="">You Are Protected.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/75 lg:mx-0 lg:mt-6 lg:text-lg"
        >
          Safely report sexual harassment at the University of Cape Coast.
          Your report is confidential, taken seriously, and supported by
          trained CEGRAD staff.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
        >
          <Link
            href={reportHref}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-dark px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-navy/30 transition-all hover:bg-navy-dark hover:shadow-navy/40 active:scale-[0.98]"
          >
            <Flag size={18}/>
            Report an Incident
          </Link>
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
          >
            <BookOpen size={18} />
            Know Your Rights
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-xs text-white/45"
        >
          Your report is confidential and securely handled by authorized CEGRAD personnel
        </motion.p>
      </motion.div>

      {/* ══ RIGHT: image swiper — flush to right edge, curve on the left ══ */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-64 overflow-hidden sm:h-80 lg:h-132 lg:[clip-path:ellipse(100%_80%_at_100%_50%)] xl:h-140"
      >
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[active].image}
              alt={slides[active].tag}
              fill
              loading="eager"
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient for caption readability */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 h-56 bg-linear-to-t from-black/100 via-black/60 to-transparent"
          aria-hidden="true"
        />

        {/* Mobile: top fade into navy */}
        <div
          className="absolute inset-x-0 top-0 z-20 h-24 bg-linear-to-b from-navy to-transparent lg:hidden"
          aria-hidden="true"
        />

        {/* Sliding caption tag */}
        <div className="absolute bottom-14 left-8 right-8 z-30 hidden lg:block xl:bottom-18">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.75 }}
              className="ml-auto max-w-md px-4 py-3"
            >
              {slides[active].headline && (
                <p className="mb-1 text-lg font-bold">
                  {slides[active].headline}
                </p>
              )}
              <p className="text-md leading-snug text-white/90">
                {slides[active].tag}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 right-4 z-30 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-5 bg-white/40' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </motion.div>

    </section>
  )
}
