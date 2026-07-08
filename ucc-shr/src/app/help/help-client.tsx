"use client"

import { useState } from "react"
import { FaqSection } from "@/src/components/organisms/faq-section"
import { Mail, Phone, MapPin, PhoneForwarded, ArrowRight, X } from "lucide-react"
import { EmailModal } from "@/src/components/molecules/email-modal/email-modal"
import { Button } from '@/src/components/atoms/button'
import { Heading } from '@/src/components/atoms/heading'
import { Text } from '@/src/components/atoms/text'
import { FadeIn, FadeInStagger, FadeInItem } from '@/src/components/atoms/fade-in'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type HelpClientProps = {
  customFaqs?: any[]
}

export function HelpClient({ customFaqs }: HelpClientProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const emailText = 'cegrad@ucc.edu.gh'
  const addressText = 'Second Floor, C.A Ackah lecture Theatre Complex, UCC Campus'

  const phoneText = '+233 235 383 415, +233 205 383 415, +233 575 383 415'
  const phoneLines = phoneText.split(',').map(p => p.trim()).filter(Boolean)
  const primaryPhone = phoneLines[0]

  const tollFreeNumber = '0800-100-114'

  return (
    <>
      <div className="bg-gray-50 pb-16">
        {/* Help Hero */}
        <section className="relative mx-auto max-w-4xl space-y-8 px-6 pb-12 pt-16 text-center lg:px-8">
          <FadeIn>
            <Text as="span" size="sm" weight="bold" tone="navy" className="uppercase tracking-widest text-red">
              Help & Support
            </Text>
            <Heading size={{ base: '4xl', lg: '6xl' }} tone="navy" weight="semibold" className="mt-4 tracking-tight">
              We're Here to Listen.
            </Heading>
            <Text size="lg" tone="muted" className="mx-auto mt-6 max-w-2xl leading-relaxed">
              Whether you have questions about the reporting process, need immediate assistance, or want to reach out to our support staff, we provide multiple ways for you to connect with us safely.
            </Text>
          </FadeIn>
        </section>

        {/* Contact Cards */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Toll-Free Hotline */}
            <FadeInItem>
              <a
                href={`tel:${tollFreeNumber.replace(/\s+/g, '')}`}
                className="group flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-red hover:shadow-lg"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red text-white transition-transform group-hover:scale-110">
                  <PhoneForwarded size={28} />
                </div>
                <div>
                  <Heading as="h3" size="xl" weight="semibold" tone="navy">Toll-Free Hotline</Heading>
                  <Text size="sm" tone="muted" className="mt-1">Free to call from any network:</Text>
                  <Text size="xl" weight="bold" className="mt-2 text-red">{tollFreeNumber}</Text>
                </div>
              </a>
            </FadeInItem>

            {/* Emergency Hotline */}
            <FadeInItem>
              <a
                href="tel:+233244766862"
                className="group flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-navy hover:shadow-lg"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy/10 text-navy transition-transform group-hover:scale-110">
                  <Phone size={28} />
                </div>
                <div>
                  <Heading as="h3" size="xl" weight="semibold" tone="navy">Emergency Hotline</Heading>
                  <Text size="sm" tone="muted" className="mt-1">Call us immediately at:</Text>
                  <div className="mt-2 flex flex-col font-semibold text-navy">
                    <span>024 476 6862</span>
                    <span>024 210 9202</span>
                  </div>
                </div>
              </a>
            </FadeInItem>

            {/* Direct Message (Modal) */}
            <FadeInItem>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="group flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-navy hover:shadow-lg"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy/10 text-navy transition-transform group-hover:scale-110">
                  <Mail size={28} />
                </div>
                <div>
                  <Heading as="h3" size="xl" weight="semibold" tone="navy">Direct Message</Heading>
                  <Text size="sm" tone="muted" className="mt-1">Send us a secure message.</Text>
                  <Text size="base" weight="semibold" tone="navy" className="mt-2">{emailText}</Text>
                </div>
              </button>
            </FadeInItem>

            {/* General Contacts */}
            <FadeInItem>
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="group flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-navy hover:shadow-lg"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 transition-transform group-hover:scale-110">
                  <Phone size={28} />
                </div>
                <div>
                  <Heading as="h3" size="xl" weight="semibold" tone="navy">General Office</Heading>
                  <Text size="sm" tone="muted" className="mt-1">For non-emergencies:</Text>
                  <div className="mt-2 flex flex-col font-semibold text-navy">
                    {phoneLines.map((phone, idx) => (
                      <span key={idx}>{phone}</span>
                    ))}
                  </div>
                </div>
              </a>
            </FadeInItem>

          </FadeInStagger>
        </section>

        {/* Location Section */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 lg:mt-24">
          <FadeIn className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-16 items-center">
            {/* Left side */}
            <div className="max-w-xl">
              <Heading size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold">Find the CeGRAD Office</Heading>
              <Text size="lg" className="mt-4 leading-relaxed">
                We are located on the University of Cape Coast campus. Click on the map to view the CeGRAD office building and get directions.
              </Text>
              <a
                href="https://maps.app.goo.gl/9RxyyZ5j6N2Tz3mX9"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2   px-6 py-3 font-semibold text-navy transition-all hover:text-red "
              >
                <MapPin size={20} className="text-red" />
                Second Floor, C.A. Ackah Lecture Theatre Complex
              </a>
            </div>

            {/* Right side (Map Card) */}
            <div className="relative h-[450px] w-full rounded-3xl overflow-hidden bg-[#e6e2d6] shadow-sm group">
              {/* Interactive Google Map iframe */}
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
              
              {/* Center Map Location Images (acting as the pin) */}
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
        </section>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <FaqSection showHelpLink={false} customFaqs={customFaqs} />
        </div>
      </div>

      {/* Email Form Modal */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

      {/* Location Gallery Modal */}
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
                    <Text size="sm" tone="muted" className="text-center font-medium">Building Exterior</Text>
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
                    <Text size="sm" tone="muted" className="text-center font-medium">Office Entrance: Second Floor, C.A. Ackah Lecture Theatre Complex</Text>
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


