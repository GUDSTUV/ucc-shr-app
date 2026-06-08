import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { BottomNav } from '@/src/components/organisms/bottom-nav'
import { Navbar } from '@/src/components/organisms/Navbar'

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
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  )
}
