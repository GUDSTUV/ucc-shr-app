import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { BottomNav } from '@/src/components/organisms/bottom-nav'
import { SessionProvider } from '@/src/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'CEGRAD UCC',
  description: 'Campus sexual harassment reporting and support platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SessionProvider>
          <main className="min-h-screen pb-20">{children}</main>
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}
