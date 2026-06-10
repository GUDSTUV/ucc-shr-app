'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Select } from '@/src/components/atoms/select'
import { Textarea } from '@/src/components/atoms/textarea'

type Props = {
  articleId: string
  initialTitle: string
  initialCategory: 'Awareness' | 'Rights'
  initialSummary: string
  initialContent: string
  initialCoverImage: string
  initialPublished: boolean
}

export function EditArticleForm({
  articleId,
  initialTitle,
  initialCategory,
  initialSummary,
  initialContent,
  initialCoverImage,
  initialPublished,
}: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [category, setCategory] = useState<'Awareness' | 'Rights'>(initialCategory)
  const [summary, setSummary] = useState(initialSummary)
  const [content, setContent] = useState(initialContent)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState(initialCoverImage)
  const [published, setPublished] = useState(initialPublished)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadCoverImage() {
    if (!coverFile) {
      return null
    }

    const formData = new FormData()
    formData.append('files', coverFile)
    formData.append('kinds', 'cover')

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    const data = (await response.json().catch(() => null)) as {
      ok?: boolean
      error?: string
      files?: string[]
    } | null

    if (!response.ok || !data?.ok || !Array.isArray(data.files) || data.files.length === 0) {
      throw new Error(data?.error ?? 'Unable to upload cover image right now.')
    }

    const rawPath = String(data.files[0])
    const pathOnly = rawPath.includes(':') ? rawPath.split(':').slice(1).join(':') : rawPath

    if (!pathOnly.startsWith('/uploads/')) {
      throw new Error('Unexpected file path from upload.')
    }

    return pathOnly
  }

  async function saveChanges() {
    setSaving(true)
    setError(null)
    try {
      const uploadedCoverImage = await uploadCoverImage()
      const payload: Record<string, unknown> = {
        title,
        category,
        summary,
        content,
        published,
      }

      if (uploadedCoverImage) {
        payload.coverImage = uploadedCoverImage
        setCoverImage(uploadedCoverImage)
      }

      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? 'Unable to update article.')
      }

      router.push('/admin/articles?success=article-updated')
      router.refresh()
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to update article.')
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void saveChanges()
      }}
      className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">Display Title</label>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} className="border-gray-200" required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
          <Select value={category} onChange={(event) => setCategory(event.target.value as 'Awareness' | 'Rights')}>
            <option value="Awareness">Awareness</option>
            <option value="Rights">Know Your Rights</option>
          </Select>
        </div>

        <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-4 w-4"
          />
          Published
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">Cover Image</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
          className="block h-12 w-full rounded-[10px] border-[1.5px] border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-dark"
        />
        <p className="mt-1 text-xs text-gray-500">Current image: {coverImage}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">Card Summary</label>
        <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={3} className="border-gray-200" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">Article Content</label>
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={12} className="border-gray-200" required />
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" loading={saving}>Save Changes</Button>
        <Link href="/admin/articles" className="text-sm font-semibold text-navy hover:text-navy-dark">Back to Articles</Link>
      </div>
    </form>
  )
}
