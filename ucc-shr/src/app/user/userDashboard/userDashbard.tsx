import Link from 'next/link'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { Button } from '@/src/components/atoms/button'
import { Bell, Bookmark, FileText, Plus, UserCircle2 } from 'lucide-react'
import { prisma } from '@/src/lib/prisma'

type UserDashboardProps = {
  name?: string
  email?: string
}

type DashboardStats = {
  submittedReports: number
  inReviewReports: number
  resolvedReports: number
  savedItems: number
  resources: number
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [submittedReports, inReviewReports, resolvedOnlyReports, closedReports, savedItems, resources] =
      await prisma.$transaction([
        prisma.report.count(),
        prisma.report.count({ where: { status: 'REVIEWING' } }),
        prisma.report.count({ where: { status: 'RESOLVED' } }),
        prisma.report.count({ where: { status: 'CLOSED' } }),
        prisma.article.count({ where: { published: true } }),
        prisma.event.count({ where: { published: true } }),
      ])

    return {
      submittedReports,
      inReviewReports,
      resolvedReports: resolvedOnlyReports + closedReports,
      savedItems,
      resources,
    }
  } catch {
    return {
      submittedReports: 0,
      inReviewReports: 0,
      resolvedReports: 0,
      savedItems: 0,
      resources: 0,
    }
  }
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  )
}

function QuickLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-navy-light"
    >
      <div className="grid h-10 w-10 place-content-center rounded-lg bg-navy-light text-navy">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-500">{subtitle}</p>
      </div>
    </Link>
  )
}

export default async function UserDashbard({
  name = 'User',
  email = 'user@ucc.edu.gh',
}: UserDashboardProps) {
  const stats = await getDashboardStats()

  return (
    <PublicLayout>
      <div className="font-sans">
      <section className="-mx-4 -mt-6 bg-navy px-6 py-8 mb-5 rounded-bl-xl rounded-br-xl text-white">
        {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Dashboard</p> */}
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <UserCircle2 className="h-10 w-10 shrink-0 text-white/90" />
            <div>
              <h1 className="text-xl font-bold leading-tight">Welcome, {name}</h1>
              <p className="text-sm text-white/80">{email}</p>
            </div>
          </div>
          <Link
            href="/user/notifications"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300 ring-2 ring-navy" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
     

        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          title="Submitted"
          value={stats.submittedReports.toString()}
          hint="Reports created"
        />
        <StatCard
          title="In Review"
          value={stats.inReviewReports.toString()}
          hint="Pending feedback"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedReports.toString()}
          hint="Closed cases"
        />
      </section>

      <section className="mt-5 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Access</h2>
        <QuickLink
          href="/track"
          icon={<UserCircle2 size={18} />}
          title="Case Tracking"
          subtitle="Check report progress"
        />
        <QuickLink
          href="/user/userReports"
          icon={<FileText size={18} />}
          title="Reports"
          subtitle="View and manage submissions"
        />
        <QuickLink
          href="/help"
          icon={<Bookmark size={18} />}
          title="Resources"
          subtitle="Support information and guides"
        />
             <Link
              href={`/report/new?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`}
              className="block"
            >
            <Button variant="report" className="w-full">
              <Plus size={18} /> New Report
            </Button>
          </Link>
      </section>

      <div className="mt-5">
        <AlertBox variant="info" title="Your data is protected">
          Your dashboard is private and only visible to your signed-in account.
        </AlertBox>
      </div>
      </div>
    </PublicLayout>
  )
}
