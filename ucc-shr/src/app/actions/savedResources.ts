'use server'

import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'

type ResourceType = 'ARTICLE' | 'EVENT'

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

export async function saveResource(resourceType: ResourceType, resourceId: string): Promise<{ ok: boolean; error?: string }> {
  console.log('[saveResource Action] Start:', { resourceType, resourceId })
  
  const session = await auth()
  console.log('[saveResource Action] Session user:', session?.user?.id)

  if (!session?.user?.id) {
    return { ok: false, error: 'Please log in to save resources.' }
  }

  if (!resourceId || resourceId.length < 8) {
    return { ok: false, error: 'Invalid resource.' }
  }

  const exists = await ensurePublishedResource(resourceType, resourceId)
  console.log('[saveResource Action] Resource exists:', exists)
  if (!exists) {
    return { ok: false, error: 'Resource not found or not published.' }
  }

  try {
    const result = await prisma.savedResource.upsert({
      where: {
        userId_resourceType_resourceId: {
          userId: session.user.id,
          resourceType,
          resourceId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        resourceType,
        resourceId,
      },
    })
    console.log('[saveResource Action] Upsert successful:', result)
    revalidatePath('/user/saved')
    return { ok: true }
  } catch (err) {
    console.error('[saveResource Action] DB error:', err)
    return { ok: false, error: 'Failed to save resource.' }
  }
}

export async function unsaveResource(resourceType: ResourceType, resourceId: string): Promise<{ ok: boolean; error?: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    return { ok: false, error: 'Authentication required.' }
  }

  try {
    await prisma.savedResource.deleteMany({
      where: {
        userId: session.user.id,
        resourceType,
        resourceId,
      },
    })
    revalidatePath('/user/saved')
    return { ok: true }
  } catch (err) {
    console.error('[unsaveResource] error:', err)
    return { ok: false, error: 'Failed to unsave resource.' }
  }
}
