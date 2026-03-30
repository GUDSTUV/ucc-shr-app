'use client'
import { LayoutDashboard, FileText, CalendarDays, Flag, BellRing, UserCircle2, Settings, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { NavItem } from '@/src/components/molecules/nav-item'

const items = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { href: '/admin/reports', label: 'Reports', icon: <Flag size={16} /> },
  { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { href: '/admin/notifications', label: 'Notifications', icon: <BellRing size={16} /> },
  { href: '/admin/articles', label: 'Articles', icon: <FileText size={16} /> },
  { href: '/admin/events', label: 'Events', icon: <CalendarDays size={16} /> },
]

const accountItems = [
  { href: '/admin/profile', label: 'Profile', icon: <UserCircle2 size={16} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
]

type AdminSidebarProps = {
  unreadNotificationsCount?: number
}

export function AdminSidebar({ unreadNotificationsCount }: AdminSidebarProps) {
  const pathname = usePathname()

  async function handleLogout() {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="sticky top-0 flex h-dvh flex-col p-4">
        <div className="mb-5 rounded-xl border border-navy/15 bg-navy-light px-3 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/70">
              <Image
                src="/icons/logo.svg"
                alt="CEGRAD logo"
                width={30}
                height={30}
                priority
                className="h-7.5 w-7.5"
              />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy">CEGRAD UCC</p>
              <p className="mt-1 text-base font-semibold text-navy-dark">Admin Console</p>
            </div>
          </div>
        </div>

        <nav aria-label="Admin navigation" className="space-y-1.5">
          {items.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              badgeCount={item.href === '/admin/notifications' ? unreadNotificationsCount : undefined}
              active={
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              }
            />
          ))}
        </nav>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Confidential Environment</p>
          <p className="mt-1 leading-relaxed">Handle all reports under approved institutional protocols.</p>
        </div>

        <div className="mt-auto pt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-2">
            <nav aria-label="Admin account" className="space-y-1">
              {accountItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                />
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-gray-200 bg-white px-3 text-base font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
