import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  label?: React.ReactNode
  helperText?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const helperId = helperText && id ? `${id}-helper` : undefined

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={id} className="mb-2 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={id}
          aria-describedby={helperId}
          ref={ref}
          className={`w-full h-12 px-4 rounded-md font-sans
        border-[1.5px] bg-white outline-none transition-colors
        ${error
          ? 'border-red focus:border-red'
          : 'border-gray-200 focus:border-navy'}
        ${className ?? ''}`}
          {...props}
        />
        {helperText && <p id={helperId} className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'