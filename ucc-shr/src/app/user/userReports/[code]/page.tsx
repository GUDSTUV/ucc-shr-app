import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CalendarDays, FileText, MapPin, RefreshCw, Shield } from 'lucide-react'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser, parseReportNotes } from '@/src/lib/auth/report-access'
import { StatusBadge } from '@/src/components/molecules/status-badge'
import { ReportChat } from '@/src/components/organisms/report-chat'
import { PublicLayout } from '@/src/components/templates/public-layout'

type ReportDetailsPageProps = {
  params: Promise<{
    code: string
  }>
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export default async function ReportDetailsPage({ params }: ReportDetailsPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const { code } = await params
  const reportCode = decodeURIComponent(code).trim()

  if (!reportCode) {
    notFound()
  }

  const report = await prisma.report.findUnique({
    where: { code: reportCode },
    select: {
      id: true,
      code: true,
      type: true,
      status: true,
      description: true,
      location: true,
      files: true,
      createdAt: true,
      updatedAt: true,
      notes: true,
    },
  })

  if (!report) {
    notFound()
  }

  const canAccess = belongsToUser(report.notes, session.user.id, session.user.email ?? null)

  if (!canAccess) {
    redirect('/user/userReports')
  }

  const { markAllReportNotificationsAsRead } = await import('@/src/lib/notification-service')
  await markAllReportNotificationsAsRead(session.user.id, session.user.role ?? 'USER', report.id)

  const parsedNotes = parseReportNotes(report.notes)
  const witnesses = Array.isArray(parsedNotes.witnesses) ? parsedNotes.witnesses : []
  
  const allUpdates = Array.isArray(parsedNotes.adminUpdates) ? parsedNotes.adminUpdates : []
  const publicUpdates = allUpdates.filter((u: { isInternal?: boolean }) => !u.isInternal)

  return (
    <PublicLayout>
      <div className="font-sans">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <Link href="/user/userReports" className="inline-flex items-center gap-2 text-sm font-medium text-navy mb-4 hover:underline">
              <ArrowLeft size={16} /> Back to Reports
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Report Details</h1>
            <p className="mt-1 text-sm text-gray-500">Incident #{report.code.replace('UCC-', '')}</p>
          </div>
        </div>

      <main>
        <section className="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8 shadow-sm space-y-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Status</p>
              <div className="mt-2">
                <StatusBadge status={report.status} />
              </div>
            </div>
            <Shield className="h-8 w-8 text-navy" />
          </div>

          {/* Core Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Incident Type</p>
              <p className="mt-1 text-base md:text-lg text-gray-900">{report.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Description</p>
              <p className="mt-1 text-base md:text-lg leading-relaxed text-gray-900 whitespace-pre-wrap">{report.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} />
                  <p className="text-sm font-semibold uppercase tracking-wider">Location</p>
                </div>
                <p className="mt-2 text-base md:text-lg text-gray-900">{report.location || 'Not specified'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarDays size={16} />
                  <p className="text-sm font-semibold uppercase tracking-wider">Submitted</p>
                </div>
                <p className="mt-2 text-base md:text-lg text-gray-900">{formatDate(report.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Tracking / Meta */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw size={16} />
              <p className="text-sm font-semibold uppercase tracking-wider">Last Updated</p>
            </div>
            <p className="mt-2 text-base md:text-lg text-gray-900">{formatDate(report.updatedAt)}</p>
          </div>

          {/* People */}
          <div className="border-t border-gray-100 pt-6 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Submitted Contact</p>
              <p className="mt-1 text-base md:text-lg text-gray-900">{parsedNotes.contact || 'Not provided'}</p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Witnesses</p>
              {witnesses.length > 0 ? (
                <ul className="mt-3 space-y-3 text-base md:text-lg text-gray-900">
                  {witnesses.map((witness, index) => (
                    <li key={`${witness}-${index}`} className="rounded-xl bg-gray-50 px-4 py-3">
                      {witness}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-base md:text-lg text-gray-700">No witness details were submitted.</p>
              )}
            </div>
          </div>




        </section>

        {/* Messaging Interface */}
        <section className="mt-8">
          <ReportChat reportCode={report.code} />
        </section>
      </main>
      </div>
    </PublicLayout>
  )
}
