"use server"

import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

export async function updateSiteContent(formData: FormData) {
  await requireSuperAdmin()
  
  const entries = [
    { key: 'heroTitle', value: formData.get('heroTitle') as string },
    { key: 'heroSubtitle', value: formData.get('heroSubtitle') as string },
    { key: 'contactEmail', value: formData.get('contactEmail') as string },
    { key: 'contactPhone', value: formData.get('contactPhone') as string },
    { key: 'contactAddress', value: formData.get('contactAddress') as string },
    { key: 'footerText', value: formData.get('footerText') as string },
  ]

  for (const entry of entries) {
    if (entry.value !== null && entry.value !== undefined) {
      await prisma.siteContent.upsert({
        where: { key: entry.key },
        update: { value: entry.value },
        create: { key: entry.key, value: entry.value }
      })
    }
  }

  // Revalidate public pages that use this content
  revalidatePath('/')
  revalidatePath('/help')
  revalidatePath('/about')
  revalidatePath('/hub')
  revalidatePath('/admin/site-content')

  return { success: true }
}

export async function updateSiteContentJson(key: string, value: Prisma.JsonValue) {
  await requireSuperAdmin()

  await prisma.siteContent.upsert({
    where: { key },
    update: { value: value as Prisma.InputJsonValue },
    create: { key, value: value as Prisma.InputJsonValue }
  })

  // Revalidate public pages
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/hub')
  revalidatePath('/help')
  revalidatePath('/admin/site-content')

  return { success: true }
}
