import Link from 'next/link'
import { BellRing, Clock3 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Button } from '@/src/components/atoms/button'
import { requireAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import {
  clearNotificationDismissed,
  clearNotificationReads,
  dismissNotification,
  getNotificationDismissedIds,
  getNotificationReadIds,
  getNotificationState,
  upsertNotificationState,
} from '@/src/lib/notification-state'

type PageProps = {
  searchParams: Promise<{ tab?: string; page?: string }>
}

function formatRelativeTime(value: Date) {
  const at = value.getTime()
  const now = Date.now()
  const deltaMinutes = Math.max(1, Math.floor((now - at) / (1000 * 60)))

  if (deltaMinutes < 60) return `${deltaMinutes} min ago`
  const deltaHours = Math.floor(deltaMinutes / 60)
  if (deltaHours < 24) return `${deltaHours} hour${deltaHours === 1 ? '' : 's'} ago`
  const deltaDays = Math.floor(deltaHours / 24)
  if (deltaDays === 1) return 'Yesterday'
  return `${deltaDays} days ago`
}

export default async function AdminNotificationsPage({ searchParams }: PageProps) {
  const session = await requireAdmin()

  const params = await searchParams
  const activeTab = params.tab === 'unread' ? 'unread' : 'all'
  const pageNumber = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
  const pageSize = 10

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      code: true,
      type: true,
      createdAt: true,
      status: true,
    },
  })

  const notificationState = await getNotificationState(session.user.id, 'ADMIN')

  const cutoffMs = notificationState?.clearedAt?.getTime() ?? 0

  const withNotificationId = reports.map((report) => ({
    ...report,
    notificationId: `report:${report.id}`,
  }))

  const readIds = await getNotificationReadIds(
    session.user.id,
    'ADMIN',
    withNotificationId.map((item) => item.notificationId),
  )
  const dismissedIds = await getNotificationDismissedIds(
    session.user.id,
    'ADMIN',
    withNotificationId.map((item) => item.notificationId),
  )

  const notifications = withNotificationId.map((report) => ({
    ...report,
    unread: report.createdAt.getTime() > cutoffMs && !readIds.has(report.notificationId),
  }))

  const visibleNotifications = notifications.filter(
    (item) => item.createdAt.getTime() > cutoffMs && !dismissedIds.has(item.notificationId),
  )

  const unreadCount = visibleNotifications.filter((item) => item.unread).length
  const filteredNotifications = activeTab === 'unread'
    ? visibleNotifications.filter((item) => item.unread)
    : visibleNotifications
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize))
  const currentPage = Math.min(pageNumber, totalPages)
  const start = (currentPage - 1) * pageSize
  const paginatedNotifications = filteredNotifications.slice(start, start + pageSize)

  async function clearAllNotifications() {
    'use server'

    const actionSession = await requireAdmin()

    const now = new Date()
    await clearNotificationReads(actionSession.user.id, 'ADMIN')
    await clearNotificationDismissed(actionSession.user.id, 'ADMIN')
    await upsertNotificationState(actionSession.user.id, 'ADMIN', {
      lastSeenAt: now,
      clearedAt: now,
    })

    revalidatePath('/admin/notifications')
    revalidatePath('/admin')
  }

  async function clearSingleNotification(formData: FormData) {
    'use server'

    const actionSession = await requireAdmin()

    const notificationId = String(formData.get('notificationId') ?? '').trim()
    if (!notificationId) {
      return
    }

    await dismissNotification(actionSession.user.id, 'ADMIN', notificationId)
    await upsertNotificationState(actionSession.user.id, 'ADMIN', { lastSeenAt: new Date() })

    revalidatePath('/admin/notifications')
    revalidatePath('/admin')
  }

  return (
    <AdminLayout title="Notifications" unreadNotificationsCount={unreadCount}>
      <section className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/notifications?tab=all&page=1"
              className={`rounded-xl px-3 py-2.5 text-center text-base font-semibold transition ${
                activeTab === 'all' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              href="/admin/notifications?tab=unread&page=1"
              className={`rounded-xl px-3 py-2.5 text-center text-base font-semibold transition ${
                activeTab === 'unread' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </Link>
          </div>
        </div>

        <div className="flex justify-end">
          <form action={clearAllNotifications}>
            <Button type="submit" variant="outline" size="sm">Clear All</Button>
          </form>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-navy">
              <BellRing size={18} />
              <p className="text-base font-semibold">New Report Submissions</p>
            </div>
            <span className="rounded-full bg-navy-light px-3 py-1 text-sm font-semibold text-navy">{unreadCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          {paginatedNotifications.map((report) => (
            <article key={report.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${report.unread ? 'border-navy/20' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">New report submitted: {report.code}</p>
                  <p className="mt-1 text-base text-gray-800">Category: {report.type}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-700">
                    <Clock3 size={13} />
                    <span>{formatRelativeTime(report.createdAt)}</span>
                  </div>
                  <form action={clearSingleNotification} className="mt-3">
                    <input type="hidden" name="notificationId" value={report.notificationId} />
                    <Button type="submit" size="sm" variant="outline">Clear</Button>
                  </form>
                </div>
                <Link
                  href={`/admin/reports/${encodeURIComponent(report.code)}`}
                  className="text-sm font-semibold text-navy hover:text-navy-dark"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}

          {filteredNotifications.length === 0 ? (
            <article className="rounded-2xl border border-gray-100 bg-white p-4 text-center text-sm text-gray-600 shadow-sm">
              No report notifications yet.
            </article>
          ) : null}
        </div>

        {filteredNotifications.length > 0 ? (
          <section className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3.5 text-base shadow-sm">
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/notifications?tab=${activeTab}&page=${Math.max(1, currentPage - 1)}`}
                className={`rounded-lg px-3 py-2 font-semibold ${
                  currentPage === 1 ? 'pointer-events-none bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prev
              </Link>
              <Link
                href={`/admin/notifications?tab=${activeTab}&page=${Math.min(totalPages, currentPage + 1)}`}
                className={`rounded-lg px-3 py-2 font-semibold ${
                  currentPage === totalPages ? 'pointer-events-none bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
              </Link>
            </div>
          </section>
        ) : null}
      </section>
    </AdminLayout>
  )
}
