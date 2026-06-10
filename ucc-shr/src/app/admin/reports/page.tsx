import Link from 'next/link'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { requireAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'
import { ReportFilters } from './report-filters'
import { ReportTabs } from './report-tabs'

type PageProps = {
  searchParams?: Promise<{
    q?: string
    status?: string
    type?: string
    assigned?: string
    sort?: string
  }>
}

const ALLOWED_STATUSES = new Set(['RECEIVED', 'UNDER_REVIEW', 'UNDER_INVESTIGATION', 'CLOSED', 'CLOSED'])
const ALLOWED_ASSIGNED = new Set(['assigned', 'unassigned'])
const ALLOWED_SORT = new Set(['newest', 'oldest', 'updated', 'status'])

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

function sortReports(
  reports: Array<{
    code: string
    createdAt: Date
    updatedAt: Date
    status: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'
    type: string
    counsellorName: string | null
  }>,
  sort: string
) {
  const byDateDesc = [...reports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  if (sort === 'oldest') {
    return [...reports].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  if (sort === 'updated') {
    return [...reports].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  if (sort === 'status') {
    const rank: Record<'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED', number> = {
      RECEIVED: 1,
      UNDER_REVIEW: 2,
      UNDER_INVESTIGATION: 3,
      CLOSED: 4,

    }

    return [...reports].sort((a, b) => {
      const diff = rank[a.status] - rank[b.status]
      if (diff !== 0) return diff
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }

  return byDateDesc
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  await requireAdmin()

  const params = (await searchParams) ?? {}

  const rawQuery = (params.q ?? '').trim().slice(0, 120)
  const query = rawQuery.toLowerCase()
  const rawStatus = (params.status ?? '').trim().toUpperCase()
  const rawType = (params.type ?? '').trim()
  const rawAssigned = (params.assigned ?? '').trim().toLowerCase()
  const rawSort = (params.sort ?? 'newest').trim().toLowerCase()

  const statusFilter = ALLOWED_STATUSES.has(rawStatus) ? rawStatus : ''
  const typeFilter = rawType.slice(0, 100)
  const assignedFilter = ALLOWED_ASSIGNED.has(rawAssigned) ? rawAssigned : ''
  const sortBy = ALLOWED_SORT.has(rawSort) ? rawSort : 'newest'

  const reportsRaw = await prisma.report.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter as 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED' } : {}),
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(rawQuery
        ? {
            OR: [
              { code: { contains: rawQuery, mode: 'insensitive' } },
              { type: { contains: rawQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      code: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      type: true,
      notes: true,
    },
  })

  const reportsWithAssignment = reportsRaw.map((report) => {
    const notes = parseReportNotes(report.notes)
    return {
      code: report.code,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      status: report.status,
      type: report.type,
      counsellorName: notes.counsellorName ?? notes.investigatorName ?? null,
    }
  })

  const availableTypes = Array.from(new Set(reportsWithAssignment.map((report) => report.type))).sort()

  const filtered = reportsWithAssignment.filter((report) => {
    if (assignedFilter === 'assigned' && !report.counsellorName) return false
    if (assignedFilter === 'unassigned' && report.counsellorName) return false

    if (!query) return true

    const searchable = `${report.code} ${report.type} ${report.status} ${report.counsellorName ?? ''}`.toLowerCase()
    return searchable.includes(query)
  })

  const reports = sortReports(filtered, sortBy)

  return (
    <AdminLayout title="Case Management">
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-gray-700">Monitor and update all incident reports.</p>
            <Link href="/admin">
              <Button size="sm">Back to Dashboard</Button>
            </Link>
          </div>

          <ReportFilters
            availableTypes={availableTypes}
            currentQ={query}
            currentStatus={statusFilter}
            currentType={typeFilter}
            currentAssigned={assignedFilter}
            currentSort={sortBy}
          />
        </div>

        <ReportTabs />

        <div className="overflow-x-auto">
          <table className="min-w-190 w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-[0.08em] text-gray-600">
                <th className="px-4 py-4 font-semibold">Report ID</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Category</th>
                <th className="px-4 py-4 font-semibold">Counsellor</th>
                <th className="px-4 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.code} className="border-t border-gray-100 text-[15px] text-gray-800">
                  <td className="px-4 py-5">
                    <p className="font-semibold text-gray-900">{report.code}</p>
                    <p className="text-sm text-gray-700">{formatSubmittedAt(report.createdAt)}</p>
                  </td>
                  <td className="px-4 py-5">
                    <Badge variant={statusMeta(report.status).variant}>{statusMeta(report.status).label}</Badge>
                  </td>
                  <td className="px-4 py-5 text-gray-900">{report.type}</td>
                  <td className="px-4 py-5 text-gray-900">{report.counsellorName || 'Unassigned'}</td>
                  <td className="px-4 py-5">
                    <div className="flex gap-3 text-sm font-semibold">
                      <Link href={`/admin/reports/${encodeURIComponent(report.code)}`} className="text-navy hover:text-navy-dark">
                        View Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No reports found for the selected filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  )
}
