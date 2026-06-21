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
    <motion.div variants={itemVariants} className="border-b border-gray-200 last:border-0">
      <Button
        variant="unstyled"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4"
      >
        <Text as="span" size="lg" weight="semibold" className="text-gray-900 transition-colors group-hover:text-navy">{question}</Text>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-400 transition-transform duration-300 group-hover:text-navy ${open ? 'rotate-180 text-navy' : ''}`}
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
            <Text size="base" tone="muted" className="pb-8 pr-12 leading-relaxed">
              {answer}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

type FAQType = { question: string; answer: string }

export function FaqSection({ showHelpLink = true, featuredOnly = false, customFaqs }: { showHelpLink?: boolean; featuredOnly?: boolean; customFaqs?: FAQType[] }) {
  const activeFaqs = customFaqs && customFaqs.length > 0 ? customFaqs : faqs

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
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
          <Text size="base" tone="muted" className="mx-auto mt-4 max-w-2xl">
            Answers to the most common concerns about reporting, privacy, and
            the support process.
          </Text>
        </motion.div>

        {/* Accordion list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mt-16 max-w-3xl"
        >
          {activeFaqs
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
            className="mt-16 text-center"
          >
            <Text size="base" tone="muted" className="text-gray-500">
              Still have questions?{' '}
              <Link
                href="/help"
                className="font-semibold text-navy underline-offset-4 hover:underline"
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
