import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'report' | 'outline' | 'ghost' | 'danger' | 'danger-ghost' | 'unstyled'
export type ButtonSize    = 'none' | 'icon' | 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'type'> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  disabled?:  boolean
  loading?:   boolean
  fullWidth?: boolean
  onClick?:   () => void
  children?:  ReactNode
  type?:      'button' | 'submit' | 'reset'
  className?: string
}