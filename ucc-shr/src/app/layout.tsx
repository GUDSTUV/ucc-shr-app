import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/src/components/organisms/bottom-nav'
import { Navbar } from '@/src/components/organisms/Navbar'
import { auth } from '@/src/lib/auth/auth'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

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
  
  let unreadReportsCount = 0
  
  if (session?.user) {
    const { isAdminRole } = await import('@/src/lib/auth/roles')
    if (!isAdminRole(session.user.role)) {
      const { getUserNotifications } = await import('@/src/lib/notification-service')
      const counts = await getUserNotifications(session.user.id, session.user.email ?? null)
      unreadReportsCount = counts.unreadCount
    }
  }

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 font-sans" suppressHydrationWarning>
        <Toaster position="top-center" />
        <Suspense fallback={null}>
          <Navbar 
            user={user} 
            unreadReportsCount={unreadReportsCount} 
          />
        </Suspense>
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Suspense fallback={null}>
          <BottomNav user={user} />
        </Suspense>
      </body>
    </html>
  )
}
