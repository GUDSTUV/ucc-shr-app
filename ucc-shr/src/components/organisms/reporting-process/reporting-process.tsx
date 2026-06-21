'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, FileText, Search, ShieldAlert } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

const steps = [
  {
    Icon: FileText,
    step: '01',
    title: 'Submit Report',
    description:
      'Fill in the secure form and provide details. Your information is encrypted and treated as confidential.',
  },
  {
    Icon: Search,
    step: '02',
    title: 'CEGRAD Review',
    description:
      'Trained CEGRAD staff review your report with full confidentiality to determine the appropriate next steps.',
  },
  {
    Icon: ShieldAlert,
    step: '03',
    title: 'Investigation',
    description:
      'A formal or informal investigation is conducted under UCC institutional policy, ensuring fairness to all parties.',
  },
  {
    Icon: CheckCircle,
    step: '04',
    title: 'Action & Support',
    description:
      'Resolution is pursued. Support services like counseling and legal guidance are provided to you throughout.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function ReportingProcessSection() {
  return (
    <section id="reporting" className="bg-gray-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">
            Transparent Process
          </Text>
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="bold" className="mt-2">
            How Reporting Works
          </Heading>
          <Text size="base" tone="muted" className="mx-auto mt-4 max-w-2xl">
            We have made the reporting process simple, safe, and transparent.
            Here is exactly what to expect when you come forward.
          </Text>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 relative"
        >
          {/* Horizontal line for desktop timeline */}
          <div className="hidden lg:block absolute top-6 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true" />

          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div key={step.step} variants={itemVariants} className="relative flex flex-col lg:items-center lg:text-center">
                
                {/* Mobile vertical line */}
                {index !== steps.length - 1 && (
                  <div className="lg:hidden absolute top-14 left-6 bottom-[-40px] w-0.5 bg-gray-200" aria-hidden="true" />
                )}

                <div className="flex items-center gap-4 lg:flex-col lg:gap-6">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white ring-8 ring-gray-50">
                    <step.Icon size={20} />
                  </div>
                  
                  <div className="flex-1 lg:mt-2">
                    <Text as="span" size="sm" weight="bold" className="text-navy/50 tracking-wider">
                      STEP {step.step}
                    </Text>
                    <Heading as="h3" size="lg" weight="semibold" tone="navy" className="mt-1 lg:mt-2">
                      {step.title}
                    </Heading>
                    <Text size="sm" tone="muted" className="mt-2 leading-relaxed max-w-xs mx-auto lg:mx-0">
                      {step.description}
                    </Text>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/report"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-navy px-8 text-base font-bold text-white transition-colors hover:bg-navy-dark active:scale-[0.98]"
          >
            <FileText size={18} />
            Start Your Report
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
