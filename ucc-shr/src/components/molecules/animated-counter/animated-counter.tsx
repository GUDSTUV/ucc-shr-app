'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string
  duration?: number
}

/**
 * Animates a numeric value counting up when it scrolls into view.
 * Non-numeric parts (e.g. "24/7", "100%") are kept intact.
 */
export function AnimatedCounter({ value, duration = 1200 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateValue()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function animateValue() {
    // Extract the leading number from the value string
    const match = value.match(/^(\d+)(.*)$/)
    if (!match) {
      // No leading number (e.g. "24/7"), just show instantly
      setDisplay(value)
      return
    }

    const target = parseInt(match[1], 10)
    const suffix = match[2] // e.g. "%", " Types", etc.
    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)

      setDisplay(`${current}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  return <span ref={ref}>{display}</span>
}
