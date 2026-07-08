'use client'

import Link from 'next/link'
import { Text } from '@/src/components/atoms/text'
import { Heading } from '@/src/components/atoms/heading'
import { FadeIn } from '@/src/components/atoms/fade-in'

type PageHeroProps = {
  title: string
  subtitle: string
  buttonText?: string
  buttonLink?: string
}

export function PageHero({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: PageHeroProps) {
  return (
    <div className="relative w-full bg-navy py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Subtle Texture: Faint concentric circles in top-left as shown in reference */}
      <div 
        className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/[0.03] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -top-12 left-16 h-80 w-80 rounded-full bg-white/[0.03] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Subtle Texture: Faint concentric circles in bottom-right */}
      <div 
        className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/[0.03] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-12 right-16 h-80 w-80 rounded-full bg-white/[0.03] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-3xl">
          {/* Title */}
          <Heading 
            as="h1" 
            size={{ base: '4xl', sm: '5xl', lg: '5xl' }} 
            tone="white" 
            weight="medium" 
            className="tracking-tight"
          >
            {title}
          </Heading>

          {/* Red Accent Rule */}
          <div className="mt-6 h-[3px] w-12 bg-red" />

          {/* Subtitle */}
          <Text 
            size="lg" 
            tone="white" 
            className="mt-6 max-w-2xl leading-relaxed opacity-80"
          >
            {subtitle}
          </Text>
          
          {/* Action Button */}
          {buttonText && buttonLink && (
            <div className="mt-10">
              <Link
                href={buttonLink}
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 bg-white/10 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {buttonText}
              </Link>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  )
}
