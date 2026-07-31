import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'
import { logActivity } from '@/src/lib/audit'
import { generateUniqueTrackingCode } from '@/src/lib/tracking-code'

const ALLOWED_REPORT_TYPES = ['verbal', 'physical', 'online', 'quid_pro_quo', 'other'] as const

const createReportSchema = z.object({
  type: z.enum(ALLOWED_REPORT_TYPES, { error: 'Invalid report type.' }),
  location: z.string().trim().max(180).optional().nullable(),
  contact: z.string().trim().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  description: z.string().trim().min(1, 'Description is required.').max(4000, 'Description is too long.'),
  isAnonymous: z.boolean().optional(),
  witnesses: z.array(z.string().trim().min(1)).optional(),
  incidentDate: z.coerce.date().optional().nullable(),
  offenderDescription: z.string().trim().max(1000).optional().nullable(),
  priorReport: z.object({
    reported: z.boolean(),
    where: z.string().trim().max(300).optional().nullable()
  }).optional().nullable(),
  confidentialityRequested: z.boolean().optional(),
  complainantName: z.string().trim().optional().nullable(),
  complainantGender: z.string().trim().optional().nullable(),
  complainantUserType: z.string().trim().optional().nullable(),
  complainantStudentId: z.string().trim().optional().nullable(),
  complainantDepartment: z.string().trim().optional().nullable(),
  respondentName: z.string().trim().optional().nullable(),
  respondentPosition: z.string().trim().optional().nullable(),
  respondentDepartment: z.string().trim().optional().nullable(),
  respondentRelationship: z.string().trim().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const json = await request.json()
    
    const parseResult = createReportSchema.safeParse(json)
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const payload = parseResult.data

    const reporterId = session?.user?.id ?? null
    const reporterEmail = session?.user?.email?.toLowerCase() ?? null
    const contact = payload.contact || null
    const normalizedContact = contact?.toLowerCase() ?? null

    if (!normalizedContact && !reporterEmail) {
      return NextResponse.json(
        { ok: false, error: 'A contact email is required.' },
        { status: 400 }
      )
    }

    const code = await generateUniqueTrackingCode()
    const type = payload.type
    const description = payload.description

    const incidentDate = payload.incidentDate ? new Date(payload.incidentDate) : new Date()
    const confidentialityRequested = Boolean(payload.confidentialityRequested)
    const witnesses = payload.witnesses?.slice(0, 10) || []

    const report = await prisma.report.create({
      data: {
        code,
        type,
        description,
        location: payload.location || null,
        date: incidentDate,
        isAnonymous: confidentialityRequested,
        files: [],
        notes: JSON.stringify({
          reporterId,
          reporterEmail,
          contact: normalizedContact,
          phone: payload.phone || null,
          confidentialityRequested,
          offenderDescription: payload.offenderDescription || null,
          priorReport: payload.priorReport || null,
          witnesses,
          complainantName: payload.complainantName || null,
          complainantGender: payload.complainantGender || null,
          complainantUserType: payload.complainantUserType || null,
          complainantStudentId: payload.complainantStudentId || null,
          complainantDepartment: payload.complainantDepartment || null,
          respondentName: payload.respondentName || null,
          respondentPosition: payload.respondentPosition || null,
          respondentDepartment: payload.respondentDepartment || null,
          respondentRelationship: payload.respondentRelationship || null,
        }),
      },
      select: { id: true, code: true },
    })

    if (reporterId) {
      await logActivity({
        userId: reporterId,
        action: 'CREATED',
        resourceType: 'REPORT',
        resourceId: report.id,
        details: { code: report.code, type },
      })
    }

    return NextResponse.json({ ok: true, code: report.code, id: report.id })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to submit report right now. Please try again.' },
      { status: 500 }
    )
  }
}
