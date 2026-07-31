"use client"

import { useState } from "react"
import { FaqSection } from "@/src/components/organisms/faq-section"
import { Mail, Phone, MapPin, PhoneForwarded, X } from "lucide-react"
import { Button } from '@/src/components/atoms/button'
import { Heading } from '@/src/components/atoms/heading'
import { Text } from '@/src/components/atoms/text'
import { FadeIn } from '@/src/components/atoms/fade-in'
import { ContactForm } from '@/src/components/organisms/contact-form'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

type HelpClientProps = {
  customFaqs?: any[]
}

export function HelpClient({ customFaqs }: HelpClientProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const tollFreeNumber = '0800-100-114'

  return (
    <>
      <div className="bg-gray-50">

        {/* ── HERO ── Navy gradient hero */}
        <section className="relative overflow-hidden bg-navy text-white">
          {/* Subtle decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark opacity-90" aria-hidden="true" />
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/[0.03]" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/[0.02]" aria-hidden="true" />

          <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:px-8 lg:py-28">
            <FadeIn>
              <Text as="span" size="xs" weight="medium" tone="white" className="uppercase tracking-widest opacity-80 drop-shadow-sm">
                Help & Support
              </Text>
              <Heading size={{ base: '2xl', sm: '3xl', lg: '5xl' }} tone="white" className="mt-5 leading-tight tracking-tight drop-shadow-md">
                We&apos;re Here to Listen.
              </Heading>
              <Text size={{ base: 'lg', lg: 'xl' }} tone="white" className="mx-auto mt-5 max-w-2xl leading-relaxed opacity-90 drop-shadow-sm">
                Whether you have questions about the reporting process, need immediate assistance, or want to reach out to our support staff, we provide multiple ways for you to connect with us safely.
              </Text>


            </FadeIn>
          </div>
        </section>

        {/* ── LOCATION SECTION ── */}
        <section id="location" className="scroll-mt-20 bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeIn className="grid gap-12 lg:grid-cols-[1fr,1.2fr] lg:gap-16 lg:items-center">
              {/* Left side — text */}
              <div className="max-w-xl">
                <Text as="span" size="xs" weight="medium" tone="navy" className="uppercase tracking-widest">
                  Visit Us
                </Text>
                <Heading size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold" className="mt-2">
                  Find the CeGRAD Office
                </Heading>
                <Text size={{ base: 'base', lg: 'lg' }} tone="muted" className="mt-3 max-w-xl">
                  We are located on the University of Cape Coast campus. Click on the map to view the CeGRAD office building and get directions.
                </Text>

                <div className="mt-6 flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-red" />
                  <a href="https://www.google.com/maps/search/?api=1&query=Faculty+of+Education+Lecture+Theatre+(FELT),+University+of+Cape+Coast" target="_blank" rel="noopener noreferrer" className="hover:underline focus:outline-none focus:ring-2 focus:ring-navy rounded">
                    <Text size="base" weight="medium" tone="navy">
                      Second Floor, C.A. Ackah Lecture Theatre Complex
                    </Text>
                  </a>
                </div>


              </div>

              {/* Right side — Map Card */}
              <div className="relative h-[450px] w-full overflow-hidden rounded-3xl bg-[#e6e2d6] shadow-sm group">
                <iframe
                  src="https://maps.google.com/maps?q=Faculty+of+Education+Lecture+Theatre(FELT),+University+of+Cape+Coast&t=&z=17&ie=UTF8&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />

                {/* Image thumbnails on map */}
                <div className="absolute top-[40%] lg:top-[40%] left-1/2 -translate-x-1/2 -translate-y-full z-10 flex flex-row items-center gap-3">
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-xl border-2 border-white shadow-xl transition-transform duration-300 hover:scale-110 hover:z-20 focus:outline-none focus:ring-2 focus:ring-navy"
                    aria-label="View Building Exterior"
                  >
                    <Image src="/images/cegrad_building.jpg" alt="Building" fill className="object-cover" />
                  </button>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-xl border-2 border-white shadow-xl transition-transform duration-300 hover:scale-110 hover:z-20 focus:outline-none focus:ring-2 focus:ring-navy"
                    aria-label="View Office Entrance"
                  >
                    <Image src="/images/cegrad_office.jpg" alt="Office" fill className="object-cover" />
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── CONTACT FORM SECTION ── Navy background with inline form */}
        <section id="contact" className="bg-navy py-16 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">

              {/* Left column — heading + contact details */}
              <FadeIn className="lg:col-span-5 lg:pt-2">
                <Text as="span" size="xs" weight="medium" tone="white" className="uppercase tracking-widest opacity-80">
                  Contact Us
                </Text>
                <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="white" weight="semibold" className="mt-2">
                  We Are Here to Help
                </Heading>
                <Text size={{ base: 'base', lg: 'lg' }} tone="white" className="mt-3 max-w-xl opacity-70">
                  If you need guidance before reporting, want to speak with someone, or have an enquiry, please reach out to CEGRAD directly.
                </Text>

                {/* Contact details list */}
                <div className="mt-8 space-y-5">

                  {/* Toll-Free */}
                  <a href={`tel:${tollFreeNumber.replace(/\s+/g, '')}`} className="group flex items-center gap-4 transition-opacity hover:opacity-100 opacity-80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red/20">
                      <PhoneForwarded size={18} className="text-red-300" />
                    </div>
                    <div>
                      <Text size="xs" tone="white" className="opacity-60">Toll-Free Hotline</Text>
                      <Text size="base" weight="bold" tone="white">{tollFreeNumber}</Text>
                    </div>
                  </a>

                  {/* Emergency */}
                  <a href="tel:+233244766862" className="group flex items-center gap-4 transition-opacity hover:opacity-100 opacity-80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Phone size={18} />
                    </div>
                    <div>
                      <Text size="xs" tone="white" className="opacity-60">Emergency Lines</Text>
                      <Text size="base" weight="medium" tone="white">024 476 6862 &middot; 024 210 9202</Text>
                    </div>
                  </a>

                  {/* General Office */}
                  <div className="flex items-center gap-4 opacity-80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Phone size={18} />
                    </div>
                    <div>
                      <Text size="xs" tone="white" className="opacity-60">General Office</Text>
                      <Text size="sm" weight="medium" tone="white">+233 235 383 415</Text>
                      <Text size="sm" weight="medium" tone="white">+233 205 383 415</Text>
                      <Text size="sm" weight="medium" tone="white">+233 575 383 415</Text>
                    </div>
                  </div>


                </div>
              </FadeIn>

              {/* Right column — inline contact form */}
              <FadeIn delay={0.15} className="w-full lg:col-span-7 lg:max-w-lg lg:justify-self-end">
                <ContactForm />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ── */}
        <div id="faqs" className="scroll-mt-20">
          <FaqSection showHelpLink={false} customFaqs={customFaqs} />
        </div>
      </div>

      {/* ── GALLERY MODAL ── */}
      <AnimatePresence>
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/80 backdrop-blur-sm"
              onClick={() => setIsGalleryOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] z-10"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <Heading size="xl" weight="semibold" tone="navy">CeGRAD Location Photos</Heading>
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 bg-gray-100">
                      <Image
                        src="/images/cegrad_building.jpg"
                        alt="CeGRAD Building Exterior"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Text size="sm" tone="muted" weight="medium" className="text-center">Building Exterior</Text>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5 bg-gray-100">
                      <Image
                        src="/images/cegrad_office.jpg"
                        alt="CeGRAD Office Front"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Text size="sm" tone="muted" weight="medium" className="text-center">Office Entrance: Second Floor, C.A. Ackah Lecture Theatre Complex</Text>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
