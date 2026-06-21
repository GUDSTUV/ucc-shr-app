import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock3, FileText, Mic, EyeOff } from 'lucide-react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireAdmin } from '@/src/lib/auth/guards'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { logActivity } from '@/src/lib/audit'
import { parseReportNotes, canViewConfidentialDetails } from '@/src/lib/auth/report-access'
import { StatusBadge } from '@/src/components/molecules/status-badge'
import { AdminReportUpdateForm } from './admin-report-update-form'
import { ReportChat } from '@/src/components/organisms/report-chat'
import { WorkflowStepper } from '@/src/components/organisms/workflow-stepper'
import { PrintButton } from '@/src/components/atoms/print-button/print-button'

type PageProps = {
  params: Promise<{ code: string }>
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function parseEvidenceItem(item: string) {
  const [kind, ...rest] = item.split(':')
  const rawValue = rest.join(':').trim() || item

  const url = rawValue.startsWith('/uploads/') || rawValue.startsWith('http://') || rawValue.startsWith('https://')
    ? rawValue
    : null
  const fileName = url ? rawValue.split('/').pop() || rawValue : rawValue

  if (kind === 'audio') return { kindLabel: 'Audio', icon: Mic, fileName, url }
  if (kind === 'doc') return { kindLabel: 'Document', icon: FileText, fileName, url }
  return { kindLabel: 'Evidence', icon: FileText, fileName, url }
}

function isImageFile(fileName: string) {
  return /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(fileName)
}

function isAudioFile(fileName: string) {
  return /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(fileName)
}

function getAudioMimeType(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'mp3') return 'audio/mpeg'
  if (ext === 'wav') return 'audio/wav'
  if (ext === 'ogg') return 'audio/ogg'
  if (ext === 'm4a') return 'audio/mp4'
  if (ext === 'aac') return 'audio/aac'
  if (ext === 'flac') return 'audio/flac'
  if (ext === 'webm') return 'audio/webm'
  return undefined
}

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  HIGH: 'bg-red-50 text-red-700 ring-1 ring-red-200',
}

const OUTCOME_LABELS: Record<string, string> = {
  SUBSTANTIATED: 'Complaint Substantiated',
  NOT_SUBSTANTIATED: 'Complaint Not Substantiated',
  INCONCLUSIVE: 'Inconclusive',
}

const ACTION_LABELS: Record<string, string> = {
  WARNING_ISSUED: 'Warning Issued',
  DISCIPLINARY_ACTION: 'Disciplinary Action',
  REFERRAL_TO_MANAGEMENT: 'Referral to Management',
  COUNSELLING_SUPPORT: 'Counselling Support',
  LEGAL_REFERRAL: 'Legal Referral',
}

/** Masked placeholder shown when the viewing admin cannot see confidential details */
function HiddenField({ label }: { label: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">{label}</p>
      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <EyeOff size={13} />
        <span className="italic">Hidden — Confidential Report</span>
      </div>
    </div>
  )
}

export default async function AdminReportDetailsPage({ params }: PageProps) {
  await requireAdmin()
  const session = await auth()
  const currentUserId = session?.user?.id ?? ''
  const currentUserRole = session?.user?.role ?? ''

  const { code } = await params
  const reportCode = decodeURIComponent(code).trim()

  if (!reportCode) notFound()

  const [report, counsellors] = await Promise.all([
    prisma.report.findUnique({
      where: { code: reportCode },
      select: {
        code: true,
        status: true,
        type: true,
        description: true,
        location: true,
        date: true,
        files: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ['SUPER_ADMIN', 'ADMIN', 'COUNSELOR', 'INVESTIGATOR'] } },
      orderBy: [{ role: 'asc' }, { name: 'asc' }, { email: 'asc' }],
      select: { id: true, name: true, email: true, role: true },
    }),
  ])

  if (!report) notFound()

  const notes = parseReportNotes(report.notes)
  const updates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
  const witnesses = Array.isArray(notes.witnesses) ? notes.witnesses : []
  const evidenceFiles = report.files ?? []
  const assignedCounsellor = notes.counsellorName ?? null
  const currentCounsellorId = notes.counsellorId ?? null

  // ─── Privacy enforcement ───
  const canSeeConfidential = canViewConfidentialDetails(notes, currentUserId, currentUserRole)
  const isConfidential = Boolean(notes.confidentialityRequested)

  // ─── Audit: record that this admin viewed the report ───
  if (currentUserId) {
    logActivity({
      userId: currentUserId,
      action: 'VIEWED',
      resourceType: 'REPORT',
      resourceId: reportCode,
      details: { isConfidential, viewedIdentity: canSeeConfidential },
    })
  }

  const counsellorOptions = counsellors.map((user) => ({
    id: user.id,
    label: `${user.name || user.email} (${user.role})`,
  }))

  return (
    <AdminLayout title="Report Details">
      <div className="flex items-center justify-between mb-5 print:hidden">
        <Link href="/admin/reports" className="inline-flex items-center gap-1 text-base font-semibold text-navy hover:text-navy-dark">
          <ArrowLeft size={14} /> Back to reports
        </Link>
        <PrintButton />
      </div>

      {/* Confidentiality banner */}
      {isConfidential && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">
          <EyeOff size={15} className="shrink-0" />
          <span>
            <strong>Confidential Report</strong> — The reporter has requested their identity be kept private.
            {canSeeConfidential
              ? ' You can see their details because you are a Super Admin or the assigned investigator.'
              : ' Their contact details are hidden from you. Only the Super Admin or the assigned investigator can see them.'}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-8 w-full max-w-6xl">

        {/* Left Pane: Report Details */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Report Code</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">{report.code}</h2>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div className="mt-6 mb-2 border-y border-gray-100 py-6 print:hidden">
              <WorkflowStepper currentStatus={report.status} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Type</p>
                <p className="mt-1 text-base text-gray-900">{report.type}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Location</p>
                <p className="mt-1 text-base text-gray-900">{report.location || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Description</p>
                <p className="mt-1 text-base leading-relaxed text-gray-900 whitespace-pre-wrap">{report.description}</p>
              </div>

              {/* ─── Reporter Contact (privacy-gated) ─── */}
              {isConfidential && !canSeeConfidential ? (
                <>
                  <HiddenField label="Reporter Contact" />
                  <HiddenField label="Reporter Email" />
                  <HiddenField label="Phone Number" />
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Submitted Contact</p>
                    <p className="mt-1 text-base text-gray-900">{notes.contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Reporter Email</p>
                    <p className="mt-1 text-base text-gray-900">{notes.reporterEmail || 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Phone Number</p>
                    <p className="mt-1 text-base text-gray-900">{notes.phone || 'Not provided'}</p>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Assigned Investigator</p>
                <p className="mt-1 text-base text-gray-900">{assignedCounsellor || 'Unassigned'}</p>
              </div>

              {/* Offender description */}
              {notes.offenderDescription && (
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Person Responsible (as described by reporter)</p>
                  <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">{notes.offenderDescription}</p>
                </div>
              )}

              {/* Prior report */}
              {notes.priorReport && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Previously Reported?</p>
                  <p className="mt-1 text-base text-gray-900">
                    {notes.priorReport.reported ? `Yes — ${notes.priorReport.where || 'Location not specified'}` : 'No'}
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-700 md:col-span-2 print:mt-4 print:pt-4 print:border-t print:border-gray-200">
                Submitted: {formatDate(report.createdAt)} | Last updated: {formatDate(report.updatedAt)}
              </div>
            </div>

            {/* Witnesses */}
            <div className="mt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Witnesses</p>
              {isConfidential && !canSeeConfidential ? (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <EyeOff size={13} />
                  <span className="italic">Hidden — Confidential Report</span>
                </div>
              ) : witnesses.length > 0 ? (
                <ul className="mt-2 space-y-2 text-base text-gray-900">
                  {witnesses.map((witness, index) => (
                    <li key={`${witness}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2.5 print:bg-transparent print:px-0">
                      • {witness}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-base text-gray-700">No witness details were submitted.</p>
              )}
            </div>
          </section>

          {/* Assessment Summary (visible when set) */}
          {(notes.riskLevel || notes.investigationOutcome || (notes.actionsTaken && notes.actionsTaken.length > 0)) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Investigator Assessment</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {notes.riskLevel && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Risk Level</p>
                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${RISK_STYLES[notes.riskLevel] ?? ''}`}>
                      {notes.riskLevel.charAt(0) + notes.riskLevel.slice(1).toLowerCase()}
                    </span>
                  </div>
                )}
                {notes.investigationOutcome && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Outcome</p>
                    <p className="mt-1 text-sm text-gray-900">{OUTCOME_LABELS[notes.investigationOutcome] ?? notes.investigationOutcome}</p>
                  </div>
                )}
                {notes.actionsTaken && notes.actionsTaken.length > 0 && (
                  <div className="sm:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Actions Taken</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {notes.actionsTaken.map((action) => (
                        <span key={action} className="rounded-full bg-navy-light px-3 py-1 text-xs font-medium text-navy">
                          {ACTION_LABELS[action] ?? action}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Evidence Files */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] print:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-700">Evidence Files</p>
            {evidenceFiles.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {evidenceFiles.map((item, index) => {
                  const parsed = parseEvidenceItem(item)
                  const audioInline = parsed.url && (parsed.kindLabel === 'Audio' || isAudioFile(parsed.fileName))
                  const fileUrl = parsed.url ?? undefined

                  return (
                    <li key={`${item}-${index}`} className="rounded-lg bg-gray-50 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <parsed.icon size={14} className="text-navy" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-600">{parsed.kindLabel}</p>
                          {parsed.url && !audioInline ? (
                            <a href={parsed.url} target="_blank" rel="noreferrer" className="block break-all text-base text-navy underline underline-offset-2">
                              {parsed.fileName}
                            </a>
                          ) : (
                            <p className="break-all text-base text-gray-900">{parsed.fileName}</p>
                          )}
                        </div>
                      </div>
                      {audioInline ? (
                        <audio controls controlsList="nodownload" preload="metadata" className="mt-2 w-full">
                          <source src={fileUrl} type={getAudioMimeType(parsed.fileName)} />
                          Your browser does not support audio playback.
                        </audio>
                      ) : null}
                      {parsed.url && isImageFile(parsed.fileName) ? (
                        <a href={parsed.url} target="_blank" rel="noreferrer" className="mt-2 block">
                          <Image src={parsed.url} alt={parsed.fileName} width={1200} height={800} unoptimized className="max-h-56 w-full rounded-md border border-gray-200 object-cover" />
                        </a>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-1 text-base text-gray-700">Evidence will be collected in person during the investigation, per CEGRAD policy.</p>
            )}
          </section>

          {/* Update History */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] print:mt-6">
            <h3 className="text-base font-semibold uppercase tracking-[0.08em] text-gray-700">Update History</h3>
            {updates.length > 0 ? (
              <ul className="mt-3 space-y-3 print:space-y-4">
                {updates.map((update) => (
                  <li key={update.id} className="rounded-xl bg-gray-50 p-4 print:border print:border-gray-300 print:bg-white print:break-inside-avoid">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={update.status} />
                      <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                        <Clock3 size={12} /> {formatDate(update.at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-700">By {update.by}</p>
                    <p className="mt-1 text-base text-gray-900">{update.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-base text-gray-700">No admin updates yet.</p>
            )}
          </section>
        </div>

        {/* Right Pane: Admin Actions & Messaging */}
        <div className="space-y-6 print:hidden">
          <div className="sticky top-6 space-y-6">
            <AdminReportUpdateForm
              code={report.code}
              currentStatus={report.status}
              counsellors={counsellorOptions}
              currentCounsellorId={currentCounsellorId}
              currentRiskLevel={notes.riskLevel ?? null}
              currentOutcome={notes.investigationOutcome ?? null}
              currentActionsTaken={notes.actionsTaken ?? []}
            />
            <section>
              <ReportChat reportCode={report.code} isAssignedCounsellor={true} />
            </section>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
