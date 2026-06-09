'use client'
import { LayoutDashboard, FileText, CalendarDays, Flag, BellRing, UserCircle2, Settings, BarChart3 } from 'lucide-react'
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
              <Text size="xs" weight="semibold" tone="navy" className="uppercase tracking-[0.14em]">CEGRAD UCC</Text>
              <Text size="base" weight="semibold" className="mt-1 text-navy-dark">Admin Console</Text>
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
          <Text weight="semibold" tone="default">Confidential Environment</Text>
          <Text className="mt-1 leading-relaxed">Handle all reports under approved institutional protocols.</Text>
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

            <Button
              type="button"
              onClick={handleLogout}
              variant="outline"
              fullWidth
              className="mt-2 bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
