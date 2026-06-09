'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bookmark, Calendar, BookOpen, ArrowRight, X } from 'lucide-react'
import type { SavedResourceItem } from './savedTypes'
import { Button } from '@/src/components/atoms/button'

type SavedItemsClientProps = {
  initialItems: SavedResourceItem[]
}

const labelConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  'Know Your Rights': { color: 'bg-navy-light text-navy', icon: <BookOpen size={12} /> },
  'Awareness': { color: 'bg-blue-50 text-blue-700', icon: <BookOpen size={12} /> },
  'Events': { color: 'bg-emerald-50 text-emerald-700', icon: <Calendar size={12} /> },
}

export function SavedItemsClient({ initialItems }: SavedItemsClientProps) {
  const [items, setItems] = useState(initialItems)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleUnsave(item: SavedResourceItem) {
    setError(null)
    setSuccess(null)
    setRemovingId(item.id)

    try {
      const response = await fetch('/api/user/saved', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: item.resourceType,
          resourceId: item.resourceId,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to remove saved resource right now.')
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id))
      setSuccess('Removed from saved items.')
      window.setTimeout(() => {
        setSuccess((current) => (current === 'Removed from saved items.' ? null : current))
      }, 2500)
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to remove saved resource right now.')
    } finally {
      setRemovingId(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        {success ? (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-content-center rounded-full bg-navy-light text-navy">
            <Bookmark size={24} />
          </div>
          <h2 className="text-base font-semibold text-gray-900">No saved items yet</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
            Save articles or events from the Awareness Hub and they will appear here.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {success ? (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      ) : null}
      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const badge = labelConfig[item.label] ?? { color: 'bg-gray-100 text-gray-700', icon: <BookOpen size={12} /> }
          return (
            <article
              key={item.id}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-navy/20 hover:shadow-md"
            >
              {/* Badge */}
              <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide" style={{}} aria-label={item.label}>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.color}`}>
                  {badge.icon}
                  {item.label}
                </span>
              </div>

              {/* Content */}
              <h2 className="mb-1 text-sm font-bold leading-snug text-gray-900 group-hover:text-navy transition-colors line-clamp-2">
                {item.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
                {item.summary}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-navy-dark transition-colors"
                  aria-label={`Open ${item.title}`}
                >
                  Open <ArrowRight size={13} />
                </Link>
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => void handleUnsave(item)}
                  disabled={removingId === item.id}
                  aria-label={`Remove ${item.title} from saved`}
                  className="inline-flex items-center gap-1 rounded-md p-1 text-xs text-gray-400 transition hover:text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={14} />
                  <span>{removingId === item.id ? 'Removing…' : 'Unsave'}</span>
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

