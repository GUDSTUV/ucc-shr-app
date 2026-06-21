import { redirect } from 'next/navigation'
import { auth } from './auth'
import { isAdminRole } from './roles'
import { prisma } from '@/src/lib/prisma'

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/admin/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (!dbUser || !isAdminRole(dbUser.role)) {
    redirect('/admin/login')
  }

  if (dbUser.role === 'SUSPENDED') {
    redirect('/admin/login?error=Suspended')
  }

  // Update session object with fresh role
  session.user.role = dbUser.role

  return session
}

export async function requireSuperAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/admin/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (dbUser?.role === 'SUSPENDED') {
    redirect('/admin/login?error=Suspended')
  }

  if (!dbUser || dbUser.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  session.user.role = dbUser.role

  return session
}

export async function requireStaff() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (!dbUser) {
    redirect('/login')
  }

  if (dbUser.role === 'SUSPENDED') {
    redirect('/login?error=Suspended')
  }

  if (isAdminRole(dbUser.role)) {
    redirect('/admin')
  }

  session.user.role = dbUser.role

  return session
}
