import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'

type PageProps = {
  searchParams?: Promise<{ status?: string }>
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(value)
}

function sanitizeText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength)
}

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  const safeName = (name || '').trim()

  if (safeName) {
    const parts = safeName.split(/\s+/).slice(0, 2)
    return parts.map((part) => part.charAt(0).toUpperCase()).join('')
  }

  return (email || 'AD').slice(0, 2).toUpperCase()
}

function isInstitutionalEmail(email: string) {
  return email.toLowerCase().endsWith('@stu.ucc.edu.gh')
}

export default async function AdminProfilePage({ searchParams }: PageProps) {
  const session = await requireSuperAdmin()

  const params = searchParams ? await searchParams : undefined
  const status = params?.status ?? ''

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  })

  if (!user) {
    redirect('/admin/login')
  }

  async function updateAdminProfile(formData: FormData) {
    'use server'

    const actionSession = await requireSuperAdmin()

    const nextName = sanitizeText(String(formData.get('name') ?? ''), 80)
    const nextEmail = sanitizeText(String(formData.get('email') ?? ''), 160).toLowerCase()

    if (!nextName) {
      redirect('/admin/profile?status=name-required')
    }

    if (!nextEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      redirect('/admin/profile?status=email-invalid')
    }

    if (!isInstitutionalEmail(nextEmail)) {
      redirect('/admin/profile?status=email-domain')
    }

    try {
      await prisma.user.update({
        where: { id: actionSession.user.id },
        data: {
          name: nextName,
          email: nextEmail,
        },
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('Unique constraint')) {
        redirect('/admin/profile?status=email-taken')
      }

      redirect('/admin/profile?status=error')
    }

    revalidatePath('/admin')
    revalidatePath('/admin/profile')
    redirect('/admin/profile?status=saved')
  }

  const statusMap: Record<string, { tone: 'ok' | 'warn'; message: string }> = {
    saved: { tone: 'ok', message: 'Profile updated successfully.' },
    'name-required': { tone: 'warn', message: 'Name is required.' },
    'email-invalid': { tone: 'warn', message: 'Please enter a valid email address.' },
    'email-domain': { tone: 'warn', message: 'Use your institutional email address (@stu.ucc.edu.gh).' },
    'email-taken': { tone: 'warn', message: 'That email is already in use by another account.' },
    error: { tone: 'warn', message: 'Unable to update profile right now. Please try again.' },
  }

  const statusInfo = statusMap[status]

  return (
    <AdminLayout
      title="Admin Profile"
      description="Maintain your administrator identity details and contact information."
      actions={
        <Link href="/admin/settings">
          <Button variant="outline" size="sm" className="h-10 rounded-lg">Go to Settings</Button>
        </Link>
      }
    >
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr]">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
          <p className="mt-1 text-base text-gray-700">All fields should remain accurate for internal case accountability.</p>

          {statusInfo ? (
            <p
              role="status"
              className={`mt-4 rounded-xl border px-3 py-2 text-sm font-medium ${
                statusInfo.tone === 'ok'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-light text-red-dark'
              }`}
            >
              {statusInfo.message}
            </p>
          ) : null}

          <form action={updateAdminProfile} className="mt-4 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1 block text-base font-medium text-gray-900">Full name</span>
              <Input
                name="name"
                defaultValue={user.name}
                required
                maxLength={80}
                className="h-11 border-gray-300 text-gray-900"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-base font-medium text-gray-900">Institutional email</span>
              <Input
                name="email"
                type="email"
                inputMode="email"
                defaultValue={user.email}
                required
                maxLength={160}
                className="h-11 border-gray-300 text-gray-900"
              />
            </label>

            <Button type="submit" className="h-11 rounded-lg">Save Profile Changes</Button>
          </form>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Administrator Record</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy text-base font-semibold text-white">
                {getInitials(user.name, user.email)}
              </span>
              <div>
                <p className="text-base font-semibold text-gray-900">{user.name}</p>
                <p className="text-base text-gray-700">{user.email}</p>
              </div>
            </div>

            <dl className="space-y-3 text-base">
              <div className="rounded-xl border border-gray-200 p-3">
                <dt className="font-medium text-gray-700">Role</dt>
                <dd className="mt-1 text-gray-900">{user.role === 'SUPER_ADMIN' ? 'Super Administrator' : user.role}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <dt className="font-medium text-gray-700">Account created</dt>
                <dd className="mt-1 text-gray-900">{formatDate(user.createdAt)}</dd>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <dt className="font-medium text-gray-700">User ID</dt>
                <dd className="mt-1 break-all text-gray-900">{user.id}</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>
    </AdminLayout>
  )
}
