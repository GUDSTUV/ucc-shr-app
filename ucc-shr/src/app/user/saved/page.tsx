import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { SavedItemsClient } from './savedItemsClient'
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
    <div className="mx-auto min-h-screen max-w-md bg-gray-50 pb-8 font-sans text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/user/profile"
            aria-label="Go back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="pr-8 text-lg font-bold text-navy">Saved Items</h1>
        </div>
      </header>

      <main className="px-4 pt-5">
        <SavedItemsClient initialItems={resources} />
      </main>
    </div>
  )
}
