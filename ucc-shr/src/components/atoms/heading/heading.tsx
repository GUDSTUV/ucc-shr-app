import type { ComponentPropsWithoutRef, ElementType } from 'react'

type HeadingSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
type HeadingTone = 'default' | 'navy' | 'light' | 'white'
type HeadingWeight = 'medium' | 'semibold' | 'bold'

type ResponsiveHeadingSize = HeadingSize | {
  base?: HeadingSize
  sm?: HeadingSize
  md?: HeadingSize
  lg?: HeadingSize
  xl?: HeadingSize
  '2xl'?: HeadingSize
}

type HeadingProps<T extends ElementType = 'h2'> = {
  as?: T
  size?: ResponsiveHeadingSize
  tone?: HeadingTone
  weight?: HeadingWeight
} & ComponentPropsWithoutRef<T>

const responsiveHeadingSizes: Record<HeadingSize, Record<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>> = {
  sm: { base: 'text-sm', sm: 'sm:text-sm', md: 'md:text-sm', lg: 'lg:text-sm', xl: 'xl:text-sm', '2xl': '2xl:text-sm' },
  base: { base: 'text-base', sm: 'sm:text-base', md: 'md:text-base', lg: 'lg:text-base', xl: 'xl:text-base', '2xl': '2xl:text-base' },
  lg: { base: 'text-lg', sm: 'sm:text-lg', md: 'md:text-lg', lg: 'lg:text-lg', xl: 'xl:text-lg', '2xl': '2xl:text-lg' },
  xl: { base: 'text-xl', sm: 'sm:text-xl', md: 'md:text-xl', lg: 'lg:text-xl', xl: 'xl:text-xl', '2xl': '2xl:text-xl' },
  '2xl': { base: 'text-2xl', sm: 'sm:text-2xl', md: 'md:text-2xl', lg: 'lg:text-2xl', xl: 'xl:text-2xl', '2xl': '2xl:text-2xl' },
  '3xl': { base: 'text-3xl', sm: 'sm:text-3xl', md: 'md:text-3xl', lg: 'lg:text-3xl', xl: 'xl:text-3xl', '2xl': '2xl:text-3xl' },
  '4xl': { base: 'text-4xl', sm: 'sm:text-4xl', md: 'md:text-4xl', lg: 'lg:text-4xl', xl: 'xl:text-4xl', '2xl': '2xl:text-4xl' },
  '5xl': { base: 'text-5xl', sm: 'sm:text-5xl', md: 'md:text-5xl', lg: 'lg:text-5xl', xl: 'xl:text-5xl', '2xl': '2xl:text-5xl' },
  '6xl': { base: 'text-6xl', sm: 'sm:text-6xl', md: 'md:text-6xl', lg: 'lg:text-6xl', xl: 'xl:text-6xl', '2xl': '2xl:text-6xl' },
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

function getHeadingSizeClasses(size: ResponsiveHeadingSize): string {
  if (typeof size === 'string') return responsiveHeadingSizes[size].base
  const classes: string[] = []
  if (size.base) classes.push(responsiveHeadingSizes[size.base].base)
  if (size.sm) classes.push(responsiveHeadingSizes[size.sm].sm)
  if (size.md) classes.push(responsiveHeadingSizes[size.md].md)
  if (size.lg) classes.push(responsiveHeadingSizes[size.lg].lg)
  if (size.xl) classes.push(responsiveHeadingSizes[size.xl].xl)
  if (size['2xl']) classes.push(responsiveHeadingSizes[size['2xl']]['2xl'])
  return classes.join(' ')
}

export function Heading<T extends ElementType = 'h2'>(props: HeadingProps<T>) {
  const { as, size = '2xl', tone = 'default', weight = 'semibold', className, ...rest } = props
  const Component = as ?? 'h2'

  return (
    <Component
      className={`font-sans ${getHeadingSizeClasses(size)} ${headingWeights[weight]} ${headingTones[tone]} ${className ?? ''}`.trim()}
      {...rest}
    />
  )
}

export type { HeadingProps, HeadingSize, ResponsiveHeadingSize, HeadingTone, HeadingWeight }
