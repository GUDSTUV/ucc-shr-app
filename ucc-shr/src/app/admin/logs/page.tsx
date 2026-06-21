import { notFound } from 'next/navigation'
import { ScrollText, User, Flag, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'

type PageProps = {
  searchParams?: Promise<{
    page?: string
    action?: string
    resource?: string
  }>
}

const PAGE_SIZE = 25

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  VIEWED: { label: 'Viewed', color: 'bg-blue-50 text-blue-700 ring-blue-200' },
  UPDATED: { label: 'Updated', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  CREATED: { label: 'Created', color: 'bg-green-50 text-green-700 ring-green-200' },
  DELETED: { label: 'Deleted', color: 'bg-red-50 text-red-700 ring-red-200' },
  SUSPENDED: { label: 'Suspended', color: 'bg-red-50 text-red-700 ring-red-200' },
  PROMOTED: { label: 'Promoted', color: 'bg-purple-50 text-purple-700 ring-purple-200' },
}

const RESOURCE_ICONS: Record<string, typeof Flag> = {
  REPORT: Flag,
  USER: User,
  SYSTEM: Settings,
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(value)
}

function buildFilterUrl(current: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const merged = { ...current, ...overrides, page: undefined }
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value)
  }
  const qs = params.toString()
  return `/admin/logs${qs ? `?${qs}` : ''}`
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  await requireSuperAdmin()

  const params = searchParams ? await searchParams : undefined
  const page = Math.max(1, parseInt(params?.page ?? '1', 10) || 1)
  const filterAction = params?.action ?? undefined
  const filterResource = params?.resource ?? undefined

  const where: Record<string, unknown> = {}
  if (filterAction) where.action = filterAction
  if (filterResource) where.resourceType = filterResource

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        User: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentFilters = { action: filterAction, resource: filterResource }

  return (
    <AdminLayout
      title="Activity Logs"
      description="Immutable audit trail of all administrative actions. Only visible to the Super Admin."
    >
      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {/* Action filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
          <span className="font-medium text-gray-600">Action:</span>
          <div className="flex gap-1">
            <a
              href={buildFilterUrl(currentFilters, { action: undefined })}
              className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${!filterAction ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All
            </a>
            {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
              <a
                key={key}
                href={buildFilterUrl(currentFilters, { action: key })}
                className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${filterAction === key ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Resource filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
          <span className="font-medium text-gray-600">Resource:</span>
          <div className="flex gap-1">
            <a
              href={buildFilterUrl(currentFilters, { resource: undefined })}
              className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${!filterResource ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All
            </a>
            {['REPORT', 'USER', 'SYSTEM'].map((key) => (
              <a
                key={key}
                href={buildFilterUrl(currentFilters, { resource: key })}
                className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${filterResource === key ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="mb-4 text-sm text-gray-500">
        Showing {logs.length} of {totalCount.toLocaleString()} entries{' '}
        {(filterAction || filterResource) && <span className="font-medium">(filtered)</span>}
      </p>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <ScrollText size={40} className="text-gray-300" />
          <p className="mt-4 text-base font-semibold text-gray-700">No activity logs yet</p>
          <p className="mt-1 text-sm text-gray-500">Administrative actions will appear here as they happen.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actor</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Resource</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Target</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => {
                  const actionInfo = ACTION_LABELS[log.action] ?? { label: log.action, color: 'bg-gray-50 text-gray-600 ring-gray-200' }
                  const ResourceIcon = RESOURCE_ICONS[log.resourceType] ?? Settings
                  const details = log.details as Record<string, unknown> | null

                  return (
                    <tr key={log.id} className="transition hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500 font-mono">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{log.User.name || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{log.User.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${actionInfo.color}`}>
                          {actionInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <ResourceIcon size={13} className="shrink-0" />
                          {log.resourceType.charAt(0) + log.resourceType.slice(1).toLowerCase()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 font-mono">
                        {log.resourceId}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-xs text-gray-600">
                        {details ? (
                          <details className="cursor-pointer">
                            <summary className="font-medium text-navy hover:underline">View details</summary>
                            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-2 text-[11px] text-gray-700">
                              {JSON.stringify(details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="italic text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1">
                {page > 1 && (
                  <a
                    href={buildFilterUrl({ ...currentFilters, page: String(page - 1) }, {})}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <ChevronLeft size={12} /> Previous
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={buildFilterUrl({ ...currentFilters, page: String(page + 1) }, {})}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Next <ChevronRight size={12} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
