import Link from 'next/link'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { Button } from '@/src/components/atoms/button'
import { BannerListClient } from './banner-list-client'

export default async function AdminBannersPage() {
  await requireSuperAdmin()

  const banners = await prisma.campaignBanner.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const serializedBanners = banners.map(b => ({
    id: b.id,
    title: b.title,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl,
    isActive: b.isActive,
    createdAt: b.createdAt
  }))

  return (
    <AdminLayout 
      title="Campaign Banners" 
      description="Manage the images and campaigns displayed on the homepage hero section."
      actions={
        <Link href="/admin/banners/new">
          <Button size="sm">Add Banner</Button>
        </Link>
      }
    >
      <BannerListClient initialBanners={serializedBanners} />
    </AdminLayout>
  )
}
