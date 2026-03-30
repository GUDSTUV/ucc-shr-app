'use client'

import { useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/src/components/atoms/input'
import { Select } from '@/src/components/atoms/select'

type ReportFiltersProps = {
  availableTypes: string[]
  currentQ: string
  currentStatus: string
  currentType: string
  currentAssigned: string
  currentSort: string
}

export function ReportFilters({
  availableTypes,
  currentQ,
  currentStatus,
  currentType,
  currentAssigned,
  currentSort,
}: ReportFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchDebounceRef = useRef<number | null>(null)

  function pushFilters(next: Partial<{ q: string; status: string; type: string; assigned: string; sort: string }>) {
    const params = new URLSearchParams()
    const current = new URLSearchParams(searchParams.toString())

    const q = (next.q ?? current.get('q') ?? currentQ).trim()
    const status = next.status ?? current.get('status') ?? currentStatus
    const type = next.type ?? current.get('type') ?? currentType
    const assigned = next.assigned ?? current.get('assigned') ?? currentAssigned
    const sort = next.sort ?? current.get('sort') ?? currentSort

    if (q) params.set('q', q)
    if (status) params.set('status', status)
    if (type) params.set('type', type)
    if (assigned) params.set('assigned', assigned)
    if (sort && sort !== 'newest') params.set('sort', sort)

    const queryString = params.toString()
    router.replace(queryString ? `/admin/reports?${queryString}` : '/admin/reports', { scroll: false })
  }

  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-5">
      <Input
        defaultValue={currentQ}
        onChange={(e) => {
          if (searchDebounceRef.current) {
            window.clearTimeout(searchDebounceRef.current)
          }

          const nextValue = e.target.value
          searchDebounceRef.current = window.setTimeout(() => {
            pushFilters({ q: nextValue })
          }, 250)
        }}
        placeholder="Search report ID, category, status, or counsellor"
        className="h-11 text-base"
        aria-label="Search reports"
      />

      <Select value={currentStatus} onChange={(e) => pushFilters({ status: e.target.value })} className="h-11 text-base" aria-label="Filter by status">
        <option value="">Status: All</option>
        <option value="RECEIVED">Received</option>
        <option value="REVIEWING">Reviewing</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </Select>

      <Select value={currentType} onChange={(e) => pushFilters({ type: e.target.value })} className="h-11 text-base" aria-label="Filter by category">
        <option value="">Category: All</option>
        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <Select value={currentAssigned} onChange={(e) => pushFilters({ assigned: e.target.value })} className="h-11 text-base" aria-label="Filter by assignment">
        <option value="">Assignment: All</option>
        <option value="assigned">Assigned</option>
        <option value="unassigned">Unassigned</option>
      </Select>

      <Select value={currentSort} onChange={(e) => pushFilters({ sort: e.target.value })} className="h-11 text-base" aria-label="Sort reports">
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="updated">Sort: Recently Updated</option>
        <option value="status">Sort: Status</option>
      </Select>
    </div>
  )
}
