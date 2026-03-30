import bcrypt from 'bcryptjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import {
  clearNotificationDismissed,
  clearNotificationReads,
  getNotificationDismissedIds,
  getNotificationReadIds,
  getNotificationState,
  upsertNotificationState,
} from '@/src/lib/notification-state'

type PageProps = {
  searchParams?: Promise<{ status?: string }>
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

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const session = await requireSuperAdmin()

  const params = searchParams ? await searchParams : undefined
  const status = params?.status ?? ''

  const [user, reports, notificationState] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        createdAt: true,
      },
    }),
    getNotificationState(session.user.id, 'ADMIN'),
  ])

  if (!user) {
    redirect('/admin/login')
  }

  const reportNotificationIds = reports.map((report) => `report:${report.id}`)
  const [readIds, dismissedIds] = await Promise.all([
    getNotificationReadIds(session.user.id, 'ADMIN', reportNotificationIds),
    getNotificationDismissedIds(session.user.id, 'ADMIN', reportNotificationIds),
  ])

  const cutoffMs = notificationState?.clearedAt?.getTime() ?? 0
  const visibleNotificationCount = reports.filter(
    (report) => report.createdAt.getTime() > cutoffMs && !dismissedIds.has(`report:${report.id}`),
  ).length
  const unreadNotificationCount = reports.filter((report) => {
    const notificationId = `report:${report.id}`
    const isVisible = report.createdAt.getTime() > cutoffMs && !dismissedIds.has(notificationId)
    return isVisible && !readIds.has(notificationId)
  }).length

  async function clearAdminFeed() {
    'use server'

    const actionSession = await requireSuperAdmin()

    const now = new Date()
    await clearNotificationReads(actionSession.user.id, 'ADMIN')
    await clearNotificationDismissed(actionSession.user.id, 'ADMIN')
    await upsertNotificationState(actionSession.user.id, 'ADMIN', {
      lastSeenAt: now,
      clearedAt: now,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin/settings')
    redirect('/admin/settings?status=feed-cleared')
  }

  async function markFeedAsSeen() {
    'use server'

    const actionSession = await requireSuperAdmin()

    await upsertNotificationState(actionSession.user.id, 'ADMIN', {
      lastSeenAt: new Date(),
    })

    revalidatePath('/admin')
    revalidatePath('/admin/settings')
    redirect('/admin/settings?status=feed-seen')
  }

  async function changePassword(formData: FormData) {
    'use server'

    const actionSession = await requireSuperAdmin()

    const currentPassword = String(formData.get('currentPassword') ?? '')
    const nextPassword = String(formData.get('newPassword') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (nextPassword.length < 8) {
      redirect('/admin/settings?status=password-length')
    }

    if (nextPassword !== confirmPassword) {
      redirect('/admin/settings?status=password-match')
    }

    const account = await prisma.user.findUnique({
      where: { id: actionSession.user.id },
      select: { password: true },
    })

    if (!account) {
      redirect('/admin/login')
    }

    const validCurrentPassword = await bcrypt.compare(currentPassword, account.password)
    if (!validCurrentPassword) {
      redirect('/admin/settings?status=password-current')
    }

    const newHashedPassword = await bcrypt.hash(nextPassword, 10)

    await prisma.user.update({
      where: { id: actionSession.user.id },
      data: { password: newHashedPassword },
    })

    revalidatePath('/admin/settings')
    redirect('/admin/settings?status=password-updated')
  }

  const statusMap: Record<string, { tone: 'ok' | 'warn'; message: string }> = {
    'feed-cleared': { tone: 'ok', message: 'Admin notification feed has been cleared.' },
    'feed-seen': { tone: 'ok', message: 'Notification state updated as seen.' },
    'password-updated': { tone: 'ok', message: 'Password updated successfully.' },
    'password-current': { tone: 'warn', message: 'Current password is incorrect.' },
    'password-length': { tone: 'warn', message: 'New password must be at least 8 characters.' },
    'password-match': { tone: 'warn', message: 'New password and confirmation do not match.' },
  }

  const statusInfo = statusMap[status]

  return (
    <AdminLayout
      title="Admin Settings"
      description="Manage admin security controls and notification center behavior."
      actions={
        <Link href="/admin/profile">
          <Button variant="outline" size="sm" className="h-10 rounded-lg">Back to Profile</Button>
        </Link>
      }
    >
      <section className="space-y-4">
        {statusInfo ? (
          <p
            role="status"
            className={`rounded-xl border px-3 py-2 text-sm font-medium ${
              statusInfo.tone === 'ok'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-light text-red-dark'
            }`}
          >
            {statusInfo.message}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Notification Controls</h2>
            <p className="mt-1 text-base text-gray-700">Keep the admin feed organized while preserving critical visibility.</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-base">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Visible items</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{visibleNotificationCount}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <dt className="font-medium text-gray-700">Unread items</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{unreadNotificationCount}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <form action={markFeedAsSeen}>
                <Button type="submit" variant="outline" size="sm" className="h-10 rounded-lg">Mark Feed As Seen</Button>
              </form>
              <form action={clearAdminFeed}>
                <Button type="submit" size="sm" className="h-10 rounded-lg">Clear Notification Feed</Button>
              </form>
              <Link href="/admin/notifications" className="inline-flex">
                <Button variant="ghost" size="sm" className="h-10 rounded-lg">Open Notifications</Button>
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            <p className="mt-1 text-base text-gray-700">Use a strong password to protect confidential institutional records.</p>

            <form action={changePassword} className="mt-4 space-y-3" noValidate>
              <label className="block">
                <span className="mb-1 block text-base font-medium text-gray-900">Current password</span>
                <Input
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 border-gray-300 text-gray-900"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-base font-medium text-gray-900">New password</span>
                <Input
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-11 border-gray-300 text-gray-900"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-base font-medium text-gray-900">Confirm new password</span>
                <Input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-11 border-gray-300 text-gray-900"
                />
              </label>

              <Button type="submit" className="h-11 rounded-lg">Update Password</Button>
            </form>
          </article>
        </div>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Governance Details</h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 text-base">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <dt className="font-medium text-gray-700">Role</dt>
              <dd className="mt-1 text-gray-900">{user.role === 'SUPER_ADMIN' ? 'Super Administrator' : user.role}</dd>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <dt className="font-medium text-gray-700">Login email</dt>
              <dd className="mt-1 break-all text-gray-900">{user.email}</dd>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <dt className="font-medium text-gray-700">Member since</dt>
              <dd className="mt-1 text-gray-900">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </article>
      </section>
    </AdminLayout>
  )
}
