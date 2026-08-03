// public/sw.js — CEGRAD UCC Service Worker for Web Push Notifications
// Handles incoming push events and notification click navigation.

self.addEventListener('push', function (event) {
  let data = {
    title: 'CEGRAD UCC',
    body: 'You have a new notification.',
    url: '/',
    icon: '/icons/icon-192x192.png',
  }

  if (event.data) {
    try {
      data = { ...data, ...JSON.parse(event.data.text()) }
    } catch {
      data.body = event.data.text()
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: { url: data.url || '/' },
      requireInteraction: false,
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // Focus existing tab if open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url)
            return client.focus()
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})
