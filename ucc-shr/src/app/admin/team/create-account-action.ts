'use server'

import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { logActivity } from '@/src/lib/audit'

export async function createAdminAccount(formData: FormData) {
  const session = await requireSuperAdmin()
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'ADMIN'

  if (!name || !email || !password || !role) {
    return { error: 'Name, email, role, and password are required.' }
  }

  if (!['ADMIN', 'COUNSELOR', 'INVESTIGATOR'].includes(role)) {
    return { error: 'Invalid role selected.' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: 'A user with this email already exists.' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as any,
      emailVerified: true // Assume verified if created by Super Admin
    }
  })

  logActivity({
    userId: session.user.id!,
    action: 'CREATED',
    resourceType: 'USER',
    resourceId: newUser.id,
    details: { createdEmail: email, createdName: name, role: role },
  })

  revalidatePath('/admin/team')
  return { success: true }
}
