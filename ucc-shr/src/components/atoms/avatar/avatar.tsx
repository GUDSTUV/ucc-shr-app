import type { ReactNode } from 'react'
import Image from 'next/image'

export interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fallbackIcon?: ReactNode
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const imageSizes = {
  sm: 32,
  md: 40,
  lg: 48,
}

export function Avatar({
  src,
  alt = 'avatar',
  initials,
  size = 'md',
  className,
  fallbackIcon,
}: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={imageSizes[size]}
        height={imageSizes[size]}
        unoptimized
        className={`${sizes[size]} rounded-full object-cover bg-gray-100 ${className ?? ''}`}
      />
    )
  }

  return (
    <span
      className={`${sizes[size]} inline-flex items-center justify-center rounded-full bg-navy-light text-navy font-semibold ${className ?? ''}`}
    >
      {initials ?? fallbackIcon ?? '?'}
    </span>
  )
}
