import UserProfile from "./userProfile"
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'

export default async function UserProfilePage() {
	const session = await auth()

	if (!session?.user) {
		redirect('/login')
	}

	return <UserProfile name={session.user.name ?? undefined} email={session.user.email ?? undefined} />
}
