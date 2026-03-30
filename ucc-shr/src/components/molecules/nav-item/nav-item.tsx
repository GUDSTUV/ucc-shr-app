import Link from 'next/link'
import type { ReactNode } from 'react'

export interface NavItemProps {
  href: string
  icon?: ReactNode
  label: string
  active?: boolean
  badgeCount?: number
}

export function NavItem({ href, icon, label, active, badgeCount }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-[15px] transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2
        ${active ? 'bg-navy-light text-navy font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {typeof badgeCount === 'number' && badgeCount > 0 ? (
        <span className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-red px-1.5 text-xs font-semibold text-white">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </Link>
  )
}
