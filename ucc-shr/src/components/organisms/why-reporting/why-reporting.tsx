'use client'

import { motion } from 'framer-motion'
import { Heart, Scale, ShieldCheck } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

const cards = [
  {
    Icon: Scale,
    title: 'Accountability',
    description:
      'Your report creates a verifiable record that holds perpetrators accountable under UCC institutional policy and national law.',
    iconClass: 'bg-navy-light text-navy',
  },
  {
    Icon: ShieldCheck,
    title: 'Your Protection',
    description:
      'Reporters are protected from retaliation under UCC policy. Legal and institutional safeguards apply the moment you submit.',
    iconClass: 'bg-teal-light text-teal-dark',
  },
  {
    Icon: Heart,
    title: 'Support Access',
    description:
      'Gain immediate access to counseling, legal guidance, and peer support services provided by trained CEGRAD staff.',
    iconClass: 'bg-navy-light text-navy',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function WhyReportingSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
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
            Why It Matters
          </Text>
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">
            Reporting Makes a Difference
          </Heading>
          <Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
            Every report contributes to a safer campus. Here is what happens
            when you speak up.
          </Text>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="flex flex-col group rounded-lg border border-gray-200 p-6 lg:p-8"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <card.Icon size={22} />
              </div>
              <Text as="h3" size="lg" weight="semibold" className="mt-4 text-gray-900">
                {card.title}
              </Text>
              <Text size="sm" tone="muted" className="mt-2 leading-relaxed">
                {card.description}
              </Text>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
