import { Info, AlertTriangle, CheckCircle } from 'lucide-react'

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
        {title && <p className="text-[13px] font-semibold mb-0.5">{title}</p>}
        <div className="text-[12px] font-light text-gray-600">{children}</div>
      </div>
    </div>
  )
}