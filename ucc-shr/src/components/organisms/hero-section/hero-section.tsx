'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Flag } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { Button } from '@/src/components/atoms/button'

export type BannerSlide = {
  id: string
  imageUrl: string
  title: string
  linkUrl?: string | null
}

const fallbackSlides: BannerSlide[] = [
  {
    id: '1',
    imageUrl: '/images/hero/campus.jpg',
    title: 'Creating a Safe and Respectful Campus Environment',
  },
  {
    id: '2',
    imageUrl: '/images/hero/campus-2.jpg',
    title: "Don't Stay Silent. Report sexual harassment today. Help is here. You deserve to be heard and supported.",
  },
  {
    id: '3',
    imageUrl: '/images/hero/campus-3.jpg',
    title: 'Report Sexual Harassment. Safely report harassment, intimidation, unwanted behaviour, and boundary violations with full confidence.',
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

export function HeroSection({ banners = [], customTitle, customSubtitle }: { banners?: BannerSlide[], customTitle?: string, customSubtitle?: string }) {
  const [active, setActive] = useState(0)
  const router = useRouter()
  const reportHref = '/report'

  const slides = banners.length > 0 ? banners : fallbackSlides

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [slides.length])

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

        <Heading
          as={motion.h1}
          variants={itemVariants}
          size={{ base: '3xl', sm: '4xl', lg: '5xl' }}
          weight="bold"
          tone="white"
          className="leading-tight tracking-tight"
        >
          {customTitle ? (
            customTitle.split('. ').map((part, i, arr) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === arr.length - 1 ? <span>{part}</span> : part + '.'}
              </span>
            ))
          ) : (
            <>
              You Are Heard.
              <br />
              <span>You Are Protected.</span>
            </>
          )}
        </Heading>

        {/* Sub-headline */}
        <Text
          as={motion.p}
          variants={itemVariants}
          size={{ base: 'base', lg: 'lg' }}
          tone="white"
          className="mx-auto mt-4 max-w-md leading-relaxed opacity-75 lg:mx-0 lg:mt-6"
        >
          {customSubtitle || "Safely report sexual harassment at the University of Cape Coast. Your report is confidential, taken seriously, and supported by trained CEGRAD staff."}
        </Text>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto bg-navy-dark shadow-lg shadow-navy/30 border border-transparent hover:border-white hover:bg-navy-dark hover:shadow-navy/40"
            onClick={() => router.push(reportHref)}
          >
            <Flag size={20} />
            Report an Incident
          </Button>
          <Button
            variant="unstyled"
            className="inline-flex h-[54px] w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-6 text-[17px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
            onClick={() => router.push('/hub')}
          >
            <BookOpen size={20} />
            Know Your Rights
          </Button>
        </motion.div>

        <Text
          as={motion.p}
          variants={itemVariants}
          size="xs"
          tone="white"
          className="mt-6 opacity-45"
        >
          Your report is confidential and securely handled by authorized CEGRAD personnel
        </Text>
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
              src={slides[active].imageUrl}
              alt={slides[active].title}
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
          className="absolute inset-x-0 bottom-0 z-20 h-56 bg-linear-to-t from-black via-black/60 to-transparent"
          aria-hidden="true"
        />

        {/* Mobile: top fade into navy */}
        <div
          className="absolute inset-x-0 top-0 z-20 h-24 bg-linear-to-b from-navy to-transparent lg:hidden"
          aria-hidden="true"
        />

        {/* Sliding caption tag */}
        <div className="absolute bottom-7 left-4 right-4 z-30 lg:bottom-14 lg:left-8 lg:right-8 xl:bottom-18">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.75 }}
              className="mx-auto max-w-md text-center px-2 py-1 lg:ml-auto lg:text-left lg:px-4 lg:py-3"
            >
              <Text size={{ base: 'xs', lg: 'base' }} tone="white" className="leading-tight drop-shadow-md lg:leading-snug lg:opacity-90">
                {slides[active].title}
              </Text>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 right-4 z-30 flex gap-1.5">
          {slides.map((_, i) => (
            <Button
              variant="unstyled"
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
