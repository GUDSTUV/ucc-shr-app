import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'

type CreateReportPayload = {
  type?: string
  location?: string
  contact?: string
  description?: string
  isAnonymous?: boolean
  witnesses?: string[]
  evidenceFiles?: string[]
}

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

    if (!exists) {
      return candidate
    }
  }

  const fallback = randomBytes(3).toString('hex').toUpperCase()
  return `UCC-${new Date().getFullYear()}-${fallback}`
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const payload = (await request.json()) as CreateReportPayload

    const type = payload.type?.trim()
    const description = payload.description?.trim()

    if (!type || !description) {
      return NextResponse.json(
        { ok: false, error: 'Type and description are required.' },
        { status: 400 }
      )
    }

    const code = await generateUniqueTrackingCode()

    const contact = payload.contact?.trim()
    const reporterId = session?.user?.id ?? null
    const reporterEmail = session?.user?.email?.toLowerCase() ?? null
    const normalizedContact = contact?.toLowerCase() ?? null
    const witnesses = Array.isArray(payload.witnesses)
      ? payload.witnesses.map((item) => item.trim()).filter(Boolean)
      : []

    const files = Array.isArray(payload.evidenceFiles)
      ? payload.evidenceFiles.map((item) => item.trim()).filter(Boolean)
      : []

    const report = await prisma.report.create({
      data: {
        code,
        type,
        description,
        location: payload.location?.trim() || null,
        date: new Date(),
        isAnonymous: payload.isAnonymous ?? true,
        files,
        notes:
          normalizedContact || witnesses.length || reporterId || reporterEmail
            ? JSON.stringify({
                reporterId,
                reporterEmail,
                contact: normalizedContact,
                witnesses,
              })
            : null,
      },
      select: {
        id: true,
        code: true,
      },
    })

    return NextResponse.json({ ok: true, code: report.code, id: report.id })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to submit report right now. Please try again.' },
      { status: 500 }
    )
  }
}
