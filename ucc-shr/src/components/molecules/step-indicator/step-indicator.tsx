import { Check } from 'lucide-react'

export interface StepIndicatorProps {
  step: number
  total: number
  labels: string[]
  className?: string
}

export function StepIndicator({ step, total, labels, className }: StepIndicatorProps) {
  return (
    <div className={`flex w-full items-start justify-between ${className ?? ''}`}>
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1
        const isCompleted = step > stepNum
        const isCurrent = step === stepNum
        const isLast = i === total - 1

        return (
          <div key={i} className="relative flex flex-1 flex-col items-center">
            {/* Left connector line */}
            {i > 0 && (
              <div
                className={`absolute left-0 right-1/2 top-3.5 h-0.5 transition-colors duration-300 ${
                  isCompleted || isCurrent ? 'bg-navy' : 'bg-gray-200'
                }`}
              />
            )}
            {/* Right connector line */}
            {!isLast && (
              <div
                className={`absolute left-1/2 right-0 top-3.5 h-0.5 transition-colors duration-300 ${
                  isCompleted ? 'bg-navy' : 'bg-gray-200'
                }`}
              />
            )}

            {/* Circle */}
            <div
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                isCompleted
                  ? 'border-navy bg-navy text-white'
                  : isCurrent
                  ? 'border-navy bg-white text-navy shadow-sm'
                  : 'border-gray-200 bg-white text-gray-400'
              }`}
            >
              {isCompleted ? <Check size={12} strokeWidth={3} /> : stepNum}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-center text-[9px] font-bold uppercase leading-tight tracking-widest ${
                isCurrent ? 'text-navy' : isCompleted ? 'text-navy/50' : 'text-gray-300'
              }`}
            >
              {labels[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
