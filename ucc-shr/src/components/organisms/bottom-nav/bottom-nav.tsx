'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, CalendarClock, Flag, BookText, UserRound } from 'lucide-react'
import { MobileNavItem } from '@/src/components/molecules/mobile-nav-item'
import { ReportFab } from '@/src/components/atoms/report-fab'

export function BottomNav() {
  const path = usePathname()
  const { data: session } = useSession()
  const isSignedInUser = Boolean(session?.user) && session?.user?.role !== 'SUPER_ADMIN'
  const reportHref = isSignedInUser ? '/user/userDashboard' : '/report'

  if (path.startsWith('/admin')) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto grid h-18.5 w-full max-w-2xl grid-cols-5 items-end rounded-2xl border border-navy/10 bg-white/95 px-1 pb-2 shadow-[0_-8px_24px_rgba(38,56,117,0.15)] backdrop-blur-sm">
        <MobileNavItem
          href="/"
          label="Home"
          icon={<Home size={20} strokeWidth={2.3} />}
          active={path === '/'}
        />

        <MobileNavItem
          href="/hub"
          label="Post/Event"
          icon={<CalendarClock size={20} strokeWidth={2.3} />}
          active={path.startsWith('/hub') || path.startsWith('/events')}
        />

        <ReportFab
          href={reportHref}
          label="Report"
          icon={<Flag size={24} strokeWidth={2.5} />}
          active={path.startsWith('/report') || path.startsWith('/user/userDashboard')}
        />

        <MobileNavItem
          href="/about"
          label="About"
          icon={<BookText size={20} strokeWidth={2.3} />}
          active={path === '/about'}
        />

        <MobileNavItem
          href="/user/profile"
          label="Profile"
          icon={<UserRound size={20} strokeWidth={2.3} />}
          active={path.startsWith('/user/profile')}
        />
      </div>
    </nav>
  )
}
