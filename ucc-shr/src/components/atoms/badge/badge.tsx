import type { BadgeProps, BadgeVariant } from './badge.types'

const styles: Record<BadgeVariant, string> = {
  navy:    'bg-navy-light text-navy',
  red:     'bg-red-light  text-red',
  error:   'bg-red-light  text-red',
  gray:    'bg-gray-100   text-gray-600',
  success: 'bg-[#E8F5EE]  text-[#1A6B50]',
  warning: 'bg-[#FFF8E7]  text-[#B45309]',
}

export function Badge({ variant = 'navy', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1
      rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  )
}