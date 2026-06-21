import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'

type CreateReportPayload = {
  type?: string
  location?: string
  contact?: string
  phone?: string
  description?: string
  isAnonymous?: boolean
  witnesses?: string[]
  incidentDate?: string
  offenderDescription?: string
  priorReport?: { reported: boolean; where?: string }
  confidentialityRequested?: boolean
}

const ALLOWED_REPORT_TYPES = new Set([
  'verbal',
  'physical',
  'online',
  'quid_pro_quo',
  'other',
])

function buildTrackingCode() {
  const year = new Date().getFullYear()
  const token = randomBytes(2).toString('hex').toUpperCase()
  return `UCC-${year}-${token}`
}

async function generateUniqueTrackingCode() {
  for (let i = 0; i < 8; i += 1) {
    const candidate = buildTrackingCode()
    const exists = await prisma.report.findUnique({
      where: { code: candidate },
      select: { id: true },
    })
    if (!exists) return candidate
  }
  const fallback = randomBytes(3).toString('hex').toUpperCase()
  return `UCC-${new Date().getFullYear()}-${fallback}`
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const payload = (await request.json()) as CreateReportPayload

    const type = payload.type?.trim().toLowerCase()
    const description = payload.description?.trim()

    if (!type || !description) {
      return NextResponse.json(
        { ok: false, error: 'Type and description are required.' },
        { status: 400 }
      )
    }

    const contact = payload.contact?.trim()
    const phone = payload.phone?.trim() || null
    const reporterId = session?.user?.id ?? null
    const reporterEmail = session?.user?.email?.toLowerCase() ?? null

    if (!contact && !reporterEmail) {
      return NextResponse.json(
        { ok: false, error: 'A contact email is required.' },
        { status: 400 }
      )
    }

    if (!ALLOWED_REPORT_TYPES.has(type)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid report type.' },
        { status: 400 }
      )
    }

    if (description.length > 4000) {
      return NextResponse.json(
        { ok: false, error: 'Description is too long.' },
        { status: 400 }
      )
    }

    const code = await generateUniqueTrackingCode()

    const normalizedContact = contact?.toLowerCase() ?? null
    const witnesses = Array.isArray(payload.witnesses)
      ? payload.witnesses.map((item) => item.trim()).filter(Boolean)
      : []

    const incidentDate = payload.incidentDate ? new Date(payload.incidentDate) : null

    // Sanitise the offender description
    const offenderDescription = payload.offenderDescription?.trim().slice(0, 1000) || null

    // Sanitise prior report
    const priorReport = payload.priorReport
      ? {
          reported: Boolean(payload.priorReport.reported),
          where: payload.priorReport.where?.trim().slice(0, 300) || null,
        }
      : null

    const confidentialityRequested = Boolean(payload.confidentialityRequested)

    const report = await prisma.report.create({
      data: {
        code,
        type,
        description,
        location: payload.location?.trim().slice(0, 180) || null,
        date: incidentDate ?? new Date(),
        isAnonymous: confidentialityRequested,
        files: [],
        notes: JSON.stringify({
          reporterId,
          reporterEmail,
          contact: normalizedContact,
          phone,
          confidentialityRequested,
          offenderDescription,
          priorReport,
          witnesses: witnesses.slice(0, 10),
        }),
      },
      select: { id: true, code: true },
    })

    return NextResponse.json({ ok: true, code: report.code, id: report.id })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to submit report right now. Please try again.' },
      { status: 500 }
    )
  }
}
