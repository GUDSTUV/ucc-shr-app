import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

const DEFAULT_ARTICLE_IMAGE = '/icons/default-article.svg'

type PatchPayload = {
  title?: unknown
  category?: unknown
  summary?: unknown
  content?: unknown
  coverImage?: unknown
  published?: unknown
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)
}

async function ensureUniqueSlug(baseTitle: string, articleId: string) {
  const base = slugify(baseTitle) || `article-${Date.now()}`
  for (let i = 0; i < 50; i += 1) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const existing = await prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } })
    if (!existing || existing.id === articleId) {
      return candidate
    }
  }
  return `${base}-${Date.now()}`
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
  const body = (await request.json().catch(() => null)) as PatchPayload | null

  const existing = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      coverImage: true,
    },
  })
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Article not found.' }, { status: 404 })
  }

  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 180) : ''
  const categoryRaw = typeof body?.category === 'string' ? body.category.trim() : ''
  const summary = typeof body?.summary === 'string' ? body.summary.trim().slice(0, 300) : ''
  const content = typeof body?.content === 'string' ? body.content.trim().slice(0, 12000) : ''
  const coverImageRaw = typeof body?.coverImage === 'string' ? body.coverImage.trim() : ''
  const published = body?.published === true

  if (!title || !content) {
    return NextResponse.json({ ok: false, error: 'Title and content are required.' }, { status: 400 })
  }

  const slug = await ensureUniqueSlug(title, id)
  const category = categoryRaw === 'Rights' ? 'Rights' : 'Awareness'
  const contentPayload = summary ? `${summary}\n\n${content}` : content
  const hasCoverImageField = body ? Object.prototype.hasOwnProperty.call(body, 'coverImage') : false
  const coverImage = hasCoverImageField
    ? coverImageRaw.startsWith('/uploads/') || coverImageRaw.startsWith('/icons/')
      ? coverImageRaw
      : DEFAULT_ARTICLE_IMAGE
    : existing.coverImage || DEFAULT_ARTICLE_IMAGE

  const article = await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      category,
      content: contentPayload,
      coverImage,
      published,
    },
    select: { id: true, slug: true, published: true },
  })

  return NextResponse.json({ ok: true, article })
}
