'use server'

import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function suspendAdmin(userId: string) {
  const session = await requireSuperAdmin()
  
  if (session.user.id === userId) {
    return { error: "You cannot suspend yourself." }
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser || targetUser.role === 'SUPER_ADMIN') {
    return { error: "Cannot suspend a Super Admin or user does not exist." }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'SUSPENDED' }
  })

  revalidatePath('/admin/team')
  return { success: true }
}

export async function restoreAdmin(userId: string) {
  const session = await requireSuperAdmin()
  
  if (session.user.id === userId) {
    return { error: "You cannot restore yourself." }
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser) {
    return { error: "User does not exist." }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' }
  })

  revalidatePath('/admin/team')
  return { success: true }
}

export async function promoteToAdmin(email: string) {
  await requireSuperAdmin()
  
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    return { error: "User not found. They must create an account first." }
  }

  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return { error: "User is already an Admin or Super Admin." }
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  })

  revalidatePath('/admin/team')
  return { success: true }
}
