import Link from 'next/link'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { ArrowRight, Clock3, FileBarChart, ShieldCheck } from 'lucide-react'

function formatHours(value: number) {
  return `${value.toFixed(1)} hrs`
}

function mean(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function median(values: number[]) {
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

export default async function AdminAnalyticsPage() {
  await requireSuperAdmin()

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [
    reportStatusCounts,
    reportsInWindow,
    reportTypeCounts,
  ] = await Promise.all([
    prisma.report.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.report.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: {
        createdAt: true,
        updatedAt: true,
        status: true,
        notes: true,
      },
    }),
    prisma.report.groupBy({ by: ['type'], _count: { type: true } }),
  ])

  const statusCountMap = reportStatusCounts.reduce<
    Record<'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED', number>
  >(
    (
      acc: Record<'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED', number>,
      row: { status: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'; _count: { status: number } },
    ) => {
      acc[row.status] = row._count.status
      return acc
    },
    {
      RECEIVED: 0,
      UNDER_REVIEW: 0,
      UNDER_INVESTIGATION: 0,
      CLOSED: 0,
    } as Record<'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED', number>,
  )

  const totalReports = Object.values(statusCountMap).reduce((sum: number, count: number) => sum + count, 0)
  const receivedReports = statusCountMap.RECEIVED
  const reviewingReports = statusCountMap.UNDER_REVIEW
  const resolvedReports = statusCountMap.CLOSED
  const closedReports = statusCountMap.CLOSED

  const monthBuckets = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1)
    const key = `${date.getFullYear()}-${date.getMonth()}`

    return {
      key,
      label: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      count: 0,
    }
  })

  for (const report of reportsInWindow) {
    const key = `${report.createdAt.getFullYear()}-${report.createdAt.getMonth()}`
    const bucket = monthBuckets.find((item) => item.key === key)
    if (bucket) bucket.count += 1
  }

  const maxMonthCount = Math.max(...monthBuckets.map((bucket) => bucket.count), 1)
  const monthBars = monthBuckets.map((bucket) => ({
    ...bucket,
    height: Math.max(10, Math.round((bucket.count / maxMonthCount) * 100)),
  }))

  const typeCounts = reportTypeCounts.reduce<Record<string, number>>((acc, row) => {
    const key = row.type || 'Other'
    acc[key] = (acc[key] || 0) + row._count.type
    return acc
  }, {})

  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({
      label,
      value,
      percent: totalReports > 0 ? Math.round((value / totalReports) * 100) : 0,
    }))

  const resolvedDurations = reportsInWindow
    .filter((report) => report.status === 'CLOSED')
    .map((report) => (report.updatedAt.getTime() - report.createdAt.getTime()) / (1000 * 60 * 60))
    .filter((value) => value >= 0)

  const avgResolutionHours = mean(resolvedDurations)
  const medianResolutionHours = median(resolvedDurations)

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const currentMonthCount = reportsInWindow.filter((report) => report.createdAt >= currentMonthStart).length
  const previousMonthCount = reportsInWindow.filter(
    (report) => report.createdAt >= previousMonthStart && report.createdAt < currentMonthStart,
  ).length

  const trendDiff = currentMonthCount - previousMonthCount
  const trendPercent = previousMonthCount > 0
    ? Math.round((trendDiff / previousMonthCount) * 1000) / 10
    : currentMonthCount > 0
      ? 100
      : 0

  // ─── Analytics Aggregations from Notes ───
  let totalDemographics = 0
  let studentComplainants = 0
  let staffComplainants = 0
  let externalComplainants = 0

  let totalGender = 0
  let maleComplainants = 0
  let femaleComplainants = 0

  let priorReportedCount = 0

  const respondentPositionCounts: Record<string, number> = {}
  const respondentRelationshipCounts: Record<string, number> = {}
  const complainantDeptCounts: Record<string, number> = {}
  const respondentDeptCounts: Record<string, number> = {}

  for (const report of reportsInWindow) {
    if (!report.notes) continue
    try {
      const notes = JSON.parse(report.notes)

      // Demographics
      if (notes.complainantUserType) {
        totalDemographics++
        const ut = notes.complainantUserType.toLowerCase()
        if (ut.includes('student')) studentComplainants++
        else if (ut.includes('staff')) staffComplainants++
        else externalComplainants++
      }

      if (notes.complainantGender) {
        totalGender++
        const g = notes.complainantGender.toLowerCase()
        if (g === 'male') maleComplainants++
        else if (g === 'female') femaleComplainants++
      }

      if (notes.complainantDepartment) {
        const dept = notes.complainantDepartment
        complainantDeptCounts[dept] = (complainantDeptCounts[dept] || 0) + 1
      }

      // Power Dynamics & Respondent
      if (notes.respondentPosition) {
        const pos = notes.respondentPosition
        respondentPositionCounts[pos] = (respondentPositionCounts[pos] || 0) + 1
      }

      if (notes.respondentRelationship) {
        const rel = notes.respondentRelationship
        respondentRelationshipCounts[rel] = (respondentRelationshipCounts[rel] || 0) + 1
      }

      if (notes.respondentDepartment) {
        const dept = notes.respondentDepartment
        respondentDeptCounts[dept] = (respondentDeptCounts[dept] || 0) + 1
      }

      // Prior Reports
      if (notes.priorReport?.reported) {
        priorReportedCount++
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  const formatTop5 = (counts: Record<string, number>) => {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }))
  }

  const topRespondentPositions = formatTop5(respondentPositionCounts)
  const topRespondentRelationships = formatTop5(respondentRelationshipCounts)
  const topComplainantDepts = formatTop5(complainantDeptCounts)
  const topRespondentDepts = formatTop5(respondentDeptCounts)

  const statusRows = [
    { label: 'Received', count: receivedReports, variant: 'navy' as const },
    { label: 'Reviewing', count: reviewingReports, variant: 'warning' as const },
    { label: 'Resolved', count: resolvedReports, variant: 'success' as const },
    { label: 'Closed', count: closedReports, variant: 'gray' as const },
  ]

  return (
    <AdminLayout
      title="Analytics"
      description="Analyze incident trends and reporting demographics."
      actions={
        <div className="flex gap-2">
          <a href="/api/admin/export" download className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-[1.5px] border-navy px-4 text-sm font-semibold text-navy transition-all hover:bg-navy-light active:scale-[0.97]">
            Export CSV
          </a>
          <Link href="/admin/reports">
            <Button size="sm" className="h-10 rounded-lg">Open Case Management</Button>
          </Link>
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">12-Month Report Volume</h2>
              <Badge variant={trendDiff >= 0 ? 'warning' : 'success'}>
                {trendDiff >= 0 ? '+' : ''}{trendPercent}% vs last month
              </Badge>
            </div>
            <p className="mt-1 text-base text-gray-700">Monthly incoming reports across the past year.</p>

            <div className="mt-4 flex h-72 items-end gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3" role="img" aria-label="Bar chart of 12-month report volume">
              {monthBars.map((item, index) => (
                <div key={item.key} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-t-md ${index >= monthBars.length - 2 ? 'bg-navy' : 'bg-navy/30'}`}
                    style={{ height: `${item.height}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold tracking-wide text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Response Efficiency</h2>
            <p className="mt-1 text-base text-gray-700">Based on reports resolved or closed in the last 12 months.</p>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Average resolution time</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{formatHours(avgResolutionHours)}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Median resolution time</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{formatHours(medianResolutionHours)}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Resolved or closed cases</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{resolvedDurations.length}</dd>
              </div>
            </dl>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Report Status Distribution</h2>
              <span className="text-sm font-semibold text-gray-700">Total: {totalReports}</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {statusRows.map((row) => (
                <div key={row.label} className="rounded-xl border border-gray-200 p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-base font-medium text-gray-800">{row.label}</p>
                    <Badge variant={row.variant}>{row.count}</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-navy"
                      style={{ width: `${totalReports > 0 ? Math.round((row.count / totalReports) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Report Categories</h2>
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-navy-dark">
              View full registry <ArrowRight size={14} />
            </Link>
          </div>

          {topTypes.length > 0 ? (
            <div className="mt-4 space-y-3">
              {topTypes.map((entry) => (
                <div key={entry.label}>
                  <div className="mb-1.5 flex items-center justify-between text-base">
                    <span className="text-gray-800">{entry.label}</span>
                    <span className="font-semibold text-gray-900">{entry.value} ({entry.percent}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100" aria-hidden="true">
                    <div className="h-full rounded-full bg-navy" style={{ width: `${entry.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-700">No category data available yet.</p>
          )}
        </article>

        {/* ─── NEW: Demographics ─── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Complainant Demographics</h2>
            <p className="mt-1 text-sm text-gray-700">Breakdown of who is reporting harassment.</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex justify-between items-center">
                <dt className="font-medium text-gray-700">Students</dt>
                <dd className="text-lg font-semibold text-gray-900">{studentComplainants}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex justify-between items-center">
                <dt className="font-medium text-gray-700">Staff</dt>
                <dd className="text-lg font-semibold text-gray-900">{staffComplainants}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex justify-between items-center">
                <dt className="font-medium text-gray-700">External / Other</dt>
                <dd className="text-lg font-semibold text-gray-900">{externalComplainants}</dd>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Gender & Escalation</h2>
            <p className="mt-1 text-sm text-gray-700">Gender distribution and prior reporting rates.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Female Victims</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{femaleComplainants}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Male Victims</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{maleComplainants}</dd>
              </div>
              <div className="col-span-2 rounded-xl border border-warning bg-warning/10 p-3 mt-2 flex items-center justify-between">
                <div>
                  <dt className="font-bold text-gray-900">Prior Reports</dt>
                  <dd className="text-xs text-gray-700">Cases reported elsewhere before CEGRAD</dd>
                </div>
                <dd className="text-2xl font-black text-warning-dark">{priorReportedCount}</dd>
              </div>
            </div>
          </article>
        </div>

        {/* ─── NEW: Power Dynamics ─── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Offender Profiles</h2>
            <p className="mt-1 text-sm text-gray-700">Top roles of reported respondents.</p>
            {topRespondentPositions.length > 0 ? (
              <div className="mt-4 space-y-3">
                {topRespondentPositions.map((entry) => (
                  <div key={entry.label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 font-medium">{entry.label}</span>
                    <Badge variant="gray">{entry.value}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500 italic">No data available.</p>
            )}
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Relationship to Victim</h2>
            <p className="mt-1 text-sm text-gray-700">Power dynamics (e.g. Supervisor vs Peer).</p>
            {topRespondentRelationships.length > 0 ? (
              <div className="mt-4 space-y-3">
                {topRespondentRelationships.map((entry) => (
                  <div key={entry.label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800 font-medium">{entry.label}</span>
                    <Badge variant="gray">{entry.value}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500 italic">No data available.</p>
            )}
          </article>
        </div>

        {/* ─── NEW: Departmental Hotspots ─── */}
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Departmental Hotspots</h2>
          <p className="mt-1 text-sm text-gray-700">Which departments have the most complainants and respondents?</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-navy mb-3">Top Complainant Departments</h3>
              {topComplainantDepts.length > 0 ? (
                <ul className="space-y-2">
                  {topComplainantDepts.map((entry) => (
                    <li key={entry.label} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate pr-2">{entry.label}</span>
                      <span className="font-semibold">{entry.value}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500 italic">No data.</p>}
            </div>
            <div>
              <h3 className="font-semibold text-red-600 mb-3">Top Offender Departments</h3>
              {topRespondentDepts.length > 0 ? (
                <ul className="space-y-2">
                  {topRespondentDepts.map((entry) => (
                    <li key={entry.label} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate pr-2">{entry.label}</span>
                      <span className="font-semibold">{entry.value}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500 italic">No data.</p>}
            </div>
          </div>
        </article>

      </section>
    </AdminLayout>
  )
}
