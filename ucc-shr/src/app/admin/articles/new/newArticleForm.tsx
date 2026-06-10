'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Select } from '@/src/components/atoms/select'
import { Textarea } from '@/src/components/atoms/textarea'

type Category = 'Awareness' | 'Rights'

type SubmitMode = 'draft' | 'publish'

export function NewArticleForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Awareness')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [submittingMode, setSubmittingMode] = useState<SubmitMode | null>(null)
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

  async function handleSubmit(mode: SubmitMode) {
    setError(null)

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    if (!content.trim()) {
      setError('Article content is required.')
      return
    }

    setSubmittingMode(mode)

    try {
      const coverImage = await uploadCoverImage()

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          summary,
          content,
          coverImage,
          published: mode === 'publish',
        }),
      })

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean
        error?: string
      } | null

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? 'Unable to save article right now.')
      }

      const successKey = mode === 'publish' ? 'article-published' : 'article-draft-saved'
      router.push(`/admin/articles?success=${successKey}`)
      router.refresh()
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save article right now.')
      setSubmittingMode(null)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void handleSubmit('publish')
      }}
      className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-gray-700">Display Title</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter article title"
            className="border-gray-200"
            maxLength={180}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
            className="border-gray-200"
          >
            <option value="Awareness">Awareness</option>
            <option value="Rights">Know Your Rights</option>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Cover Image</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
            className="block h-12 w-full rounded-[10px] border-[1.5px] border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-dark"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">Card Summary</label>
        <Textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Short summary shown on the Posts & Events card"
          rows={3}
          className="border-gray-200"
          maxLength={300}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">Article Content</label>
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write the full article content..."
          rows={12}
          className="border-gray-200"
          required
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={submittingMode === 'draft'}
          disabled={Boolean(submittingMode)}
          onClick={() => void handleSubmit('draft')}
        >
          Save Draft
        </Button>
        <Button type="submit" size="sm" loading={submittingMode === 'publish'} disabled={Boolean(submittingMode)}>
          Publish Article
        </Button>
        <Link href="/admin/articles" className="text-sm font-semibold text-navy hover:text-navy-dark">
          Back to Articles
        </Link>
      </div>
    </form>
  )
}
