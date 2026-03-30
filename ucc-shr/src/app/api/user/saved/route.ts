import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

type ResourceType = 'ARTICLE' | 'EVENT'

function isResourceType(value: unknown): value is ResourceType {
  return value === 'ARTICLE' || value === 'EVENT'
}

async function ensurePublishedResource(resourceType: ResourceType, resourceId: string) {
  if (resourceType === 'ARTICLE') {
    const article = await prisma.article.findUnique({
      where: { id: resourceId },
      select: { id: true, published: true },
    })

    return Boolean(article?.published)
  }

  const event = await prisma.event.findUnique({
    where: { id: resourceId },
    select: { id: true, published: true },
  })

  return Boolean(event?.published)
}

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 })
  }

  const saved = await prisma.savedResource.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      resourceType: true,
      resourceId: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ ok: true, saved })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Please log in to save resources.' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as {
    resourceType?: unknown
    resourceId?: unknown
  } | null

  if (!body || !isResourceType(body.resourceType) || typeof body.resourceId !== 'string' || body.resourceId.length < 8) {
    return NextResponse.json({ ok: false, error: 'Invalid save request.' }, { status: 400 })
  }

  const exists = await ensurePublishedResource(body.resourceType, body.resourceId)
  if (!exists) {
    return NextResponse.json({ ok: false, error: 'Resource not found.' }, { status: 404 })
  }

  await prisma.savedResource.upsert({
    where: {
      userId_resourceType_resourceId: {
        userId: session.user.id,
        resourceType: body.resourceType,
        resourceId: body.resourceId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as {
    resourceType?: unknown
    resourceId?: unknown
  } | null

  if (!body || !isResourceType(body.resourceType) || typeof body.resourceId !== 'string') {
    return NextResponse.json({ ok: false, error: 'Invalid unsave request.' }, { status: 400 })
  }

  await prisma.savedResource.deleteMany({
    where: {
      userId: session.user.id,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
    },
  })

  return NextResponse.json({ ok: true })
}
