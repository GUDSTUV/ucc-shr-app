import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Clock } from 'lucide-react'

const partners = [
  {
    name: 'University of Cape Coast',
    abbr: 'UCC',
    href: 'https://ucc.edu.gh',
  },
  {
    name: 'UN Women',
    abbr: 'UN Women',
    href: 'https://www.unwomen.org',
  },
  {
    name: 'Ghana Education Service',
    abbr: 'GES',
    href: 'https://ges.gov.gh',
  },
  {
    name: 'Commission on Human Rights and Administrative Justice',
    abbr: 'CHRAJ',
    href: 'https://chraj.gov.gh',
  },
  {
    name: 'Domestic Violence and Victims Support Unit',
    abbr: 'DOVVSU',
    href: 'https://police.gov.gh',
  },
]

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

export function Footer() {
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
                <p className="text-sm font-bold text-white">CEGRAD-UCC</p>
                <p className="text-xs text-white/60">Centre for Gender Research</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/60">
              Creating a safe, inclusive, and respectful academic community free
              from sexual harassment and discrimination.
            </p>

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
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Resources
            </h3>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={15} className="mt-0.5 shrink-0 text-red" />
                <span>
                  Second Floor, C.A Ackah lecture Theatre Complex, UCC Campus
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
                  <a href="tel:+233235383415" className="transition hover:text-white">+233 235 383 415</a>
                  <a href="tel:+233205383415" className="transition hover:text-white">+233 205 383 415</a>
                  <a href="tel:+233575383415" className="transition hover:text-white">+233 575 383 415</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Partners strip ── */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-white/30">
            Trusted Partners &amp; Supporting Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partners.map(({ name, abbr, href }) => (
              <a
                key={abbr}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                title={name}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/50 transition hover:border-white/30 hover:text-white/80"
              >
                {abbr}
              </a>
            ))}
          </div>
        </div>

        {/* ── Copyright row ── */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} CEGRAD-UCC. All rights reserved.
            </p>
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
