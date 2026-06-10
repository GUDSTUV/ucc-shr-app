import { Check } from 'lucide-react'
import { ReportStatus } from '@/src/components/molecules/status-badge'

export type WorkflowStepperProps = {
  currentStatus: ReportStatus
}

const STEPS = [
  { id: 'RECEIVED', label: 'Received', description: 'Report submitted' },
  { id: 'UNDER_REVIEW', label: 'Review & Support', description: 'Initial contact' },
  { id: 'UNDER_INVESTIGATION', label: 'Investigation', description: 'Office/Board review' },
  { id: 'CLOSED', label: 'Closed', description: 'Resolution reached' },
] as const

export function WorkflowStepper({ currentStatus }: WorkflowStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStatus)

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div key={step.id} className="relative flex flex-1 flex-col items-center group">
              {/* Connector Line */}
              {index !== STEPS.length - 1 && (
                <div
                  className={`absolute left-[50%] top-4 -z-10 h-0.5 w-full ${
                    isCompleted ? 'bg-navy' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step Circle */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors
                  ${
                    isCompleted
                      ? 'border-navy bg-navy text-white'
                      : isCurrent
                      ? 'border-navy bg-white text-navy ring-4 ring-navy/10'
                      : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : index + 1}
              </div>

              {/* Text Labels */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    isCurrent ? 'text-navy' : isUpcoming ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
