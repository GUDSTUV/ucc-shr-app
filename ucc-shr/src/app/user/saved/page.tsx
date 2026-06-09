import Link from 'next/link'
import { ArrowLeft, Bookmark } from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { SavedItemsClient } from './savedItemsClient'
import { PublicLayout } from '@/src/components/templates/public-layout'
import type { SavedResourceItem } from './savedTypes'

export default async function SavedItemsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const saved = await prisma.savedResource.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      resourceType: true,
      resourceId: true,
      createdAt: true,
    },
  })

  const articleIds = saved.filter((item) => item.resourceType === 'ARTICLE').map((item) => item.resourceId)
  const eventIds = saved.filter((item) => item.resourceType === 'EVENT').map((item) => item.resourceId)

  const [articles, events] = await Promise.all([
    articleIds.length > 0
      ? prisma.article.findMany({
          where: { id: { in: articleIds } },
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            content: true,
          },
        })
      : Promise.resolve([]),
    eventIds.length > 0
      ? prisma.event.findMany({
          where: { id: { in: eventIds } },
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
          },
        })
      : Promise.resolve([]),
  ])

  const articleById = new Map(articles.map((item) => [item.id, item]))
  const eventById = new Map(events.map((item) => [item.id, item]))

  const resources: SavedResourceItem[] = saved
    .map((item) => {
      if (item.resourceType === 'ARTICLE') {
        const article = articleById.get(item.resourceId)
        if (!article) return null

        const contentText =
          typeof article.content === 'string' ? article.content : JSON.stringify(article.content)

        return {
          id: item.id,
          resourceType: 'ARTICLE' as const,
          resourceId: item.resourceId,
          title: article.title,
          summary: contentText.slice(0, 120) || 'Saved article',
          label: article.category === 'Rights' ? 'Know Your Rights' : 'Awareness',
          href: `/hub/${article.slug}`,
        }
      }

      const event = eventById.get(item.resourceId)
      if (!event) return null

      return {
        id: item.id,
        resourceType: 'EVENT' as const,
        resourceId: item.resourceId,
        title: event.title,
        summary: `${new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }).format(event.startDate)} - ${event.description.slice(0, 80)}${event.description.length > 80 ? '...' : ''}`,
        label: 'Events',
        href: `/events/${event.id}`,
      }
    })
    .filter((item): item is SavedResourceItem => item !== null)

  return (
    <PublicLayout>
      <div className="font-sans">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/user/userDashboard"
            aria-label="Go back to dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-navy">Saved Resources</h1>
            <p className="text-xs text-gray-500">Articles and events you&apos;ve bookmarked</p>
          </div>
          <div className="ml-auto grid h-9 w-9 place-content-center rounded-full bg-navy-light text-navy">
            <Bookmark size={16} />
          </div>
        </div>

        <SavedItemsClient initialItems={resources} />
      </div>
    </PublicLayout>
  )
}
