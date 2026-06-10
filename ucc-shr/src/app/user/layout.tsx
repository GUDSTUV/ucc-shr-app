import { ReactNode } from 'react'
import { requireStaff } from '@/src/lib/auth/guards'

export default async function UserAreaLayout({ children }: { children: ReactNode }) {
  await requireStaff()
  return <>{children}</>
}
