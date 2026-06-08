'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, FileText, Hash, Search } from 'lucide-react'

const steps = [
  {
    Icon: FileText,
    step: '01',
    title: 'Submit Your Report',
    description:
      'Fill in the secure form and provide a contact for follow-up. Your information is encrypted and treated as confidential.',
  },
  {
    Icon: Hash,
    step: '02',
    title: 'Receive Reference ID',
    description:
      'You get a private tracking code to monitor your case status without revealing your identity.',
  },
  {
    Icon: Search,
    step: '03',
    title: 'CEGRAD Review',
    description:
      'Trained CEGRAD staff review and process your report with full confidentiality and care.',
  },
  {
    Icon: CheckCircle,
    step: '04',
    title: 'Action & Support',
    description:
      'Resolution is pursued under UCC policy. Support services are made available to you throughout.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function ReportingProcessSection() {
  return (
    <section id="reporting" className="bg-white py-16 lg:py-24">
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
            Transparent Process
          </span>
          <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">
            How Reporting Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            We have made the reporting process simple, safe, and transparent.
            Here is exactly what to expect.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div key={step.step} variants={itemVariants} className="relative">
              {/* Connector line on desktop */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-full top-6 z-0 -ml-3 hidden h-px w-6 bg-gray-200 lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <step.Icon size={20} />
                  </div>
                  <span className="text-3xl font-bold text-gray-100">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl bg-navy-dark px-6 py-3.5 text-base font-semibold text-white shadow-sm shadow-teal/25 transition-all hover:bg-navy active:scale-[0.98]"
          >
            <FileText size={17} />
            Start Your Report
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
