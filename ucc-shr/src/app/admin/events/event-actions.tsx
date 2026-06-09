'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/src/components/atoms/button'

type Props = {
  eventId: string
  currentPublished: boolean
}

export function EventActions({ eventId, currentPublished }: Props) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)

  async function togglePublish() {
    setPublishing(true)
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !currentPublished,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.ok) {
        setPublishing(false)
        return
      }

      router.refresh()
    } catch {
      setPublishing(false)
    }
  }

  return (
    <div className="mt-4 flex gap-3 text-sm font-semibold">
      <Link href={`/admin/events/${eventId}/edit`} className="text-navy hover:text-navy-dark">
        Edit
      </Link>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => void togglePublish()}
        disabled={publishing}
        className="text-navy hover:text-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {publishing ? 'Saving...' : currentPublished ? 'Unpublish' : 'Publish'}
      </Button>
    </div>
  )
}
