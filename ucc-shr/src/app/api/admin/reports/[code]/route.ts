import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { logActivity } from '@/src/lib/audit'
import { isAdminRole, isCaseOfficerRole } from '@/src/lib/auth/roles'
import {
  parseReportNotes,
  type ReportAdminUpdate,
  type RiskLevel,
  type InvestigationOutcome,
  type ActionTaken,
} from '@/src/lib/auth/report-access'

type UpdatePayload = {
  status?: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'
  message?: string
  counsellorId?: string | null
  riskLevel?: RiskLevel | null
  investigationOutcome?: InvestigationOutcome | null
  actionsTaken?: ActionTaken[]
  escalate?: boolean
  escalationReason?: string
}
 
const ALLOWED_STATUSES = new Set(['RECEIVED', 'UNDER_REVIEW', 'UNDER_INVESTIGATION', 'CLOSED', 'CLOSED'])
const MAX_UPDATE_MESSAGE_LENGTH = 1000
const MAX_ADMIN_UPDATES = 100

export async function PATCH(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  const session = await auth()

  if (!session?.user || !isAdminRole(session.user.role ?? '')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userRole = session.user.role ?? ''
  const isCaseOfficer = isCaseOfficerRole(userRole)
  const isSuperAdmin = userRole === 'SUPER_ADMIN'

  try {
    const { code } = await context.params
    const reportCode = decodeURIComponent(code).trim()

    if (!reportCode) {
      return NextResponse.json({ ok: false, error: 'Invalid report code.' }, { status: 400 })
    }

    const payload = (await request.json()) as UpdatePayload
    const status = payload.status
    const message = payload.message?.trim()
    const hasCounsellorKey = Object.prototype.hasOwnProperty.call(payload, 'counsellorId')
    const counsellorId = hasCounsellorKey ? (payload.counsellorId?.trim() || null) : undefined
    const riskLevel = payload.riskLevel ?? null
    const investigationOutcome = payload.investigationOutcome ?? null
    const actionsTaken = Array.isArray(payload.actionsTaken) ? payload.actionsTaken : undefined
    const escalate = payload.escalate === true
    const escalationReason = payload.escalationReason?.trim() || ''

    if (status && !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ ok: false, error: 'Valid status is required.' }, { status: 400 })
    }

    // Case Officers cannot close cases — only Super Admin can
    if (isCaseOfficer && status === 'CLOSED') {
      return NextResponse.json({ ok: false, error: 'Only the Super Admin can close cases.' }, { status: 403 })
    }

    // Case Officers cannot assign/reassign cases
    if (isCaseOfficer && hasCounsellorKey) {
      return NextResponse.json({ ok: false, error: 'Only the Super Admin can assign cases.' }, { status: 403 })
    }

    if (message && message.length > MAX_UPDATE_MESSAGE_LENGTH) {
      return NextResponse.json(
        { ok: false, error: `Update note is too long. Keep it under ${MAX_UPDATE_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      )
    }

    const report = await prisma.report.findUnique({
      where: { code: reportCode },
      select: {
        id: true,
        status: true,
        notes: true,
      },
    })

    if (!report) {
      return NextResponse.json({ ok: false, error: 'Report not found.' }, { status: 404 })
    }

    const notes = parseReportNotes(report.notes)
    const adminUpdates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []

    // Case Officers can only update reports assigned to them
    const assignedId = notes.counsellorId ?? notes.investigatorId ?? null
    if (isCaseOfficer && assignedId !== session.user.id) {
      return NextResponse.json({ ok: false, error: 'You can only update cases assigned to you.' }, { status: 403 })
    }
    const nextStatus = status ?? report.status

    let nextCounsellorId = notes.counsellorId ?? notes.investigatorId ?? null
    let nextCounsellorName = notes.counsellorName ?? notes.investigatorName ?? null

    if (hasCounsellorKey) {
      if (!counsellorId) {
        nextCounsellorId = null
        nextCounsellorName = null
      } else {
        const counsellor = await prisma.user.findUnique({
          where: { id: counsellorId },
          select: { id: true, name: true, email: true, role: true },
        })

        if (!counsellor || !isAdminRole(counsellor.role)) {
          return NextResponse.json({ ok: false, error: 'Selected counsellor is invalid.' }, { status: 400 })
        }

        nextCounsellorId = counsellor.id
        nextCounsellorName = counsellor.name || counsellor.email || 'Counsellor'
      }
    }

    const statusChanged = nextStatus !== report.status
    const previousCounsellorId = notes.counsellorId ?? notes.investigatorId ?? null
    const counsellorChanged = nextCounsellorId !== previousCounsellorId

    const hasAssessmentChange = riskLevel !== undefined || investigationOutcome !== undefined || actionsTaken !== undefined

    if (!statusChanged && !counsellorChanged && !message && !hasAssessmentChange && !escalate) {
      return NextResponse.json({ ok: false, error: 'No changes were provided.' }, { status: 400 })
    }

    let autoMessage = ''
    if (counsellorChanged && nextCounsellorName) autoMessage = `Assigned counsellor: ${nextCounsellorName}.`
    if (counsellorChanged && !nextCounsellorName) autoMessage = 'Counsellor assignment cleared.'
    if (statusChanged) autoMessage = autoMessage ? `${autoMessage} Status changed to ${nextStatus}.` : `Status changed to ${nextStatus}.`

    if (escalate) {
      autoMessage = autoMessage
        ? `${autoMessage} ESCALATED: ${escalationReason || 'Requires Super Admin attention.'}`
        : `ESCALATED: ${escalationReason || 'Requires Super Admin attention.'}`
    }

    const updateMessage = message || autoMessage || 'Case details updated.'

    const updateEntry: ReportAdminUpdate = {
      id: randomUUID(),
      at: new Date().toISOString(),
      by: session.user.name || session.user.email || (isCaseOfficer ? 'Case Officer' : 'Admin'),
      status: nextStatus,
      message: updateMessage,
    }

    const updatedNotes = {
      ...notes,
      counsellorId: nextCounsellorId,
      counsellorName: nextCounsellorName,
      investigatorId: undefined,
      investigatorName: undefined,
      ...(riskLevel !== undefined && { riskLevel }),
      ...(investigationOutcome !== undefined && { investigationOutcome }),
      ...(actionsTaken !== undefined && { actionsTaken }),
      ...(escalate && {
        escalatedAt: new Date().toISOString(),
        escalationReason: escalationReason || 'Requires Super Admin attention.',
        escalatedBy: session.user.name || session.user.email || 'Case Officer',
      }),
      adminUpdates: [updateEntry, ...adminUpdates].slice(0, MAX_ADMIN_UPDATES),
    }

    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: nextStatus,
        notes: JSON.stringify(updatedNotes),
      },
    })

    // Audit log
    logActivity({
      userId: session.user.id!,
      action: 'UPDATED',
      resourceType: 'REPORT',
      resourceId: reportCode,
      details: {
        previousStatus: report.status,
        newStatus: nextStatus,
        ...(counsellorChanged && { assignedTo: nextCounsellorName }),
        ...(riskLevel !== undefined && { riskLevel }),
        ...(investigationOutcome !== undefined && { investigationOutcome }),
        message: updateMessage,
      },
    })

    return NextResponse.json({ ok: true, update: updateEntry })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to update report right now. Please try again.' },
      { status: 500 }
    )
  }
}
