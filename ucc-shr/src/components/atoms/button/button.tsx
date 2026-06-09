import { Loader2 } from 'lucide-react'
import type { ButtonProps } from './button.types'

const variants = {
  primary: 'bg-navy text-white hover:bg-navy-dark',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  report:  'bg-red text-white hover:bg-red-dark shadow-md shadow-red/30',
  outline: 'border-[1.5px] border-navy text-navy hover:bg-navy-light',
  ghost:   'text-navy hover:bg-navy-light',
  danger:  'bg-red-600 text-white hover:bg-red-700',
  'danger-ghost': 'text-red-600 hover:bg-red-50',
  unstyled: '',
}
const sizes = {
  none: '',
  icon: 'h-10 w-10 p-0',
  xs: 'h-8 px-3 text-xs',
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-[54px] px-6 text-[17px]',
}

export function Button({
  variant = 'primary', size = 'md',
  disabled, loading, fullWidth,
  onClick, children, type = 'button', className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={
        variant === 'unstyled'
          ? className ?? ''
          : `inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold font-sans transition-all active:scale-[0.97] disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`.trim()
      }
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}