import UserReports from '@/src/app/user/userReports/userReports'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

type ReportNotes = {
  reporterId?: string | null
  reporterEmail?: string | null
  contact?: string | null
}

function parseNotes(value: string | null): ReportNotes {
  if (!value) return {}

  try {
    return JSON.parse(value) as ReportNotes
  } catch {
    return {}
  }
}

function belongsToUser(notes: string | null, userId: string, userEmail: string | null) {
  if (!notes) return false

  const parsed = parseNotes(notes)
  if (parsed.reporterId === userId) return true

  const normalizedEmail = userEmail?.toLowerCase() ?? null
  if (!normalizedEmail) return false

  if (parsed.reporterEmail?.toLowerCase() === normalizedEmail) return true
  if (parsed.contact?.toLowerCase() === normalizedEmail) return true

  const notesLower = notes.toLowerCase()
  return (
    notesLower.includes(`"reporteremail":"${normalizedEmail}"`) ||
    notesLower.includes(`"contact":"${normalizedEmail}"`)
  )
}

export default async function UserReportsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const reports = await prisma.report.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      code: true,
      type: true,
      status: true,
      createdAt: true,
      notes: true,
    },
  })

  const userReports = reports.filter((report) =>
    belongsToUser(report.notes, session.user.id, session.user.email ?? null)
  )

  return (
    <UserReports
      reports={userReports.map((report) => ({
        ...report,
        createdAt: report.createdAt.toISOString(),
      }))}
    />
  )
}
