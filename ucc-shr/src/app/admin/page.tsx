import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'
import { getNotificationReadIds, getNotificationState } from '@/src/lib/notification-state'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { RecentReportFilters } from './recent-report-filters'
import { RecentReportsTable } from './recent-reports-table'
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileWarning,
  Plus,
} from 'lucide-react'

type PageProps = {
  searchParams?: Promise<{
    recentQ?: string
    recentStatus?: string
    recentAssigned?: string
    recentSort?: string
  }>
}

const ALLOWED_RECENT_STATUSES = new Set(['RECEIVED', 'REVIEWING', 'REFERRED', 'RESOLVED', 'CLOSED'])
const ALLOWED_RECENT_ASSIGNED = new Set(['assigned', 'unassigned'])

function formatSubmittedAt(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function statusMeta(status: 'RECEIVED' | 'REVIEWING' | 'REFERRED' | 'RESOLVED' | 'CLOSED') {
  if (status === 'REVIEWING') return { label: 'Reviewing', variant: 'warning' as const }
  if (status === 'REFERRED') return { label: 'Referred', variant: 'navy' as const }
  if (status === 'RESOLVED') return { label: 'Resolved', variant: 'success' as const }
  if (status === 'CLOSED') return { label: 'Closed', variant: 'gray' as const }
  return { label: 'Received', variant: 'navy' as const }
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await requireSuperAdmin()

  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [
    reportStatusCounts,
    recentReportsRaw,
    reportTypeCounts,
    lastSixMonthsReports,
    resolvedForSla,
    notificationState,
  ] = await Promise.all([
    prisma.report.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: {
        id: true,
        code: true,
        createdAt: true,
        status: true,
        type: true,
        notes: true,
      },
    }),
    prisma.report.groupBy({ by: ['type'], _count: { type: true } }),
    prisma.report.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.report.findMany({
      where: { status: { in: ['RESOLVED', 'CLOSED'] } },
      select: { createdAt: true, updatedAt: true },
    }),
    getNotificationState(session.user.id, 'ADMIN'),
  ])

  const statusCountMap = reportStatusCounts.reduce<Record<'RECEIVED' | 'REVIEWING' | 'REFERRED' | 'RESOLVED' | 'CLOSED', number>>(
    (acc, row) => {
      acc[row.status] = row._count.status
      return acc
    },
    {
      RECEIVED: 0,
      REVIEWING: 0,
      REFERRED: 0,
      RESOLVED: 0,
      CLOSED: 0,
    },
  )

  const totalReports = Object.values(statusCountMap).reduce((sum, count) => sum + count, 0)
  const activeCases = statusCountMap.RECEIVED + statusCountMap.REVIEWING + statusCountMap.REFERRED
  const resolvedCases = statusCountMap.RESOLVED + statusCountMap.CLOSED

  const adminNotificationCutoffMs = notificationState?.clearedAt?.getTime() ?? 0
  const recentNotificationIds = recentReportsRaw.map((report) => `report:${report.id}`)
  const recentReadIds = await getNotificationReadIds(session.user.id, 'ADMIN', recentNotificationIds)
  const newReportsCount = recentReportsRaw.filter((report) => {
    const isAfterCutoff = report.createdAt.getTime() > adminNotificationCutoffMs
    const isRead = recentReadIds.has(`report:${report.id}`)
    return isAfterCutoff && !isRead
  }).length

  const avgResponseHours = resolvedForSla.length
    ? Math.round(
        (resolvedForSla.reduce((sum, report) => {
          const diffMs = report.updatedAt.getTime() - report.createdAt.getTime()
          return sum + diffMs / (1000 * 60 * 60)
        }, 0) /
          resolvedForSla.length) *
          10
      ) / 10
    : 0

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthCount = lastSixMonthsReports.filter(
    (report) => report.createdAt >= previousMonthStart && report.createdAt < currentMonthStart
  ).length
  const currentMonthCount = lastSixMonthsReports.filter((report) => report.createdAt >= currentMonthStart).length

  const trendDiff = currentMonthCount - previousMonthCount
  const trendPercent =
    previousMonthCount > 0 ? Math.round((trendDiff / previousMonthCount) * 1000) / 10 : currentMonthCount > 0 ? 100 : 0

  const monthBuckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    return {
      key,
      label: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      count: 0,
    }
  })

  for (const report of lastSixMonthsReports) {
    const key = `${report.createdAt.getFullYear()}-${report.createdAt.getMonth()}`
    const bucket = monthBuckets.find((item) => item.key === key)
    if (bucket) bucket.count += 1
  }

  const maxBucketCount = Math.max(...monthBuckets.map((item) => item.count), 1)
  const trendBars = monthBuckets.map((item) => ({
    ...item,
    height: Math.max(12, Math.round((item.count / maxBucketCount) * 100)),
  }))

  const typeCounts = reportTypeCounts.reduce<Record<string, number>>((acc, row) => {
    const key = row.type || 'Other'
    acc[key] = (acc[key] || 0) + row._count.type
    return acc
  }, {})

  const sortedTypeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
  const topTypeEntries = sortedTypeEntries.slice(0, 3)
  const otherCount = sortedTypeEntries.slice(3).reduce((sum, [, count]) => sum + count, 0)
  const categorySource = otherCount > 0 ? [...topTypeEntries, ['Other Types', otherCount] as const] : topTypeEntries

  const categoryData = categorySource.map(([label, count]) => ({
    label,
    percent: totalReports > 0 ? Math.round((count / totalReports) * 100) : 0,
  }))

  const statCards = [
    {
      label: 'Total Reports',
      value: totalReports.toLocaleString(),
      trend: `${trendDiff >= 0 ? '+' : ''}${trendPercent}%`,
      trendVariant: trendDiff >= 0 ? ('success' as const) : ('red' as const),
      icon: <ClipboardList size={18} />,
      iconClass: 'bg-navy-light text-navy',
    },
    {
      label: 'Active Cases',
      value: activeCases.toLocaleString(),
      trend: `${activeCases} pending`,
      trendVariant: 'warning' as const,
      icon: <FileWarning size={18} />,
      iconClass: 'bg-red-light text-red',
    },
    {
      label: 'Resolved Cases',
      value: resolvedCases.toLocaleString(),
      trend: totalReports > 0 ? `${Math.round((resolvedCases / totalReports) * 100)}% rate` : '0% rate',
      trendVariant: 'success' as const,
      icon: <CheckCircle2 size={18} />,
      iconClass: 'bg-[#E8F5EE] text-[#1A6B50]',
    },
    {
      label: 'Avg. Response Time',
      value: `${avgResponseHours.toFixed(1)} hrs`,
      trend: resolvedForSla.length ? `${resolvedForSla.length} closed cases` : 'No closed cases yet',
      trendVariant: 'navy' as const,
      icon: <Clock3 size={18} />,
      iconClass: 'bg-navy-light text-navy',
    },
  ]

  const recentReports = recentReportsRaw.map((report) => {
    const meta = statusMeta(report.status)
    const notes = parseReportNotes(report.notes)
    const counsellor = notes.counsellorName || notes.investigatorName || 'Pending Assignment'
    return {
      id: report.code,
      status: report.status,
      submittedAt: formatSubmittedAt(report.createdAt),
      statusLabel: meta.label,
      statusVariant: meta.variant,
      category: report.type,
      counsellor,
      counsellorAssigned: Boolean(notes.counsellorName || notes.investigatorName),
    }
  })

  const unassignedCount = recentReports.filter((report) => !report.counsellorAssigned).length
  const reviewingCount = recentReportsRaw.filter((report) => report.status === 'REVIEWING').length
  const receivedCount = recentReportsRaw.filter((report) => report.status === 'RECEIVED').length

  const params = (await searchParams) ?? {}
  const recentQ = (params.recentQ ?? '').trim().slice(0, 80)
  const recentStatusRaw = (params.recentStatus ?? '').trim().toUpperCase()
  const recentAssignedRaw = (params.recentAssigned ?? '').trim().toLowerCase()
  const recentSortRaw = (params.recentSort ?? '').trim().toLowerCase()

  const recentStatusFilter = ALLOWED_RECENT_STATUSES.has(recentStatusRaw) ? recentStatusRaw : ''
  const recentAssignedFilter = ALLOWED_RECENT_ASSIGNED.has(recentAssignedRaw) ? recentAssignedRaw : ''

  const filteredRecentReports = recentReports.filter((report) => {
    if (recentStatusFilter && report.status !== recentStatusFilter) return false
    if (recentAssignedFilter === 'assigned' && !report.counsellorAssigned) return false
    if (recentAssignedFilter === 'unassigned' && report.counsellorAssigned) return false

    if (!recentQ) return true

    const searchable = `${report.id} ${report.statusLabel} ${report.category} ${report.counsellor}`.toLowerCase()
    return searchable.includes(recentQ.toLowerCase())
  })

  // Parse sort parameter
  const sortedRecentReports = [...filteredRecentReports]
  if (recentSortRaw) {
    const [sortColumn, sortDirection] = recentSortRaw.split(':')
    const isAsc = sortDirection === 'asc'

    sortedRecentReports.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      if (sortColumn === 'id') {
        aVal = a.id
        bVal = b.id
      } else if (sortColumn === 'status') {
        aVal = a.statusLabel
        bVal = b.statusLabel
      } else if (sortColumn === 'category') {
        aVal = a.category || ''
        bVal = b.category || ''
      } else if (sortColumn === 'counsellor') {
        aVal = a.counsellor
        bVal = b.counsellor
      } else if (sortColumn === 'submittedat') {
        aVal = a.submittedAt
        bVal = b.submittedAt
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return 0
    })
  }

  return (
    <AdminLayout
      title="Reporting Dashboard"
      description="Monitor institutional case activity, triage urgent reports, and keep response timelines on track."
      unreadNotificationsCount={newReportsCount}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/notifications">
            <Button variant="outline" size="sm" className="h-10 rounded-lg">
              <Bell size={16} /> Notifications
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button size="sm" className="h-10 rounded-lg">
              <Plus size={16} /> Open Cases
            </Button>
          </Link>
        </div>
      }
    >
      <section className="space-y-6">
        <section className="rounded-2xl border border-navy/15 bg-linear-to-r from-navy to-navy-dark p-5 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/85">Case Operations</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">Welcome, CEGRAD</h2>
          <p className="mt-2 max-w-3xl text-base text-white/90">
            You have {activeCases} active case{activeCases === 1 ? '' : 's'} and {newReportsCount} new notification{newReportsCount === 1 ? '' : 's'} requiring review.
          </p>


          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Link href="/admin/notifications?tab=unread&page=1" className="rounded-xl border border-white/25 bg-white/10 p-4 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold">Unread Reports and Alerts</p>
                <span className="rounded border border-white/35 bg-navy/50 px-2.5 py-1 text-xs font-semibold text-white">{newReportsCount} unread</span>
              </div>
              <p className="mt-2 text-sm text-white/85">Review incoming items that have not been acknowledged.</p>
            </Link>

            <Link href="/admin/reports?status=REVIEWING&sort=updated" className="rounded-xl border border-white/25 bg-white/10 p-4 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold">Reviewing Queue</p>
                <span className="rounded border border-white/35 bg-navy/50 px-2.5 py-1 text-xs font-semibold text-white">{reviewingCount} in review</span>
              </div>
              <p className="mt-2 text-sm text-white/85">Continue active investigations and update status quickly.</p>
            </Link>

            <Link href="/admin/reports?status=RECEIVED&sort=newest" className="rounded-xl border border-white/25 bg-white/10 p-4 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold">Newly Received Cases</p>
                <span className="rounded border border-white/35 bg-navy/50 px-2.5 py-1 text-xs font-semibold text-white">{receivedCount} received</span>
              </div>
              <p className="mt-2 text-sm text-white/85">Triage new submissions and assign first actions.</p>
            </Link>

            <Link href="/admin/reports?assigned=unassigned" className="rounded-xl border border-white/25 bg-white/10 p-4 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold">Unassigned Reports</p>
                <span className="rounded border border-white/35 bg-navy/50 px-2.5 py-1 text-xs font-semibold text-white">{unassignedCount} pending</span>
              </div>
              <p className="mt-2 text-sm text-white/85">Route reports to counsellors or investigators.</p>
            </Link>

            <Link href="/admin/reports?sort=updated" className="rounded-xl border border-white/25 bg-white/10 p-4 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:col-span-2 xl:col-span-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold">Recently Updated Cases</p>
                <ArrowRight size={16} className="text-white/85" />
              </div>
              <p className="mt-2 text-sm text-white/85">Check latest activity and follow-up progress.</p>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconClass}`}>
                  {card.icon}
                </span>
                <Badge variant={card.trendVariant}>{card.trend}</Badge>
              </div>

              <p className="text-sm font-medium text-gray-700">{card.label}</p>
              <p className="mt-1 text-[30px] font-semibold leading-none text-gray-900">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Reporting Trends</h2>
              <Badge variant="gray">Last 6 Months</Badge>
            </div>

            <div className="flex h-64 items-end gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4" role="img" aria-label="Monthly report volume for the last six months">
              {trendBars.map((bar, index) => (
                <div key={bar.key} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-xl ${index === trendBars.length - 1 ? 'bg-navy' : 'bg-navy/30'}`}
                    style={{ height: `${bar.height}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold tracking-wide text-gray-700">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Category Distribution</h2>
                <Link href="/admin/reports" className="text-sm font-semibold text-navy hover:text-navy-dark">
                  View
                </Link>
              </div>

              <div className="space-y-4">
                {categoryData.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-base">
                      <span className="text-gray-800">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100" aria-hidden="true">
                      <div className="h-full rounded-full bg-navy" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Incident Reports</h2>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <Badge variant="warning">{activeCases} active</Badge>
              <Badge variant="gray">{sortedRecentReports.length} shown</Badge>
              <Link href="/admin/reports" className="text-sm font-semibold text-navy hover:text-navy-dark">
                View full registry
              </Link>
            </div>
          </div>

          <RecentReportFilters />

          <RecentReportsTable reports={sortedRecentReports} />
        </section>
      </section>
    </AdminLayout>
  )
}
