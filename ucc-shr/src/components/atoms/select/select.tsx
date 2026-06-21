import { forwardRef } from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ error, className, children, ...props }, ref) => (
		<select
			ref={ref}
			className={`w-full h-12 px-4 rounded-md font-sans
				border-[1.5px] bg-white outline-none transition-colors
				${error ? 'border-red focus:border-red' : 'border-gray-200 focus:border-navy'}
				${className ?? ''}`}
			{...props}
		>
			{children}
		</select>
	)
)

Select.displayName = 'Select'
