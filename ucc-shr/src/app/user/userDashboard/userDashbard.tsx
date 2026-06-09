import Link from 'next/link'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { Button } from '@/src/components/atoms/button'
import { Bookmark, FileText, Plus, MessageCircle, ShieldCheck } from 'lucide-react'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser, parseReportNotes } from '@/src/lib/auth/report-access'
import { getNotificationReadIds, getNotificationState } from '@/src/lib/notification-state'
import { StatusBadge } from '@/src/components/molecules/status-badge'

type UserDashboardProps = {
  userId: string
  name?: string
  email?: string
}

function QuickLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-navy/20 hover:shadow-sm"
    >
      <div className="grid h-10 w-10 shrink-0 place-content-center rounded-lg bg-navy-light text-navy">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-500">{subtitle}</p>
      </div>
    </Link>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export default async function UserDashbard({
  userId,
  name = 'User',
  email = 'user@ucc.edu.gh',
}: UserDashboardProps) {
  const [reportsRaw, notificationState] = await Promise.all([
    prisma.report.findMany({
      select: {
        id: true,
        code: true,
        type: true,
        status: true,
        createdAt: true,
        notes: true,
        Message: {
          select: {
            id: true,
            senderId: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    getNotificationState(userId, 'USER'),
  ])

  const cutoffMs = Math.max(
    notificationState?.lastSeenAt?.getTime() ?? 0,
    notificationState?.clearedAt?.getTime() ?? 0,
  )

  const userReports = reportsRaw.filter(r => belongsToUser(r.notes, userId, email ?? null))
  const activeReports = userReports.filter(r => ['RECEIVED', 'REVIEWING', 'REFERRED'].includes(r.status))
  const latestActiveReport = activeReports[0]

  // Calculate unread admin updates (notifications)
  const userNotificationIds: string[] = []
  for (const report of userReports) {
    const notes = parseReportNotes(report.notes)
    const updates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
    userNotificationIds.push(...updates.map((update) => update.id))
  }

  const readIds = await getNotificationReadIds(userId, 'USER', userNotificationIds)

  let unreadNotificationCount = 0
  for (const report of userReports) {
    const notes = parseReportNotes(report.notes)
    const updates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
    unreadNotificationCount += updates.filter((update) => {
      const isAfterCutoff = new Date(update.at).getTime() > cutoffMs
      return isAfterCutoff && !readIds.has(update.id)
    }).length
  }

  // Calculate unread chat messages for the latest report (if any)
  let hasUnreadMessages = false
  if (latestActiveReport) {
    const counsellorMessages = latestActiveReport.Message.filter(m => m.senderId !== userId)
    hasUnreadMessages = counsellorMessages.some(m => new Date(m.createdAt).getTime() > cutoffMs)
  }

  return (
    <PublicLayout>
      <div className="font-sans">

        {/* Welcome Greeting */}
        <section className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            Welcome back, <span className="text-navy">{name}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your reports.
          </p>
        </section>

        {/* Active Case Summary Widget */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Current Case Status
          </h2>
          {latestActiveReport ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={latestActiveReport.status as any} />
                    <span className="text-xs text-gray-400">
                      Submitted {formatDate(latestActiveReport.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy">
                    {latestActiveReport.type}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    A counsellor is currently assigned to your case. Open the secure chat to communicate directly.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="relative inline-block">
                    <Link href={`/user/userReports/${encodeURIComponent(latestActiveReport.code)}`}>
                      <Button variant="primary" className="h-11 w-full px-5 shadow-sm sm:w-auto">
                        <MessageCircle size={16} className="mr-1.5" />
                        Open Secure Chat
                      </Button>
                    </Link>
                    {hasUnreadMessages && (
                      <span className="absolute -right-1 -top-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No active cases</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                You currently do not have any open reports under investigation.
              </p>
            </div>
          )}
        </section>

        {/* Quick access */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Account &amp; Resources
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickLink
              href="/user/userReports"
              icon={<FileText size={18} />}
              title="My Reports"
              subtitle="View all past submissions"
            />
            <QuickLink
              href="/user/saved"
              icon={<Bookmark size={18} />}
              title="Saved Resources"
              subtitle="Articles and events"
            />
          </div>
        </section>

        {/* File New Report — always visible at the bottom */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Report an Incident
          </h2>
          <div className="rounded-2xl border border-navy/10 bg-navy-light p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <Plus className="h-6 w-6 text-navy" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              Need to report an incident?
            </h3>
            <p className="mx-auto mt-1 mb-4 max-w-sm text-sm text-gray-600">
              Your report is confidential. You can submit a new report at any time, even if you have an ongoing case.
            </p>
            <Link href="/report/new" className="inline-block">
              <Button variant="primary" className="h-10 px-6">
                <Plus size={16} className="mr-2" /> File a New Report
              </Button>
            </Link>
          </div>
        </section>

        <div className="mt-2">
          <AlertBox variant="info" title="Strict Confidentiality">
            Your dashboard is private and protected. Only you and authorized CEGRAD staff can access your case details.
          </AlertBox>
        </div>
      </div>
    </PublicLayout>
  )
}
