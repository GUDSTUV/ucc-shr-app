import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CalendarDays, FileText, MapPin, Mic, RefreshCw, Shield } from 'lucide-react'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { belongsToUser } from '@/src/lib/auth/report-access'
import { StatusBadge } from '@/src/components/molecules/status-badge'
import { ReportChat } from '@/src/components/organisms/report-chat'
import { PublicLayout } from '@/src/components/templates/public-layout'

type ReportDetailsPageProps = {
  params: Promise<{
    code: string
  }>
}

type ReportNotes = {
  contact?: string | null
  witnesses?: string[]
  adminUpdates?: Array<{
    id: string
    at: string
    by: string
    status: 'RECEIVED' | 'REVIEWING' | 'REFERRED' | 'RESOLVED' | 'CLOSED'
    message: string
  }>
}

function parseNotes(value: string | null): ReportNotes {
  if (!value) return {}

  try {
    return JSON.parse(value) as ReportNotes
  } catch {
    return {}
  }
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

function parseEvidenceItem(item: string) {
  const [kind, ...rest] = item.split(':')
  const rawValue = rest.join(':').trim() || item

  const url = rawValue.startsWith('/uploads/') || rawValue.startsWith('http://') || rawValue.startsWith('https://')
    ? rawValue
    : null
  const fileName = url ? rawValue.split('/').pop() || rawValue : rawValue

  if (kind === 'audio') {
    return { kindLabel: 'Audio', icon: Mic, fileName, url }
  }

  if (kind === 'doc') {
    return { kindLabel: 'Document', icon: FileText, fileName, url }
  }

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

  const parsedNotes = parseNotes(report.notes)
  const evidenceFiles = report.files ?? []
  const adminUpdates = Array.isArray(parsedNotes.adminUpdates) ? parsedNotes.adminUpdates : []

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

      <main className="space-y-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 lg:p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Status</p>
              <div className="mt-2">
                <StatusBadge status={report.status} />
              </div>
            </div>
            <Shield className="h-6 w-6 text-navy" />
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Incident Type</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{report.type}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Description</p>
              <p className="mt-1 text-sm text-gray-700">{report.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em]">Location</p>
                </div>
                <p className="mt-1 text-sm text-gray-800">{report.location || 'Not specified'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarDays size={14} />
                  <p className="text-xs font-semibold uppercase tracking-[0.12em]">Submitted</p>
                </div>
                <p className="mt-1 text-sm text-gray-800">{formatDate(report.createdAt)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw size={14} />
            <p className="text-xs font-semibold uppercase tracking-[0.12em]">Last Updated</p>
          </div>
          <p className="mt-2 text-sm text-gray-800">{formatDate(report.updatedAt)}</p>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Submitted Contact</p>
          <p className="mt-1 text-sm text-gray-800">{parsedNotes.contact || 'Not provided'}</p>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Witnesses</p>
            {parsedNotes.witnesses && parsedNotes.witnesses.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-gray-800">
                {parsedNotes.witnesses.map((witness, index) => (
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

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Evidence Files</p>
          {evidenceFiles.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {evidenceFiles.map((item, index) => {
                const parsed = parseEvidenceItem(item)
                const audioInline = parsed.url && (parsed.kindLabel === 'Audio' || isAudioFile(parsed.fileName))
                const fileUrl = parsed.url ?? undefined

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
                        <source src={fileUrl} type={getAudioMimeType(parsed.fileName)} />
                        Your browser does not support audio playback.
                      </audio>
                    ) : null}

                    {parsed.url && isImageFile(parsed.fileName) ? (
                      <a href={parsed.url} target="_blank" rel="noreferrer" className="mt-2 block">
                        <Image
                          src={parsed.url}
                          alt={parsed.fileName}
                          width={1200}
                          height={800}
                          unoptimized
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

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Admin Updates</p>
          {adminUpdates.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {adminUpdates.map((update) => (
                <li key={update.id} className="rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={update.status} />
                    <span className="text-xs text-gray-500">{formatDate(new Date(update.at))}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gray-600">By {update.by}</p>
                  <p className="mt-1 text-sm text-gray-800">{update.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-gray-700">No updates from admin yet.</p>
          )}
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
