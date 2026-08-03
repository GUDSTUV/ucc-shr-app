/**
 * src/lib/web-push.ts
 * Server-side helper for sending Web Push Notifications via the VAPID protocol.
 *
 * Required env vars:
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY  — generated with: npx web-push generate-vapid-keys
 *   VAPID_PRIVATE_KEY             — generated with: npx web-push generate-vapid-keys
 *   VAPID_SUBJECT                 — e.g. mailto:noreply@example.com
 */

import webpush from 'web-push'
import { prisma } from '@/src/lib/prisma'

let initialized = false

function initWebPush() {
  if (initialized) return
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT

  if (!publicKey || !privateKey || !subject) {
    console.warn('[WEB-PUSH] VAPID keys not configured — push notifications are disabled.')
    return
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  initialized = true
}

export type PushPayload = {
  title: string
  body: string
  url?: string
  icon?: string
}

/**
 * Send a push notification to all subscriptions for a given user.
 * Expired/invalid subscriptions are automatically removed from the DB.
 */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  initWebPush()
  if (!initialized) return

  let subscriptions: { id: string; endpoint: string; p256dh: string; auth: string }[]
  try {
    subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
      select: { id: true, endpoint: true, p256dh: true, auth: true },
    })
  } catch (err) {
    console.error('[WEB-PUSH] Failed to fetch subscriptions:', err)
    return
  }

  if (!subscriptions.length) return

  const data = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? '/',
    icon: payload.icon ?? '/icons/logo.svg',
  })

  const expiredIds: string[] = []

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          data
        )
      } catch (err: any) {
        // 404 / 410 means the subscription is no longer valid
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          expiredIds.push(sub.id)
        } else {
          console.error(`[WEB-PUSH] Failed to send to ${sub.endpoint}:`, err?.message ?? err)
        }
      }
    })
  )

  // Clean up expired subscriptions
  if (expiredIds.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: expiredIds } } }).catch(() => {})
  }
}

/**
 * Send a push notification to all SUPER_ADMIN and ADMIN users.
 */
export async function sendPushToAdmins(payload: PushPayload) {
  initWebPush()
  if (!initialized) return

  try {
    const adminSubs = await prisma.pushSubscription.findMany({
      where: {
        User: { role: { in: ['SUPER_ADMIN', 'ADMIN', 'COUNSELOR', 'INVESTIGATOR'] } },
      },
      select: { id: true, endpoint: true, p256dh: true, auth: true, userId: true },
    })

    if (!adminSubs.length) return

    const data = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url ?? '/admin',
      icon: payload.icon ?? '/icons/logo.svg',
    })

    const expiredIds: string[] = []

    await Promise.allSettled(
      adminSubs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            data
          )
        } catch (err: any) {
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            expiredIds.push(sub.id)
          } else {
            console.error(`[WEB-PUSH] Admin push failed:`, err?.message ?? err)
          }
        }
      })
    )

    if (expiredIds.length > 0) {
      await prisma.pushSubscription.deleteMany({ where: { id: { in: expiredIds } } }).catch(() => {})
    }
  } catch (err) {
    console.error('[WEB-PUSH] sendPushToAdmins failed:', err)
  }
}
