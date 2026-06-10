'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteContent } from './actions'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'

type Props = {
  initialData: {
    heroTitle: string
    heroSubtitle: string
    footerText: string
  }
}

export function SiteContentForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const entries = Array.from(formData.entries())
      const results = await Promise.all(
        entries.map(([key, value]) => updateSiteContent(key, value as string))
      )

      if (results.every(r => r.success)) {
        toast.success('Home content updated successfully')
        router.refresh()
      } else {
        toast.error('Failed to update some content')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Link to Banners */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-navy">Home Page Carousel</h3>
            <p className="mt-1 text-sm text-gray-500">
              The sliding images on the home page are managed in the Banners section.
            </p>
          </div>
          <Link href="/admin/banners">
            <Button variant="outline" className="gap-2">
              <ImageIcon size={16} />
              Manage Banners
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-medium text-navy">Hero Section Text</h2>
          <p className="mt-1 text-sm text-gray-500">Main headline and description on the homepage.</p>
          
          <div className="mt-4 space-y-4">
            <Input 
              label="Hero Title"
              name="heroTitle"
              defaultValue={initialData.heroTitle}
              required
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Hero Subtitle</label>
              <textarea 
                name="heroSubtitle"
                defaultValue={initialData.heroSubtitle}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h2 className="text-lg font-medium text-navy">Global Footer</h2>
          <p className="mt-1 text-sm text-gray-500">Copyright and description in the footer.</p>
          <div className="mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Footer Text</label>
              <textarea 
                name="footerText"
                defaultValue={initialData.footerText}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Home Content'}
          </Button>
        </div>
      </form>
    </div>
  )
}
