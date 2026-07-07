'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
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
    title: 'Creating a Safe and Respectful Campus Environment.',
  },
  {
    id: '2',
    imageUrl: '/images/hero/campus-2.jpg',
    title: "Don't Stay Silent. Report sexual harassment today. Help is here. You deserve to be heard and supported.",
  },
  {
    id: '3',
    imageUrl: '/images/hero/campus-3.jpg',
    title: 'Safely report harassment, intimidation, unwanted behaviour, and boundary violations with full confidence.',
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
  const activeSlide = slides[active] ?? slides[0]
  const slideSubtitle = activeSlide?.title?.trim()
    || customSubtitle
    || 'Confidential reporting, prompt review, and trained CEGRAD support for the University of Cape Coast community.'

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-160 overflow-hidden bg-navy text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[active].imageUrl}
            alt={slides[active].title}
            fill
            loading="eager"
            priority={active === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/65 to-black/90 sm:from-black/65 sm:via-black/55 sm:to-navy/85 lg:from-black/55 lg:via-black/45 lg:to-black/80" aria-hidden="true" />


      <div className="relative mx-auto flex min-h-160 max-w-7xl flex-col justify-center px-6 py-16 text-center sm:px-10 lg:px-8 lg:text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl lg:mx-0 lg:max-w-3xl"
        >
          {/* <Text
            as={motion.span}
            variants={itemVariants}
            size="xs"
            weight="semibold"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 uppercase tracking-[0.2em] text-white/90"
          >
            CEGRAD Reporting Platform
          </Text> */}

          <Heading
            as={motion.h1}
            variants={itemVariants}
            size={{ base: '2xl', sm: '3xl', lg: '5xl' }}
            tone="white"
            className="mt-5 leading-tight tracking-tight drop-shadow-md"
          >
            {customTitle ? (
              customTitle
            ) : (
              <>
                A Safer Campus
                <br />
                Starts With Your Voice
              </>
            )}
          </Heading>

          <AnimatePresence mode="wait">
            <Text
              key={activeSlide.id}
              as={motion.p}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              size={{ base: 'lg', lg: 'xl' }}
              tone="white"
              className="mx-auto mt-5 max-w-2xl leading-relaxed opacity-90 drop-shadow-sm lg:mx-0"
            >
              {slideSubtitle}
            </Text>
          </AnimatePresence>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:items-start lg:justify-start"
          >
            <Button
              variant="primary"
              size="md"
              className="w-full border border-transparent bg-red hover:bg-red-dark sm:w-auto"
              onClick={() => router.push(reportHref)}
            >
              <Flag size={18} />
              Report an Incident
            </Button>
            <Button
              variant="unstyled"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 text-[15px] text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98] sm:w-auto"
              onClick={() => router.push('/rights')}
            >
              <BookOpen size={18} />
              Know Your Rights
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <Button
            variant="unstyled"
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-7 bg-white/80' : 'w-2 bg-white/45'
            }`}
          />
        ))}
      </div>

    </section>
  )
}
