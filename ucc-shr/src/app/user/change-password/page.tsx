import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import ChangePasswordForm from './changePasswordForm'
import { PublicLayout } from '@/src/components/templates/public-layout'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ChangePasswordPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md">
        <header className="mb-6 flex items-center">
          <Link
            href="/user/userDashboard"
            aria-label="Go back"
            className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-navy">Change Password</h1>
        </header>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <ChangePasswordForm />
        </div>
      </div>
    </PublicLayout>
  )
}
