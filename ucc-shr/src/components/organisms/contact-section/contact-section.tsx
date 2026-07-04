'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input/input'
import { Textarea } from '@/src/components/atoms/textarea/textarea'

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => {
      setStatus('success')
    }, 1500)
  }

  return (
    <section id="contact" className="bg-navy py-16 text-white lg:py-24">
      <div className="mx-auto gap-20 max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Heading */}
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
            <Text size="lg" tone="white" className="mt-3 max-w-xl opacity-70">
              If you need guidance before reporting, or just want to talk to
              someone, reach out to CEGRAD directly.
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
            <form onSubmit={handleSubmit} className="space-y-4 p-1">
              <div>
                <Text as="label" htmlFor="name" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
                  Name <span className="text-red-300">*</span>
                </Text>
                <Input type="text" id="name" required placeholder="Your full name" className="text-navy placeholder:text-gray-500" />
              </div>
              <div>
                <Text as="label" htmlFor="email" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
                  Email Address <span className="text-red-300">*</span>
                </Text>
                <Input type="email" id="email" required placeholder="you@example.com" className="text-navy placeholder:text-gray-500" />
              </div>
              <div>
                <Text as="label" htmlFor="message" size="sm" weight="regular" tone="white" className="mb-1 block opacity-80">
                  Message <span className="text-red-300">*</span>
                </Text>
                <Textarea id="message" required rows={5} placeholder="How can we help you?" className="text-navy placeholder:text-gray-500" />
              </div>
              <div className="pt-2">
                <Button type="submit" variant="report" size="md" loading={status === 'sending'} className="min-w-40 font-normal">
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </Button>
              </div>
              {status === 'success' && (
                <div className="flex items-center gap-2 text-base text-green-200">
                  <CheckCircle2 size={18} />
                  <span>Message sent successfully.</span>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
