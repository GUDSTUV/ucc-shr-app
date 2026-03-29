import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'
import { ReportFilters } from './report-filters'

type PageProps = {
  searchParams?: Promise<{
    q?: string
    status?: string
    type?: string
    assigned?: string
    sort?: string
  }>
}

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

function sortReports(
  reports: Array<{
    code: string
    createdAt: Date
    updatedAt: Date
    status: 'RECEIVED' | 'REVIEWING' | 'RESOLVED' | 'CLOSED'
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
    const rank: Record<'RECEIVED' | 'REVIEWING' | 'RESOLVED' | 'CLOSED', number> = {
      REVIEWING: 0,
      RECEIVED: 1,
      RESOLVED: 2,
      CLOSED: 3,
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
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  const params = (await searchParams) ?? {}

  const query = (params.q ?? '').trim().toLowerCase()
  const statusFilter = (params.status ?? '').trim()
  const typeFilter = (params.type ?? '').trim()
  const assignedFilter = (params.assigned ?? '').trim()
  const sortBy = (params.sort ?? 'newest').trim()

  const reportsRaw = await prisma.report.findMany({
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
    if (statusFilter && report.status !== statusFilter) return false
    if (typeFilter && report.type !== typeFilter) return false

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
            <p className="text-sm text-gray-600">Monitor and update all incident reports.</p>
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

        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-[0.12em] text-gray-400">
                <th className="px-4 py-3 font-semibold">Report ID</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Counsellor</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.code} className="border-t border-gray-100 text-sm text-gray-700">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{report.code}</p>
                    <p className="text-xs text-gray-500">{formatSubmittedAt(report.createdAt)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusMeta(report.status).variant}>{statusMeta(report.status).label}</Badge>
                  </td>
                  <td className="px-4 py-4 text-gray-800">{report.type}</td>
                  <td className="px-4 py-4 text-gray-800">{report.counsellorName || 'Unassigned'}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-xs font-semibold">
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
