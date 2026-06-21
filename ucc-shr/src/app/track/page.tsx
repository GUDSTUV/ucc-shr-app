"use client"

import { useState } from 'react'
import { FormLayout } from '@/src/components/templates/form-layout'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { StatusBadge } from '@/src/components/molecules/status-badge'
import { Text } from '@/src/components/atoms/text'
import { Heading } from '@/src/components/atoms/heading'

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    code: string
    type: string
    status: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'
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
          status: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'
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

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
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
        <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <Heading as="h3" size="lg" weight="semibold" tone="navy">{result.code}</Heading>
            <StatusBadge status={result.status} />
          </div>
          <div className="pt-2 space-y-1">
            <Text size="sm" tone="muted"><Text as="span" weight="semibold">Type:</Text> {result.type}</Text>
            <Text size="sm" tone="muted"><Text as="span" weight="semibold">Location:</Text> {result.location || 'Not specified'}</Text>
          </div>
          <div className="pt-2">
            <Text as="p" size="xs" weight="semibold" tone="muted" className="mb-1 uppercase tracking-wider text-gray-400">Description</Text>
            <Text size="sm" tone="default" className="leading-relaxed">{result.description}</Text>
          </div>
          <div className="pt-4 mt-4 flex flex-col sm:flex-row sm:justify-between border-t border-gray-100 space-y-1 sm:space-y-0">
            <Text size="xs" tone="muted">Submitted: {formatDate(result.createdAt)}</Text>
            <Text size="xs" tone="muted">Last updated: {formatDate(result.updatedAt)}</Text>
          </div>
        </section>
      ) : null}
    </FormLayout>
  )
}
