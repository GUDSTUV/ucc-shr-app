import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'
import { sendDirectEmail } from '@/src/lib/email'
import { sendPushToUser } from '@/src/lib/web-push'

// GET /api/reports/[code]/messages - Fetch messages for a report
export async function GET(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code } = await context.params
    const reportCode = decodeURIComponent(code).trim()

    const report = await prisma.report.findUnique({
      where: { code: reportCode },
      select: {
        id: true,
        notes: true,
        Message: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            User: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ ok: false, error: 'Report not found' }, { status: 404 })
    }

    const notes = parseReportNotes(report.notes)
    
    // Determine access
    const isReporter = notes.reporterId === session.user.id
    const isAssigned = notes.counsellorId === session.user.id
    const isSuperAdmin = session.user.role === 'SUPER_ADMIN'

    if (!isReporter && !isAssigned && !isSuperAdmin) {
      return NextResponse.json({ ok: false, error: 'Access denied' }, { status: 403 })
    }

    const messages = report.Message.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId: msg.senderId,
      senderName: msg.User.name || 'User',
      senderRole: msg.User.role,
      isMe: msg.senderId === session.user.id,
    }))

    return NextResponse.json({ ok: true, messages })
  } catch (error) {
    console.error('[MESSAGES_GET]', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/reports/[code]/messages - Send a new message
export async function POST(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code } = await context.params
    const reportCode = decodeURIComponent(code).trim()
    
    const body = await request.json()
    const content = body.content?.trim()

    if (!content) {
      return NextResponse.json({ ok: false, error: 'Message content is required' }, { status: 400 })
    }

    const report = await prisma.report.findUnique({
      where: { code: reportCode },
      select: {
        id: true,
        notes: true,
      },
    })

    if (!report) {
      return NextResponse.json({ ok: false, error: 'Report not found' }, { status: 404 })
    }

    const notes = parseReportNotes(report.notes)
    
    const isReporter = notes.reporterId === session.user.id
    const isAssignedStaff = notes.counsellorId === session.user.id
    const isSuperAdmin = session.user.role === 'SUPER_ADMIN'

    // Only the reporter, the ASSIGNED staff, and Super Admins can send messages.
    if (!isReporter && !isAssignedStaff && !isSuperAdmin) {
      return NextResponse.json(
        { ok: false, error: 'Only the reporter, assigned counsellor, and Super Admin can send messages in this thread.' },
        { status: 403 }
      )
    }

    const message = await prisma.message.create({
      data: {
        reportId: report.id,
        senderId: session.user.id,
        content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        senderId: true,
        User: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    })

    // Email + push notification logic
    if (isReporter) {
      // The reporter sent the message. Notify the assigned counsellor if they exist.
      const counsellorId = notes.counsellorId
      if (counsellorId) {
        const counsellor = await prisma.user.findUnique({
          where: { id: counsellorId },
          select: { email: true, name: true },
        })
        if (counsellor?.email) {
          sendDirectEmail(
            counsellor.email,
            `New message on case ${reportCode}`,
            `<p>Hi ${counsellor.name || 'Counsellor'},</p><p>You have received a new message from the reporter on case <strong>${reportCode}</strong>.</p><p>Please log in to your dashboard to reply.</p>`
          ).catch((err) => console.error('[EMAIL_ERROR]', err))
        }
        // Push to counsellor
        void sendPushToUser(counsellorId, {
          title: `New message on case ${reportCode}`,
          body: `The reporter has sent a new message. Tap to reply.`,
          url: `/admin/reports/${reportCode}?tab=messages`,
        }).catch((err) => console.error('[PUSH_ERROR]', err))
      }
    } else {
      // A staff member sent the message. Notify the reporter.
      const emailTo = notes.reporterEmail || notes.contact
      if (emailTo) {
        sendDirectEmail(
          emailTo,
          `New message on your report: ${reportCode}`,
          `<p>You have received a new message from the CEGRAD team regarding your report (<strong>${reportCode}</strong>).</p><p>Please log in to your dashboard to view the message and reply.</p>`
        ).catch((err) => console.error('[EMAIL_ERROR]', err))
      }
      // Push to reporter if they have an account
      if (notes.reporterId) {
        void sendPushToUser(notes.reporterId, {
          title: 'New message on your report',
          body: `You have a reply from the CEGRAD team on case ${reportCode}.`,
          url: `/user/userReports/${reportCode}?tab=messages`,
        }).catch((err) => console.error('[PUSH_ERROR]', err))
      }
    }

    return NextResponse.json({
      ok: true,
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        senderId: message.senderId,
        senderName: message.User.name || 'User',
        senderRole: message.User.role,
        isMe: true,
      },
    })
  } catch (error) {
    console.error('[MESSAGES_POST]', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
