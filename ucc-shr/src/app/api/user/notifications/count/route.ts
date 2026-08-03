import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { isAdminRole } from '@/src/lib/auth/roles'

/**
 * GET /api/user/notifications/count
 * Returns the unread notification count for the currently logged-in user.
 * Used by the client-side polling component to keep the bell badge live.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ unreadCount: 0 }, { status: 200 })
  }

  // Admins use a different notification system; skip polling for them
  if (isAdminRole(session.user.role)) {
    return NextResponse.json({ unreadCount: 0 }, { status: 200 })
  }

  try {
    const { getUserNotifications } = await import('@/src/lib/notification-service')
    const { unreadCount } = await getUserNotifications(session.user.id, session.user.email ?? null)
    return NextResponse.json({ unreadCount }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch notification count:', error)
    return NextResponse.json({ unreadCount: 0 }, { status: 200 })
  }
}
