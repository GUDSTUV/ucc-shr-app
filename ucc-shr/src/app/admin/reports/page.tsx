import Link from 'next/link'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { redirect } from 'next/navigation'

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

export default async function AdminReportsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  const reports = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      code: true,
      createdAt: true,
      status: true,
      type: true,
    },
  })

  return (
    <AdminLayout title="Case Management">
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">Monitor and update all incident reports.</p>
          <Link href="/admin">
            <Button size="sm">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-[0.12em] text-gray-400">
                <th className="px-4 py-3 font-semibold">Report ID</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Assigned To</th>
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
                  <td className="px-4 py-4 text-gray-800">Unassigned</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-xs font-semibold">
                      <button type="button" className="text-navy hover:text-navy-dark">
                        View
                      </button>
                      <button type="button" className="text-navy hover:text-navy-dark">
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No reports found yet.
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
