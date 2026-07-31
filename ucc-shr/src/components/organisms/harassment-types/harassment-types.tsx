'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { FadeIn } from '@/src/components/atoms/fade-in'
import { harassmentTypes } from '@/src/app/(public)/hub/constants'

type HarassmentType = typeof harassmentTypes[0]

export function HarassmentTypesSection() {
  const [selectedType, setSelectedType] = useState<HarassmentType | null>(null)

  return (
    <section id="awareness" className="bg-gray-50 py-16 lg:py-24 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <FadeIn>
            <Text as="span" size="xs" weight="medium" tone="navy" className="uppercase tracking-widest">
              Know the Signs
            </Text>
            <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold" className="mt-2 mb-6">
              Understanding <span className="text-red">Sexual Harassment</span>
            </Heading>
            <Text size={{ base: 'base', lg: 'lg' }} tone="muted" className="mb-10 leading-relaxed max-w-2xl">
              Sexual harassment takes many forms. Recognising it is the first step toward ending it.
            </Text>

            <div>
              {/* Interactive grid of forms */}
              <div className="flex flex-wrap gap-3">
                {harassmentTypes.map((type) => (
                  <button
                    key={type.title}
                    onClick={() => setSelectedType(type)}
                    className="px-5 py-3 rounded-md border border-gray-300 bg-white text-[15px] font-medium text-gray-800 transition-all hover:border-navy hover:text-navy hover:shadow-sm active:scale-[0.98]"
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right Column (Illustration) */}
          <FadeIn delay={0.2} className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md lg:max-w-lg mix-blend-multiply">
               <Image 
                 src="/images/awareness/aw1.png" 
                 alt="Illustration representing support and conversation" 
                 fill 
                 className="object-contain" 
                 priority
               />
            </div>
          </FadeIn>
          
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedType(null)}
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            >
              <button
                onClick={() => setSelectedType(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-navy-light text-navy">
                <selectedType.Icon size={24} />
              </div>
              
              <Heading as="h3" size={{ base: 'xl', lg: '2xl' }} tone="navy" weight="semibold" className="mb-3">
                {selectedType.title}
              </Heading>
              
              <Text size="base" tone="muted" className="mb-6 leading-relaxed">
                {selectedType.description}
              </Text>

              {selectedType.examples && selectedType.examples.length > 0 && (
                <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
                  <Text as="p" size="sm" weight="bold" tone="navy" className="mb-3 uppercase tracking-wider">
                    Examples include:
                  </Text>
                  <ul className="space-y-2.5">
                    {selectedType.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red"></span>
                        <span className="leading-relaxed">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
