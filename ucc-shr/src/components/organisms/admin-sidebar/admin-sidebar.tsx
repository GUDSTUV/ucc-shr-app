'use client'
import { LayoutDashboard, FileText, CalendarDays, Flag, BellRing, UserCircle2, Settings, BarChart3, Users, Image as ImageIcon, Globe } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { NavItem } from '@/src/components/molecules/nav-item'
import { Text } from '@/src/components/atoms/text/text'
import { Button } from '@/src/components/atoms/button/button'

const items = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { href: '/admin/reports', label: 'Reports', icon: <Flag size={16} /> },
  { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { href: '/admin/notifications', label: 'Notifications', icon: <BellRing size={16} /> },
  { href: '/admin/articles', label: 'Articles', icon: <FileText size={16} /> },
  { href: '/admin/events', label: 'Events', icon: <CalendarDays size={16} /> },
  { href: '/admin/banners', label: 'Banners', icon: <ImageIcon size={16} /> },
  { href: '/admin/site-content', label: 'Site Content', icon: <Globe size={16} /> },
  { href: '/admin/team', label: 'Team', icon: <Users size={16} /> },
]

const accountItems = [
  { href: '/admin/profile', label: 'Profile', icon: <UserCircle2 size={16} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
]

type AdminSidebarProps = {
  unreadNotificationsCount?: number
  userRole?: string
}

export function AdminSidebar({ unreadNotificationsCount, userRole = 'ADMIN' }: AdminSidebarProps) {
  const pathname = usePathname()

  const visibleItems = items.filter(item => {
    if (userRole === 'SUPER_ADMIN') return true
    // Standard ADMIN can only see Dashboard, Reports, Notifications
    return ['/admin', '/admin/reports', '/admin/notifications'].includes(item.href)
  })

  const visibleAccountItems = accountItems.filter(item => {
    if (userRole === 'SUPER_ADMIN') return true
    return item.href === '/admin/profile'
  })

  async function handleLogout() {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white md:block print:hidden">
      <div className="sticky top-0 flex h-dvh flex-col py-4">
        <div className="mb-4 shrink-0 px-4">
          <div className="rounded-xl border border-navy/15 bg-navy-light px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70">
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
                <Text size="xs" weight="semibold" tone="navy" className="uppercase tracking-[0.14em]">CEGRAD UCC</Text>
                <Text size="base" weight="semibold" className="mt-1 text-navy-dark">Admin Console</Text>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {visibleItems.map((item) => (
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

        <div className="mt-auto shrink-0 border-t border-gray-100 bg-white px-4 pt-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-2">
            <nav aria-label="Admin account" className="space-y-1">
              {visibleAccountItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                />
              ))}
            </nav>

            <Button
              type="button"
              onClick={handleLogout}
              variant="outline"
              fullWidth
              className="mt-2 border-gray-200 bg-white text-gray-800 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
