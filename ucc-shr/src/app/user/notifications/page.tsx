import Link from 'next/link'
import { ArrowLeft, Bell, CheckCircle2, Clock3 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser, parseReportNotes } from '@/src/lib/auth/report-access'
import { Button } from '@/src/components/atoms/button'
import { PublicLayout } from '@/src/components/templates/public-layout'
import {
  clearNotificationDismissed,
  clearNotificationReads,
  dismissNotification,
  getNotificationDismissedIds,
  getNotificationReadIds,
  getNotificationState,
  upsertNotificationState,
} from '@/src/lib/notification-state'

type NotificationItem = {
  id: string
  notificationId: string
  title: string
  message: string
  time: string
  unread: boolean
  atMs: number
}

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>
}

function formatRelativeTime(value: string) {
  const at = new Date(value).getTime()
  const now = Date.now()
  const deltaMinutes = Math.max(1, Math.floor((now - at) / (1000 * 60)))

  if (deltaMinutes < 60) return `${deltaMinutes} min ago`
  const deltaHours = Math.floor(deltaMinutes / 60)
  if (deltaHours < 24) return `${deltaHours} hour${deltaHours === 1 ? '' : 's'} ago`
  const deltaDays = Math.floor(deltaHours / 24)
  if (deltaDays === 1) return 'Yesterday'
  return `${deltaDays} days ago`
}

export default async function UserNotificationsPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  await searchParams

  const notificationState = await getNotificationState(session.user.id, 'USER')
  const openedAt = new Date()
  await upsertNotificationState(session.user.id, 'USER', { lastSeenAt: openedAt })

  const cutoffMs = Math.max(
    notificationState?.lastSeenAt?.getTime() ?? 0,
    notificationState?.clearedAt?.getTime() ?? 0,
    openedAt.getTime(),
  )

  const reports = await prisma.report.findMany({
    select: {
      code: true,
      notes: true,
    },
  })

  const notifications: NotificationItem[] = []

  for (const report of reports) {
    if (!belongsToUser(report.notes, session.user.id, session.user.email ?? null)) {
      continue
    }

    const notes = parseReportNotes(report.notes)
    const updates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []

    for (const update of updates) {
      const atMs = new Date(update.at).getTime()

      notifications.push({
        id: update.id,
        notificationId: update.id,
        title: `Report ${report.code} updated`,
        message: update.message,
        time: formatRelativeTime(update.at),
        unread: false,
        atMs,
      })
    }
  }

  const readIds = await getNotificationReadIds(
    session.user.id,
    'USER',
    notifications.map((item) => item.notificationId),
  )
  const dismissedIds = await getNotificationDismissedIds(
    session.user.id,
    'USER',
    notifications.map((item) => item.notificationId),
  )

  for (const item of notifications) {
    item.unread = item.atMs > cutoffMs && !readIds.has(item.notificationId)
  }

  notifications.sort((a, b) => b.atMs - a.atMs)

  const visibleNotifications = notifications.filter(
    (item) => item.atMs > (notificationState?.clearedAt?.getTime() ?? 0) && !dismissedIds.has(item.notificationId),
  )

  const unreadCount = visibleNotifications.filter((item) => item.unread).length

  const filteredNotifications = visibleNotifications

  async function clearAllNotifications() {
    'use server'

    const actionSession = await auth()
    if (!actionSession?.user) {
      redirect('/login')
    }

    const now = new Date()
    await clearNotificationReads(actionSession.user.id, 'USER')
    await clearNotificationDismissed(actionSession.user.id, 'USER')
    await upsertNotificationState(actionSession.user.id, 'USER', {
      lastSeenAt: now,
      clearedAt: now,
    })

    revalidatePath('/user/notifications')
    revalidatePath('/user/userDashboard')
  }

  async function clearSingleNotification(formData: FormData) {
    'use server'

    const actionSession = await auth()
    if (!actionSession?.user) {
      redirect('/login')
    }

    const notificationId = String(formData.get('notificationId') ?? '').trim()
    if (!notificationId) {
      return
    }

    await dismissNotification(actionSession.user.id, 'USER', notificationId)
    await upsertNotificationState(actionSession.user.id, 'USER', { lastSeenAt: new Date() })

    revalidatePath('/user/notifications')
    revalidatePath('/user/userDashboard')
  }

  return (
    <PublicLayout>
      <div className="font-sans">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/user/userDashboard"
            aria-label="Go back to dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-navy">Notifications</h1>
            <p className="text-xs text-gray-500">Updates on your reports</p>
          </div>
          {unreadCount > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
          <form action={clearAllNotifications}>
            <Button type="submit" variant="outline" size="sm">Clear All</Button>
          </form>
        </div>
        <section aria-label="Notifications list" className="space-y-3">
          {filteredNotifications.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border p-4 shadow-sm transition-colors ${
                item.unread 
                  ? 'border-navy/20 bg-blue-50/50' 
                  : 'border-gray-100 bg-white opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-light text-navy">
                  {item.unread ? <Bell size={16} /> : <CheckCircle2 size={16} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm font-semibold ${item.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.title}
                    </p>
                    {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
                  </div>
                  <p className={`mt-1 text-sm ${item.unread ? 'text-gray-700' : 'text-gray-500'}`}>
                    {item.message}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Clock3 size={13} />
                    <span>{item.time}</span>
                  </div>
                  <form action={clearSingleNotification} className="mt-3">
                    <input type="hidden" name="notificationId" value={item.notificationId} />
                    <Button type="submit" size="sm" variant="outline">Clear</Button>
                  </form>
                </div>
              </div>
            </article>
          ))}

          {filteredNotifications.length === 0 ? (
            <article className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-full bg-navy-light text-navy">
                <Bell size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-900">No notifications</p>
              <p className="mt-1 text-xs text-gray-500">You will see updates here when admin updates your reports.</p>
            </article>
          ) : null}
        </section>
      </div>
    </PublicLayout>
  )
}
