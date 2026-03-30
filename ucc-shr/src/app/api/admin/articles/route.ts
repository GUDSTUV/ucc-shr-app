import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

const DEFAULT_ARTICLE_IMAGE = '/icons/default-article.svg'

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

async function createUniqueSlug(baseTitle: string) {
  const base = slugify(baseTitle) || `article-${Date.now()}`

  for (let i = 0; i < 50; i += 1) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const existing = await prisma.article.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing) {
      return candidate
    }
  }

  return `${base}-${Date.now()}`
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as {
    title?: unknown
    category?: unknown
    summary?: unknown
    content?: unknown
    coverImage?: unknown
    published?: unknown
  } | null

  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 180) : ''
  const categoryRaw = typeof body?.category === 'string' ? body.category.trim() : ''
  const summary = typeof body?.summary === 'string' ? body.summary.trim().slice(0, 300) : ''
  const content = typeof body?.content === 'string' ? body.content.trim().slice(0, 12000) : ''
  const coverImageRaw = typeof body?.coverImage === 'string' ? body.coverImage.trim() : ''
  const published = body?.published === true

  if (!title) {
    return NextResponse.json({ ok: false, error: 'Title is required.' }, { status: 400 })
  }

  if (!content) {
    return NextResponse.json({ ok: false, error: 'Content is required.' }, { status: 400 })
  }

  const category = categoryRaw === 'Rights' ? 'Rights' : 'Awareness'
  const slug = await createUniqueSlug(title)

  const contentPayload = summary ? `${summary}\n\n${content}` : content
  const coverImage =
    coverImageRaw.startsWith('/uploads/') || coverImageRaw.startsWith('/icons/')
      ? coverImageRaw
      : DEFAULT_ARTICLE_IMAGE

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content: contentPayload,
      category,
      published,
      coverImage,
      authorId: session.user.id,
    },
    select: {
      id: true,
      slug: true,
      published: true,
    },
  })

  return NextResponse.json({ ok: true, article }, { status: 201 })
}
