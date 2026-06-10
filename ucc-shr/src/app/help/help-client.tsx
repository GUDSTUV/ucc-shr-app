"use client"

import { useState } from "react"
import { FaqSection } from "@/src/components/organisms/faq-section"
import { Footer } from "@/src/components/organisms/Footer"
import { Mail, Phone, MapPin } from "lucide-react"
import { EmailModal } from "@/src/components/molecules/email-modal/email-modal"
import { Button } from '@/src/components/atoms/button'

export function HelpClient({ customFaqs }: { customFaqs?: any[] }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  return (
    <>
      <div className="bg-gray-50 pb-16">
        {/* Help Hero */}
        <section className="relative mx-auto max-w-4xl space-y-8 px-6 pb-12 pt-16 text-center lg:px-8">
          <span className="text-sm font-bold uppercase tracking-widest text-red">
            Help & Support
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            We&apos;re Here to Listen.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Whether you have questions about the reporting process, need immediate assistance, or want to reach out to our support staff, we provide multiple ways for you to connect with us safely.
          </p>
        </section>

        {/* Contact Cards */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Direct Message (Modal) */}
            <Button
              variant="unstyled"
              onClick={() => setIsEmailModalOpen(true)}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-navy/20 hover:shadow-md"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy-light/20 text-navy">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">Direct Message</h3>
                <p className="mt-1 text-sm text-gray-500">Send us a secure message online.</p>
              </div>
            </Button>

            {/* Emergency Hotline */}
            <a
              href="tel:+233244766862"
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-red/20 hover:shadow-md"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red/10 text-red">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">Emergency Hotline</h3>
                <p className="mt-1 text-sm text-gray-500">Call us immediately at:</p>
                <div className="mt-1 flex flex-col text-sm font-semibold text-navy">
                  <span>024 476 6862</span>
                  <span>024 210 9202</span>
                  <span>020 813 9772</span>
                </div>
              </div>
            </a>

            {/* General Contacts */}
            <a
              href="tel:+233235383415"
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-navy/20 hover:shadow-md"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy-light/10 text-navy">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">General Office</h3>
                <p className="mt-1 text-sm text-gray-500">For non-emergencies:</p>
                <div className="mt-1 flex flex-col text-sm font-semibold text-navy">
                  <span>+233 235 383 415</span>
                  <span>+233 205 383 415</span>
                  <span>+233 575 383 415</span>
                </div>
              </div>
            </a>

            {/* Office Location */}
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">Visit Us</h3>
                <p className="mt-1 text-sm font-medium text-navy">CEGRAD Office</p>
                <p className="mt-1 text-sm text-gray-500">Second Floor, C.A Ackah lecture Theatre Complex, UCC Campus.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection showHelpLink={false} customFaqs={customFaqs} />
      </div>

      {/* Email Form Modal */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
      <Footer />
    </>
  )
}
