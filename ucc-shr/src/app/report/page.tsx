import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'

export default async function ReportAccessPage() {
  const session = await auth()

  if (session?.user) {
    if (session.user.role === 'SUPER_ADMIN') {
      redirect('/admin/dashboard')
    }
    redirect('/report/new')
  }

  // Middleware will redirect unauthenticated users to /login
  // This fallback should rarely be reached
  redirect('/login?callbackUrl=/report/new')
}
