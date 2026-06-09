import type { FormFieldProps } from './form-field.types'
import { Text } from '../../atoms/text/text'

export function FormField({ label, hint, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Text as="label" size="sm" weight="medium" className="text-gray-900">
        {label}
        {required && <span className="text-red ml-0.5">*</span>}
      </Text>
      {hint && <Text size="xs" tone="muted" className="font-light">{hint}</Text>}
      {children}
      {error && <Text size="xs" weight="medium" className="text-red">{error}</Text>}
    </div>
  )
}
