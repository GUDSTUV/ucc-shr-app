import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { requireSuperAdmin } from '@/src/lib/auth/guards'

export async function GET() {
  try {
    await requireSuperAdmin()

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        code: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        location: true,
      },
    })

    const csvLines = [
      'Report Code,Type,Status,Submitted At,Last Updated,Location',
    ]

    for (const r of reports) {
      const line = [
        `"${r.code}"`,
        `"${r.type}"`,
        `"${r.status}"`,
        `"${r.createdAt.toISOString()}"`,
        `"${r.updatedAt.toISOString()}"`,
        `"${(r.location || 'Not specified').replace(/"/g, '""')}"`,
      ].join(',')
      csvLines.push(line)
    }

    const csvContent = csvLines.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="cegrad_reports_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
