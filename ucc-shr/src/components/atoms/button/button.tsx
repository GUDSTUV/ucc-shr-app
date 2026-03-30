import { Loader2 } from 'lucide-react'
import type { ButtonProps } from './button.types'

const variants = {
  primary: 'bg-navy text-white hover:bg-navy-dark',
  report:  'bg-red  text-white hover:bg-red-dark w-full shadow-md shadow-red/30',
  outline: 'border-[1.5px] border-navy text-navy hover:bg-navy-light',
  ghost:   'text-navy hover:bg-navy-light',
}
const sizes = {
  sm: 'h-10 px-4  text-sm',
  md: 'h-12 px-5  text-[15px]',
  lg: 'h-[54px] px-6 text-[17px]',
}

export function Button({
  variant = 'primary', size = 'md',
  disabled, loading, fullWidth,
  onClick, children, type = 'button', className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={
        `inline-flex items-center justify-center gap-2
         rounded-[10px] font-semibold font-sans
         transition-all active:scale-[0.97]
        disabled:opacity-50 min-h-11
         ${variants[variant]} ${sizes[size]}
         ${fullWidth ? 'w-full' : ''}
         ${className ?? ''}`
      }
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}