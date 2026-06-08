import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'

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

    // Only the reporter and the ASSIGNED staff can send messages.
    // Even Super Admins cannot send messages unless they assign themselves.
    if (!isReporter && !isAssignedStaff) {
      return NextResponse.json(
        { ok: false, error: 'Only the reporter and the assigned counsellor can send messages in this thread.' },
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
