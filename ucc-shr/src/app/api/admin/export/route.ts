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
        notes: true,
      },
    })

    const csvLines = [
      'Report Code,Type,Status,Submitted At,Last Updated,Location,Complainant Type,Complainant Gender,Complainant Dept,Respondent Position,Respondent Relationship,Respondent Dept,Prior Reported',
    ]

    for (const r of reports) {
      let notes: any = {}
      if (r.notes) {
        try {
          notes = JSON.parse(r.notes)
        } catch (e) {}
      }

      const getSafeValue = (val: string | undefined | null) => {
        return `"${(val || 'N/A').replace(/"/g, '""')}"`
      }

      const priorReported = notes.priorReport?.reported ? 'Yes' : 'No'

      const line = [
        `"${r.code}"`,
        `"${r.type}"`,
        `"${r.status}"`,
        `"${r.createdAt.toISOString()}"`,
        `"${r.updatedAt.toISOString()}"`,
        getSafeValue(r.location),
        getSafeValue(notes.complainantUserType),
        getSafeValue(notes.complainantGender),
        getSafeValue(notes.complainantDepartment),
        getSafeValue(notes.respondentPosition),
        getSafeValue(notes.respondentRelationship),
        getSafeValue(notes.respondentDepartment),
        `"${priorReported}"`
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
