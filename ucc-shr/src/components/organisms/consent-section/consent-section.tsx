'use client'

import { ShieldCheck, ArrowRight } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { FadeIn, FadeInStagger, FadeInItem } from '@/src/components/atoms/fade-in'
import { consentPrinciples } from '@/src/app/(public)/awareness/constants'

export function ConsentSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center">
          <Text as="span" size="xs" weight="medium" tone="navy" className="uppercase tracking-widest">Clear Boundaries</Text>
          <Heading as="h2" size={{ base: '3xl', lg: '4xl' }} tone="navy" weight="semibold" className="mt-2">Understanding Consent</Heading>
          <Text size={{ base: 'base', lg: 'lg' }} tone="muted" className="mx-auto mt-3 max-w-2xl">
            Consent is a clear, unambiguous, and voluntary agreement. It must be present in every interaction. Remember the F.R.I.E.S framework:
          </Text>
        </FadeIn>

        <FadeInStagger className="mt-12 lg:mt-16 mx-auto max-w-5xl border-t border-gray-100">
          {consentPrinciples.map((item) => (
            <FadeInItem key={item.letter}>
              <div className="group flex flex-col md:flex-row md:items-center border-b border-gray-100 py-8 gap-5 md:gap-10 transition-colors hover:bg-gray-50 px-4 md:px-6 cursor-default">
                
                {/* Left Column: Term */}
                <div className="flex md:w-[35%] items-center gap-5 shrink-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-light transition-colors group-hover:bg-navy">
                    <Heading as="span" size={{ base: 'lg', lg: 'xl' }} tone="navy" weight="semibold" className="transition-colors group-hover:text-white">
                      {item.letter}
                    </Heading>
                  </div>
                  <Text as="h3" size={{ base: 'lg', lg: 'xl' }} tone="navy" weight="semibold">
                    {item.title}
                  </Text>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:flex shrink-0 items-center justify-center px-2">
                  <ArrowRight size={24} className="text-gray-300 group-hover:text-navy transition-all group-hover:translate-x-2" />
                </div>

                {/* Right Column: Description */}
                <div className="md:flex-1 md:pl-4">
                  <Text size={{ base: 'base', lg: 'lg' }} tone="muted" className="leading-relaxed group-hover:text-gray-800 transition-colors">
                    {item.desc}
                  </Text>
                </div>
                
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
