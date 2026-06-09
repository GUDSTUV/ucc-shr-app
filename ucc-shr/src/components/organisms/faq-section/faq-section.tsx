'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { Button } from '@/src/components/atoms/button'

const faqs = [
  {
    question: 'Will my identity be kept anonymous?',
    answer:
      'You do not need to provide your full name, but a contact (email or phone) is required so CEGRAD can follow up. Without a contact, CEGRAD cannot investigate or take action on a report.',
  },
  {
    question: 'What happens after I submit a report?',
    answer:
      'Your report is securely logged and assigned to a CEGRAD support officer who reviews it within 48 hours. You will receive a unique reference code to track progress at any time.',
  },
  {
    question: 'Can I edit or add information after submitting?',
    answer:
      'Yes. Use your tracking code on the Track page to add updates, corrections, or additional evidence to your open report.',
  },
  {
    question: 'Will my report stay confidential?',
    answer:
      'Reports are treated as confidential records and shared only on a strictly need-to-handle basis in accordance with CEGRAD policy and applicable privacy law.',
  },
  {
    question: 'Can I report on behalf of someone else?',
    answer:
      'Yes. You may file as a witness. Include as much factual detail as possible so the support team can follow up appropriately.',
  },
  {
    question: 'What types of harassment can I report?',
    answer:
      'You can report verbal, non-verbal, physical, and digital harassment. This includes any unwanted conduct based on sex, gender, race, disability, or other protected characteristics.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function FaqAccordionItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div variants={itemVariants}>
      <Button
        variant="unstyled"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-navy/20 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
      >
        <Text as="span" size="base" weight="semibold" className="text-gray-900">{question}</Text>
        <ChevronDown
          size={18}
          className={`shrink-0 text-navy transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </Button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Text size="sm" tone="muted" className="rounded-b-2xl border border-t-0 border-gray-100 bg-white px-5 pb-4 pt-3 leading-relaxed">
              {answer}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection({ showHelpLink = true, featuredOnly = false }: { showHelpLink?: boolean; featuredOnly?: boolean }) {
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
          <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">
            Got Questions?
          </Text>
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">
            Frequently Asked Questions
          </Heading>
          <Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
            Answers to the most common concerns about reporting, privacy, and
            the support process.
          </Text>
        </motion.div>

        {/* Accordion grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mt-10 max-w-3xl space-y-3"
        >
          {faqs
            .filter((_, i) => (featuredOnly ? [0, 1, 5].includes(i) : true))
            .map((faq, i) => (
              <FaqAccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={i}
              />
            ))}
        </motion.div>

        {/* CTA */}
        {showHelpLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <Text size="sm" tone="muted" className="text-gray-500">
              Still have questions?{' '}
              <Link
                href="/help"
                className="font-semibold text-navy underline-offset-2 hover:underline"
              >
                Visit the Help Centre
              </Link>
            </Text>
          </motion.div>
        )}
      </div>
    </section>
  )
}
