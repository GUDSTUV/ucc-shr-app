'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface NotificationPollerProps {
  /** Poll interval in milliseconds. Default: 30 seconds */
  intervalMs?: number
  /** Only poll when user is logged in */
  isLoggedIn: boolean
}

/**
 * NotificationPoller
 * A headless client component that polls /api/user/notifications/count
 * every `intervalMs` milliseconds and calls router.refresh() if the
 * unread count has changed — causing the server Navbar to re-render
 * with the updated badge without a full page reload.
 */
export function NotificationPoller({ intervalMs = 30_000, isLoggedIn }: NotificationPollerProps) {
  const router = useRouter()
  const pathname = usePathname()

  const poll = useCallback(async () => {
    // Skip polling when not logged in or on auth / admin pages
    if (!isLoggedIn) return
    if (
      pathname.startsWith('/admin') ||
      pathname === '/login' ||
      pathname === '/signup'
    ) return

    try {
      const res = await fetch('/api/user/notifications/count', { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as { unreadCount: number }

      // Store previous count in sessionStorage to detect changes
      const prevKey = 'cegrad_notif_count'
      const prev = sessionStorage.getItem(prevKey)
      const next = String(data.unreadCount)

      if (prev !== null && prev !== next) {
        // Count changed — refresh server components to update the badge
        router.refresh()
      }

      sessionStorage.setItem(prevKey, next)
    } catch {
      // Network errors are silent — not critical
    }
  }, [isLoggedIn, pathname, router])

  useEffect(() => {
    if (!isLoggedIn) return

    // Poll immediately on mount
    poll()

    const id = setInterval(poll, intervalMs)
    return () => clearInterval(id)
  }, [poll, isLoggedIn, intervalMs])

  // This component renders nothing — it is purely a side-effect component
  return null
}
