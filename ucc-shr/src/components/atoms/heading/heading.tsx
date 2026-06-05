import type { ComponentPropsWithoutRef, ElementType } from 'react'

type HeadingSize = 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
type HeadingTone = 'default' | 'navy' | 'light' | 'white'
type HeadingWeight = 'medium' | 'semibold' | 'bold'

type HeadingProps<T extends ElementType = 'h2'> = {
  as?: T
  size?: HeadingSize
  tone?: HeadingTone
  weight?: HeadingWeight
} & ComponentPropsWithoutRef<T>

const headingSizes: Record<HeadingSize, string> = {
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
}

const headingTones: Record<HeadingTone, string> = {
  default: 'text-gray-900',
  navy: 'text-navy',
  light: 'text-navy-light',
  white: 'text-white',
}

const headingWeights: Record<HeadingWeight, string> = {
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export function Heading<T extends ElementType = 'h2'>(props: HeadingProps<T>) {
  const { as, size = '2xl', tone = 'default', weight = 'semibold', className, ...rest } = props
  const Component = as ?? 'h2'

  return (
    <Component
      className={`font-sans ${headingSizes[size]} ${headingWeights[weight]} ${headingTones[tone]} ${className ?? ''}`.trim()}
      {...rest}
    />
  )
}

export type { HeadingProps, HeadingSize, HeadingTone, HeadingWeight }
