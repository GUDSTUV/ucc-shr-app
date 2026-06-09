'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { Button } from '@/src/components/atoms/button'

type Story = {
  id: string
  message: string
}

const stories: Story[] = [
  {
    id: 's1',
    message:
      'The support I received from CEGRAD helped me feel safe enough to continue with the process. I felt listened to and never judged.',
  },
  {
    id: 's2',
    message:
      'The staff treated my case with care and confidentiality. Knowing my identity was protected made it easier to be honest about what happened.',
  },
  {
    id: 's3',
    message:
      "I was scared at first, but CEGRAD's respectful approach and follow-up support helped me through the whole process.",
  },
]

type SurvivorSupportStoriesProps = {
  showSubmissionForm?: boolean
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function SurvivorSupportStories({ showSubmissionForm = true }: SurvivorSupportStoriesProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function go(dir: 1 | -1) {
    setDirection(dir)
    setIndex((prev) => (prev + dir + stories.length) % stories.length)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitted(false)
    if (!message.trim() || message.trim().length < 10) {
      setError('Please share at least 10 characters. It will be reviewed before appearing here.')
      return
    }
    try {
      const res = await fetch('/api/support-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })
      if (!res.ok) throw new Error('Failed')
      setMessage('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setError('Unable to submit right now. Please try again.')
    }
  }

  return (
    <section className="bg-navy-light py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
    
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">
            Survivor Support Stories
          </Heading>
          <Text size="sm" tone="muted" className="mt-3 max-w-xl leading-7">
            People who have gone through the reporting process share their experience
            voluntarily.
          </Text>
        </motion.div>

        {/* ── Carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          {/* Card area with fixed height to prevent layout shift */}
          <div className="relative overflow-hidden rounded-2xl border border-navy/10 bg-white p-8 shadow-sm min-h-52 lg:p-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={stories[index].id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-4"
              >
                <span className="select-none font-serif text-7xl leading-none text-navy/15">&ldquo;</span>
                <Text as="p" size={{ base: 'lg', lg: 'xl' }} className="leading-8 text-gray-700 italic">
                  {stories[index].message}
                </Text>
                <div className="mt-2 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-navy" />
                  <Text as="span" size="xs" weight="medium" tone="muted" className="text-gray-400">
                    Anonymous &middot; Verified by CEGRAD staff
                  </Text>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls row */}
          <div className="mt-5 flex items-center justify-between">
            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {stories.map((_, i) => (
                <Button
                  variant="unstyled"
                  key={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                  aria-label={`Go to story ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-navy' : 'w-2 bg-navy/25 hover:bg-navy/50'
                  }`}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="unstyled"
                onClick={() => go(-1)}
                aria-label="Previous story"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 bg-white text-navy transition hover:border-navy hover:bg-navy hover:text-white"
              >
                <ArrowLeft size={16} />
              </Button>
              <Button
                variant="unstyled"
                onClick={() => go(1)}
                aria-label="Next story"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 bg-white text-navy transition hover:border-navy hover:bg-navy hover:text-white"
              >
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ── Submission form (full page only) ── */}
        {showSubmissionForm && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm lg:p-8"
          >
            <Text as="h3" size="lg" weight="semibold" tone="navy">Share your story</Text>
            <Text size="sm" tone="muted" className="mt-1">
              Optional — only if your case has been completed or closed. Your name is never stored or shown.
            </Text>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block space-y-2">
                <Text as="span" size="xs" weight="medium" tone="muted" className="uppercase tracking-wider">Your message</Text>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Share what helped you feel supported…"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
                />
                <p className="text-xs text-gray-400">{message.length} / 500 characters</p>
              </label>

              {error && (
                <p className="rounded-lg bg-red/10 px-4 py-2 text-sm text-red-300">{error}</p>
              )}
              {submitted && (
                <div className="flex items-center gap-2 rounded-lg bg-navy-light px-4 py-3 text-sm font-medium text-navy">
                  <CheckCircle2 size={15} />
                  Thank you. Your story will be reviewed and may appear here within 24 hours.
                </div>
              )}

              <Button
                variant="unstyled"
                type="submit"
                className="rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark active:scale-[0.98]"
              >
                Submit anonymously
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}

