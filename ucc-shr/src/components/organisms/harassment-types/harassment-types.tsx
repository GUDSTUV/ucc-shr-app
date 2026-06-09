'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, Hand, MessageSquare, Smartphone } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

const types = [
  {
    Icon: MessageSquare,
    title: 'Verbal Harassment',
    description:
      'Unwanted comments, sexual demands, threats, and derogatory language targeting individuals.',
    examples: ['Inappropriate jokes', 'Sexual remarks', 'Verbal threats'],
  },
  {
    Icon: Eye,
    title: 'Non-Verbal Harassment',
    description:
      'Unwanted gestures, intrusive staring, stalking, or displaying offensive material.',
    examples: ['Leering or staring', 'Offensive gestures', 'Stalking behaviour'],
  },
  {
    Icon: Hand,
    title: 'Physical Harassment',
    description:
      'Any unwanted physical contact or physical intimidation, from touching to assault.',
    examples: ['Unwanted touching', 'Blocking movement', 'Physical assault'],
  },
  {
    Icon: Smartphone,
    title: 'Digital Harassment',
    description:
      'Harassment carried out through messages, social media, images, or online platforms.',
    examples: ['Explicit messages', 'Non-consensual images', 'Online abuse'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function HarassmentTypesSection() {
  return (
    <section id="awareness" className="bg-navy-light py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">
            Know the Signs
          </Text>
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">
            Understanding Sexual Harassment
          </Heading>
          <Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
            Sexual harassment takes many forms. Recognising it is the first step
            toward ending it.
          </Text>
        </motion.div>

        {/* Type cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {types.map((type) => (
            <motion.div
              key={type.title}
              variants={itemVariants}
              className="rounded-2xl border border-white bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-light text-navy">
                <type.Icon size={20} />
              </div>
              <Text as="h3" size="base" weight="semibold" className="mt-4 text-gray-900">
                {type.title}
              </Text>
              <Text size="sm" tone="muted" className="mt-1.5 leading-relaxed">
                {type.description}
              </Text>
              <ul className="mt-3 space-y-1">
                {type.examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                    {ex}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Link to hub */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/hub"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors hover:text-navy-dark"
          >
            Explore full awareness resources →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
