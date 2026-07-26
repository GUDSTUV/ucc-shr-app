import Link from 'next/link'
import { MessageSquare, Clock3 } from 'lucide-react'
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
import { getAdminNotifications } from '@/src/lib/notification-service'

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

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const session = await requireAdmin()

  const { messages, unreadMessagesCount } = await getAdminNotifications(session.user.id, session.user.role)

  const params = await searchParams
  const activeTab = params.tab === 'unread' ? 'unread' : 'all'
  const pageNumber = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)
  const pageSize = 10

  const filteredNotifications = activeTab === 'unread'
    ? messages.filter((item) => item.unread)
    : messages
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize))
  const currentPage = Math.min(pageNumber, totalPages)
  const start = (currentPage - 1) * pageSize
  const paginatedNotifications = filteredNotifications.slice(start, start + pageSize)

  async function clearSingleNotification(formData: FormData) {
    'use server'

    const actionSession = await requireAdmin()

    const notificationId = String(formData.get('notificationId') ?? '').trim()
    if (!notificationId) {
      return
    }

    await dismissNotification(actionSession.user.id, 'ADMIN', notificationId)

    revalidatePath('/admin/messages')
    revalidatePath('/admin')
  }

  return (
    <AdminLayout title="Messages">
      <section className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/messages?tab=all&page=1"
              className={`rounded-xl px-3 py-2.5 text-center text-base font-semibold transition ${
                activeTab === 'all' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              href="/admin/messages?tab=unread&page=1"
              className={`rounded-xl px-3 py-2.5 text-center text-base font-semibold transition ${
                activeTab === 'unread' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-navy">
              <MessageSquare size={18} />
              <p className="text-base font-semibold">Message Timeline</p>
            </div>
            <span className="rounded-full bg-navy-light px-3 py-1 text-sm font-semibold text-navy">{unreadMessagesCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          {paginatedNotifications.map((item) => (
            <article key={item.notificationId} className={`rounded-2xl border bg-white p-5 shadow-sm ${item.unread ? 'border-navy/20 bg-blue-50/10' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-base text-gray-800">{item.message}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-700">
                    <Clock3 size={13} />
                    <span>{formatRelativeTime(item.time)}</span>
                  </div>
                  <form action={clearSingleNotification} className="mt-3">
                    <input type="hidden" name="notificationId" value={item.notificationId} />
                    <Button type="submit" size="sm" variant="outline">Clear</Button>
                  </form>
                </div>
                <Link
                  href={item.link}
                  className="text-sm font-semibold text-navy hover:text-navy-dark shrink-0"
                >
                  View Chat
                </Link>
              </div>
            </article>
          ))}

          {filteredNotifications.length === 0 ? (
            <article className="rounded-2xl border border-gray-100 bg-white p-4 text-center text-sm text-gray-600 shadow-sm">
              No chat messages yet.
            </article>
          ) : null}
        </div>

        {filteredNotifications.length > 0 ? (
          <section className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3.5 text-base shadow-sm">
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/messages?tab=${activeTab}&page=${Math.max(1, currentPage - 1)}`}
                className={`rounded-lg px-3 py-2 font-semibold ${
                  currentPage === 1 ? 'pointer-events-none bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prev
              </Link>
              <Link
                href={`/admin/messages?tab=${activeTab}&page=${Math.min(totalPages, currentPage + 1)}`}
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
