'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { FadeIn, FadeInItem, FadeInStagger } from '@/src/components/atoms/fade-in'

const consentPrinciples = [
  { 
    letter: 'F', 
    title: 'Freely Given', 
    desc: 'Consent is a choice you make without pressure, manipulation, or under the influence of drugs or alcohol.',
    example: 'A student agrees to go on a date without feeling pressured, blackmailed, or threatened by their partner.'
  },
  { 
    letter: 'R', 
    title: 'Reversible', 
    desc: 'Anyone can change their mind about what they feel like doing, anytime. Even if you’ve done it before.',
    example: 'During intimacy, one person decides they want to stop. Their partner immediately respects their decision and stops without complaining.'
  },
  { 
    letter: 'I', 
    title: 'Informed', 
    desc: 'You can only consent to what you are informed of—for example, if someone says they will use protection and then doesn’t, there is no consent.',
    example: 'Both partners agree to use contraception before engaging in sexual activity, and neither secretly removes or tampers with it.'
  },
  { 
    letter: 'E', 
    title: 'Enthusiastic', 
    desc: 'When it comes to sex, you should only do stuff you WANT to do, not things that you feel you’re expected to do.',
    example: 'Both people are actively participating and expressing clear interest, rather than one person just lying still or saying "I guess so".'
  },
  { 
    letter: 'S', 
    title: 'Specific', 
    desc: 'Saying yes to one thing doesn’t mean you’ve said yes to others.',
    example: 'Consenting to kissing or cuddling in a dorm room does not automatically mean consenting to taking off clothes or having sex.'
  },
]

export function ConsentSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="text-center">
          <Text as="span" size="xs" weight="semibold" tone="navy" className="uppercase tracking-widest">Clear Boundaries</Text>
          <Heading size="3xl" tone="navy" className="mt-2 lg:text-4xl">Understanding Consent</Heading>
          <Text size="base" tone="muted" className="mx-auto mt-3 max-w-2xl">
            Consent is a clear, unambiguous, and voluntary agreement. It must be present in every interaction. Remember the F.R.I.E.S framework:
          </Text>
        </FadeIn>

        <div className="mt-12 lg:mt-16 flex flex-col lg:flex-row gap-8 lg:gap-20 items-start mx-auto max-w-5xl">
          {/* Left Side: Letters navigation */}
          <FadeInStagger className="flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide shrink-0 snap-x">
            {consentPrinciples.map((item, index) => {
              const isActive = activeIndex === index
              return (
                <FadeInItem key={item.letter} className="snap-start shrink-0 lg:shrink">
                  <button
                    onClick={() => setActiveIndex(index)}
                    className={`group relative flex items-center gap-3 lg:gap-5 rounded-xl p-2 pr-4 lg:pr-10 transition-all text-left ${
                      isActive ? 'bg-navy shadow-md' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold transition-colors ${
                        isActive ? 'bg-white text-navy' : 'bg-gray-100 text-gray-500 group-hover:bg-navy/10 group-hover:text-navy'
                      }`}
                    >
                      {item.letter}
                    </div>
                    <div className="block">
                      <Heading
                        as="h3"
                        size="base"
                        weight="semibold"
                        className={`transition-colors whitespace-nowrap lg:whitespace-normal ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-navy'}`}
                      >
                        {item.title}
                      </Heading>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute right-0 top-1/2 -mt-4 hidden h-8 w-1 rounded-l-full bg-white lg:block"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </FadeInItem>
              )
            })}
          </FadeInStagger>

          {/* Right Side: Dynamic Content */}
          <FadeIn delay={0.2} className="flex-1 w-full flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-10 w-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 text-[150px] sm:text-[200px] font-black text-gray-200/40 leading-none select-none">
                  {consentPrinciples[activeIndex].letter}
                </div>
                <div className="relative z-10">
                  <Heading as="h3" size="xl" tone="navy" weight="bold" className="sm:text-2xl">
                    {consentPrinciples[activeIndex].title}
                  </Heading>
                  <div className="mt-4 sm:mt-5 h-1 w-10 rounded-full bg-red-light" />
                  <Text size="base" tone="default" className="mt-4 sm:mt-6 leading-relaxed text-gray-700">
                    {consentPrinciples[activeIndex].desc}
                  </Text>

                  <div className="mt-6 rounded-xl bg-navy/5 border border-navy/10 p-4 sm:p-5">
                    <Text as="p" size="xs" weight="semibold" tone="navy" className="uppercase tracking-wider">Real-world example</Text>
                    <Text size="sm" className="mt-2 text-gray-700 leading-relaxed italic">
                      &quot;{consentPrinciples[activeIndex].example}&quot;
                    </Text>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} className="mx-auto mt-16 sm:mt-20 flex max-w-4xl flex-col items-center gap-5 sm:gap-6 rounded-2xl border border-navy/5 bg-navy-light/20 p-6 sm:flex-row sm:items-center sm:p-10">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white shadow-sm">
            <ShieldCheck size={28} className="text-navy sm:h-8 sm:w-8" />
          </div>
          <div className="text-center sm:text-left">
            <Heading as="h3" size="lg" tone="navy" className="sm:text-xl">Silence is NOT Consent</Heading>
            <Text size="sm" tone="muted" className="mt-2 leading-relaxed sm:text-base">
              The absence of a &quot;no&quot; does not mean &quot;yes&quot;. Only a clear, enthusiastic &quot;yes&quot; constitutes consent.
            </Text>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
