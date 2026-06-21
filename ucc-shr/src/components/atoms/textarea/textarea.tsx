import { forwardRef } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ error, className, rows = 4, ...props }, ref) => (
		<textarea
			ref={ref}
			rows={rows}
			className={`w-full px-4 py-3 rounded-md font-sans
				border-[1.5px] bg-white outline-none transition-colors resize-none
				${error ? 'border-red focus:border-red' : 'border-gray-200 focus:border-navy'}
				${className ?? ''}`}
			{...props}
		/>
	)
)

Textarea.displayName = 'Textarea'
