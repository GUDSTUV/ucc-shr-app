'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, X } from 'lucide-react'

type State = 'idle' | 'checking' | 'subscribed' | 'denied' | 'unsupported' | 'error'

/**
 * PushPrompt
 * Shows a dismissible banner asking the user to enable push notifications.
 * - Registers /sw.js service worker
 * - Subscribes via the Web Push API
 * - Persists the subscription via POST /api/push/subscribe
 *
 * Only renders when:
 *   1. Browser supports notifications + service workers
 *   2. Permission is not yet granted
 *   3. User has not previously dismissed this prompt
 */
export function PushPrompt({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [state, setState] = useState<State>('checking')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) { setState('unsupported'); return }
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setState('unsupported')
      return
    }
    // Check if already dismissed in this session
    if (sessionStorage.getItem('cegrad_push_dismissed') === '1') {
      setDismissed(true)
      return
    }
    if (Notification.permission === 'granted') {
      setState('subscribed')
    } else if (Notification.permission === 'denied') {
      setState('denied')
    } else {
      setState('idle')
    }
  }, [isLoggedIn])

  async function handleEnable() {
    setState('checking')
    try {
      if (typeof window === 'undefined') return

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState('denied')
        return
      }

      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      let publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!publicKey) {
        // Fallback: fetch from server endpoint if env var was not baked at client build time
        const keyRes = await fetch('/api/push/subscribe')
        if (keyRes.ok) {
          const keyData = await keyRes.json()
          publicKey = keyData.publicKey
        }
      }

      if (!publicKey) {
        console.error('[PUSH] No VAPID public key available from env or API.')
        setState('error')
        return
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      })

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })

      if (res.ok) {
        setState('subscribed')
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('[PUSH] Subscribe API failed:', errorData)
        setState('error')
      }
    } catch (err) {
      console.error('[PUSH_PROMPT_ERROR]', err)
      setState('error')
    }
  }

  function handleDismiss() {
    sessionStorage.setItem('cegrad_push_dismissed', '1')
    setDismissed(true)
  }

  // Don't show if: unsupported, already subscribed, or dismissed
  if (dismissed || state === 'unsupported' || state === 'subscribed') {
    return null
  }

  return (
    <div
      role="alert"
      className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border border-navy/20 bg-white px-4 py-3 shadow-lg md:bottom-6 md:left-auto md:right-6 md:max-w-xs"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/10">
          {state === 'error' || state === 'denied' ? (
            <BellOff size={18} className="text-red-500" />
          ) : (
            <Bell size={18} className="text-navy" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {state === 'error'
              ? 'Could not enable notifications'
              : state === 'denied'
              ? 'Notifications are blocked'
              : 'Stay updated instantly'}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 leading-snug">
            {state === 'error'
              ? 'Please try again or verify network connection.'
              : state === 'denied'
              ? 'Please enable notifications in your browser/site settings.'
              : 'Get notified about replies and updates on your reports.'}
          </p>
          {state !== 'denied' && (
            <button
              onClick={handleEnable}
              disabled={state === 'checking'}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-dark disabled:opacity-60"
            >
              <Bell size={12} />
              {state === 'checking' ? 'Enabling…' : state === 'error' ? 'Try Again' : 'Enable Notifications'}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="ml-1 shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="Dismiss notification prompt"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// Converts a base64 VAPID public key to the Uint8Array format required by PushManager.subscribe
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}
