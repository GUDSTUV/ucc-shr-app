'use client'
import { useEffect, useState } from 'react'
import { Camera, FileText, Mic, UserPlus, EyeOff } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Textarea } from '@/src/components/atoms/textarea'
import { Select } from '@/src/components/atoms/select'
import { FormField } from '@/src/components/molecules/form-field'
import { StepIndicator } from '@/src/components/molecules/step-indicator'
import { AlertBox } from '@/src/components/molecules/alert-box'

type ReportFormProps = {
  canToggleAnonymous?: boolean
  initialContact?: string
}

type EvidenceKind = 'photo' | 'doc' | 'audio'

type EvidenceUploadItem = {
  kind: EvidenceKind
  file: File
}

export function ReportForm({ canToggleAnonymous = false, initialContact = '' }: ReportFormProps) {
  const totalSteps = 3
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [typeValue, setTypeValue] = useState('')
  const [locationValue, setLocationValue] = useState('')
  const [contactValue, setContactValue] = useState(initialContact)
  const [descriptionValue, setDescriptionValue] = useState('')
  const [witness, setWitness] = useState('')
  const [witnesses, setWitnesses] = useState<string[]>([])
  const [anonymous, setAnonymous] = useState(true)
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceUploadItem[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  useEffect(() => {
    if (!canToggleAnonymous) {
      setAnonymous(true)
    }
  }, [canToggleAnonymous])

  useEffect(() => {
    setContactValue(initialContact)
  }, [initialContact])

  const addWitness = () => {
    const value = witness.trim()
    if (!value) return

    setWitnesses((prev) => [...prev, value])
    setWitness('')
  }

  const captureEvidence = (kind: EvidenceKind) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      const nextItems = Array.from(files).map((file) => ({ kind, file }))
      setEvidenceFiles((prev) => [...prev, ...nextItems])
    }

  const uploadEvidenceFiles = async () => {
    if (evidenceFiles.length === 0) return [] as string[]

    const formData = new FormData()

    evidenceFiles.forEach((item) => {
      formData.append('files', item.file)
      formData.append('kinds', item.kind)
    })

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    let result: {
      ok?: boolean
      files?: string[]
      error?: string
    }

    try {
      result = (await response.json()) as {
        ok?: boolean
        files?: string[]
        error?: string
      }
    } catch {
      result = {
        ok: false,
        error: 'Unexpected upload response. Please try again.',
      }
    }

    if (!response.ok || !result.ok || !result.files) {
      throw new Error(result.error ?? 'Unable to upload evidence files.')
    }

    return result.files
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setSubmittedCode(null)

    try {
      const uploadedEvidenceFiles = await uploadEvidenceFiles()

      const payload = {
        type: typeValue,
        location: locationValue,
        contact: contactValue,
        description: descriptionValue,
        isAnonymous: canToggleAnonymous ? anonymous : true,
        witnesses,
        evidenceFiles: uploadedEvidenceFiles,
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
  setContactValue(initialContact)
  setDescriptionValue('')
      setWitness('')
      setWitnesses([])
      setEvidenceFiles([])
      setAnonymous(true)
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
      setStepError('Choose harassment type and provide a description before continuing.')
      return
    }

    setStep((prev) => Math.min(totalSteps, prev + 1))
  }

  const prevStep = () => {
    setStepError(null)
    setStep((prev) => Math.max(1, prev - 1))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
      <StepIndicator step={step} total={totalSteps} />

      {submittedCode ? (
        <AlertBox variant="success" title="Report submitted successfully">
          Your tracking code is {submittedCode}. Save it to follow updates.
        </AlertBox>
      ) : null}

      {submitError ? (
        <AlertBox variant="danger" title="Submission failed">
          {submitError}
        </AlertBox>
      ) : null}

      {stepError ? (
        <AlertBox variant="danger" title="Complete required fields">
          {stepError}
        </AlertBox>
      ) : null}

      <AlertBox variant="info" title="Safety note">
        Do not include identifying details if you want to remain anonymous.
      </AlertBox>

      {step === 1 ? (
        <>
          <FormField label="Sexual harassment type" required>
            <Select name="type" value={typeValue} onChange={(event) => setTypeValue(event.target.value)}>
              <option value="" disabled>Select sexual harassment type</option>
              <option value="verbal">Verbal harassment</option>
              <option value="physical">Physical harassment</option>
              <option value="online">Online harassment</option>
            </Select>
          </FormField>

          <FormField label="Location">
            <Input
              name="location"
              value={locationValue}
              onChange={(event) => setLocationValue(event.target.value)}
              placeholder="Where did this happen?"
            />
          </FormField>

          <FormField label="Contact (phone or email)">
            <Input
              name="contact"
              value={contactValue}
              onChange={(event) => setContactValue(event.target.value)}
              placeholder="How can we reach you for follow-up?"
            />
          </FormField>

          <FormField label="Description" required>
            <Textarea
              name="description"
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              placeholder="Describe what happened"
              rows={6}
            />
          </FormField>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-gray-700">Upload Evidence (Optional)</p>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-navy/40 hover:text-navy">
                <Camera size={15} />
                <span className="mt-1 text-[10px] font-semibold uppercase">Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={captureEvidence('photo')} />
              </label>

              <label className="flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-navy/40 hover:text-navy">
                <FileText size={15} />
                <span className="mt-1 text-[10px] font-semibold uppercase">Doc</span>
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={captureEvidence('doc')} />
              </label>

              <label className="flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-navy/40 hover:text-navy">
                <Mic size={15} />
                <span className="mt-1 text-[10px] font-semibold uppercase">Audio</span>
                <input type="file" accept="audio/*" className="hidden" onChange={captureEvidence('audio')} />
              </label>
            </div>

            {evidenceFiles.length > 0 ? (
              <p className="text-[11px] text-gray-500">{evidenceFiles.length} evidence file(s) selected</p>
            ) : null}

            {evidenceFiles.length > 0 ? (
              <div className="space-y-1">
                {evidenceFiles.map((item, index) => (
                  <p key={`${item.file.name}-${index}`} className="truncate text-[11px] text-gray-500">
                    {item.kind.toUpperCase()}: {item.file.name}
                  </p>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-gray-700">Add Witnesses</p>
            <div className="flex items-center gap-2">
              <Input
                value={witness}
                onChange={(event) => setWitness(event.target.value)}
                placeholder="Name or email"
              />
              <button
                type="button"
                onClick={addWitness}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-light text-navy transition-transform active:scale-95"
                aria-label="Add witness"
              >
                <UserPlus size={17} />
              </button>
            </div>

            {witnesses.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {witnesses.map((item, index) => (
                  <span key={`${item}-${index}`} className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-700">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {canToggleAnonymous ? (
            <>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <div className="flex items-start gap-2">
                  <EyeOff size={15} className="mt-0.5 text-navy" />
                  <div>
                    <p className="text-[12px] font-semibold text-gray-800">Report Anonymously</p>
                    <p className="text-[11px] text-gray-500">
                      {anonymous ? 'Identity will not be revealed' : 'Identity may be shared for follow-up'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={anonymous}
                  onClick={() => setAnonymous((prev) => !prev)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${anonymous ? 'bg-navy' : 'bg-gray-300'}`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${anonymous ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <p className="text-right text-[11px] font-semibold text-gray-500">
                Anonymous: {anonymous ? 'ON' : 'OFF'}
              </p>
            </>
          ) : null}
        </>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <h3 className="text-sm font-semibold text-navy">Review Before Submit</h3>
          <p className="text-xs text-gray-700"><span className="font-semibold">Type:</span> {typeValue || '-'}</p>
          <p className="text-xs text-gray-700"><span className="font-semibold">Location:</span> {locationValue || '-'}</p>
          <p className="text-xs text-gray-700"><span className="font-semibold">Contact:</span> {contactValue || '-'}</p>
          <p className="text-xs text-gray-700"><span className="font-semibold">Description:</span> {descriptionValue || '-'}</p>
          <p className="text-xs text-gray-700"><span className="font-semibold">Witnesses:</span> {witnesses.length}</p>
          <p className="text-xs text-gray-700"><span className="font-semibold">Evidence files:</span> {evidenceFiles.length}</p>
          <p className="text-xs text-gray-700"><span className="font-semibold">Anonymous:</span> {anonymous ? 'Yes' : 'No'}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" disabled={step === 1 || submitting} onClick={prevStep}>
          Previous
        </Button>

        {step < totalSteps ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            variant="report"
            loading={submitting}
          >
            Submit report
          </Button>
        )}
      </div>
    </form>
  )
}
