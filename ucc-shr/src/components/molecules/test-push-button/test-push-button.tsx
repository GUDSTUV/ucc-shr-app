'use client'

import { useState } from 'react'
import { Bell, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'

export function TestPushButton() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleSendTest() {
    setLoading(true)
    setStatus(null)

    try {
      // First ensure service worker & push subscription are active
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        setStatus({
          type: 'error',
          message: 'Web Push is not supported in this browser. Please use Chrome, Edge, or install the PWA.',
        })
        setLoading(false)
        return
      }

      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission()
        if (perm !== 'granted') {
          setStatus({
            type: 'error',
            message: 'Notifications are blocked in your browser settings. Please allow notifications.',
          })
          setLoading(false)
          return
        }
      }

      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      let sub = await reg.pushManager.getSubscription()
      if (!sub) {
        // Fetch public key
        let publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!publicKey) {
          const keyRes = await fetch('/api/push/subscribe')
          if (keyRes.ok) {
            const data = await keyRes.json()
            publicKey = data.publicKey
          }
        }

        if (!publicKey) {
          setStatus({
            type: 'error',
            message: 'VAPID public key not found. Please ensure VAPID keys are added to Vercel/env.',
          })
          setLoading(false)
          return
        }

        const padding = '='.repeat((4 - (publicKey.length % 4)) % 4)
        const base64 = (publicKey + padding).replace(/-/g, '+').replace(/_/g, '/')
        const rawData = atob(base64)
        const rawBytes = Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))

        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: rawBytes as unknown as BufferSource,
        })

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub.toJSON()),
        })
      }

      // Now trigger test push from server
      const res = await fetch('/api/push/test', { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Push alert sent! Check your notification tray.',
        })
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to send test push notification.',
        })
      }
    } catch (err: unknown) {
      console.error('[TEST_PUSH_ERROR]', err)
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'An unexpected error occurred.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <Bell size={15} className="text-navy" /> Test Push Notifications
          </p>
          <p className="text-xs text-gray-500">
            Verify that your device and browser can receive background alerts.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleSendTest}
          disabled={loading}
          className="h-9 gap-1.5 rounded-lg bg-navy text-white hover:bg-navy-dark"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={13} /> Send Test Push
            </>
          )}
        </Button>
      </div>

      {status && (
        <div
          className={`mt-2.5 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
            status.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 size={14} className="shrink-0 text-green-600" />
          ) : (
            <AlertCircle size={14} className="shrink-0 text-red-500" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  )
}
