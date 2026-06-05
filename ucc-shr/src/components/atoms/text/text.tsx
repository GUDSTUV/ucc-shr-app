import type { ComponentPropsWithoutRef, ElementType } from 'react'

type TextSize = 'xs' | 'sm' | 'base' | 'lg'
type TextTone = 'default' | 'muted' | 'navy' | 'light' | 'white'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

type TextProps<T extends ElementType = 'p'> = {
  as?: T
  size?: TextSize
  tone?: TextTone
  weight?: TextWeight
} & ComponentPropsWithoutRef<T>

const textSizes: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
}

const textTones: Record<TextTone, string> = {
  default: 'text-gray-900',
  muted: 'text-gray-600',
  navy: 'text-navy',
  light: 'text-navy-light',
  white: 'text-white',
}

const textWeights: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export function Text<T extends ElementType = 'p'>(props: TextProps<T>) {
  const { as, size = 'base', tone = 'default', weight = 'regular', className, ...rest } = props
  const Component = as ?? 'p'

  return (
    <Component
      className={`font-sans ${textSizes[size]} ${textWeights[weight]} ${textTones[tone]} ${className ?? ''}`.trim()}
      {...rest}
    />
  )
}

export type { TextProps, TextSize, TextTone, TextWeight }
