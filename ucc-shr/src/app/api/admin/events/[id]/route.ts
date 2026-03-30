import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

const DEFAULT_EVENT_IMAGE = '/icons/default-event.svg'

type UpdateEventPayload = {
  title?: unknown
  description?: unknown
  image?: unknown
  venue?: unknown
  startDate?: unknown
  endDate?: unknown
  capacity?: unknown
  published?: unknown
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const body = (await request.json().catch(() => null)) as UpdateEventPayload | null

  const existing = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      venue: true,
      startDate: true,
      endDate: true,
      capacity: true,
      published: true,
    },
  })
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Event not found.' }, { status: 404 })
  }

  const title =
    typeof body?.title === 'string' && body.title.trim().length > 0
      ? body.title.trim().slice(0, 180)
      : existing.title
  const description =
    typeof body?.description === 'string' && body.description.trim().length > 0
      ? body.description.trim().slice(0, 5000)
      : existing.description
  const venue =
    typeof body?.venue === 'string' && body.venue.trim().length > 0
      ? body.venue.trim().slice(0, 180)
      : existing.venue

  const hasImageField = body ? Object.prototype.hasOwnProperty.call(body, 'image') : false
  let image = existing.image || DEFAULT_EVENT_IMAGE
  if (hasImageField) {
    const imageRaw = typeof body?.image === 'string' ? body.image.trim() : ''
    image = imageRaw.startsWith('/uploads/') || imageRaw.startsWith('/icons/') ? imageRaw : DEFAULT_EVENT_IMAGE
  }

  let startDate = existing.startDate
  if (typeof body?.startDate === 'string' && body.startDate.trim().length > 0) {
    const parsed = new Date(body.startDate)
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ ok: false, error: 'Invalid start date.' }, { status: 400 })
    }
    startDate = parsed
  }

  let endDate = existing.endDate
  if (typeof body?.endDate === 'string') {
    const raw = body.endDate.trim()
    if (!raw) {
      endDate = null
    } else {
      const parsed = new Date(raw)
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ ok: false, error: 'Invalid end date.' }, { status: 400 })
      }
      endDate = parsed
    }
  }

  let capacity = existing.capacity
  if (typeof body?.capacity === 'number') {
    capacity = Number.isFinite(body.capacity) && body.capacity > 0 ? Math.floor(body.capacity) : null
  } else if (typeof body?.capacity === 'string') {
    const parsed = Number(body.capacity)
    capacity = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null
  }

  const published = typeof body?.published === 'boolean' ? body.published : existing.published

  const event = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      image,
      venue,
      startDate,
      endDate,
      capacity,
      published,
    },
    select: { id: true, published: true },
  })

  return NextResponse.json({ ok: true, event })
}
