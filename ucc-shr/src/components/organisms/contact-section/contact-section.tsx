'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { ContactForm } from '@/src/components/organisms/contact-form'

export function ContactSection() {

  return (
    <section id="contact" className="bg-navy py-16 text-white lg:py-24">
      <div className="mx-auto gap-20 max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 lg:pt-2"
          >
            <Text as="span" size="xs" weight="medium" tone="white" className="uppercase tracking-widest opacity-80">
              Support
            </Text>
            <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} weight="semibold" tone="white" className="mt-2">
              We Are Here to Help
            </Heading>
            <Text size={{ base: 'base', lg: 'lg' }} tone="white" className="mt-3 max-w-xl opacity-70">
              If you need guidance before reporting, want to speak with someone, or have an enquiry please reach out to CEGRAD directly.
            </Text>
          </motion.div>

          {/* Inline email form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full lg:col-span-7 lg:max-w-lg lg:justify-self-end"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
