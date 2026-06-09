import { Text } from '../../atoms/text/text'

export interface StepIndicatorProps {
  step: number
  total: number
  className?: string
}

export function StepIndicator({ step, total, className }: StepIndicatorProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <Text size="xs" weight="semibold" tone="navy">Step {step} of {total}</Text>
      <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-red transition-all"
          style={{ width: `${Math.max(0, Math.min(100, (step / total) * 100))}%` }}
        />
      </div>
    </div>
  )
}
