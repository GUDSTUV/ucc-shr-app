import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { BottomNav } from '@/src/components/organisms/bottom-nav'
import { Navbar } from '@/src/components/organisms/Navbar'
import { auth } from '@/src/lib/auth/auth'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'CEGRAD UCC',
  description: 'Campus sexual harassment reporting and support platform',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user ? { name: session.user.name, role: session.user.role } : null

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning>
        <Toaster position="top-center" />
        <Suspense fallback={null}>
          <Navbar user={user} />
        </Suspense>
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Suspense fallback={null}>
          <BottomNav user={user} />
        </Suspense>
      </body>
    </html>
  )
}
