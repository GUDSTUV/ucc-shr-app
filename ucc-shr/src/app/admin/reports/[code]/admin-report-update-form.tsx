'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/atoms/button'
import { Select } from '@/src/components/atoms/select'
import { Textarea } from '@/src/components/atoms/textarea'
import { AlertTriangle } from 'lucide-react'
import type { RiskLevel, InvestigationOutcome, ActionTaken } from '@/src/lib/auth/report-access'

type AdminReportUpdateFormProps = {
  code: string
  currentStatus: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'
  counsellors: Array<{ id: string; label: string }>
  currentCounsellorId: string | null
  currentRiskLevel?: RiskLevel | null
  currentOutcome?: InvestigationOutcome | null
  currentActionsTaken?: ActionTaken[]
  userRole?: string
}

const ACTION_OPTIONS: { value: ActionTaken; label: string }[] = [
  { value: 'WARNING_ISSUED', label: 'Warning Issued' },
  { value: 'DISCIPLINARY_ACTION', label: 'Disciplinary Action' },
  { value: 'REFERRAL_TO_MANAGEMENT', label: 'Referral to Management' },
  { value: 'COUNSELLING_SUPPORT', label: 'Counselling Support' },
  { value: 'LEGAL_REFERRAL', label: 'Legal Referral' },
]

export function AdminReportUpdateForm({
  code,
  currentStatus,
  counsellors,
  currentCounsellorId,
  currentRiskLevel,
  currentOutcome,
  currentActionsTaken = [],
  userRole = 'ADMIN',
}: AdminReportUpdateFormProps) {
  const router = useRouter()
  const isSuperAdmin = userRole === 'SUPER_ADMIN'

  const [status, setStatus] = useState(currentStatus)
  const [counsellorId, setCounsellorId] = useState(currentCounsellorId ?? '')
  const [message, setMessage] = useState('')
  const [riskLevel, setRiskLevel] = useState<RiskLevel | ''>(currentRiskLevel ?? '')
  const [outcome, setOutcome] = useState<InvestigationOutcome | ''>(currentOutcome ?? '')
  const [actionsTaken, setActionsTaken] = useState<ActionTaken[]>(currentActionsTaken)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)


  function toggleAction(action: ActionTaken) {
    setActionsTaken((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const body: Record<string, unknown> = {
        status,
        message,
        riskLevel: riskLevel || null,
      }

      // Only Super Admin can assign/reassign and set closure fields
      if (isSuperAdmin) {
        body.counsellorId = counsellorId || null
        body.investigationOutcome = outcome || null
        body.actionsTaken = actionsTaken
      }

      const response = await fetch(`/api/admin/reports/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = (await response.json()) as { ok?: boolean; error?: string }

      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Failed to update report.')
        setSubmitting(false)
        return
      }

      setMessage('')
      setSuccess('Case updated successfully.')
      router.refresh()
    } catch {
      setError('Network error while updating report.')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
        {/* Assign Case Officer — Super Admin only */}
        {isSuperAdmin && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Assign Case Officer</p>
            <Select value={counsellorId} onChange={(e) => setCounsellorId(e.target.value)} className="mt-2 h-11 text-base">
              <option value="">Unassigned</option>
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
          </div>
        )}

        {/* Status */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Case Status</p>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof currentStatus)}
            className="mt-2 h-11 text-base"
          >
            <option value="RECEIVED">Received</option>
            <option value="UNDER_REVIEW">Under Review (Chat Stage)</option>
            <option value="UNDER_INVESTIGATION">Under Investigation (Office)</option>
            {/* Only Super Admin can close cases */}
            {isSuperAdmin && <option value="CLOSED">Closed</option>}
          </Select>
        </div>

        {/* Risk Level */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Risk Level</p>
          <p className="mt-0.5 text-xs text-gray-500">Used for internal analytics and prioritisation.</p>
          <div className="mt-2 flex gap-2">
            {(['LOW', 'MEDIUM', 'HIGH'] as RiskLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setRiskLevel(riskLevel === level ? '' : level)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1 ${
                  riskLevel === level
                    ? level === 'HIGH'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : level === 'MEDIUM'
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Investigation Outcome — Super Admin only, when closing */}
        {isSuperAdmin && status === 'CLOSED' && (
          <>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Investigation Outcome</p>
              <Select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as InvestigationOutcome | '')}
                className="mt-2 h-11 text-base"
              >
                <option value="">Select outcome</option>
                <option value="SUBSTANTIATED">Complaint Substantiated</option>
                <option value="NOT_SUBSTANTIATED">Complaint Not Substantiated</option>
                <option value="INCONCLUSIVE">Inconclusive</option>
              </Select>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Actions Taken</p>
              <div className="mt-2 space-y-2">
                {ACTION_OPTIONS.map(({ value, label }) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={actionsTaken.includes(value)}
                      onChange={() => toggleAction(value)}
                      className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Case Note */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">
            Internal Case Notes
          </p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Record internal case notes, meeting details, follow-up actions, or next steps (Hidden from reporter)..."
            rows={4}
            className="mt-2 text-base leading-relaxed"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}

        <Button type="submit" disabled={submitting} className="h-11 w-full px-4 text-base">
          {submitting ? 'Saving...' : 'Save Update'}
        </Button>
      </form>

    </div>
  )
}
