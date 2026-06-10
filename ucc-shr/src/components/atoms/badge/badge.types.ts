import type { ReactNode } from 'react'

export type BadgeVariant = 'navy' | 'red' | 'gray' | 'success' | 'warning' | 'error'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}
