import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldCheck, UserRound, UserPlus } from 'lucide-react'
import { FormLayout } from '@/src/components/templates/form-layout'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { auth } from '@/src/lib/auth/auth'

export default async function ReportAccessPage() {
  const session = await auth()
  if (session?.user) {
    if (session.user.role === 'SUPER_ADMIN') {
      redirect('/login')
    }
    redirect('/user/userDashboard')
  }

  return (
    <FormLayout title="Report Incident">
      <AlertBox variant="info" title="Choose how to continue">
        You can sign in, create an account, or continue as a guest for anonymous reporting.
      </AlertBox>

      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-navy hover:bg-navy-light"
        >
          <UserRound size={18} />
          Login
        </Link>

        <Link
          href="/signup"
          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-navy hover:bg-navy-light"
        >
          <UserPlus size={18} />
          Sign Up
        </Link>

        <Link
          href="/report/new"
          className="flex items-center gap-3 rounded-xl bg-red px-4 py-3 text-sm font-semibold text-white hover:bg-red-dark"
        >
          <ShieldCheck size={18} />
          Continue as Guest (Anonymous)
        </Link>
      </div>
    </FormLayout>
  )
}
