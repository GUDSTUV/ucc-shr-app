'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/atoms/button'
import { Select } from '@/src/components/atoms/select'
import { Textarea } from '@/src/components/atoms/textarea'

type AdminReportUpdateFormProps = {
  code: string
  currentStatus: 'RECEIVED' | 'REVIEWING' | 'RESOLVED' | 'CLOSED'
  counsellors: Array<{ id: string; label: string }>
  currentCounsellorId: string | null
}

export function AdminReportUpdateForm({
  code,
  currentStatus,
  counsellors,
  currentCounsellorId,
}: AdminReportUpdateFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [counsellorId, setCounsellorId] = useState(currentCounsellorId ?? '')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/reports/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          message,
          counsellorId: counsellorId || null,
        }),
      })

      const result = (await response.json()) as { ok?: boolean; error?: string }

      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Failed to update report.')
        setSubmitting(false)
        return
      }

      router.refresh()
    } catch {
      setError('Network error while updating report.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      <div>
        <p className="text-base font-semibold text-gray-700">Assign Counsellor</p>
        <Select value={counsellorId} onChange={(event) => setCounsellorId(event.target.value)} className="mt-2 h-11 text-base">
          <option value="">Unassigned</option>
          {counsellors.map((counsellor) => (
            <option key={counsellor.id} value={counsellor.id}>
              {counsellor.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <p className="text-base font-semibold text-gray-700">Update Status</p>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof currentStatus)}
          className="mt-2 h-11 text-base"
        >
          <option value="RECEIVED">Received</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </Select>
      </div>

      <div>
        <p className="text-base font-semibold text-gray-700">Admin Note</p>
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Optional note shown to the user in notifications"
          rows={4}
          className="mt-2 text-base leading-relaxed"
        />
      </div>

      {error ? <p className="text-base text-red-600">{error}</p> : null}

      <Button type="submit" disabled={submitting} className="h-11 px-4 text-base">
        {submitting ? 'Saving...' : 'Save Update'}
      </Button>
    </form>
  )
}
