import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser } from '@/src/lib/auth/report-access'

export const dynamic = 'force-dynamic'

export default async function DispatchPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Find all reports to see if any belong to this user
  // This mirrors the logic in the dashboard to determine if they have reports
  const reportsRaw = await prisma.report.findMany({
    select: {
      notes: true,
      reporterId: true,
      reporterEmailSnapshot: true,
      contactEmail: true,
    }
  })

  const hasReports = reportsRaw.some(r => 
    belongsToUser(r.notes, session.user.id!, session.user.email ?? null, {
      reporterId: r.reporterId,
      reporterEmailSnapshot: r.reporterEmailSnapshot,
      contactEmail: r.contactEmail,
    })
  )

  if (hasReports) {
    redirect('/user/dashboard')
  } else {
    redirect('/report/new')
  }
}
