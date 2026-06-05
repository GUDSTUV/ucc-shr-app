'use client'

import { motion } from 'framer-motion'
import { Mail, MessageCircle, Phone } from 'lucide-react'

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
    href: 'tel:+233332132000',
    Icon: Phone,
    iconClass: 'bg-white/15',
    label: 'Emergency Line',
    sub: '0332 132 000',
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
          <span className="text-xs font-semibold uppercase tracking-widest">
            Support
          </span>
          <h2 className="mt-2 text-3xl font-bold lg:text-4xl">
            We Are Here to Help
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
            If you need guidance before reporting, or just want to talk to
            someone, reach out to CEGRAD directly.
          </p>
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
                <p className="text-sm font-semibold">{label}</p>
                <p className="truncate text-xs text-white/60">{sub}</p>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-xs text-white/40"
        >
          You may also report without contacting us first
        </motion.p>
      </div>
    </section>
  )
}
