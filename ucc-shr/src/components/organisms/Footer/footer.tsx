import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Clock } from 'lucide-react'
import { Text } from '@/src/components/atoms/text/text'
import { prisma } from '@/src/lib/prisma'


const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/hub', label: 'Awareness Hub' },
  { href: '/about', label: 'About CEGRAD' },
  { href: '/help', label: 'Help & FAQ' },
  { href: '/report', label: 'Report Incident' },
  { href: '/track', label: 'Track Report' },
]

const resources = [
  { href: '/hub', label: 'Know Your Rights' },
  { href: '/hub', label: 'Prevention Guide' },
  { href: '/hub', label: 'Support Services' },
  { href: '/hub', label: 'Campus Policy' },
  { href: '/events', label: 'Events & Workshops' },
]

const socials = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'https://twitter.com', label: 'X (Twitter)', Icon: Twitter },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
]

export async function Footer() {
  const contentRecords = await prisma.siteContent.findMany({
    where: { key: { in: ['footerText', 'contactAddress', 'contactPhone'] } }
  })
  
  const contentMap = contentRecords.reduce((acc, record) => {
    acc[record.key] = record.value
    return acc
  }, {} as Record<string, unknown>)
  
  const footerText = typeof contentMap['footerText'] === 'string' 
    ? contentMap['footerText'] 
    : 'Creating a safe, inclusive, and respectful academic community free from sexual harassment and discrimination.'
    
  const addressText = typeof contentMap['contactAddress'] === 'string'
    ? contentMap['contactAddress']
    : 'Second Floor, C.A Ackah lecture Theatre Complex, UCC Campus'
    
  const phoneText = typeof contentMap['contactPhone'] === 'string'
    ? contentMap['contactPhone']
    : '+233 235 383 415'
    
  const phoneLines = phoneText.split(',').map(p => p.trim()).filter(Boolean)
  if (phoneLines.length === 0) phoneLines.push('+233 235 383 415')

  return (
    <footer className="border-t border-navy/40 bg-navy-dark text-navy-light">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* ── Col 1: Brand ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy">
                <Image
                  src="/icons/logo.svg"
                  alt="CEGRAD UCC logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </span>
              <div className="leading-tight">
                <Text size="sm" weight="bold" tone="white">CEGRAD-UCC</Text>
                <Text size="xs" tone="white" className="opacity-60">Centre for Gender Research</Text>
              </div>
            </div>

            <Text size="sm" tone="white" className="leading-relaxed opacity-60">
              {footerText}
            </Text>

            {/* Social links */}
            <div className="flex gap-2 pt-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div className="space-y-3">
            <Text as="h3" size="xs" weight="bold" tone="white" className="uppercase tracking-wider">
              Quick Links
            </Text>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Resources ── */}
          <div className="space-y-3">
            <Text as="h3" size="xs" weight="bold" tone="white" className="uppercase tracking-wider">
              Resources
            </Text>
            <ul className="space-y-2">
              {resources.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ── */}
          <div className="space-y-3">
            <Text as="h3" size="xs" weight="bold" tone="white" className="uppercase tracking-wider">
              Contact
            </Text>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={15} className="mt-0.5 shrink-0 text-red" />
                <span>
                  {addressText}
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Clock size={15} className="mt-0.5 shrink-0 text-red" />
                <span>
                  Mon - Fri: 8:00 AM - 5:00 PM
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone size={15} className="mt-0.5 shrink-0 text-red" />
                <div className="flex flex-col gap-1">
                  {phoneLines.map((phone, idx) => (
                    <a key={idx} href={`tel:${phone.replace(/\s+/g, '')}`} className="transition hover:text-white">{phone}</a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Copyright row ── */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <Text size="xs" tone="white" className="opacity-30">
              © {new Date().getFullYear()} CEGRAD-UCC. All rights reserved.
            </Text>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40 sm:justify-end">
              <Link href="/privacy" className="transition hover:text-white/70">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition hover:text-white/70">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
