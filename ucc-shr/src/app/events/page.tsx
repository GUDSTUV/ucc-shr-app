import { PublicLayout } from '@/src/components/templates/public-layout'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'
import dynamic from 'next/dynamic'

const HubClient = dynamic(() => import('@/src/components/organisms/hub-client').then(m => m.HubClient))

const DEFAULT_ARTICLE_IMAGE = '/icons/default-article.svg'
const DEFAULT_EVENT_IMAGE = '/icons/default-event.svg'

interface HubItem {
	id: string
	resourceType: 'ARTICLE' | 'EVENT'
	resourceId: string
	href: string
	title: string
	excerpt: string
	category: 'Awareness' | 'Events' | 'Rights'
	readTime: string
	imageUrl?: string
	dateLabel?: string
	timeLabel?: string
	isRegistration?: boolean
	imageTheme: string
	isSaved: boolean
}

export default async function EventsPage() {
	const session = await auth()

	const [articles, events, saved] = await Promise.all([
		prisma.article.findMany({
			where: { published: true },
			orderBy: { updatedAt: 'desc' },
			take: 30,
			select: {
				id: true,
				slug: true,
				title: true,
				category: true,
				content: true,
				coverImage: true,
				updatedAt: true,
			},
		}),
		prisma.event.findMany({
			where: { published: true },
			orderBy: { startDate: 'desc' },
			take: 30,
			select: {
				id: true,
				title: true,
				description: true,
				image: true,
				startDate: true,
			},
		}),
		session?.user
			? prisma.savedResource.findMany({
					where: { userId: session.user.id },
					select: { resourceType: true, resourceId: true },
				})
			: Promise.resolve([]),
	])

	const savedKeys = new Set(saved.map((entry) => `${entry.resourceType}:${entry.resourceId}`))

	const articleItems: Array<HubItem & { sortAt: number }> = articles.map((article) => {
		const category = article.category === 'Rights' ? 'Rights' : 'Awareness'
		const contentText = typeof article.content === 'string' ? article.content : JSON.stringify(article.content)
		const key = `ARTICLE:${article.id}`

		return {
			id: key,
			resourceType: 'ARTICLE',
			resourceId: article.id,
			href: `/hub/${article.slug}`,
			title: article.title,
			excerpt: contentText.slice(0, 140) || 'Read the latest CEGRAD update.',
			category,
			readTime: '3 min read',
			imageUrl: article.coverImage || DEFAULT_ARTICLE_IMAGE,
			imageTheme:
				category === 'Rights' ? 'from-red/10 via-red/5 to-white' : 'from-navy-light via-white to-gray-100',
			isRegistration: false,
			isSaved: savedKeys.has(key),
			sortAt: article.updatedAt.getTime(),
		}
	})

	const eventItems: Array<HubItem & { sortAt: number }> = events.map((event) => {
		const key = `EVENT:${event.id}`

		return {
			id: key,
			resourceType: 'EVENT',
			resourceId: event.id,
			href: `/events/${event.id}`,
			title: event.title,
			excerpt: `${event.description.slice(0, 120)}${event.description.length > 120 ? '...' : ''}`,
			category: 'Events',
			readTime: 'Event',
			imageUrl: event.image || DEFAULT_EVENT_IMAGE,
			dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(event.startDate).toUpperCase(),
			timeLabel: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(event.startDate),
			isRegistration: true,
			imageTheme: 'from-navy-dark via-navy to-gray-900',
			isSaved: savedKeys.has(key),
			sortAt: event.startDate.getTime(),
		}
	})

	const items: HubItem[] = [...articleItems, ...eventItems]
		.sort((a, b) => b.sortAt - a.sortAt)
		.slice(0, 30)

	return (
		<PublicLayout>
			<section className="space-y-3">
				<h1 className="text-2xl font-bold text-navy lg:text-3xl">Posts & Events</h1>
				<p className="text-sm text-gray-600">
					Read the latest articles, find upcoming events, and access educational resources from CEGRAD.
				</p>
			</section>

			<section className="mt-8">
				<HubClient items={items} isAuthenticated={Boolean(session?.user)} />
			</section>
		</PublicLayout>
	)
}
