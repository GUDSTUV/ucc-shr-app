import UserProfile from "./userProfile"
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'

function isUnknownImageFieldError(error: unknown) {
	const message = error instanceof Error ? error.message : ''
	return message.includes('Unknown field `image` for select statement on model `User`')
}

export default async function UserProfilePage() {
	const session = await auth()

	if (!session?.user) {
		redirect('/login')
	}

	let user: { id: string; name: string; email: string; image?: string | null } | null = null

	try {
		user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
			},
		})
	} catch (error: unknown) {
		if (!isUnknownImageFieldError(error)) {
			throw error
		}

		const fallbackUser = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
			},
		})

		user = fallbackUser
	}

	return (
		<UserProfile
			id={user?.id ?? session.user.id}
			name={user?.name ?? session.user.name ?? undefined}
			email={user?.email ?? session.user.email ?? undefined}
			image={user?.image ?? session.user.image ?? undefined}
		/>
	)
}
