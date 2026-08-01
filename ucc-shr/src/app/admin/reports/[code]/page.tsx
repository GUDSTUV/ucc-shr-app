import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock3, FileText, EyeOff } from 'lucide-react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireAdmin } from '@/src/lib/auth/guards'
import { isCaseOfficerRole } from '@/src/lib/auth/roles'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { logActivity } from '@/src/lib/audit'
import { parseReportNotes, canViewConfidentialDetails } from '@/src/lib/auth/report-access'
import { StatusBadge } from '@/src/components/molecules/status-badge'
import { AdminReportUpdateForm } from './admin-report-update-form'
import { ReportEmailForm } from './report-email-form'
import { Button } from '@/src/components/atoms/button/button'
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
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
        <EyeOff size={13} />
        <span className="italic">Hidden — Confidential Report</span>
      </div>
    </div>
  )
}

export default async function AdminReportDetailsPage({ params }: PageProps) {
  const session = await requireAdmin()
  const currentUserId = session?.user?.id ?? ''
  const currentUserRole = session?.user?.role ?? ''
  const isCaseOfficer = isCaseOfficerRole(currentUserRole)

  const { code } = await params
  const reportCode = decodeURIComponent(code).trim()

  if (!reportCode) notFound()

  const [report, counsellors] = await Promise.all([
    prisma.report.findUnique({
      where: { code: reportCode },
      select: {
        id: true,
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

  const { markAllReportNotificationsAsRead } = await import('@/src/lib/notification-service')
  await markAllReportNotificationsAsRead(currentUserId, currentUserRole, report.id)

  const notes = parseReportNotes(report.notes)
  const updates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
  const witnesses = Array.isArray(notes.witnesses) ? notes.witnesses : []
  const assignedCounsellor = notes.counsellorName ?? null
  const currentCounsellorId = notes.counsellorId ?? null
  const assignedId = notes.counsellorId ?? notes.investigatorId ?? null
  const isAssigned = assignedId === currentUserId

  // Case Officers can only view cases assigned to them
  if (isCaseOfficer && !isAssigned) {
    return (
      <AdminLayout title="Access Denied">
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
            <EyeOff size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 max-w-md text-gray-600">
            This case has not been assigned to you. Only the assigned Case Officer or the Super Administrator can access its details.
          </p>
          <Link href="/admin/reports" className="mt-6">
            <Button>Return to Queue</Button>
          </Link>
        </div>
      </AdminLayout>
    )
  }

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

      {/* Removed confidentiality banner as all reports are confidential by default */}

      <div className="flex flex-col gap-8 w-full max-w-6xl">

        {/* Left Pane: Report Details */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Report Code</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">{report.code}</h2>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div className="mt-6 mb-2 border-y border-gray-100 py-6 print:hidden">
              <WorkflowStepper currentStatus={report.status} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Type</p>
                <p className="mt-1 text-base text-gray-900">{report.type}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location</p>
                <p className="mt-1 text-base text-gray-900">{report.location || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</p>
                <p className="mt-1 text-base leading-relaxed text-gray-900 whitespace-pre-wrap">{report.description}</p>
              </div>

              {/* ─── Complainant & Contact (privacy-gated) ─── */}
              {isConfidential && !canSeeConfidential ? (
                <>
                  <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                    <p className="text-sm font-bold uppercase tracking-wider text-navy mb-4">Complainant Details</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <HiddenField label="Full Name" />
                      <HiddenField label="Gender" />
                      <HiddenField label="User Type" />
                      <HiddenField label="Student/Staff ID" />
                      <HiddenField label="Department/Unit" />
                      <HiddenField label="Submitted Contact" />
                      <HiddenField label="Reporter Email" />
                      <HiddenField label="Phone Number" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                    <p className="text-sm font-bold uppercase tracking-wider text-navy mb-4">Complainant Details</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</p>
                        <p className="mt-1 text-base text-gray-900">{notes.complainantName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gender</p>
                        <p className="mt-1 text-base text-gray-900">{notes.complainantGender || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">User Type</p>
                        <p className="mt-1 text-base text-gray-900">{notes.complainantUserType || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Student/Staff ID</p>
                        <p className="mt-1 text-base text-gray-900">{notes.complainantStudentId || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Department/Unit</p>
                        <p className="mt-1 text-base text-gray-900">{notes.complainantDepartment || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                    <p className="text-sm font-bold uppercase tracking-wider text-navy mb-4">Contact Information</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Submitted Contact</p>
                        <p className="mt-1 text-base text-gray-900">{notes.contact || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Reporter Email (System)</p>
                        <p className="mt-1 text-base text-gray-900">{notes.reporterEmail || 'Not available'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phone Number</p>
                        <p className="mt-1 text-base text-gray-900">{notes.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Form (shown if email is available) */}
              {(notes.reporterEmail || notes.contact) && (
                <div className="md:col-span-2">
                  <ReportEmailForm 
                    reportCode={report.code} 
                    reporterEmail={(notes.reporterEmail || notes.contact)!} 
                  />
                </div>
              )}

              <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Assigned Investigator</p>
                <p className="mt-1 text-base text-gray-900">{assignedCounsellor || 'Unassigned'}</p>
              </div>

              {/* Respondent (Alleged Offender) Details */}
              <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-100">
                <p className="text-sm font-bold uppercase tracking-wider text-navy mb-4">Respondent (Alleged Offender) Details</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</p>
                    <p className="mt-1 text-base text-gray-900">{notes.respondentName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Position</p>
                    <p className="mt-1 text-base text-gray-900">{notes.respondentPosition || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Department/Unit</p>
                    <p className="mt-1 text-base text-gray-900">{notes.respondentDepartment || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Relationship to Complainant</p>
                    <p className="mt-1 text-base text-gray-900">{notes.respondentRelationship || 'Not provided'}</p>
                  </div>
                  {notes.offenderDescription && (
                    <div className="md:col-span-2 mt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Additional Description</p>
                      <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">{notes.offenderDescription}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Prior report */}
              {notes.priorReport && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Previously Reported?</p>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Witnesses</p>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Investigator Assessment</p>
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



          {/* Update History */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] print:hidden">
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
              userRole={currentUserRole}
            />
            <section>
              <ReportChat reportCode={report.code} isAssignedCounsellor={isAssigned} />
            </section>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
