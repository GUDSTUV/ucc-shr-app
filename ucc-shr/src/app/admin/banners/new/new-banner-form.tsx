'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FormField } from '@/src/components/molecules/form-field'
import { Input } from '@/src/components/atoms/input'
import { Button } from '@/src/components/atoms/button'
import { AlertBox } from '@/src/components/molecules/alert-box'
import { createBanner } from '../banner-actions'

export function NewBannerForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setError('')
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  async function uploadImage() {
    if (!imageFile) return null

    const formData = new FormData()
    formData.append('files', imageFile)

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error ?? 'Unable to upload image right now.')
    }

    const uploadedFiles: string[] = data.files || []
    if (uploadedFiles.length === 0) {
      throw new Error('No file returned from upload.')
    }

    const [kind, pathOnly] = uploadedFiles[0].split(':')
    if (!pathOnly.startsWith('/uploads/')) {
      throw new Error('Unexpected file path from upload.')
    }

    return pathOnly
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!imageFile) {
        throw new Error('Please select an image for the banner.')
      }

      const imageUrl = await uploadImage()
      if (!imageUrl) {
        throw new Error('Image upload failed.')
      }

      const res = await createBanner({
        title,
        linkUrl: linkUrl || null,
        imageUrl,
      })

      if (res.success) {
        router.push('/admin/banners')
      } else {
        throw new Error('Failed to save the banner.')
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {error && <AlertBox variant="danger" title="Error">{error}</AlertBox>}

      <FormField label="Banner Title / Text" hint="This text will be overlaid on the image.">
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          placeholder="e.g., Creating a Safe and Respectful Campus Environment"
          disabled={loading}
        />
      </FormField>

      <FormField label="Link URL (Optional)" hint="Make the text clickable. Example: /hub/safety-guide or https://example.com">
        <Input 
          type="url"
          value={linkUrl} 
          onChange={(e) => setLinkUrl(e.target.value)} 
          placeholder="https://"
          disabled={loading}
        />
      </FormField>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Banner Image</label>
        <p className="text-xs text-gray-500">For best results, use a wide landscape image (e.g. 1920x1080) under 5MB.</p>
        
        {imagePreview && (
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
          </div>
        )}

        <div className="mt-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-navy-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navy hover:file:bg-navy/10"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/banners')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Banner'}
        </Button>
      </div>
    </form>
  )
}
