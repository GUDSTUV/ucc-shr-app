'use client'

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

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams()

    params.set('q', key === 'q' ? value : currentQ)
    params.set('status', key === 'status' ? value : currentStatus)
    params.set('type', key === 'type' ? value : currentType)
    params.set('assigned', key === 'assigned' ? value : currentAssigned)
    params.set('sort', key === 'sort' ? value : currentSort)

    const queryString = params.toString()
    router.push(`/admin/reports?${queryString}`)
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
      <Input
        value={currentQ}
        onChange={(e) => handleFilterChange('q', e.target.value)}
        placeholder="Search code, category, or counsellor"
        className="h-10"
      />

      <Select value={currentStatus} onChange={(e) => handleFilterChange('status', e.target.value)} className="h-10">
        <option value="">Status: All</option>
        <option value="RECEIVED">Received</option>
        <option value="REVIEWING">Reviewing</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </Select>

      <Select value={currentType} onChange={(e) => handleFilterChange('type', e.target.value)} className="h-10">
        <option value="">Category: All</option>
        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>

      <Select value={currentAssigned} onChange={(e) => handleFilterChange('assigned', e.target.value)} className="h-10">
        <option value="">Assignment: All</option>
        <option value="assigned">Assigned</option>
        <option value="unassigned">Unassigned</option>
      </Select>

      <Select value={currentSort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="h-10">
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="updated">Sort: Recently Updated</option>
        <option value="status">Sort: Status</option>
      </Select>
    </div>
  )
}
