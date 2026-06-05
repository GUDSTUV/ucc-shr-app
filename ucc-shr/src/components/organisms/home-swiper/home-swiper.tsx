'use client'

import { useCallback, useRef, useState, useEffect } from 'react'

type Slide = {
  title: string
  message: string
}

const slides: Slide[] = [
  {
    title: 'Report Sexual Harassment',
    message: 'This platform helps you safely report sexual harassment, intimidation, unwanted behavior, and boundary violations with confidence.',
  },
  {
    title: "Don't Stay Silent",
    message: 'Report sexual harassment today. Help is here. You deserve to be heard and supported.',
  },
  {
    title: 'Learn & Recognize',
    message: 'Understand warning signs like unwanted messages, coercion, intimidation, and repeated boundary violations so you can recognize harmful behavior.',
  },
  {
    title: 'Anonymous Reporting',
    message: 'Share what happened without revealing your identity when you choose anonymous mode.',
  },
  {
    title: 'Fast & Simple',
    message: 'Complete your report in a few steps on mobile or desktop without long forms.',
  },
  {
    title: 'Track & Follow Up',
    message: 'Use your report code to track progress and receive updates privately.',
  },
  {
    title: 'Support Is Available',
    message: 'CEGRAD can connect survivors to counseling, legal guidance, and trusted campus referral services.',
  },
]

export function HomeSwiper({ autoSlideMs }: { autoSlideMs?: number }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  const maxIndex = slides.length - 1

  const goNext = useCallback(() => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  useEffect(() => {
    if (!autoSlideMs || autoSlideMs < 1000) {
      return
    }

    const timer = window.setInterval(goNext, autoSlideMs)
    return () => window.clearInterval(timer)
  }, [autoSlideMs, goNext])

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    touchDeltaX.current = 0
  }

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    touchDeltaX.current = (event.touches[0]?.clientX ?? 0) - touchStartX.current
  }

  const onTouchEnd = () => {
    const threshold = 50

    if (touchDeltaX.current <= -threshold) {
      goNext()
    } else if (touchDeltaX.current >= threshold) {
      goPrev()
    }

    touchStartX.current = null
    touchDeltaX.current = 0
  }

  return (
    <section className="mb-5">
      <div className="relative overflow-hidden rounded-2xl bg-navy text-white touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <article key={slide.title} className="w-full shrink-0 p-6 md:p-8 lg:p-10">
              <p className="text-xs font-semibold tracking-widest uppercase opacity-70 mb-2 md:text-sm">
                CEGRAD UCC
              </p>
              <h2 className="text-xl font-bold leading-tight mb-2 md:text-2xl lg:text-3xl">{slide.title}</h2>
              <p className="text-sm font-light opacity-90 md:text-base leading-relaxed">{slide.message}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center">
        <div className="flex items-center gap-2" aria-label="Slide indicators">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to ${slide.title}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${dotIndex === index ? 'bg-navy w-5' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
