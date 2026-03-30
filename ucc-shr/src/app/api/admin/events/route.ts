import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

const DEFAULT_EVENT_IMAGE = '/icons/default-event.svg'

type CreateEventPayload = {
  title?: unknown
  description?: unknown
  image?: unknown
  venue?: unknown
  startDate?: unknown
  endDate?: unknown
  capacity?: unknown
  published?: unknown
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as CreateEventPayload | null

  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 180) : ''
  const description = typeof body?.description === 'string' ? body.description.trim().slice(0, 5000) : ''
  const imageRaw = typeof body?.image === 'string' ? body.image.trim() : ''
  const venue = typeof body?.venue === 'string' ? body.venue.trim().slice(0, 180) : ''
  const startDateRaw = typeof body?.startDate === 'string' ? body.startDate : ''
  const endDateRaw = typeof body?.endDate === 'string' ? body.endDate : ''
  const capacityRaw = typeof body?.capacity === 'number' ? body.capacity : Number(body?.capacity)
  const published = body?.published === true

  if (!title || !description || !venue || !startDateRaw) {
    return NextResponse.json({ ok: false, error: 'Title, description, venue and start date are required.' }, { status: 400 })
  }

  const startDate = new Date(startDateRaw)
  if (Number.isNaN(startDate.getTime())) {
    return NextResponse.json({ ok: false, error: 'Invalid start date.' }, { status: 400 })
  }

  const endDate = endDateRaw ? new Date(endDateRaw) : null
  if (endDateRaw && Number.isNaN(endDate?.getTime() ?? Number.NaN)) {
    return NextResponse.json({ ok: false, error: 'Invalid end date.' }, { status: 400 })
  }

  const image = imageRaw.startsWith('/uploads/') || imageRaw.startsWith('/icons/') ? imageRaw : DEFAULT_EVENT_IMAGE

  const event = await prisma.event.create({
    data: {
      title,
      description,
      image,
      venue,
      startDate,
      endDate,
      capacity: Number.isFinite(capacityRaw) && capacityRaw > 0 ? Math.floor(capacityRaw) : null,
      published,
      authorId: session.user.id,
    },
    select: { id: true, published: true },
  })

  return NextResponse.json({ ok: true, event }, { status: 201 })
}
