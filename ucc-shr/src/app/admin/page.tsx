import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Select } from '@/src/components/atoms/select'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { redirect } from 'next/navigation'
import {
  Bell,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileWarning,
  Filter,
  Plus,
  Search,
  UserRound,
} from 'lucide-react'

function formatSubmittedAt(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function statusMeta(status: 'RECEIVED' | 'REVIEWING' | 'RESOLVED' | 'CLOSED') {
  if (status === 'REVIEWING') return { label: 'Reviewing', variant: 'warning' as const }
  if (status === 'RESOLVED') return { label: 'Resolved', variant: 'success' as const }
  if (status === 'CLOSED') return { label: 'Closed', variant: 'gray' as const }
  return { label: 'Received', variant: 'navy' as const }
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [
    totalReports,
    activeCases,
    resolvedCases,
    recentReportsRaw,
    allReportsForTypes,
    lastSixMonthsReports,
    resolvedForSla,
  ] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: { in: ['RECEIVED', 'REVIEWING'] } } }),
    prisma.report.count({ where: { status: { in: ['RESOLVED', 'CLOSED'] } } }),
    prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        code: true,
        createdAt: true,
        status: true,
        type: true,
      },
    }),
    prisma.report.findMany({ select: { type: true } }),
    prisma.report.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.report.findMany({
      where: { status: { in: ['RESOLVED', 'CLOSED'] } },
      select: { createdAt: true, updatedAt: true },
    }),
  ])

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

  const typeCounts = allReportsForTypes.reduce<Record<string, number>>((acc, report) => {
    const key = report.type || 'Other'
    acc[key] = (acc[key] || 0) + 1
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
    return {
      id: report.code,
      submittedAt: formatSubmittedAt(report.createdAt),
      statusLabel: meta.label,
      statusVariant: meta.variant,
      category: report.type,
      investigator: 'Pending Assignment',
      investigatorAssigned: false,
    }
  })

  return (
    <AdminLayout title="Reporting Dashboard">
      <section className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-[460px]">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search cases, IDs, or investigator"
              className="h-11 border-gray-200 bg-white pl-9 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-gray-200 bg-white text-navy hover:bg-navy-light"
            >
              <Bell size={18} />
            </button>

            <Button size="sm" className="h-11 rounded-[10px] px-4">
              <Plus size={16} /> New Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconClass}`}>
                  {card.icon}
                </span>
                <Badge variant={card.trendVariant}>{card.trend}</Badge>
              </div>

              <p className="text-sm text-gray-600">{card.label}</p>
              <p className="mt-1 text-[30px] font-semibold leading-none text-gray-900">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Reporting Trends</h2>
              <Badge variant="gray">Last 6 Months</Badge>
            </div>

            <div className="flex h-[230px] items-end gap-3 rounded-xl bg-gray-50 p-4">
              {trendBars.map((bar, index) => (
                <div key={bar.key} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-xl ${index === trendBars.length - 1 ? 'bg-navy' : 'bg-navy/25'}`}
                    style={{ height: `${bar.height}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-semibold tracking-wide text-gray-400">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Category Distribution</h2>
              <button type="button" className="text-sm font-semibold text-navy hover:text-navy-dark">
                View Details
              </button>
            </div>

            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-navy" style={{ width: `${item.percent}%` }} aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Incident Reports</h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Filter size={14} /> Filters
              </button>

              <Select className="h-10 min-w-[130px] rounded-full border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700">
                <option>Status: All</option>
                <option>In Progress</option>
                <option>Reviewing</option>
                <option>Urgent</option>
              </Select>

              <Select className="h-10 min-w-[130px] rounded-full border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700">
                <option>Category: All</option>
                <option>Verbal Harassment</option>
                <option>Cyber Harassment</option>
                <option>Physical Misconduct</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[780px] w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-[0.12em] text-gray-400">
                  <th className="px-4 py-3 font-semibold">Report ID</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Investigator</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-t border-gray-100 align-top text-sm text-gray-700">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{report.id}</p>
                      <p className="text-xs text-gray-500">{report.submittedAt}</p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant={report.statusVariant}>{report.statusLabel}</Badge>
                    </td>

                    <td className="px-4 py-4 text-gray-800">{report.category}</td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {report.investigatorAssigned ? (
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-light text-navy">
                            <UserRound size={14} />
                          </span>
                        ) : null}
                        <span className={report.investigatorAssigned ? 'text-gray-800' : 'italic text-gray-400'}>
                          {report.investigator}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-3 text-xs font-semibold">
                        <button type="button" className="text-navy hover:text-navy-dark">
                          Assign Investigator
                        </button>
                        <button type="button" className="text-gray-700 hover:text-navy">
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </AdminLayout>
  )
}
