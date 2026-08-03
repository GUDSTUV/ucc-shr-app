import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

/**
 * GET /api/push/subscribe
 * Returns the VAPID public key so client can subscribe even if env was not baked at build time.
 */
export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || ''
  return NextResponse.json({ ok: true, publicKey })
}

/**
 * POST /api/push/subscribe
 * Save a push subscription for the currently logged-in user.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { endpoint, keys } = body as {
      endpoint?: string
      keys?: { p256dh?: string; auth?: string }
    }

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ ok: false, error: 'Invalid subscription data.' }, { status: 400 })
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        userId: session.user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      update: {
        userId: session.user.id,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[PUSH_SUBSCRIBE]', err)
    return NextResponse.json({ ok: false, error: 'Failed to save subscription.' }, { status: 500 })
  }
}

/**
 * DELETE /api/push/subscribe
 * Remove a push subscription for the currently logged-in user.
 */
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { endpoint } = body as { endpoint?: string }

    if (!endpoint) {
      return NextResponse.json({ ok: false, error: 'Endpoint required.' }, { status: 400 })
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: session.user.id },
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[PUSH_UNSUBSCRIBE]', err)
    return NextResponse.json({ ok: false, error: 'Failed to remove subscription.' }, { status: 500 })
  }
}
