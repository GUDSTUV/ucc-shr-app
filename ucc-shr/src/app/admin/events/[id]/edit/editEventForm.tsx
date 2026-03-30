'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Button } from '@/src/components/atoms/button'
import { Input } from '@/src/components/atoms/input'
import { Textarea } from '@/src/components/atoms/textarea'

type Props = {
  event: {
    id: string
    title: string
    description: string
    image: string
    venue: string
    startDate: Date
    endDate: Date | null
    capacity: number | null
    published: boolean
  }
}

function toDatetimeLocal(date: Date | null) {
  if (!date) return ''
  const pad = (v: number) => String(v).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${y}-${m}-${d}T${h}:${min}`
}

export function EditEventForm({ event }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(event.title)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState(event.image)
  const [venue, setVenue] = useState(event.venue)
  const [description, setDescription] = useState(event.description)
  const [startDate, setStartDate] = useState(toDatetimeLocal(new Date(event.startDate)))
  const [endDate, setEndDate] = useState(toDatetimeLocal(event.endDate ? new Date(event.endDate) : null))
  const [capacity, setCapacity] = useState(event.capacity ? String(event.capacity) : '')
  const [published, setPublished] = useState(event.published)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadEventImage() {
    if (!imageFile) {
      return null
    }

    const formData = new FormData()
    formData.append('files', imageFile)
    formData.append('kinds', 'event')

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
      throw new Error(data?.error ?? 'Unable to upload event image right now.')
    }

    const rawPath = String(data.files[0])
    const pathOnly = rawPath.includes(':') ? rawPath.split(':').slice(1).join(':') : rawPath

    if (!pathOnly.startsWith('/uploads/')) {
      throw new Error('Unexpected file path from upload.')
    }

    return pathOnly
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const uploadedImage = await uploadEventImage()
      const payload: Record<string, unknown> = {
        title,
        description,
        venue,
        startDate,
        endDate: endDate || null,
        capacity: capacity ? Number(capacity) : null,
        published,
      }

      if (uploadedImage) {
        payload.image = uploadedImage
        setImagePath(uploadedImage)
      }

      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? 'Unable to update event.')
      }

      router.push('/admin/events?success=event-updated')
      router.refresh()
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to update event.')
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Edit Event">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void handleSave()
        }}
        className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Title</label>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Venue</label>
          <Input value={venue} onChange={(event) => setVenue(event.target.value)} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Event Image (optional)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="block h-12 w-full rounded-[10px] border-[1.5px] border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-dark"
          />
          <p className="mt-1 text-xs text-gray-500">Current image: {imagePath}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Description</label>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={8} required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Start Date & Time</label>
            <Input type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">End Date & Time (optional)</label>
            <Input type="datetime-local" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Capacity (optional)</label>
            <Input type="number" min={1} value={capacity} onChange={(event) => setCapacity(event.target.value)} />
          </div>
          <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-gray-700">
            <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="h-4 w-4" />
            Published
          </label>
        </div>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" loading={saving}>Save Changes</Button>
          <Link href="/admin/events" className="text-sm font-semibold text-navy hover:text-navy-dark">Back to Events</Link>
        </div>
      </form>
    </AdminLayout>
  )
}
