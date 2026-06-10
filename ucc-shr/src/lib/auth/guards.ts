import { redirect } from 'next/navigation'
import { auth } from './auth'

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
    redirect('/admin/login')
  }

  return session
}

export async function requireSuperAdmin() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  return session
}

export async function requireStaff() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role === 'SUPER_ADMIN' || session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  return session
}
