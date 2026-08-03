import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { sendPushToUser } from '@/src/lib/web-push'
import { prisma } from '@/src/lib/prisma'

/**
 * POST /api/push/test
 * Sends a test push notification to all active devices registered by the current logged-in user.
 */
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const count = await prisma.pushSubscription.count({
    where: { userId: session.user.id }
  })

  if (count === 0) {
    return NextResponse.json({
      ok: false,
      error: 'No registered push devices found for your account. Please click "Enable Notifications" first.'
    }, { status: 400 })
  }

  try {
    await sendPushToUser(session.user.id, {
      title: '🔔 CEGRAD UCC Test Alert',
      body: 'Your device is connected and push notifications are working perfectly!',
      url: '/user/notifications',
    })

    return NextResponse.json({
      ok: true,
      message: `Test notification sent to ${count} registered device(s).`
    })
  } catch (err) {
    console.error('[PUSH_TEST_ERROR]', err)
    return NextResponse.json({ ok: false, error: 'Failed to send test push notification.' }, { status: 500 })
  }
}
