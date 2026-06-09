'use client'

import { motion } from 'framer-motion'
import { Mail, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { EmailModal } from '@/src/components/molecules/email-modal/email-modal'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { Button } from '@/src/components/atoms/button'

const contacts = [
  {
    href: 'mailto:cegrad@ucc.edu.gh',
    Icon: Mail,
    iconClass: 'bg-navy',
    label: 'Email CEGRAD',
    sub: 'cegrad@ucc.edu.gh',
    isExternal: false,
  },
  {
    href: 'tel:+233244766862',
    Icon: Phone,
    iconClass: 'bg-white/15',
    label: 'Emergency Line',
    sub: '0244 766 862',
    isExternal: false,
  },
  {
    href: '/help',
    Icon: MessageCircle,
    iconClass: 'bg-white/15',
    label: 'Help Centre',
    sub: 'FAQs & guidance',
    isExternal: false,
  },
]

export function ContactSection() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  return (
    <section id="contact" className="bg-navy py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Text as="span" size="xs" weight="semibold" tone="white" className="uppercase tracking-widest opacity-80">
            Support
          </Text>
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} weight="bold" tone="white" className="mt-2">
            We Are Here to Help
          </Heading>
          <Text size="base" tone="white" className="mx-auto mt-3 max-w-xl opacity-70">
            If you need guidance before reporting, or just want to talk to
            someone, reach out to CEGRAD directly.
          </Text>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3"
        >
          {contacts.map(({ href, Icon, iconClass, label, sub }) => (
            label === 'Email CEGRAD' ? (
              <Button
                variant="unstyled"
                key={label}
                onClick={() => setIsEmailModalOpen(true)}
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-sm transition hover:bg-white/15"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <Text size="sm" weight="semibold" tone="white">{label}</Text>
                  <Text size="xs" tone="white" className="truncate opacity-60">{sub}</Text>
                </div>
              </Button>
            ) : (
              <a
                key={label}
                href={href}
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/15"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <Text size="sm" weight="semibold" tone="white">{label}</Text>
                  <Text size="xs" tone="white" className="truncate opacity-60">{sub}</Text>
                </div>
              </a>
            )
          ))}
        </motion.div>

        {/* Footnote */}
        <Text
          as={motion.p}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          size="xs"
          tone="white"
          className="mt-8 text-center opacity-40"
        >
          You may also report without contacting us first
        </Text>
      </div>

      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </section>
  )
}
