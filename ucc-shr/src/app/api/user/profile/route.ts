import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

function sanitizeText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength)
}

function isUnknownImageFieldError(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  return message.includes('Unknown field `image` for select statement on model `User`')
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let user: {
    id: string
    name: string
    email: string
    image?: string | null
    createdAt: Date
  } | null = null

  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })
  } catch (error: unknown) {
    if (!isUnknownImageFieldError(error)) {
      throw error
    }

    const fallbackUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    user = fallbackUser
  }

  if (!user) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, user })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const updates: { name?: string; email?: string; image?: string | null } = {}

    if (typeof body.name === 'string') {
      const name = sanitizeText(body.name, 80)
      if (!name) {
        return NextResponse.json({ ok: false, error: 'Name is required.' }, { status: 400 })
      }
      updates.name = name
    }

    if (typeof body.email === 'string') {
      const email = sanitizeText(body.email, 160).toLowerCase()
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      if (!isEmailValid) {
        return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
      }

      updates.email = email
    }

    if (typeof body.image === 'string') {
      const image = sanitizeText(body.image, 300)
      updates.image = image || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: false, error: 'No fields to update.' }, { status: 400 })
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: updates,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })

      return NextResponse.json({ ok: true, user: updatedUser })
    } catch (error: unknown) {
      if (!isUnknownImageFieldError(error)) {
        throw error
      }

      const { image, ...safeUpdates } = updates

      if (Object.keys(safeUpdates).length === 0) {
        return NextResponse.json(
          { ok: false, error: 'Profile image support is not ready in this runtime yet. Please refresh the server.' },
          { status: 503 }
        )
      }

      const fallbackUser = await prisma.user.update({
        where: { id: session.user.id },
        data: safeUpdates,
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      return NextResponse.json({ ok: true, user: { ...fallbackUser, image: null } })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('Unique constraint')) {
      return NextResponse.json({ ok: false, error: 'This email is already in use.' }, { status: 409 })
    }

    return NextResponse.json({ ok: false, error: 'Unable to update profile right now.' }, { status: 500 })
  }
}
