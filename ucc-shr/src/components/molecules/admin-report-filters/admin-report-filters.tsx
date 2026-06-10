'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Select } from '@/src/components/atoms/select'

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

export function AdminReportFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const replaceWithoutScroll = useCallback((nextUrl: string) => {
    const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
    if (nextUrl === currentUrl) return
    router.replace(nextUrl, { scroll: false })
  }, [pathname, router, searchParams])

  const currentRecentQ = searchParams.get('recentQ') ?? ''
  const currentStatus = searchParams.get('recentStatus') ?? ''
  const currentAssigned = searchParams.get('recentAssigned') ?? ''

  const [recentQInput, setRecentQInput] = useState(currentRecentQ)

  useEffect(() => {
    setRecentQInput(currentRecentQ)
  }, [currentRecentQ])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextUrl = updateQuery(pathname, new URLSearchParams(searchParams.toString()), {
        recentQ: recentQInput,
      })
      replaceWithoutScroll(nextUrl)
    }, 250)

    return () => clearTimeout(timeout)
  }, [recentQInput, pathname, searchParams, replaceWithoutScroll])

  return (
    <div className="grid grid-cols-1 gap-2.5 border-b border-gray-100 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
      <Input
        name="recentQ"
        value={recentQInput}
        onChange={(event) => setRecentQInput(event.target.value)}
        placeholder="Filter by report ID, category, status, or counsellor"
        className="h-11 border-gray-300 bg-white text-base text-gray-900"
      />

      <Select
        name="recentStatus"
        value={currentStatus}
        onChange={(event) => {
          const nextUrl = updateQuery(pathname, new URLSearchParams(searchParams.toString()), {
            recentStatus: event.target.value,
          })
          replaceWithoutScroll(nextUrl)
        }}
        className="h-11 border-gray-300 bg-white text-base text-gray-900"
      >
        <option value="">All statuses</option>
        <option value="RECEIVED">Received</option>
        <option value="UNDER_REVIEW">Reviewing</option>
        <option value="CLOSED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </Select>

      <Select
        name="recentAssigned"
        value={currentAssigned}
        onChange={(event) => {
          const nextUrl = updateQuery(pathname, new URLSearchParams(searchParams.toString()), {
            recentAssigned: event.target.value,
          })
          replaceWithoutScroll(nextUrl)
        }}
        className="h-11 border-gray-300 bg-white text-base text-gray-900"
      >
        <option value="">All assignments</option>
        <option value="assigned">Assigned</option>
        <option value="unassigned">Unassigned</option>
      </Select>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-11 rounded-lg px-4 text-base"
        onClick={() => {
          setRecentQInput('')
          const nextUrl = updateQuery(pathname, new URLSearchParams(searchParams.toString()), {
            recentQ: '',
            recentStatus: '',
            recentAssigned: '',
          })
          replaceWithoutScroll(nextUrl)
        }}
      >
        Clear
      </Button>
    </div>
  )
}
