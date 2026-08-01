// Server component — no 'use client'.
// Fetches the 2 soonest upcoming published events + 1 most-recent published
// article and passes them to the client animation layer. Whenever the admin
// publishes or updates content this section reflects it automatically.

import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth/auth'
import { EventsCampaignClient, type CampaignFeedItem } from './events-campaign-client'

const DEFAULT_EVENT_IMAGE = '/icons/default-event.svg'
const DEFAULT_ARTICLE_IMAGE = '/icons/default-article.svg'

const categoryBadgeStyles: Record<string, string> = {
  'Rights': 'bg-red-50 text-red-700',
  'Awareness': 'bg-navy-light text-navy',
  'Events': 'bg-emerald-50 text-emerald-700',
}

export async function EventsCampaignSection() {
  type EventRow = { id: string; title: string; description: string; image?: string | null; venue: string; startDate: Date; endDate?: Date | null }
  type ArticleRow = { id: string; slug: string; title: string; category: string; content: any; coverImage?: string | null; updatedAt: Date }

  function buildGCalUrl(event: EventRow) {
    function toGCalDate(d: Date) {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    const start = toGCalDate(event.startDate)
    const end = event.endDate ? toGCalDate(event.endDate) : toGCalDate(new Date(event.startDate.getTime() + 2 * 60 * 60 * 1000))
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: event.description.slice(0, 500),
      location: event.venue,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  let events: EventRow[] = []
  let articles: ArticleRow[] = []
  let savedKeys = new Set<string>()

  const session = await auth()

  try {
    const results = await Promise.all([
      prisma.event.findMany({
        where: { published: true },
        orderBy: { startDate: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          venue: true,
          startDate: true,
          endDate: true,
        },
      }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: { updatedAt: 'desc' },
        take: 3,
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
      session?.user
        ? prisma.savedResource.findMany({
            where: { userId: session.user.id },
            select: { resourceType: true, resourceId: true },
          })
        : Promise.resolve([]),
    ])
    events = results[0]
    articles = results[1]
    savedKeys = new Set(results[2].map((entry) => `${entry.resourceType}:${entry.resourceId}`))
  } catch (error) {
    console.error('Failed to fetch events/articles for home page:', error)
  }

  const items: Array<CampaignFeedItem & { sortAt: number }> = [
    ...articles.map((article) => {
      const category = article.category === 'Rights' ? 'Rights' : 'Awareness'
      const contentText =
        typeof article.content === 'string' ? article.content : JSON.stringify(article.content)

      return {
        id: `ARTICLE:${article.id}`,
        resourceType: 'ARTICLE' as const,
        resourceId: article.id,
        href: `/hub/${article.slug}`,
        title: article.title,
        excerpt: contentText.slice(0, 140) || 'Read the latest CEGRAD update.',
        category,
        readTime: '3 min read',
        imageUrl: article.coverImage || DEFAULT_ARTICLE_IMAGE,
        imageTheme:
          category === 'Rights'
            ? 'from-red/10 via-red/5 to-white'
            : 'from-navy-light via-white to-gray-100',
        categoryBadgeClass: categoryBadgeStyles[category] || categoryBadgeStyles['Awareness'],
        isSaved: savedKeys.has(`ARTICLE:${article.id}`),
        sortAt: article.updatedAt.getTime(),
      }
    }),
    ...events.map((event) => {
      return {
        id: `EVENT:${event.id}`,
        resourceType: 'EVENT' as const,
        resourceId: event.id,
        href: `/events/${event.id}`,
        title: event.title,
        excerpt: event.description.slice(0, 140) || 'Upcoming CEGRAD event.',
        category: 'Events',
        readTime: 'Event',
        imageUrl: event.image || DEFAULT_EVENT_IMAGE,
        imageTheme: 'from-emerald-50 via-white to-emerald-50/50',
        categoryBadgeClass: categoryBadgeStyles['Events'],
        dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(event.startDate),
        timeLabel: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(event.startDate),
        googleCalendarUrl: buildGCalUrl(event),
        isSaved: savedKeys.has(`EVENT:${event.id}`),
        sortAt: event.startDate.getTime(),
      }
    }),
  ]

  // Sort by date (descending) and take top 3
  items.sort((a, b) => b.sortAt - a.sortAt)
  const topItems = items.slice(0, 3)

  // Do not show the section unless there is at least one published event or article card
  if (topItems.length === 0) {
    return null
  }

  return <EventsCampaignClient items={topItems} isAuthenticated={!!session?.user} />
}
