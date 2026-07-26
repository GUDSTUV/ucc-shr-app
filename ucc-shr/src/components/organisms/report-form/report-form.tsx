'use client'
import { useState, useEffect } from 'react'
import { UserPlus, Phone, Shield, Eye, EyeOff, ChevronRight, ChevronLeft, Pencil } from 'lucide-react'
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

const GENDER_OPTIONS = ['Male', 'Female'] as const
const USER_TYPE_OPTIONS = ['Student', 'Staff', 'External / Other'] as const
const RESPONDENT_POSITION_OPTIONS = ['Student', 'Lecturer / Teaching Staff', 'Non-Teaching Staff', 'External / Other'] as const
const RELATIONSHIP_OPTIONS = ['Lecturer', 'Supervisor', 'Peer / Classmate', 'Colleague', 'Unknown', 'Other'] as const

const STEP_INDICATOR_LABELS = ['Incident', 'Involved', 'Contact', 'Review']

const STEP_TITLES = [
  'What happened?',
  'Who was involved?',
  'How to reach you',
  'Review & Submit',
]

const STEP_SUBTITLES = [
  'Start by telling us a bit about yourself, then describe the incident.',
  'Help us understand who was involved.',
  'Let us know how CEGRAD can contact you.',
  'Review everything carefully before submitting. You can edit any section.',
]

export function ReportForm({ initialContact = '' }: ReportFormProps) {
  const totalSteps = 4
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitReady, setSubmitReady] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  // Cooldown timer to prevent double-click / keyboard-chaining on final step
  useEffect(() => {
    if (step === totalSteps) {
      setSubmitReady(false)
      const timer = setTimeout(() => setSubmitReady(true), 400)
      return () => clearTimeout(timer)
    }
  }, [step, totalSteps])

  // Step 1 — About you
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [userType, setUserType] = useState('')
  const [studentId, setStudentId] = useState('')
  const [department, setDepartment] = useState('')

  // Step 1 — What happened
  const [typeValue, setTypeValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [locationValue, setLocationValue] = useState('')

  // Step 2 — Who was involved
  const [respondentName, setRespondentName] = useState('')
  const [respondentPosition, setRespondentPosition] = useState('')
  const [respondentDepartment, setRespondentDepartment] = useState('')
  const [respondentRelationship, setRespondentRelationship] = useState('')
  const [offenderDescription, setOffenderDescription] = useState('')
  const [witness, setWitness] = useState('')
  const [witnesses, setWitnesses] = useState<string[]>([])
  const [priorReported, setPriorReported] = useState<boolean | null>(null)
  const [priorReportWhere, setPriorReportWhere] = useState('')

  // Step 3 — How to reach you
  const [phoneValue, setPhoneValue] = useState('')

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
    if (step === 1) {
      if (!fullName.trim() || !gender || !userType) {
        setStepError('Please complete the mandatory "About You" details (Name, Gender, Type).')
        return
      }
      if (!typeValue || !descriptionValue.trim()) {
        setStepError('Please select a harassment type and describe what happened before continuing.')
        return
      }
    }
    setStep((prev) => Math.min(totalSteps, prev + 1))
  }

  const prevStep = () => {
    setStepError(null)
    setStep((prev) => Math.max(1, prev - 1))
  }

  const goToStep = (s: number) => {
    setStepError(null)
    setStep(s)
  }

  const handleSubmit = async () => {
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
        complainantName: fullName.trim() || undefined,
        complainantGender: gender || undefined,
        complainantUserType: userType || undefined,
        complainantStudentId: studentId.trim() || undefined,
        complainantDepartment: department.trim() || undefined,
        respondentName: respondentName.trim() || undefined,
        respondentPosition: respondentPosition || undefined,
        respondentDepartment: respondentDepartment.trim() || undefined,
        respondentRelationship: respondentRelationship || undefined,
        offenderDescription: offenderDescription.trim() || undefined,
        witnesses,
        priorReport: priorReported !== null
          ? { reported: priorReported, where: priorReportWhere.trim() || undefined }
          : undefined,
        contact: initialContact,
        phone: phoneValue.trim() || undefined,
        confidentialityRequested: true,
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
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <Heading as="h3" size="xl" weight="semibold" tone="navy" className="mt-5">
            Report Submitted
          </Heading>
          <Text size="sm" tone="muted" className="mt-3 max-w-sm leading-relaxed">
            Your report has been securely received by CEGRAD. A member of the team will
            reach out to you. You can also track the status from your Dashboard.
          </Text>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-navy-light/50 px-4 py-3 text-left text-sm text-navy">
            <Shield size={16} className="mt-0.5 shrink-0" />
            <span>Your identity will be kept <strong>confidential</strong> (subject to investigation requirements).</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
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
              setFullName('')
              setGender('')
              setUserType('')
              setStudentId('')
              setDepartment('')
              setRespondentName('')
              setRespondentPosition('')
              setRespondentDepartment('')
              setRespondentRelationship('')
              setOffenderDescription('')
              setWitnesses([])
              setPriorReported(null)
              setPriorReportWhere('')
              setPhoneValue('')
            }}
          >
            Submit Another
          </Button>
          <a
            href="/user/userReports"
            className="flex flex-1 items-center justify-center rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // ─── Main form ───
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* ── Step indicator header ── */}
      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-6 sm:px-10">
        <StepIndicator step={step} total={totalSteps} labels={STEP_INDICATOR_LABELS} />
      </div>

      {/* ── Step title block ── */}
      <div className="px-6 pt-8 pb-1 sm:px-10">
        <Heading as="h2" size="xl" weight="semibold" tone="navy">
          {STEP_TITLES[step - 1]}
        </Heading>
        <Text size="sm" tone="muted" className="mt-2 max-w-md leading-relaxed">
          {STEP_SUBTITLES[step - 1]}
        </Text>
      </div>

      {/* ── Form body ── */}
      <div className="space-y-8 px-6 py-8 sm:px-10">

        {/* Alerts */}
        {(submitError || stepError) && (
          <div className="space-y-3">
            {submitError && (
              <AlertBox variant="danger" title="Submission failed">{submitError}</AlertBox>
            )}
            {stepError && (
              <AlertBox variant="danger" title="Complete required fields">{stepError}</AlertBox>
            )}
          </div>
        )}

        {/* ─── Step 1: What happened ─── */}
        {step === 1 && (
          <div className="space-y-7">

            {/* About You sub-section */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <Heading as="h3" size={{ base: 'base', md: 'lg' }} weight="semibold" tone="navy">About You</Heading>
              </div>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Full Name" required>
                    <Input
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Abena Mensah"
                      aria-label="Your full name"
                    />
                  </FormField>
                  <FormField label="Gender" required>
                    <Select
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      aria-label="Your gender"
                    >
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </Select>
                  </FormField>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Are you a Student or Staff?" required>
                    <Select
                      name="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      aria-label="Student or Staff"
                    >
                      <option value="">Select one</option>
                      {USER_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Student / Staff ID (Optional)">
                    <Input
                      name="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. UCC/SCI/21/0012"
                      aria-label="Your student or staff ID"
                    />
                  </FormField>
                </div>
                <FormField label="Department / Unit">
                  <Input
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Faculty of Social Sciences"
                    aria-label="Your department or unit"
                  />
                </FormField>
              </div>
            </div>

            {/* Visual Divider */}
            <div className="h-1.5 w-full rounded-full bg-gray-100/70" />

            {/* Incident details sub-section */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <Heading as="h3" size={{ base: 'base', md: 'lg' }} weight="semibold" tone="navy">The Incident</Heading>
                <Text size="xs" tone="muted" className="mt-0.5">Describe what happened in as much or as little detail as you're comfortable with.</Text>
              </div>
              <div className="space-y-6">
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

                <FormField
                  label="Describe what happened"
                  required
                  hint="Share as much or as little as you feel comfortable with."
                >
                  <Textarea
                    name="description"
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    placeholder="Describe the incident — what happened, when, and how it affected you."
                    rows={6}
                    aria-label="Description of the incident"
                  />
                </FormField>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField label="Where did the incident happen?">
                    <Input
                      name="location"
                      value={locationValue}
                      onChange={(e) => setLocationValue(e.target.value)}
                      placeholder="e.g. Science Faculty, WhatsApp"
                      aria-label="Location of the incident"
                    />
                  </FormField>
                  <FormField label="When did it happen? (Approximate date is fine)" >
                    <Input
                      type="date"
                      name="incidentDate"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      aria-label="Date of the incident"
                    />
                  </FormField>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ─── Step 2: Who was involved ─── */}
        {step === 2 && (
          <div className="space-y-8">

            {/* Respondent structured fields */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <Heading as="h3" size={{ base: 'base', md: 'lg' }} weight="semibold" tone="navy">Respondent (Alleged Offender) Details</Heading>
                <Text size="xs" tone="muted" className="mt-0.5">All fields below are optional. Share whatever you know.</Text>
              </div>
              <div className="space-y-5">
                <FormField label="Full Name">
                  <Input
                    name="respondentName"
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    placeholder="e.g. John Doe"
                    aria-label="Respondent full name"
                  />
                </FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Position">
                    <Select
                      name="respondentPosition"
                      value={respondentPosition}
                      onChange={(e) => setRespondentPosition(e.target.value)}
                      aria-label="Respondent position"
                    >
                      <option value="">Select one</option>
                      {RESPONDENT_POSITION_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField label="Relationship to you">
                    <Select
                      name="respondentRelationship"
                      value={respondentRelationship}
                      onChange={(e) => setRespondentRelationship(e.target.value)}
                      aria-label="Respondent relationship to complainant"
                    >
                      <option value="">Select one</option>
                      {RELATIONSHIP_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Select>
                  </FormField>
                </div>
                <FormField label="Department / unit" hint="If known">
                  <Input
                    name="respondentDepartment"
                    value={respondentDepartment}
                    onChange={(e) => setRespondentDepartment(e.target.value)}
                    placeholder="e.g. Department of Economics"
                    aria-label="Respondent department"
                  />
                </FormField>
              </div>
            </div>

            {/* Witnesses */}
            <div className="space-y-4">
              <div>
                <Text as="p" size="sm" weight="semibold" className="text-gray-800">
                  Were there any witnesses?{' '}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </Text>
                <Text as="p" size="xs" tone="muted" className="mt-1">
                  Add anyone who was present or is aware of the situation.
                </Text>
              </div>
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
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-light text-navy transition hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 active:scale-95"
                  aria-label="Add witness"
                >
                  <UserPlus size={17} />
                </Button>
              </div>
              {witnesses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {witnesses.map((item, index) => (
                    <Button
                      variant="unstyled"
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => removeWitness(index)}
                      className="group inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-red/10 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
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
            <div className="space-y-4">
              <div>
                <Text as="p" size="sm" weight="semibold" className="text-gray-800">
                  Have you reported this incident anywhere else?{' '}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </Text>
              </div>
              <div className="flex gap-3">
                {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setPriorReported(val)}
                    className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 ${
                      priorReported === val
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-navy/40 hover:text-navy'
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
          </div>
        )}

        {/* ─── Step 3: How to reach you ─── */}
        {step === 3 && (
          <div className="space-y-7">
            <FormField label="Your email">
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="flex-1 text-sm md:text-base text-gray-700">{initialContact || 'Not available'}</span>
              </div>
            </FormField>

            <FormField label="Phone number" hint="Optional — an alternative way for CEGRAD to reach you.">
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  name="phone"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  placeholder="e.g. 024 123 4567"
                  className="pl-10"
                  aria-label="Phone number for follow-up"
                />
              </div>
            </FormField>

          </div>
        )}

        {/* ─── Step 4: Review & Submit ─── */}
        {step === 4 && (
          <div className="space-y-5">

            {/* Section: About You */}
            <ReviewSection title="About You" onEdit={() => goToStep(1)}>
              {fullName && <ReviewRow label="Name" value={fullName} />}
              {gender && <ReviewRow label="Gender" value={gender} />}
              {userType && <ReviewRow label="Type" value={userType} />}
              {studentId && <ReviewRow label="ID" value={studentId} />}
              {department && <ReviewRow label="Department" value={department} />}
              {!fullName && !gender && !userType && !studentId && !department && (
                <ReviewRow label="Details" value="Not provided" />
              )}
            </ReviewSection>

            {/* Section: The Incident */}
            <ReviewSection title="The Incident" onEdit={() => goToStep(1)}>
              <ReviewRow
                label="Type"
                value={HARASSMENT_TYPES.find((t) => t.value === typeValue)?.label ?? typeValue}
              />
              <ReviewRow label="Description" value={descriptionValue} multiline />
              {locationValue && <ReviewRow label="Location" value={locationValue} />}
              {incidentDate && (
                <ReviewRow
                  label="Date"
                  value={new Date(incidentDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                />
              )}
            </ReviewSection>

            {/* Section: People Involved */}
            <ReviewSection title="Respondent (Alleged Offender) Details" onEdit={() => goToStep(2)}>
              {respondentName && <ReviewRow label="Name" value={respondentName} />}
              {respondentPosition && <ReviewRow label="Position" value={respondentPosition} />}
              {respondentRelationship && <ReviewRow label="Relationship" value={respondentRelationship} />}
              {respondentDepartment && <ReviewRow label="Department" value={respondentDepartment} />}
              <ReviewRow
                label="Description"
                value={offenderDescription.trim() || 'Not provided'}
                multiline
              />
              <ReviewRow
                label="Witnesses"
                value={witnesses.length > 0 ? witnesses.join(', ') : 'None added'}
              />
              {priorReported !== null && (
                <ReviewRow
                  label="Reported elsewhere"
                  value={priorReported ? (priorReportWhere.trim() || 'Yes — location not specified') : 'No'}
                />
              )}
            </ReviewSection>

            {/* Section: Your Contact */}
            <ReviewSection title="Your Contact" onEdit={() => goToStep(3)}>
              <ReviewRow label="Email" value={initialContact || 'Not available'} />
              {phoneValue && <ReviewRow label="Phone" value={phoneValue} />}
              <ReviewRow
                label="Privacy"
                value="Strictly Confidential"
              />
            </ReviewSection>

            {/* Declaration */}
            <div className="rounded-xl bg-gray-50 px-5 py-4 space-y-2">
              <Text as="p" size="sm" tone="muted" weight="semibold" className="text-gray-700">
                By submitting this report, you confirm that:
              </Text>
              <ul className="list-inside list-disc space-y-1 text-xs text-gray-500">
                <li>The information you have provided is accurate and truthful to the best of your knowledge.</li>
                <li>Your identity will be kept confidential, except where disclosure is required as part of the investigation process.</li>
              </ul>
            </div>

          </div>
        )}

        {/* ─── Navigation ─── */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1 || submitting}
            onClick={prevStep}
            className="inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
          >
            <ChevronLeft size={16} />
            Back
          </Button>

          {step < totalSteps ? (
            <Button
              key="next-btn"
              type="button"
              onClick={nextStep}
              className="flex-1 inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              Continue <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              key="submit-btn"
              type="button"
              variant="report"
              disabled={!submitReady}
              loading={submitting}
              onClick={handleSubmit}
              className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 transition-all"
            >
              Submit Report
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Review helper components ───

function ReviewSection({
  title,
  children,
  onEdit,
}: {
  title: string
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
        <Text as="h3" size="sm" weight="semibold" tone="navy">
          {title}
        </Text>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        >
          <Pencil size={11} />
          Edit
        </button>
      </div>
      <div className="divide-y divide-gray-100 px-5">
        {children}
      </div>
    </div>
  )
}

function ReviewRow({
  label,
  value,
  multiline = false,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div className={`py-4 ${multiline ? 'flex flex-col gap-2' : 'flex items-start justify-between gap-6'}`}>
      <span className="shrink-0 text-[11px] md:text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <span className={`text-sm md:text-base text-gray-900 ${multiline ? 'whitespace-pre-wrap leading-relaxed' : 'text-right'}`}>
        {value}
      </span>
    </div>
  )
}
