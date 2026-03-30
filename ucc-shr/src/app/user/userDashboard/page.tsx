import UserDashbard from './userDashbard'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <UserDashbard
      userId={session.user.id}
      name={session.user.name ?? undefined}
      email={session.user.email ?? undefined}
    />
  )
}
