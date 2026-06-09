import type { ComponentPropsWithoutRef, ElementType } from 'react'

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
type TextTone = 'default' | 'muted' | 'navy' | 'light' | 'white'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

type ResponsiveTextSize = TextSize | {
  base?: TextSize
  sm?: TextSize
  md?: TextSize
  lg?: TextSize
  xl?: TextSize
  '2xl'?: TextSize
}

type TextProps<T extends ElementType = 'p'> = {
  as?: T
  size?: ResponsiveTextSize
  tone?: TextTone
  weight?: TextWeight
} & ComponentPropsWithoutRef<T>

const responsiveTextSizes: Record<TextSize, Record<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>> = {
  xs: { base: 'text-xs', sm: 'sm:text-xs', md: 'md:text-xs', lg: 'lg:text-xs', xl: 'xl:text-xs', '2xl': '2xl:text-xs' },
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

function getTextSizeClasses(size: ResponsiveTextSize): string {
  if (typeof size === 'string') return responsiveTextSizes[size].base
  const classes: string[] = []
  if (size.base) classes.push(responsiveTextSizes[size.base].base)
  if (size.sm) classes.push(responsiveTextSizes[size.sm].sm)
  if (size.md) classes.push(responsiveTextSizes[size.md].md)
  if (size.lg) classes.push(responsiveTextSizes[size.lg].lg)
  if (size.xl) classes.push(responsiveTextSizes[size.xl].xl)
  if (size['2xl']) classes.push(responsiveTextSizes[size['2xl']]['2xl'])
  return classes.join(' ')
}

export function Text<T extends ElementType = 'p'>(props: TextProps<T>) {
  const { as, size = 'base', tone = 'default', weight = 'regular', className, ...rest } = props
  const Component = as ?? 'p'

  return (
    <Component
      className={`font-sans ${getTextSizeClasses(size)} ${textWeights[weight]} ${textTones[tone]} ${className ?? ''}`.trim()}
      {...rest}
    />
  )
}

export type { TextProps, TextSize, ResponsiveTextSize, TextTone, TextWeight }
