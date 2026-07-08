'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

const previews = [
  {
    title: 'Know Your Rights',
    description:
      'Students and staff have legal and institutional protections. Learn exactly what they are and how to invoke them.',
    href: '/rights',
  },
  {
    title: 'Prevention Tips',
    description:
      'Recognise warning signs, learn safe bystander actions, and discover how to create safer campus spaces.',
    href: '/hub',
  },
  {
    title: 'Support Resources',
    description:
      'Access counseling services, crisis support programs, and community advocacy resources at UCC.',
    href: '/hub',
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
    <section id="rights" className="relative overflow-hidden bg-linear-to-b from-navy-light/60 via-white to-gray-50 py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-red/6 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-navy/8 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
        >
          <div>
            <Text as="span" size="xs" weight="medium" tone="navy" className="uppercase tracking-widest">
              Resources
            </Text>
            <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold" className="mt-2">
              Awareness & Education
            </Heading>
            <Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl leading-7 sm:mx-0">
              Explore rights, prevention guidance, and support pathways designed for the UCC community.
            </Text>
          </div>
          {/* <Link
            href="/hub"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-navy transition-colors hover:text-red"
          >
            View all resources <ArrowRight size={15} />
          </Link> */}
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden lg:col-span-5"
          >
            <Image
              src="/images/awareness/Gemini_Generated_Image_eo2i06eo2i06eo2i.png"
              alt="Students walking on UCC campus"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-dark/70 via-navy/30 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <Text as="span" size="xs" weight="medium" className="uppercase tracking-widest text-red">
                Featured Guide
              </Text>
              <Text size="xl" tone="white" weight="medium" className="mt-1 leading-tight">
                Understand your rights and reporting options before an incident escalates.
              </Text>
            </div>
            <div className="aspect-4/5 lg:aspect-auto lg:h-full" aria-hidden="true" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="p-4 sm:p-5 lg:col-span-7"
          >
            {previews.map((preview) => (
              <motion.div key={preview.title} variants={itemVariants}>
                <div
                  className="group flex items-start gap-4 border-b border-gray-100 px-1 py-4 transition-colors hover:border-navy/25 last:border-0"
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-navy">
                    <ArrowRight size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text as="h3" size="lg" weight="medium" className="text-gray-900 transition-colors group-hover:text-navy">
                      {preview.title}
                    </Text>
                    <Text size="lg" tone="muted" className="mt-1 leading-7">
                      {preview.description}
                    </Text>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
