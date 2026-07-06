"use client"

import { useState } from "react"
import { FaqSection } from "@/src/components/organisms/faq-section"
import { Mail, Phone, MapPin, PhoneForwarded } from "lucide-react"
import { EmailModal } from "@/src/components/molecules/email-modal/email-modal"
import { Button } from '@/src/components/atoms/button'
import { Heading } from '@/src/components/atoms/heading'
import { Text } from '@/src/components/atoms/text'
import { FadeIn, FadeInStagger, FadeInItem } from '@/src/components/atoms/fade-in'
import Image from 'next/image'

type HelpClientProps = {
  customFaqs?: any[]
  customEmail?: string
  customPhone?: string
  customAddress?: string
}

export function HelpClient({ customFaqs, customEmail, customPhone, customAddress }: HelpClientProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const emailText = customEmail || 'cegrad@ucc.edu.gh'
  const addressText = customAddress || 'Second Floor, C.A Ackah lecture Theatre Complex, UCC Campus'
  
  const phoneText = customPhone || '+233 235 383 415'
  const phoneLines = phoneText.split(',').map(p => p.trim()).filter(Boolean)
  if (phoneLines.length === 0) phoneLines.push('+233 235 383 415')
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
            <Heading size={{ base: '4xl', lg: '6xl' }} tone="navy" weight="bold" className="mt-4 tracking-tight">
              We're Here to Listen.
            </Heading>
            <Text size="lg" tone="muted" className="mx-auto mt-6 max-w-2xl leading-relaxed">
              Whether you have questions about the reporting process, need immediate assistance, or want to reach out to our support staff, we provide multiple ways for you to connect with us safely.
            </Text>
          </FadeIn>
        </section>

        {/* Contact Cards */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
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
                  <Heading as="h3" size="xl" weight="bold" tone="navy">Toll-Free Hotline</Heading>
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
                  <Heading as="h3" size="xl" weight="bold" tone="navy">Emergency Hotline</Heading>
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
                  <Heading as="h3" size="xl" weight="bold" tone="navy">Direct Message</Heading>
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
                  <Heading as="h3" size="xl" weight="bold" tone="navy">General Office</Heading>
                  <Text size="sm" tone="muted" className="mt-1">For non-emergencies:</Text>
                  <div className="mt-2 flex flex-col font-semibold text-navy">
                    {phoneLines.map((phone, idx) => (
                      <span key={idx}>{phone}</span>
                    ))}
                  </div>
                </div>
              </a>
            </FadeInItem>

            {/* Office Location (Interactive Hover Card spanning 2 columns) */}
            <FadeInItem className="sm:col-span-2">
              <a 
                href="https://maps.app.goo.gl/9RxyyZ5j6N2Tz3mX9" // Placeholder map link to UCC
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full min-h-[250px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-navy hover:shadow-lg"
              >
                {/* Default State */}
                <div className="z-10 flex flex-col items-center transition-opacity duration-500 group-hover:opacity-0">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
                    <MapPin size={28} />
                  </div>
                  <Heading as="h3" size="xl" weight="bold" tone="navy" className="mt-4">Visit Us</Heading>
                  <Text size="sm" weight="semibold" tone="navy" className="mt-1">CEGRAD Office</Text>
                  <Text size="sm" tone="muted" className="mt-1">{addressText}</Text>
                  <Text size="xs" weight="medium" className="mt-4 text-red">Hover to view building</Text>
                </div>

                {/* Hover Reveal State */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy/90 p-8 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                   {/* We will just use a CSS generic background for the building thumbnail until they upload one, or a placeholder */}
                   <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" />
                   <MapPin size={48} className="z-10 mb-4 text-red-light drop-shadow-md" />
                   <Heading as="h3" size="2xl" weight="bold" tone="white" className="z-10 drop-shadow-md">CEGRAD Building</Heading>
                   <Text size="base" tone="white" className="z-10 mt-2 font-medium tracking-wide drop-shadow-md">Click to view on Google Maps</Text>
                </div>
              </a>
            </FadeInItem>

          </FadeInStagger>
        </section>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <FaqSection showHelpLink={false} customFaqs={customFaqs} />
        </div>
      </div>

      {/* Email Form Modal */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </>
  )
}


