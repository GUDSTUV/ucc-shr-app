'use server'

import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/src/lib/audit'
import bcrypt from 'bcryptjs'

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

  logActivity({
    userId: session.user.id!,
    action: 'SUSPENDED',
    resourceType: 'USER',
    resourceId: userId,
    details: { targetEmail: targetUser.email, previousRole: targetUser.role },
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

  logActivity({
    userId: session.user.id!,
    action: 'PROMOTED',
    resourceType: 'USER',
    resourceId: userId,
    details: { targetEmail: targetUser.email, restoredToRole: 'ADMIN' },
  })

  revalidatePath('/admin/team')
  return { success: true }
}

export async function promoteToAdmin(email: string) {
  const session = await requireSuperAdmin()
  
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

  logActivity({
    userId: session.user.id!,
    action: 'PROMOTED',
    resourceType: 'USER',
    resourceId: user.id,
    details: { targetEmail: email, previousRole: user.role, newRole: 'ADMIN' },
  })

  revalidatePath('/admin/team')
  return { success: true }
}

export async function resetAdminPassword(userId: string, newPasswordRaw: string) {
  const session = await requireSuperAdmin()
  
  if (newPasswordRaw.length < 6) {
    return { error: "Password must be at least 6 characters long." }
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser) {
    return { error: "User does not exist." }
  }

  const hashedPassword = await bcrypt.hash(newPasswordRaw, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })

  logActivity({
    userId: session.user.id!,
    action: 'UPDATED',
    resourceType: 'USER',
    resourceId: userId,
    details: { targetEmail: targetUser.email, description: "Super Admin changed the user's password" },
  })

  return { success: true }
}

export async function deleteSuspendedAdmin(userId: string) {
  const session = await requireSuperAdmin()
  
  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser) {
    return { error: "User does not exist." }
  }

  if (targetUser.role !== 'SUSPENDED') {
    return { error: "Only suspended accounts can be deleted. Suspend the account first." }
  }

  await prisma.user.delete({
    where: { id: userId }
  })

  logActivity({
    userId: session.user.id!,
    action: 'DELETED',
    resourceType: 'USER',
    resourceId: userId,
    details: { targetEmail: targetUser.email, description: "Permanently deleted suspended account" },
  })

  revalidatePath('/admin/team')
  return { success: true }
}
