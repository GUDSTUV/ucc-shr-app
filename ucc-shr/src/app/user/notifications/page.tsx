import Link from 'next/link'
import { ArrowLeft, Bell, BellRing, CheckCircle2, Clock3 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser, parseReportNotes } from '@/src/lib/auth/report-access'

type NotificationItem = {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  atMs: number
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

export default async function UserNotificationsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

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
        title: `Report ${report.code} updated`,
        message: update.message,
        time: formatRelativeTime(update.at),
        unread: Date.now() - atMs < 1000 * 60 * 60 * 24,
        atMs,
      })
    }
  }

  notifications.sort((a, b) => b.atMs - a.atMs)

  const unreadCount = notifications.filter((item) => item.unread).length

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 font-sans text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link
            href="/user/userDashboard"
            aria-label="Go back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-navy sm:text-xl">Notifications</h1>
            <p className="text-xs text-gray-500">Stay updated on your reports</p>
          </div>
          <span className="inline-flex w-10" aria-hidden="true" />
        </div>
      </header>

      <main className="space-y-4 px-4 pt-5">
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-navy">
              <BellRing size={18} />
              <p className="text-sm font-semibold">Unread Alerts</p>
            </div>
            <span className="rounded-full bg-navy-light px-3 py-1 text-xs font-semibold text-navy">
              {unreadCount}
            </span>
          </div>
        </section>

        <section className="space-y-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${
                item.unread ? 'border-navy/20' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-light text-navy">
                  {item.unread ? <Bell size={16} /> : <CheckCircle2 size={16} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-red" /> : null}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Clock3 size={13} />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {notifications.length === 0 ? (
            <article className="rounded-2xl border border-gray-100 bg-white p-4 text-center text-sm text-gray-600 shadow-sm">
              No notifications yet. You will see updates here when admin updates your reports.
            </article>
          ) : null}
        </section>
      </main>
    </div>
  )
}
