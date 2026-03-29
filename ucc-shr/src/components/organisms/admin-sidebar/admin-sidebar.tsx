'use client'
import { LayoutDashboard, FileText, CalendarDays, Flag, BellRing } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { NavItem } from '@/src/components/molecules/nav-item'

const items = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { href: '/admin/reports', label: 'Reports', icon: <Flag size={16} /> },
  { href: '/admin/notifications', label: 'Notifications', icon: <BellRing size={16} /> },
  { href: '/admin/articles', label: 'Articles', icon: <FileText size={16} /> },
  { href: '/admin/events', label: 'Events', icon: <CalendarDays size={16} /> },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-gray-100 bg-white p-3 hidden md:block">
      <div className="mb-3 px-2 py-1.5 text-[12px] font-semibold text-gray-500">Admin</div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
        ))}
      </nav>
    </aside>
  )
}
