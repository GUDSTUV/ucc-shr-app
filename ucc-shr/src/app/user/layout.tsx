import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'

export default async function UserAreaLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role === 'SUPER_ADMIN') {
    redirect('/login')
  }

  return <>{children}</>
}
