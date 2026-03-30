'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Badge } from '@/src/components/atoms/badge'
import Link from 'next/link'
import { UserRound, ChevronUp, ChevronDown } from 'lucide-react'

interface RecentReport {
  id: string
  status: string
  submittedAt: string
  statusLabel: string
  statusVariant: 'navy' | 'warning' | 'success' | 'gray'
  category: string
  counsellor: string
  counsellorAssigned: boolean
}

function updateQuery(
  pathname: string,
  searchParams: URLSearchParams,
  updates: Record<string, string>,
) {
  const next = new URLSearchParams(searchParams.toString())
  for (const [key, value] of Object.entries(updates)) {
    const trimmed = value.trim()
    if (trimmed) {
      next.set(key, trimmed)
    } else {
      next.delete(key)
    }
  }
  const query = next.toString()
  return query ? `${pathname}?${query}` : pathname
}

function SortHeader({
  column,
  label,
}: {
  column: string
  label: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function replaceWithoutScroll(nextUrl: string) {
    const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
    if (nextUrl === currentUrl) return
    router.replace(nextUrl, { scroll: false })
  }

  function handleSort() {
    const currentSort = searchParams.get('recentSort') ?? ''
    let newSort = column
    if (currentSort.startsWith(column)) {
      newSort = currentSort.endsWith(':asc') ? `${column}:desc` : `${column}:asc`
    } else {
      newSort = `${column}:asc`
    }
    const nextUrl = updateQuery(pathname, new URLSearchParams(searchParams.toString()), {
      recentSort: newSort,
    })
    replaceWithoutScroll(nextUrl)
  }

  function getSortIcon() {
    const currentSort = searchParams.get('recentSort') ?? ''
    if (!currentSort.startsWith(column)) return null
    const isAsc = currentSort.endsWith(':asc')
    return isAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  return (
    <button
      type="button"
      onClick={handleSort}
      className="flex items-center gap-1 rounded px-1 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      aria-label={`Sort by ${label}`}
    >
      {label}
      {getSortIcon() && <span className="text-gray-600">{getSortIcon()}</span>}
    </button>
  )
}

export function RecentReportsTable({
  reports,
}: {
  reports: RecentReport[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-190 w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-xs uppercase tracking-[0.06em] text-gray-700">
            <th className="px-4 py-4">
              <SortHeader column="id" label="Report ID" />
            </th>
            <th className="px-4 py-4">
              <SortHeader column="status" label="Status" />
            </th>
            <th className="px-4 py-4">
              <SortHeader column="category" label="Category" />
            </th>
            <th className="px-4 py-4">
              <SortHeader column="counsellor" label="Counsellor" />
            </th>
            <th className="px-4 py-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-t border-gray-100 align-top text-[15px] text-gray-800">
              <td className="px-4 py-5">
                <p className="font-semibold text-gray-900">{report.id}</p>
                <p className="text-sm text-gray-700">{report.submittedAt}</p>
              </td>

              <td className="px-4 py-5">
                <Badge variant={report.statusVariant}>{report.statusLabel}</Badge>
              </td>

              <td className="px-4 py-5 text-gray-900">{report.category}</td>

              <td className="px-4 py-5">
                <div className="flex items-center gap-2">
                  {report.counsellorAssigned ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-light text-navy">
                      <UserRound size={14} />
                    </span>
                  ) : null}
                  <span className={report.counsellorAssigned ? 'text-gray-900' : 'italic text-gray-700'}>
                    {report.counsellor}
                  </span>
                </div>
              </td>

              <td className="px-4 py-5">
                <div className="flex gap-3 text-sm font-semibold">
                  <Link href={`/admin/reports/${encodeURIComponent(report.id)}`} className="text-navy hover:text-navy-dark">
                    View Details
                  </Link>
                </div>
              </td>
            </tr>
          ))}

          {reports.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-600">
                No reports match the selected filters.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
