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
export function NotificationPoller({ intervalMs = 10_000, isLoggedIn }: NotificationPollerProps) {
  const router = useRouter()
  const pathname = usePathname()

  const poll = useCallback(async () => {
    // Skip polling when not logged in or on unauthenticated public auth pages
    if (!isLoggedIn) return
    if (
      pathname === '/login' ||
      pathname === '/signup' ||
      pathname === '/admin/login' ||
      pathname === '/forgot-password'
    ) return

    try {
      const res = await fetch('/api/user/notifications/count', { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as {
        unreadCount: number
        unreadReportsCount?: number
        unreadMessagesCount?: number
      }

      // Store combined count signature in sessionStorage to detect any change
      const prevKey = 'cegrad_notif_count_state'
      const prev = sessionStorage.getItem(prevKey)
      const next = `${data.unreadCount}:${data.unreadReportsCount ?? 0}:${data.unreadMessagesCount ?? 0}`

      if (prev !== null && prev !== next) {
        // Unread state changed — refresh server components immediately
        router.refresh()
      }

      sessionStorage.setItem(prevKey, next)
    } catch {
      // Network errors are silent
    }
  }, [isLoggedIn, pathname, router])

  useEffect(() => {
    if (!isLoggedIn) return

    // Poll immediately on mount
    poll()

    // Poll periodically
    const id = setInterval(poll, intervalMs)

    // Poll immediately when user focuses back to the window
    const handleFocus = () => {
      poll()
    }
    window.addEventListener('focus', handleFocus)

    // Listen for Service Worker push broadcasts
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PUSH_NOTIFICATION_RECEIVED') {
        poll()
        router.refresh()
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage)
    }

    return () => {
      clearInterval(id)
      window.removeEventListener('focus', handleFocus)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage)
      }
    }
  }, [poll, isLoggedIn, intervalMs, router])

  return null
}
