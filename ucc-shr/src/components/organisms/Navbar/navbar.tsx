'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flag, LogIn, Bell, UserCircle2, ChevronDown, LogOut, LayoutDashboard, FileText, Bookmark, Lock, Menu, X, BookText, HelpCircle } from 'lucide-react'
import { Text } from '@/src/components/atoms/text'
import { Button } from '@/src/components/atoms/button'
import { signOut } from 'next-auth/react'

type UserInfo = {
  name?: string | null
  role?: string | null
}

interface NavbarProps {
  user?: UserInfo | null
}

const navLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/about', label: 'About', exact: false },
  { href: '/hub', label: 'Awareness', exact: false },
  { href: '/help', label: 'Help', exact: false },
]

export function Navbar({ user }: NavbarProps) {
  const path = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns on route change
  useEffect(() => {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }, [path])

  // Hide completely on auth, reporting flows, and admin
  if (
    path.startsWith('/admin') ||
    path === '/login' ||
    path === '/signup' ||
    path.startsWith('/report') ||
    path.startsWith('/track')
  ) {
    return null
  }

  const isUserSection = path.startsWith('/user')

  return (
    <nav
      className="sticky top-0 z-40 border-b border-navy/10 bg-white/95 backdrop-blur-sm"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">

        {/* Brand */}
        <Link href={user ? '/user/userDashboard' : '/'} className="flex shrink-0 items-center gap-2 md:gap-3 text-navy">
          <span className="grid h-9 w-9 md:h-11 md:w-11 place-items-center rounded-xl bg-navy/10">
            <Image
              src="/icons/logo.svg"
              alt="CEGRAD logo"
              width={24}
              height={24}
              className="h-6 w-6 md:h-7 md:w-7"
            />
          </span>
          <div className="flex flex-col justify-center">
            <Text as="span" size={{ base: 'sm', md: 'base' }} weight="bold" tone="navy" className="tracking-tight leading-none">
              CEGRAD-UCC
            </Text>
            <Text as="span" size="xs" weight="semibold" tone="navy" className="mt-1 text-[10px] uppercase tracking-wider opacity-70 leading-none hidden sm:block">
              Sexual Harassment Reporting
            </Text>
            <Text as="span" size="xs" weight="semibold" tone="navy" className="mt-1 text-[10px] uppercase tracking-wider opacity-70 leading-none sm:hidden">
              SHR System
            </Text>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-1">
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

        {/* Desktop Actions */}
        <div className="hidden md:flex shrink-0 items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/user/notifications"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-navy transition"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </Link>

              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="unstyled"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 hover:border-navy/30 hover:bg-gray-50 transition"
                  aria-expanded={dropdownOpen}
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-navy text-white">
                    <UserCircle2 size={16} />
                  </div>
                  <Text as="span" size="sm" weight="medium" className="text-gray-700 max-w-[100px] truncate">
                    {user.name || 'User'}
                  </Text>
                  <ChevronDown size={14} className="text-gray-400" />
                </Button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2 border-b border-gray-100">
                      <Text as="p" size="xs" weight="medium" tone="muted" className="px-3 py-1 uppercase tracking-wider">Navigation</Text>
                      <Link href="/user/userDashboard" className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                        <LayoutDashboard size={16} className="text-gray-400 group-hover:text-navy" /> Dashboard
                      </Link>
                      <Link href="/user/userReports" className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                        <FileText size={16} className="text-gray-400 group-hover:text-navy" /> My Reports
                      </Link>
                      <Link href="/user/saved" className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                        <Bookmark size={16} className="text-gray-400 group-hover:text-navy" /> Saved Resources
                      </Link>
                    </div>
                    <div className="p-2 border-b border-gray-100">
                      <Text as="p" size="xs" weight="medium" tone="muted" className="px-3 py-1 uppercase tracking-wider">Account</Text>
                      <Link href="/user/change-password" className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy">
                        <Lock size={16} className="text-gray-400 group-hover:text-navy" /> Password Change
                      </Link>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="unstyled"
                        onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                        className="group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="text-red-500" /> Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-navy/20 px-4 text-[15px] font-semibold text-navy transition hover:bg-navy-light"
            >
              <LogIn size={15} />
              Sign In
            </Link>
          )}

          {!isUserSection && (
            <Link
              href="/report"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-navy px-5 text-[15px] font-semibold text-white shadow-sm shadow-navy/25 transition hover:bg-navy-dark"
            >
              <Flag size={16} />
              Report Incident
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <Link
              href="/user/notifications"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Bell size={20} />
            </Link>
          )}
          <Button
            variant="unstyled"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                {/* User identity */}
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-navy-light/30 p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
                    <UserCircle2 size={20} />
                  </div>
                  <div>
                    <Text size="sm" weight="semibold" tone="navy">{user.name}</Text>
                    <Text size="xs" tone="muted">Authenticated User</Text>
                  </div>
                </div>

                {/* Dashboard links — not on bottom nav */}
                <Text as="p" size="xs" weight="semibold" tone="muted" className="px-3 py-1 uppercase tracking-wider">Quick Access</Text>
                <Link href="/user/userReports" className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                  <FileText size={18} className="text-gray-400" /> My Reports
                </Link>
                <Link href="/user/saved" className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                  <Bookmark size={18} className="text-gray-400" /> Saved Resources
                </Link>
                <Link href="/about" className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                  <BookText size={18} className="text-gray-400" /> About
                </Link>
                <Link href="/help" className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                  <HelpCircle size={18} className="text-gray-400" /> Help
                </Link>

                <div className="my-2 h-px bg-gray-100" />
                <Text as="p" size="xs" weight="semibold" tone="muted" className="px-3 py-1 uppercase tracking-wider">Account</Text>
                <Link href="/user/change-password" className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                  <Lock size={18} className="text-gray-400" /> Password Change
                </Link>
                <Button
                  variant="unstyled"
                  onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} /> Sign Out
                </Button>
              </>
            ) : (
              <>
                {/* Unauthenticated: show nav links + sign in */}
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-md border border-navy px-4 py-2 text-base font-semibold text-navy"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
