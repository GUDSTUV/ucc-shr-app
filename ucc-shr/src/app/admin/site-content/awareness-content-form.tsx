'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteContentJson } from './actions'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { toast } from 'react-hot-toast'
import { Video, Image as ImageIcon, Upload } from 'lucide-react'

type Props = {
  initialData: {
    awarenessVideoUrl: string
  }
}

export function AwarenessContentForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [video, setVideo] = useState(initialData.awarenessVideoUrl)

  const [videoFile, setVideoFile] = useState<File | null>(null)

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('files', file)
    
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data?.error || 'Upload failed')
    
    const uploadedFiles: string[] = data.files || []
    if (uploadedFiles.length === 0) throw new Error('No file returned')
    
    const uploadedFileString = uploadedFiles[0]
    const colonIndex = uploadedFileString.indexOf(':')
    const pathOnly = colonIndex !== -1 ? uploadedFileString.substring(colonIndex + 1) : uploadedFileString
    return pathOnly
  }

  async function handleSave() {
    setIsSubmitting(true)
    try {
      let finalVideoUrl = video

      if (videoFile) {
        finalVideoUrl = await uploadFile(videoFile)
      }

      const res3 = await updateSiteContentJson('awarenessVideoUrl', finalVideoUrl)

      if (res3.success) {
        toast.success('Awareness content saved successfully')
        setVideo(finalVideoUrl)
        setVideoFile(null)
        router.refresh()
      } else {
        toast.error('Failed to save content')
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* VIDEO SECTION */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Video className="text-navy" size={24} />
          <div>
            <h2 className="text-lg font-medium text-navy">Featured Campaign Video</h2>
            <p className="mt-1 text-sm text-gray-500">The video shown in the "Break The Silence" section.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Input 
            label="Video URL (YouTube or MP4)" 
            value={videoFile ? 'Will upload selected file...' : video} 
            onChange={(e) => {
              setVideo(e.target.value)
              setVideoFile(null)
            }} 
            disabled={!!videoFile}
            placeholder="https://www.youtube.com/watch?v=..."
            helperText="Paste a YouTube link for best performance."
          />

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">OR</span>
            <div className="relative flex-1">
              <Input
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setVideoFile(file)
                }}
                className="file:mr-4 file:rounded-md file:border-0 file:bg-navy-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navy hover:file:bg-navy/10"
              />
              <p className="mt-1 text-xs text-gray-500">Upload a small MP4 file (Max 10MB).</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Uploading & Saving...' : 'Save Awareness Content'}
        </Button>
      </div>
    </div>
  )
}

