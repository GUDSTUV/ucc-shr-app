'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { PublicLayout } from '@/src/components/templates/public-layout'
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageSquare,
  Search,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/src/components/atoms/button'

type UserReportStatus = 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'

type UserReport = {
  code: string
  type: string
  status: UserReportStatus
  createdAt: string
}

const reportStatusStyles: Record<
  UserReportStatus,
  {
    label: string
    chip: string
  }
> = {
  RECEIVED: {
    label: 'Submitted',
    chip: 'bg-navy-light text-navy border border-navy/20',
  },
  UNDER_REVIEW: {
    label: 'Under review',
    chip: 'bg-red-light text-red-dark border border-red/30',
  },
  UNDER_INVESTIGATION: {
    label: 'Referred',
    chip: 'bg-orange-100 text-orange-800 border border-orange-200',
  },
  CLOSED: {
    label: 'Resolved',
    chip: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
}

type ReportTab = 'ACTIVE' | 'CLOSED'

const tabs: Array<{ key: ReportTab; label: string }> = [
  { key: 'ACTIVE', label: 'Active Cases' },
  { key: 'CLOSED', label: 'Resolved Cases' },
]

function formatSubmittedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getCardIcon(status: UserReport['status']) {
  if (status === 'UNDER_REVIEW' || status === 'UNDER_INVESTIGATION') return <MessageSquare size={19} />
  if (status === 'CLOSED') return <CheckCircle2 size={19} />
  if (status === 'RECEIVED') return <Search size={19} />
  return <FileText size={19} />
}

function reportActionLabel(status: UserReport['status']) {
  return status === 'CLOSED' ? 'View Summary' : 'View Details'
}

function ReportsCard({ report }: { report: UserReport }) {
  const statusMeta = reportStatusStyles[report.status]

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 lg:p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusMeta.chip}`}
          >
            {statusMeta.label}
          </p>
          <h3 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">Incident #{report.code.replace('UCC-', '')}</h3>
          <p className="mt-1 text-sm text-gray-600">{report.type}</p>
        </div>
        <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-navy-light text-navy shrink-0">
          {getCardIcon(report.status)}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 sm:text-base">
        <CalendarDays size={14} />
        <span>Date: {formatSubmittedDate(report.createdAt)}</span>
      </div>

      <Link
        href={`/user/userReports/${encodeURIComponent(report.code)}`}
        className={`mt-4 md:mt-6 inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl md:rounded-2xl px-6 py-3 text-sm font-semibold transition sm:text-base ${
          report.status === 'RECEIVED' ? 'bg-navy text-white hover:bg-navy-dark' : 'bg-navy-light text-navy hover:bg-[#dfe6fa]'
        }`}
      >
        {reportActionLabel(report.status)}
        <ChevronRight size={16} />
      </Link>
    </article>
  )
}

type UserReportsProps = {
  reports: UserReport[]
}

export default function UserReports({ reports }: UserReportsProps) {
  const [selectedTab, setSelectedTab] = useState<ReportTab>('ACTIVE')

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [reports]
  )

  const filteredReports = useMemo(() => {
    return selectedTab === 'ACTIVE'
      ? sortedReports.filter((report) => report.status !== 'CLOSED')
      : sortedReports.filter((report) => report.status === 'CLOSED')
  }, [selectedTab, sortedReports])

  return (
    <PublicLayout>
      <div className="font-sans">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <Link href="/user/userDashboard" className="inline-flex items-center gap-2 text-sm font-medium text-navy mb-4 hover:underline">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">My Reports</h1>
            <p className="mt-1 text-sm text-gray-500">Track all your submitted incidents and communicate securely.</p>
          </div>

          <nav className="flex items-center gap-4 md:gap-8" aria-label="Report tabs">
            {tabs.map((tab) => {
              const active = selectedTab === tab.key
              return (
                <Button
                  variant="unstyled"
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedTab(tab.key)}
                  className={`pb-2 text-sm md:text-base font-semibold transition border-b-2 ${
                    active ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-navy'
                  }`}
                >
                  {tab.label}
                </Button>
              )
            })}
          </nav>
        </div>

        <main>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">{selectedTab === 'ACTIVE' ? 'Active' : 'Resolved'} Submissions</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {filteredReports.length} Total
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <Search size={24} className="mx-auto text-gray-400 mb-3" />
              <p className="text-base text-gray-600">No reports found in this section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredReports.map((report) => (
                <ReportsCard key={report.code} report={report} />
              ))}
            </div>
          )}
        </main>
      </div>
    </PublicLayout>
  )
}
