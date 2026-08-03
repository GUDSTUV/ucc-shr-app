import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { isAdminRole, isCaseOfficerRole } from '@/src/lib/auth/roles'
import { getAdminNotifications, getUserNotifications } from '@/src/lib/notification-service'

/**
 * GET /api/user/notifications/count
 * Returns live unread counts for both Users and Administrators.
 * Used by the client-side poller to keep badges updated in real-time without page reload.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ unreadCount: 0, unreadReportsCount: 0, unreadMessagesCount: 0 }, { status: 200 })
  }

  const role = session.user.role ?? ''

  try {
    if (isAdminRole(role) || isCaseOfficerRole(role)) {
      const { unreadReportsCount, unreadMessagesCount } = await getAdminNotifications(session.user.id, role)
      return NextResponse.json({
        unreadCount: unreadReportsCount + unreadMessagesCount,
        unreadReportsCount,
        unreadMessagesCount,
      }, { status: 200 })
    }

    const { unreadCount } = await getUserNotifications(session.user.id, session.user.email ?? null)
    return NextResponse.json({
      unreadCount,
      unreadReportsCount: unreadCount,
      unreadMessagesCount: 0,
    }, { status: 200 })
  } catch (error) {
    console.error('[NOTIFICATIONS_COUNT_ERROR]', error)
    return NextResponse.json({ unreadCount: 0, unreadReportsCount: 0, unreadMessagesCount: 0 }, { status: 200 })
  }
}
