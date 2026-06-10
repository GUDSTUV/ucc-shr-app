'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function ReportTabs() {
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') ?? ''

  const tabs = [
    { label: 'All Cases', value: '' },
    { label: 'Received', value: 'RECEIVED' },
    { label: 'Review & Support', value: 'UNDER_REVIEW' },
    { label: 'Investigation', value: 'UNDER_INVESTIGATION' },
    { label: 'Closed', value: 'CLOSED' },
  ]

  return (
    <div className="flex space-x-6 border-b border-gray-200 px-4 mt-2">
      {tabs.map((tab) => {
        const isActive = currentStatus === tab.value
        
        // Construct the URL keeping other params intact
        const params = new URLSearchParams(searchParams.toString())
        if (tab.value) {
          params.set('status', tab.value)
        } else {
          params.delete('status')
        }
        
        const queryString = params.toString()
        const href = queryString ? `/admin/reports?${queryString}` : '/admin/reports'

        return (
          <Link
            key={tab.label}
            href={href}
            scroll={false}
            className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-navy text-navy'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
