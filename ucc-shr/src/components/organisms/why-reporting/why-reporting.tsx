'use client'

import { motion } from 'framer-motion'
import { Heart, Scale, ShieldCheck } from 'lucide-react'

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
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-navy">
            Why It Matters
          </span>
          <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">
            Reporting Makes a Difference
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            Every report contributes to a safer campus. Here is what happens
            when you speak up.
          </p>
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
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-navy/20 hover:shadow-sm"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.iconClass}`}
              >
                <card.Icon size={22} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
