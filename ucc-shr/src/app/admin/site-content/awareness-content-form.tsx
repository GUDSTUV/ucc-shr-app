'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteContentJson } from './actions'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { toast } from 'react-hot-toast'
import { Video, Image as ImageIcon } from 'lucide-react'

type Props = {
  initialData: {
    awarenessBanner: string
    awarenessVideoUrl: string
  }
}

export function AwarenessContentForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [banner, setBanner] = useState(initialData.awarenessBanner)
  const [video, setVideo] = useState(initialData.awarenessVideoUrl)

  async function handleSave() {
    setIsSubmitting(true)
    try {
      const res1 = await updateSiteContentJson('awarenessBanner', banner)
      const res2 = await updateSiteContentJson('awarenessVideoUrl', video)

      if (res1.success && res2.success) {
        toast.success('Awareness content saved successfully')
        router.refresh()
      } else {
        toast.error('Failed to save content')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* BANNER SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="text-navy" size={24} />
          <div>
            <h2 className="text-lg font-medium text-navy">Awareness Hero Banner</h2>
            <p className="mt-1 text-sm text-gray-500">The main background image at the top of the Awareness page.</p>
          </div>
        </div>

        <div className="mt-6">
          <Input 
            label="Background Image URL" 
            value={banner} 
            onChange={(e) => setBanner(e.target.value)} 
            placeholder="https://..."
            helperText="Paste a direct image link or use an uploaded file URL."
          />
          {banner && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img src={banner} alt="Banner Preview" className="h-48 w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Video className="text-navy" size={24} />
          <div>
            <h2 className="text-lg font-medium text-navy">Featured Campaign Video</h2>
            <p className="mt-1 text-sm text-gray-500">The video shown in the "Break The Silence" section.</p>
          </div>
        </div>

        <div className="mt-6">
          <Input 
            label="Video URL (YouTube or MP4)" 
            value={video} 
            onChange={(e) => setVideo(e.target.value)} 
            placeholder="https://www.youtube.com/watch?v=..."
            helperText="Paste a YouTube link for best performance, or a direct link to an .mp4 file."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Awareness Content'}
        </Button>
      </div>
    </div>
  )
}
