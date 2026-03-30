'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import type { SavedResourceItem } from './savedTypes'

type SavedItemsClientProps = {
  initialItems: SavedResourceItem[]
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
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-full bg-navy-light text-navy">
            <Bookmark size={20} />
          </div>
          <p className="text-center text-sm text-gray-700">You do not have any saved resources yet.</p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Save posts or events from the Hub and they will appear here.
          </p>
        </section>
        </div>
    )
  }

  return (
    <section className="space-y-3">
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-navy">{item.label.toUpperCase()}</p>
          <h2 className="mt-1 text-base font-semibold text-gray-900">{item.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{item.summary}</p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <Link href={item.href} className="text-sm font-semibold text-navy hover:text-navy-dark">
              Open
            </Link>
            <button
              type="button"
              onClick={() => void handleUnsave(item)}
              disabled={removingId === item.id}
              className="text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {removingId === item.id ? 'Removing...' : 'Unsave'}
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
