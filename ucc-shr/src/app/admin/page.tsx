import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import Link from 'next/link'
import MonthlyTrendsChart from '@/src/components/organisms/monthly-trends-chart.client'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'
import { getNotificationReadIds, getNotificationState } from '@/src/lib/notification-state'
import { requireAdmin } from '@/src/lib/auth/guards'
import { AdminReportFilters as RecentReportFilters } from '@/src/components/molecules/admin-report-filters/admin-report-filters'
import { AdminReportsTable as RecentReportsTable } from '@/src/components/organisms/admin-reports-table/admin-reports-table'
import { Bell, Plus, AlertCircle, ArrowRight } from 'lucide-react'
import { AdminStatCards } from '@/src/components/organisms/admin-stat-cards'
 
import { CategoryDistribution } from '@/src/components/organisms/category-distribution'

type PageProps = {
  searchParams?: Promise<{
    recentQ?: string
    recentStatus?: string
    recentAssigned?: string
    recentSort?: string
  }>
}

const ALLOWED_RECENT_STATUSES = new Set(['RECEIVED', 'UNDER_REVIEW', 'UNDER_INVESTIGATION', 'CLOSED', 'CLOSED'])
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

function statusMeta(status: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED') {
  if (status === 'UNDER_REVIEW') return { label: 'Reviewing', variant: 'warning' as const }
  if (status === 'UNDER_INVESTIGATION') return { label: 'Referred', variant: 'navy' as const }
  if (status === 'CLOSED') return { label: 'Closed', variant: 'success' as const }
  return { label: 'Received', variant: 'navy' as const }
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await requireAdmin()

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
      take: 5,
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
      where: { status: { in: ['CLOSED', 'CLOSED'] } },
      select: { createdAt: true, updatedAt: true },
    }),
    getNotificationState(session.user.id, 'ADMIN'),
  ])

  const statusCountMap = reportStatusCounts.reduce<Record<'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED', number>>(
    (acc, row) => {
      acc[row.status] = row._count.status
      return acc
    },
    {
      RECEIVED: 0,
      UNDER_REVIEW: 0,
      UNDER_INVESTIGATION: 0,
      CLOSED: 0,
    },
  )

  const totalReports = Object.values(statusCountMap).reduce((sum, count) => sum + count, 0)
  const activeCases = statusCountMap.RECEIVED + statusCountMap.UNDER_REVIEW + statusCountMap.UNDER_INVESTIGATION
  const resolvedCases = statusCountMap.CLOSED + statusCountMap.CLOSED

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

  // Removed statCards generation here as it is moved into the AdminStatCards component
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
  const reviewingCount = recentReportsRaw.filter((report) => report.status === 'UNDER_REVIEW').length
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Welcome back, {session.user.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Here's what's happening today. You have <strong className="text-navy">{activeCases} active cases</strong> requiring your attention.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {unassignedCount > 0 && (
              <Link href="/admin/reports?assigned=unassigned" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors">
                <AlertCircle size={18} /> {unassignedCount} Unassigned
              </Link>
            )}
            {newReportsCount > 0 && (
              <Link href="/admin/notifications" className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors">
                <Bell size={18} /> {newReportsCount} New Alerts
              </Link>
            )}
            {unassignedCount === 0 && newReportsCount === 0 && (
              <Link href="/admin/reports?status=RECEIVED&sort=newest" className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                View Recent Cases <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        <AdminStatCards 
          totalReports={totalReports}
          activeCases={activeCases}
          resolvedCases={resolvedCases}
          avgResponseHours={avgResponseHours}
          trendDiff={trendDiff}
          trendPercent={trendPercent}
          resolvedForSlaLength={resolvedForSla.length}
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <MonthlyTrendsChart trendBars={trendBars} />
          <CategoryDistribution categoryData={categoryData} />
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
