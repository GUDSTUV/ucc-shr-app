import UserReports from '@/src/app/user/userReports/userReports'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser } from '@/src/lib/auth/report-access'

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
