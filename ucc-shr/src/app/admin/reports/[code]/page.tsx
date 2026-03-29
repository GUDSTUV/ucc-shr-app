import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft, Clock3, FileText, Mic } from 'lucide-react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { parseReportNotes } from '@/src/lib/auth/report-access'
import { StatusBadge } from '@/src/components/molecules/status-badge'
import { AdminReportUpdateForm } from './admin-report-update-form'

type PageProps = {
  params: Promise<{ code: string }>
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function parseEvidenceItem(item: string) {
  const [kind, ...rest] = item.split(':')
  const rawValue = rest.join(':').trim() || item

  const url = rawValue.startsWith('/uploads/') || rawValue.startsWith('http://') || rawValue.startsWith('https://')
    ? rawValue
    : null
  const fileName = url ? rawValue.split('/').pop() || rawValue : rawValue

  if (kind === 'audio') return { kindLabel: 'Audio', icon: Mic, fileName, url }
  if (kind === 'doc') return { kindLabel: 'Document', icon: FileText, fileName, url }
  return { kindLabel: 'Evidence', icon: FileText, fileName, url }
}

function isImageFile(fileName: string) {
  return /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(fileName)
}

function isAudioFile(fileName: string) {
  return /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(fileName)
}

function getAudioMimeType(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'mp3') return 'audio/mpeg'
  if (ext === 'wav') return 'audio/wav'
  if (ext === 'ogg') return 'audio/ogg'
  if (ext === 'm4a') return 'audio/mp4'
  if (ext === 'aac') return 'audio/aac'
  if (ext === 'flac') return 'audio/flac'
  if (ext === 'webm') return 'audio/webm'
  return undefined
}

export default async function AdminReportDetailsPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  const { code } = await params
  const reportCode = decodeURIComponent(code).trim()

  if (!reportCode) {
    notFound()
  }

  const [report, counsellors] = await Promise.all([
    prisma.report.findUnique({
      where: { code: reportCode },
      select: {
        code: true,
        status: true,
        type: true,
        description: true,
        location: true,
        files: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ['SUPER_ADMIN', 'STAFF'] } },
      orderBy: [{ role: 'asc' }, { name: 'asc' }, { email: 'asc' }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),
  ])

  if (!report) {
    notFound()
  }

  const notes = parseReportNotes(report.notes)
  const updates = Array.isArray(notes.adminUpdates) ? notes.adminUpdates : []
  const witnesses = Array.isArray(notes.witnesses) ? notes.witnesses : []
  const evidenceFiles = report.files ?? []
  const assignedCounsellor = notes.counsellorName ?? notes.investigatorName ?? null
  const currentCounsellorId = notes.counsellorId ?? notes.investigatorId ?? null

  const counsellorOptions = counsellors.map((user) => ({
    id: user.id,
    label: `${user.name || user.email} (${user.role})`,
  }))

  return (
    <AdminLayout title="Report Details">
      <div className="space-y-4">
        <Link href="/admin/reports" className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-navy-dark">
          <ArrowLeft size={14} /> Back to reports
        </Link>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Report Code</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{report.code}</h2>
            </div>
            <StatusBadge status={report.status} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Type</p>
              <p className="mt-1 text-sm text-gray-800">{report.type}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Location</p>
              <p className="mt-1 text-sm text-gray-800">{report.location || 'Not specified'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Description</p>
              <p className="mt-1 text-sm text-gray-800">{report.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Submitted Contact</p>
              <p className="mt-1 text-sm text-gray-800">{notes.contact || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Reporter Email</p>
              <p className="mt-1 text-sm text-gray-800">{notes.reporterEmail || 'Not available'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Assigned Counsellor</p>
              <p className="mt-1 text-sm text-gray-800">{assignedCounsellor || 'Unassigned'}</p>
            </div>
            <div className="text-xs text-gray-500 md:col-span-2">
              Submitted: {formatDate(report.createdAt)} | Last updated: {formatDate(report.updatedAt)}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Witnesses</p>
            {witnesses.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-gray-800">
                {witnesses.map((witness, index) => (
                  <li key={`${witness}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2">
                    {witness}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-gray-700">No witness details were submitted.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Evidence Files</p>
          {evidenceFiles.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {evidenceFiles.map((item, index) => {
                const parsed = parseEvidenceItem(item)
                const audioInline = parsed.url && (parsed.kindLabel === 'Audio' || isAudioFile(parsed.fileName))

                return (
                  <li key={`${item}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <parsed.icon size={14} className="text-navy" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">{parsed.kindLabel}</p>
                        {parsed.url && !audioInline ? (
                          <a
                            href={parsed.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block break-all text-sm text-navy underline underline-offset-2"
                          >
                            {parsed.fileName}
                          </a>
                        ) : (
                          <p className="break-all text-sm text-gray-800">{parsed.fileName}</p>
                        )}
                      </div>
                    </div>

                    {audioInline ? (
                      <audio controls controlsList="nodownload" preload="metadata" className="mt-2 w-full">
                        <source src={parsed.url} type={getAudioMimeType(parsed.fileName)} />
                        Your browser does not support audio playback.
                      </audio>
                    ) : null}

                    {parsed.url && isImageFile(parsed.fileName) ? (
                      <a href={parsed.url} target="_blank" rel="noreferrer" className="mt-2 block">
                        <img
                          src={parsed.url}
                          alt={parsed.fileName}
                          className="max-h-56 w-full rounded-md border border-gray-200 object-cover"
                        />
                      </a>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-gray-700">No evidence files were uploaded for this report.</p>
          )}
        </section>

        <AdminReportUpdateForm
          code={report.code}
          currentStatus={report.status}
          counsellors={counsellorOptions}
          currentCounsellorId={currentCounsellorId}
        />

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Update History</h3>
          {updates.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {updates.map((update) => (
                <li key={update.id} className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={update.status} />
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Clock3 size={12} /> {formatDate(update.at)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-600">By {update.by}</p>
                  <p className="mt-1 text-sm text-gray-800">{update.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-600">No admin updates yet.</p>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}
