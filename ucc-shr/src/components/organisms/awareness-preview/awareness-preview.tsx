'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Scale, Shield } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

const previews = [
  {
    Icon: Scale,
    title: 'Know Your Rights',
    description:
      'Students and staff have legal and institutional protections. Learn exactly what they are and how to invoke them.',
    href: '/hub',
    iconClass: 'bg-navy text-white',
  },
  {
    Icon: Shield,
    title: 'Prevention Tips',
    description:
      'Recognise warning signs, learn safe bystander actions, and discover how to create safer campus spaces.',
    href: '/hub',
    iconClass: 'bg-navy text-white',
  },
  {
    Icon: BookOpen,
    title: 'Support Resources',
    description:
      'Access counseling services, crisis support programs, and community advocacy resources at UCC.',
    href: '/hub',
    iconClass: 'bg-navy text-white',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function AwarenessPreviewSection() {
  return (
    <section id="rights" className="bg-gray-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
        >
          <div>
            <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">
              Resources
            </Text>
            <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">
              Awareness & Education
            </Heading>
          </div>
          <Link
            href="/hub"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-teal"
          >
            View all resources <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Preview cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-8 grid gap-5 sm:grid-cols-3"
        >
          {previews.map((preview) => (
            <motion.div key={preview.title} variants={itemVariants}>
              <Link
                href={preview.href}
                className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 sm:p-8 transition-colors hover:border-navy hover:bg-gray-50"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${preview.iconClass}`}
                >
                  <preview.Icon size={22} />
                </div>
                <Text as="h3" size="base" weight="semibold" className="mt-4 transition-colors group-hover:text-navy text-gray-900">
                  {preview.title}
                </Text>
                <Text size="sm" tone="muted" className="mt-2 flex-1 leading-relaxed">
                  {preview.description}
                </Text>
                <Text as="span" size="sm" weight="semibold" tone="navy" className="mt-4 inline-flex items-center gap-1 transition-all group-hover:gap-2">
                  Read more <ArrowRight size={14} />
                </Text>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
