'use server'

import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleBannerActive(bannerId: string, isActive: boolean) {
  await requireSuperAdmin()
  
  await prisma.campaignBanner.update({
    where: { id: bannerId },
    data: { isActive }
  })

  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}

export async function deleteBanner(bannerId: string) {
  await requireSuperAdmin()
  
  await prisma.campaignBanner.delete({
    where: { id: bannerId }
  })

  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}

export async function createBanner(data: { title: string, linkUrl: string | null, imageUrl: string }) {
  await requireSuperAdmin()
  
  const banner = await prisma.campaignBanner.create({
    data: {
      title: data.title,
      linkUrl: data.linkUrl || null,
      imageUrl: data.imageUrl,
      isActive: true
    }
  })

  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true, bannerId: banner.id }
}
