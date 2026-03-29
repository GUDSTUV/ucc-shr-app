import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

type RouteContext = {
  params: Promise<{ code: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const trackingCode = code.trim()

    if (!trackingCode) {
      return NextResponse.json(
        { ok: false, error: 'Tracking code is required.' },
        { status: 400 }
      )
    }

    const report = await prisma.report.findUnique({
      where: { code: trackingCode },
      select: {
        code: true,
        type: true,
        description: true,
        location: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!report) {
      return NextResponse.json(
        { ok: false, error: 'Report not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, report })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to fetch report details.' },
      { status: 500 }
    )
  }
}
