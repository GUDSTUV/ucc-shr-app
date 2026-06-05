'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Flag, LogIn } from 'lucide-react'
import { Text } from '@/src/components/atoms/text'

const navLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/hub', label: 'Awareness', exact: false },
  { href: '/about', label: 'About', exact: false },
  { href: '/help', label: 'Help', exact: false },
]

export function Navbar() {
  const path = usePathname()
  const { data: session } = useSession()

  // Hide navbar on routes that have their own navigation
  if (
    path.startsWith('/admin') ||
    path.startsWith('/user') ||
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/report') ||
    path.startsWith('/track')
  ) {
    return null
  }

  const isSignedInUser = Boolean(session?.user) && session?.user?.role !== 'SUPER_ADMIN'
  const reportHref = isSignedInUser ? '/user/userDashboard' : '/report'
  const accountHref = isSignedInUser ? '/user/profile' : '/login'
  const accountLabel = isSignedInUser ? 'My Account' : 'Sign In'
  const isAccountActive = path.startsWith('/user/profile') || path === '/login'

  return (
    <nav
      className="hidden md:block sticky top-0 z-40 border-b border-navy/10 bg-white/95 backdrop-blur-sm"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-6 px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-3 text-navy">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy/10">
            <Image
              src="/icons/logo.svg"
              alt="CEGRAD logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </span>
          <span className="leading-tight">
            <Text as="span" size="base" weight="bold" tone="navy" className="block tracking-tight">
              CEGRAD-UCC
            </Text>
            <Text as="span" size="xs" tone="muted" className="block">
              Sexual Harassment Reporting
            </Text>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex flex-1 items-center justify-center gap-1">
          {navLinks.map(({ href, label, exact }) => {
            const active = exact ? path === href : path.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex h-10 items-center rounded-[10px] px-4 text-[15px] font-medium transition-colors
                  ${active
                    ? 'bg-navy-light text-navy font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={accountHref}
            aria-current={isAccountActive ? 'page' : undefined}
            className={`inline-flex h-11 items-center gap-2 rounded-[10px] border border-navy/20 px-4 text-[15px] font-semibold text-navy transition hover:bg-navy-light ${
              isAccountActive ? 'bg-navy-light' : ''
            }`}
          >
            <LogIn size={15} />
            {accountLabel}
          </Link>
          <Link
            href={reportHref}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-navy px-5 text-[15px] font-semibold text-white shadow-sm shadow-navy/25 transition hover:bg-navy-dark"
          >
            <Flag size={16} />
            Report Incident
          </Link>
        </div>
      </div>
    </nav>
  )
}
