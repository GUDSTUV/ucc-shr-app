import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BellRing, Clock3 } from 'lucide-react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

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

export default async function AdminNotificationsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      code: true,
      type: true,
      createdAt: true,
      status: true,
    },
  })

  const unreadCount = reports.filter((item) => Date.now() - item.createdAt.getTime() < 1000 * 60 * 60 * 24).length

  return (
    <AdminLayout title="Notifications">
      <section className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-navy">
              <BellRing size={18} />
              <p className="text-sm font-semibold">New Report Submissions</p>
            </div>
            <span className="rounded-full bg-navy-light px-3 py-1 text-xs font-semibold text-navy">{unreadCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">New report submitted: {report.code}</p>
                  <p className="mt-1 text-sm text-gray-600">Category: {report.type}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Clock3 size={13} />
                    <span>{formatRelativeTime(report.createdAt)}</span>
                  </div>
                </div>
                <Link
                  href={`/admin/reports/${encodeURIComponent(report.code)}`}
                  className="text-xs font-semibold text-navy hover:text-navy-dark"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}

          {reports.length === 0 ? (
            <article className="rounded-2xl border border-gray-100 bg-white p-4 text-center text-sm text-gray-600 shadow-sm">
              No report notifications yet.
            </article>
          ) : null}
        </div>
      </section>
    </AdminLayout>
  )
}
