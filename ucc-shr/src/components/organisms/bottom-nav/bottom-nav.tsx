'use client'

import { usePathname } from 'next/navigation'
import { Home, CalendarClock, Flag, BookText, UserRound, LayoutDashboard, FileText } from 'lucide-react'
import { MobileNavItem } from '@/src/components/molecules/mobile-nav-item'
import { ReportFab } from '@/src/components/atoms/report-fab'

type UserInfo = {
  name?: string | null
  role?: string | null
}

interface BottomNavProps {
  user?: UserInfo | null
}

export function BottomNav({ user }: BottomNavProps) {
  const path = usePathname()
  const reportHref = '/report'

  if (path.startsWith('/admin')) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto grid h-18.5 w-full max-w-2xl grid-cols-5 items-end rounded-2xl border border-navy/10 bg-white/95 px-1 pb-2 shadow-[0_-8px_24px_rgba(38,56,117,0.15)] backdrop-blur-sm">
        
        {user ? (
          // Authenticated Bottom Nav: Home, Awareness, Report, Dashboard
          <>
            <MobileNavItem
              href="/"
              label="Home"
              icon={<Home size={20} strokeWidth={2.3} />}
              active={path === '/'}
            />
            <MobileNavItem
              href="/hub"
              label="Awareness"
              icon={<CalendarClock size={20} strokeWidth={2.3} />}
              active={path.startsWith('/hub') || path.startsWith('/events')}
            />
            <ReportFab
              href={reportHref}
              label="Report"
              icon={<Flag size={24} strokeWidth={2.5} />}
              active={path.startsWith('/report')}
            />
            <MobileNavItem
              href="/user/userDashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={20} strokeWidth={2.3} />}
              active={path === '/user/userDashboard'}
            />
            <MobileNavItem
              href="/user/userReports"
              label="My Reports"
              icon={<FileText size={20} strokeWidth={2.3} />}
              active={path.startsWith('/user/userReports')}
            />
          </>
        ) : (
          // Unauthenticated Bottom Nav: Home, Awareness, Report, About, Sign In
          <>
            <MobileNavItem
              href="/"
              label="Home"
              icon={<Home size={20} strokeWidth={2.3} />}
              active={path === '/'}
            />
            <MobileNavItem
              href="/hub"
              label="Awareness"
              icon={<CalendarClock size={20} strokeWidth={2.3} />}
              active={path.startsWith('/hub') || path.startsWith('/events')}
            />
            <ReportFab
              href={reportHref}
              label="Report"
              icon={<Flag size={24} strokeWidth={2.5} />}
              active={path.startsWith('/report')}
            />
            <MobileNavItem
              href="/about"
              label="About"
              icon={<BookText size={20} strokeWidth={2.3} />}
              active={path === '/about'}
            />
            <MobileNavItem
              href="/login"
              label="Sign In"
              icon={<UserRound size={20} strokeWidth={2.3} />}
              active={path === '/login' || path === '/signup'}
            />
          </>
        )}

      </div>
    </nav>
  )
}

