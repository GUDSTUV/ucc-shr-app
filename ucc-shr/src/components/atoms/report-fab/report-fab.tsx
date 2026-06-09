import Link from 'next/link'
import type { ReactNode } from 'react'

interface ReportFabProps {
  href: string
  label: string
  icon: ReactNode
  active?: boolean
}

export function ReportFab({ href, label, icon, active = false }: ReportFabProps) {
  return (
    <div className="-mt-8 flex min-w-17 flex-col items-center justify-end">
      <Link
        href={href}
        className={`report-pop flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-white shadow-xl transition-transform active:scale-95 ${active ? 'bg-navy-dark shadow-navy/40' : 'bg-navy shadow-navy/35'}`}
        aria-label={label}
      >
        {icon}
      </Link>
      <span className="mt-1 text-[10px] font-bold text-navy">{label}</span>
    </div>
  )
}
