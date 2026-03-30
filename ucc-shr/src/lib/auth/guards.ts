import { redirect } from 'next/navigation'
import { auth } from './auth'

export async function requireSuperAdmin() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  return session
}
