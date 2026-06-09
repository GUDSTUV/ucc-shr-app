'use client'

import { ReactNode, useState, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'

interface FlipCardProps {
  frontIcon: ReactNode
  frontTitle: string
  backDescription: string
  backList?: string[]
}

export function FlipCard({ frontIcon, frontTitle, backDescription, backList }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div 
      className="group relative h-64 w-full perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={`Learn more about ${frontTitle}`}
    >
      <motion.div
        className="relative h-full w-full preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm backface-hidden transition-all group-hover:shadow-lg">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-light text-navy">
            {frontIcon}
          </div>
          <h3 className="text-lg font-bold text-navy text-center">{frontTitle}</h3>
          <span className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hover/Tap to flip</span>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex flex-col items-start justify-center rounded-2xl border border-navy bg-navy text-white p-6 shadow-lg backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <h3 className="text-base font-bold mb-2">{frontTitle}</h3>
          <p className="text-sm text-white/90 leading-relaxed mb-3">
            {backDescription}
          </p>
          
          {backList && backList.length > 0 && (
            <ul className="space-y-1.5 w-full">
              {backList.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  )
}
