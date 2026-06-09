import { Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { Text } from '../../atoms/text/text'

export type AlertVariant = 'info' | 'danger' | 'success'

const styles = {
  info:    { wrap: 'bg-navy-light border-navy',    icon: 'text-navy',      Icon: Info },
  danger:  { wrap: 'bg-red-light  border-red',     icon: 'text-red',       Icon: AlertTriangle },
  success: { wrap: 'bg-[#E8F5EE] border-[#1A6B50]',icon: 'text-[#1A6B50]', Icon: CheckCircle },
}

export interface AlertBoxProps {
  variant?: AlertVariant
  title?: string
  className?: string
  noBackground?: boolean
  noBorder?: boolean
  children: React.ReactNode
}

export function AlertBox({
  variant = 'info',
  title,
  className,
  noBackground = false,
  noBorder = false,
  children,
}: AlertBoxProps) {
  const selected = styles[variant] ?? styles.info
  const { wrap, icon, Icon } = selected
  const wrapTokens = wrap.split(' ')
  const bgClass = wrapTokens.find((token) => token.startsWith('bg-'))
  const borderColorClass = wrapTokens.find((token) => token.startsWith('border-') && token !== 'border-l-4')

  const rootClasses = [
    'flex gap-3 p-4 rounded-[10px]',
    noBorder ? '' : 'border-l-4',
    noBackground ? '' : bgClass,
    noBorder ? '' : borderColorClass,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClasses}>
      <Icon size={17} className={`shrink-0 mt-0.5 ${icon}`} />
      <div>
        {title && <Text size="sm" weight="semibold" className="mb-0.5">{title}</Text>}
        <Text size="xs" tone="muted" className="font-light">{children}</Text>
      </div>
    </div>
  )
}