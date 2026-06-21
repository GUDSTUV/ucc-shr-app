'use client'
import { useState, useEffect } from 'react'
import { UserPlus, Phone, Shield, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Textarea } from '@/src/components/atoms/textarea'
import { Select } from '@/src/components/atoms/select'
import { FormField } from '@/src/components/molecules/form-field'
import { StepIndicator } from '@/src/components/molecules/step-indicator'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

type ReportFormProps = {
  initialContact?: string
}

const HARASSMENT_TYPES = [
  { value: 'verbal', label: 'Verbal — Unwelcome sexual comments, jokes, or remarks' },
  { value: 'physical', label: 'Physical — Unwanted touching or physical contact' },
  { value: 'online', label: 'Online/Digital — Unsolicited messages, images, or videos' },
  { value: 'quid_pro_quo', label: 'Quid Pro Quo — Grades or favours demanded for sexual acts' },
  { value: 'other', label: 'Other — Any other form of sexual or gender-based harassment' },
] as const

const STEP_LABELS = ['What happened', 'Who was involved', 'How to reach you']

export function ReportForm({ initialContact = '' }: ReportFormProps) {
  const totalSteps = 3
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitReady, setSubmitReady] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  // Cooldown timer to prevent double-click / keyboard-chaining from step 2 to step 3
  useEffect(() => {
    if (step === totalSteps) {
      setSubmitReady(false)
      const timer = setTimeout(() => setSubmitReady(true), 400)
      return () => clearTimeout(timer)
    }
  }, [step, totalSteps])

  // Step 1 — What happened
  const [typeValue, setTypeValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [locationValue, setLocationValue] = useState('')

  // Step 2 — Who was involved
  const [offenderDescription, setOffenderDescription] = useState('')
  const [witness, setWitness] = useState('')
  const [witnesses, setWitnesses] = useState<string[]>([])
  const [priorReported, setPriorReported] = useState<boolean | null>(null)
  const [priorReportWhere, setPriorReportWhere] = useState('')

  // Step 3 — How to reach you
  const [phoneValue, setPhoneValue] = useState('')
  const [confidential, setConfidential] = useState(false)

  const addWitness = () => {
    const value = witness.trim()
    if (!value) return
    setWitnesses((prev) => [...prev, value])
    setWitness('')
  }

  const removeWitness = (index: number) => {
    setWitnesses((prev) => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    setStepError(null)
    if (step === 1 && (!typeValue || !descriptionValue.trim())) {
      setStepError('Please select a harassment type and describe what happened before continuing.')
      return
    }
    setStep((prev) => Math.min(totalSteps, prev + 1))
  }

  const prevStep = () => {
    setStepError(null)
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = async () => {
    // Safety guard — should never fire before the final step or during cooldown
    if (step < totalSteps || !submitReady || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    setSubmittedCode(null)

    try {
      const payload = {
        type: typeValue,
        description: descriptionValue,
        location: locationValue,
        incidentDate: incidentDate || undefined,
        offenderDescription: offenderDescription.trim() || undefined,
        witnesses,
        priorReport: priorReported !== null
          ? { reported: priorReported, where: priorReportWhere.trim() || undefined }
          : undefined,
        contact: initialContact,
        phone: phoneValue.trim() || undefined,
        confidentialityRequested: confidential,
        isAnonymous: false,
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let result: { ok?: boolean; code?: string; error?: string }
      try {
        result = (await response.json()) as { ok?: boolean; code?: string; error?: string }
      } catch {
        result = { ok: false, error: 'Unexpected server response. Please try again.' }
      }

      if (!response.ok || !result.ok) {
        setSubmitError(result.error ?? 'Unable to submit report. Please try again.')
        return
      }

      setSubmittedCode(result.code ?? null)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Network error. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success screen ───
  if (submittedCode) {
    return (
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <Shield className="h-7 w-7 text-green-600" />
          </div>
          <Heading as="h3" size="lg" weight="bold" tone="navy" className="mt-4">
            Report Submitted Successfully
          </Heading>
          <Text size="sm" tone="muted" className="mt-2 leading-relaxed">
            Your report has been securely received by CEGRAD. A member of the team will reach out
            to you. You can also track the status of your report from your Dashboard.
          </Text>
          {confidential && (
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-navy-light px-3 py-2 text-xs text-navy">
              <EyeOff size={13} />
              <span>Your personal details are marked <strong>confidential</strong> — only the Super Admin and your assigned investigator will see them.</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setSubmittedCode(null)
              setStep(1)
              setTypeValue('')
              setDescriptionValue('')
              setIncidentDate('')
              setLocationValue('')
              setOffenderDescription('')
              setWitnesses([])
              setPriorReported(null)
              setPriorReportWhere('')
              setPhoneValue('')
              setConfidential(false)
            }}
          >
            Submit Another
          </Button>
          <a
            href="/user/userDashboard"
            className="flex flex-1 items-center justify-center rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // ─── Main form ───
  return (
    <div className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-gray-100">
      {/* Step header */}
      <div>
        <StepIndicator step={step} total={totalSteps} />
        <Text as="p" size="xs" tone="muted" className="mt-2 text-center">
          Step {step} of {totalSteps} — <span className="font-medium text-gray-700">{STEP_LABELS[step - 1]}</span>
        </Text>
      </div>

      {submitError && (
        <AlertBox variant="danger" title="Submission failed">{submitError}</AlertBox>
      )}
      {stepError && (
        <AlertBox variant="danger" title="Complete required fields">{stepError}</AlertBox>
      )}

      {/* ─── Step 1: What happened ─── */}
      {step === 1 && (
        <>
          <FormField label="Type of harassment" required>
            <Select
              name="type"
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              aria-label="Select the type of harassment"
            >
              <option value="" disabled>Select the type of harassment</option>
              {HARASSMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Describe what happened" required hint="Share as much or as little as you feel comfortable with.">
            <Textarea
              name="description"
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              placeholder="Describe the incident — what happened, when, and how it affected you."
              rows={6}
              aria-label="Description of the incident"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Where did it happen?" hint="Campus building, online platform, etc.">
              <Input
                name="location"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                placeholder="e.g. Science Faculty, WhatsApp"
                aria-label="Location of the incident"
              />
            </FormField>

            <FormField label="When did it happen?" hint="Approximate date is fine">
              <Input
                type="date"
                name="incidentDate"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                aria-label="Date of the incident"
              />
            </FormField>
          </div>
        </>
      )}

      {/* ─── Step 2: Who was involved ─── */}
      {step === 2 && (
        <>
          <FormField
            label="About the person responsible"
            hint="Anything helps — a name, position, department, or description."
          >
            <Textarea
              name="offenderDescription"
              value={offenderDescription}
              onChange={(e) => setOffenderDescription(e.target.value)}
              placeholder="e.g. A male lecturer in the Economics department, name unknown. Or: Dr. [Name], Faculty of Law."
              rows={3}
              aria-label="Description of the person responsible"
            />
          </FormField>

          {/* Witnesses */}
          <div className="space-y-2">
            <Text as="p" size="sm" weight="semibold" className="text-[13px] text-gray-700">
              Were there any witnesses? <span className="font-normal text-gray-400">(Optional)</span>
            </Text>
            <Text as="p" size="xs" tone="muted">
              Add anyone who was present or is aware of the situation.
            </Text>
            <div className="flex items-center gap-2">
              <Input
                value={witness}
                onChange={(e) => setWitness(e.target.value)}
                placeholder="Name, email, or phone number"
                aria-label="Add a witness"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addWitness() }
                }}
              />
              <Button
                variant="unstyled"
                type="button"
                onClick={addWitness}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-light text-navy transition hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:scale-95"
                aria-label="Add witness"
              >
                <UserPlus size={17} />
              </Button>
            </div>
            {witnesses.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {witnesses.map((item, index) => (
                  <Button
                    variant="unstyled"
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => removeWitness(index)}
                    className="group inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] text-gray-700 transition hover:bg-red/10 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                    aria-label={`Remove witness ${item}`}
                  >
                    {item}
                    <span className="text-gray-400 group-hover:text-red">&times;</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Prior report */}
          <div className="space-y-3">
            <Text as="p" size="sm" weight="semibold" className="text-[13px] text-gray-700">
              Have you reported this incident anywhere else before? <span className="font-normal text-gray-400">(Optional)</span>
            </Text>
            <div className="flex gap-3">
              {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPriorReported(val)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 ${
                    priorReported === val
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-navy hover:text-navy'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {priorReported === true && (
              <Input
                value={priorReportWhere}
                onChange={(e) => setPriorReportWhere(e.target.value)}
                placeholder="Where did you report it? e.g. Dean's Office, Police"
                aria-label="Where was it previously reported"
              />
            )}
          </div>
        </>
      )}

      {/* ─── Step 3: How to reach you ─── */}
      {step === 3 && (
        <>
          {/* Email — read only */}
          <FormField label="Your email (from your account)">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
              <span className="flex-1 text-sm text-gray-700">{initialContact || 'Not available'}</span>
            </div>
          </FormField>

          {/* Phone */}
          <FormField label="Phone number" hint="Optional — an alternative way for CEGRAD to reach you.">
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="tel"
                name="phone"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                placeholder="e.g. 024 123 4567"
                className="pl-9"
                aria-label="Phone number for follow-up"
              />
            </div>
          </FormField>

          {/* Review summary */}
          <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <Text as="h3" size="sm" weight="bold" tone="navy">Review Before Submitting</Text>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Type:</span>
                <span className="text-right font-medium text-gray-800">
                  {HARASSMENT_TYPES.find((t) => t.value === typeValue)?.label ?? typeValue}
                </span>
              </div>
              {locationValue && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Location:</span>
                  <span className="text-right font-medium text-gray-800">{locationValue}</span>
                </div>
              )}
              {incidentDate && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-right font-medium text-gray-800">
                    {new Date(incidentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Privacy:</span>
                <span className={`text-right font-medium ${confidential ? 'text-navy' : 'text-gray-800'}`}>
                  {confidential ? 'Confidential' : 'Standard'}
                </span>
              </div>
            </div>
            <Text as="p" size="xs" tone="muted" className="border-t border-gray-100 pt-3 leading-relaxed">
              By submitting, you confirm that the information provided is truthful to the best of your knowledge. CEGRAD will treat your report with strict confidentiality.
            </Text>
          </div>

          {/* Confidentiality */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-3" htmlFor="confidential-toggle">
              <input
                id="confidential-toggle"
                type="checkbox"
                checked={confidential}
                onChange={(e) => setConfidential(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
              />
              <Text as="span" size="sm" weight="semibold" className="text-gray-800 flex items-center gap-1.5 leading-tight">
                {confidential ? <EyeOff size={14} className="shrink-0" /> : <Eye size={14} className="shrink-0" />}
                I request that my identity be kept confidential (subject to investigation requirements)
              </Text>
            </label>
          </div>
        </>
      )}

      {/* ─── Navigation ─── */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={step === 1 || submitting}
          onClick={prevStep}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          Previous
        </Button>

        {step < totalSteps ? (
          <Button
            key="next-btn"
            type="button"
            onClick={nextStep}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 inline-flex items-center justify-center gap-1"
          >
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            key="submit-btn"
            type="button"
            variant="report"
            disabled={!submitReady}
            loading={submitting}
            onClick={handleSubmit}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 transition-all"
          >
            Submit Report
          </Button>
        )}
      </div>
    </div>
  )
}
