'use client'

import { useState } from 'react'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { toggleBannerActive, deleteBanner } from './banner-actions'
import Image from 'next/image'

type Banner = {
  id: string
  title: string
  imageUrl: string
  linkUrl: string | null
  isActive: boolean
  createdAt: Date
}

export function BannerListClient({ initialBanners }: { initialBanners: Banner[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleToggle(id: string, currentlyActive: boolean) {
    setLoading(id)
    await toggleBannerActive(id, !currentlyActive)
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this banner?')) return
    setLoading(id)
    await deleteBanner(id)
    setLoading(null)
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {initialBanners.map(banner => (
        <article key={banner.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-48 w-full bg-gray-100">
            <Image 
              src={banner.imageUrl} 
              alt={banner.title} 
              fill 
              className="object-cover"
            />
            <div className="absolute right-3 top-3">
              <Badge variant={banner.isActive ? 'success' : 'gray'}>
                {banner.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{banner.title}</h3>
            {banner.linkUrl && (
              <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="mt-1 text-sm text-navy hover:underline line-clamp-1">
                {banner.linkUrl}
              </a>
            )}
            
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Added {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(banner.createdAt))}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleToggle(banner.id, banner.isActive)}
                  disabled={loading === banner.id}
                >
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDelete(banner.id)}
                  disabled={loading === banner.id}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}

      {initialBanners.length === 0 && (
        <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          No banners found. Create one to display it on the homepage hero section.
        </div>
      )}
    </div>
  )
}
