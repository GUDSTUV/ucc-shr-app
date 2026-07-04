import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes, canViewConfidentialDetails } from '@/src/lib/auth/report-access'
import { sendDirectEmail } from '@/src/lib/email'
import { logActivity } from '@/src/lib/audit'

export async function POST(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  const session = await auth()

  if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN' && session.user.role !== 'COUNSELOR' && session.user.role !== 'INVESTIGATOR')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code } = await context.params
    const reportCode = decodeURIComponent(code).trim()
    
    const body = await request.json()
    const { subject, message } = body

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ ok: false, error: 'Subject and message are required' }, { status: 400 })
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
      return NextResponse.json({ ok: false, error: 'Report not found' }, { status: 404 })
    }

    const notes = parseReportNotes(report.notes)
    
    // Check if user is allowed to view confidential details
    const canSeeConfidential = canViewConfidentialDetails(notes, session.user.id, session.user.role)
    const isConfidential = Boolean(notes.confidentialityRequested)

    if (isConfidential && !canSeeConfidential) {
      return NextResponse.json(
        { ok: false, error: 'You are not authorized to contact the reporter for this confidential case.' },
        { status: 403 }
      )
    }

    const reporterEmail = notes.reporterEmail || notes.contact || null

    if (!reporterEmail) {
      return NextResponse.json({ ok: false, error: 'No email address available for the reporter.' }, { status: 400 })
    }

    // Send the email
    await sendDirectEmail(reporterEmail, subject.trim(), message.trim().replace(/\n/g, '<br/>'))

    // Log the activity
    logActivity({
      userId: session.user.id,
      action: 'UPDATED',
      resourceType: 'REPORT',
      resourceId: reportCode,
      details: { event: 'email_sent', subject: subject.trim() },
    })

    // Append to admin updates so other admins can see it
    const newUpdate = {
      id: crypto.randomUUID(),
      status: report.status,
      message: `Email sent to reporter. Subject: "${subject.trim()}". Message preview: "${message.trim().substring(0, 50)}..."`,
      by: session.user.name || session.user.email || 'Admin',
      at: new Date().toISOString(),
    }

    const adminUpdates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
    const updatedNotes = {
      ...notes,
      adminUpdates: [newUpdate, ...adminUpdates],
    }

    await prisma.report.update({
      where: { id: report.id },
      data: { notes: JSON.stringify(updatedNotes) },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[REPORT_EMAIL_POST]', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
