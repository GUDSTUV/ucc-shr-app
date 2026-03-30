"use client"

import { useState } from 'react'
import { FormLayout } from '@/src/components/templates/form-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { StatusBadge } from '@/src/components/molecules/status-badge'

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    code: string
    type: string
    status: 'RECEIVED' | 'REVIEWING' | 'RESOLVED' | 'CLOSED'
    description: string
    location: string | null
    createdAt: string
    updatedAt: string
  } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult(null)

    const normalizedCode = trackingCode.trim().toUpperCase()
    if (!normalizedCode) {
      setError('Tracking code is required.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/reports/${encodeURIComponent(normalizedCode)}`)
      const payload = (await response.json()) as {
        ok?: boolean
        error?: string
        report?: {
          code: string
          type: string
          status: 'RECEIVED' | 'REVIEWING' | 'RESOLVED' | 'CLOSED'
          description: string
          location: string | null
          createdAt: string
          updatedAt: string
        }
      }

      if (!response.ok || !payload.ok || !payload.report) {
        setError(payload.error ?? 'Unable to track this report right now.')
        setSubmitting(false)
        return
      }

      setResult(payload.report)
      setTrackingCode(normalizedCode)
      setSubmitting(false)
    } catch {
      setError('Network error while tracking report. Please try again.')
      setSubmitting(false)
    }
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  }

  return (
    <FormLayout title="Track Your Report">
      <AlertBox title="Need your report code" variant="info">
        Enter the tracking code provided after submission to check report progress.
      </AlertBox>

      {error ? (
        <AlertBox title="Tracking failed" variant="danger">
          {error}
        </AlertBox>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
        <FormField label="Tracking Code">
          <Input
            placeholder="Example: UCC-2026-AB12"
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
            disabled={submitting}
            required
          />
        </FormField>

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Checking...' : 'Track Status'}
        </Button>
      </form>

      {result ? (
        <section className="space-y-2 rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">{result.code}</p>
            <StatusBadge status={result.status} />
          </div>
          <p className="text-sm text-gray-700">Type: {result.type}</p>
          <p className="text-sm text-gray-700">Location: {result.location || 'Not specified'}</p>
          <p className="text-sm text-gray-700">{result.description}</p>
          <p className="text-xs text-gray-500">Submitted: {formatDate(result.createdAt)}</p>
          <p className="text-xs text-gray-500">Last updated: {formatDate(result.updatedAt)}</p>
        </section>
      ) : null}
    </FormLayout>
  )
}
