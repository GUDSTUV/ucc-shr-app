'use client'
import { useEffect, useState } from 'react'
import { UserPlus, Phone, Shield } from 'lucide-react'
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
  { value: 'verbal', label: 'Verbal Sexual Harassment — Unwelcome sexual comments, jokes, or remarks' },
  { value: 'physical', label: 'Unwanted Touching / Physical Sexual Harassment' },
  { value: 'online', label: 'Cyber/Digital Sexual Harassment — Unsolicited sexual messages or image sharing' },
  { value: 'quid_pro_quo', label: 'Quid Pro Quo — Grades, favours, or benefits demanded in exchange for sexual acts' },
  { value: 'other', label: 'Other — Any other form of sexual or gender-based harassment' },
] as const

export function ReportForm({ initialContact = '' }: ReportFormProps) {
  const totalSteps = 3
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [typeValue, setTypeValue] = useState('')
  const [locationValue, setLocationValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [witness, setWitness] = useState('')
  const [witnesses, setWitnesses] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  // Keep contact in sync with session email
  useEffect(() => {
    // initialContact is just the email from the session — we don't need a separate field for it
  }, [initialContact])

  const addWitness = () => {
    const value = witness.trim()
    if (!value) return

    setWitnesses((prev) => [...prev, value])
    setWitness('')
  }

  const removeWitness = (index: number) => {
    setWitnesses((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setSubmittedCode(null)

    try {
      const payload = {
        type: typeValue,
        location: locationValue,
        contact: initialContact, // Always use the session email
        phone: phoneValue.trim() || undefined,
        description: descriptionValue,
        isAnonymous: false,
        witnesses,
        incidentDate: incidentDate || undefined,
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      let result: {
        ok?: boolean
        code?: string
        error?: string
      }

      try {
        result = (await response.json()) as {
          ok?: boolean
          code?: string
          error?: string
        }
      } catch {
        result = {
          ok: false,
          error: 'Unexpected server response. Please try again.',
        }
      }

      if (!response.ok || !result.ok) {
        setSubmitError(result.error ?? 'Unable to submit report. Please try again.')
        return
      }

      setSubmittedCode(result.code ?? null)
      setStep(1)
      setTypeValue('')
      setLocationValue('')
      setPhoneValue('')
      setDescriptionValue('')
      setIncidentDate('')
      setWitness('')
      setWitnesses([])
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Network error while submitting report. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
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

  if (submittedCode) {
    return (
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <Shield className="h-7 w-7 text-green-600" />
          </div>
          <Heading as="h3" size="lg" weight="bold" tone="navy" className="mt-4">Report Submitted Successfully</Heading>
          <Text size="sm" tone="muted" className="mt-2 leading-relaxed">
            Your report has been securely received by CEGRAD. A member of the team will review it and
            reach out to you. You can check the status of your report or message your assigned counsellor directly from your Dashboard.
          </Text>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setSubmittedCode(null)}
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 md:p-6">
      <StepIndicator step={step} total={totalSteps} />

      {submitError && (
        <AlertBox variant="danger" title="Submission failed">
          {submitError}
        </AlertBox>
      )}

      {stepError && (
        <AlertBox variant="danger" title="Complete required fields">
          {stepError}
        </AlertBox>
      )}

      {/* ─── Step 1: What happened ─── */}
      {step === 1 && (
        <>
          <FormField label="Type of harassment" required>
            <Select
              name="type"
              value={typeValue}
              onChange={(event) => setTypeValue(event.target.value)}
              aria-label="Select the type of harassment"
            >
              <option value="" disabled>Select the type of harassment</option>
              {HARASSMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Describe what happened" required>
            <Textarea
              name="description"
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              placeholder="Please describe the incident in as much detail as you feel comfortable sharing. Include what was said or done, and by whom if known."
              rows={6}
              aria-label="Description of the incident"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Where did it happen?" hint="Campus location, hall, department, etc.">
              <Input
                name="location"
                value={locationValue}
                onChange={(event) => setLocationValue(event.target.value)}
                placeholder="e.g. Science Faculty, Casely Hayford Hall"
                aria-label="Location of the incident"
              />
            </FormField>

            <FormField label="When did it happen?" hint="Approximate date if unsure">
              <Input
                type="date"
                name="incidentDate"
                value={incidentDate}
                onChange={(event) => setIncidentDate(event.target.value)}
                aria-label="Date of the incident"
              />
            </FormField>
          </div>
        </>
      )}

      {/* ─── Step 2: Additional details ─── */}
      {step === 2 && (
        <>
          <FormField
            label="Phone number"
            hint="Optional — an additional way for CEGRAD to reach you for follow-up."
          >
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="tel"
                name="phone"
                value={phoneValue}
                onChange={(event) => setPhoneValue(event.target.value)}
                placeholder="e.g. 024 123 4567"
                className="pl-9"
                aria-label="Phone number for follow-up"
              />
            </div>
          </FormField>

          <div className="space-y-2">
            <Text as="p" size="sm" weight="semibold" className="text-[13px] text-gray-700">Witnesses (Optional)</Text>
            <Text as="p" size="xs" tone="muted">
              If anyone else was present or is aware of the situation, you can add their name or contact below.
            </Text>
            <div className="flex items-center gap-2">
              <Input
                value={witness}
                onChange={(event) => setWitness(event.target.value)}
                placeholder="Name, email, or phone"
                aria-label="Add a witness"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addWitness()
                  }
                }}
              />
              <Button
                variant="unstyled"
                type="button"
                onClick={addWitness}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-light text-navy transition-transform hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:scale-95"
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
        </>
      )}

      {/* ─── Step 3: Review ─── */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl bg-navy-light p-4">
            <Text as="h3" size="sm" weight="bold" tone="navy">Review Your Report</Text>
            <Text size="xs" tone="muted" className="mt-1">
              Please review the details below before submitting. You can go back to make changes.
            </Text>
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div>
              <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Harassment Type</Text>
              <Text as="p" size="sm" className="mt-0.5 text-gray-800">
                {HARASSMENT_TYPES.find((t) => t.value === typeValue)?.label ?? typeValue}
              </Text>
            </div>

            <div>
              <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Description</Text>
              <Text as="p" size="sm" className="mt-0.5 leading-relaxed text-gray-800">{descriptionValue}</Text>
            </div>

            {locationValue && (
              <div>
                <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Location</Text>
                <Text as="p" size="sm" className="mt-0.5 text-gray-800">{locationValue}</Text>
              </div>
            )}

            {incidentDate && (
              <div>
                <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Date of Incident</Text>
                <Text as="p" size="sm" className="mt-0.5 text-gray-800">
                  {new Date(incidentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Text>
              </div>
            )}

            {phoneValue && (
              <div>
                <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Phone</Text>
                <Text as="p" size="sm" className="mt-0.5 text-gray-800">{phoneValue}</Text>
              </div>
            )}

            <div>
              <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Email (from your account)</Text>
              <Text as="p" size="sm" className="mt-0.5 text-gray-800">{initialContact || 'N/A'}</Text>
            </div>

            {witnesses.length > 0 && (
              <div>
                <Text as="p" size="xs" weight="semibold" tone="muted" className="text-[11px] uppercase tracking-wider text-gray-400">Witnesses</Text>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {witnesses.map((w, i) => (
                    <span key={`review-${w}-${i}`} className="rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-700 ring-1 ring-gray-200">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Text as="p" size="xs" tone="muted" className="leading-relaxed">
            By submitting this report, you confirm that the information provided is truthful to the best of your knowledge.
            CEGRAD will treat your report with strict confidentiality.
          </Text>
        </div>
      )}

      {/* ─── Navigation buttons ─── */}
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
            type="button"
            onClick={nextStep}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            variant="report"
            loading={submitting}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            Submit Report
          </Button>
        )}
      </div>
    </form>
  )
}
