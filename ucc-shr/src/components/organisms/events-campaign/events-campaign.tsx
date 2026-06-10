// Server component — no 'use client'.
// Fetches the 2 soonest upcoming published events + 1 most-recent published
// article and passes them to the client animation layer. Whenever the admin
// publishes or updates content this section reflects it automatically.

import { prisma } from '@/src/lib/prisma'
import { EventsCampaignClient, type CampaignFeedItem } from './events-campaign-client'

const DEFAULT_EVENT_IMAGE = '/icons/default-event.svg'
const DEFAULT_ARTICLE_IMAGE = '/icons/default-article.svg'

export async function EventsCampaignSection() {
  type EventRow = { id: string; title: string; description: string; image?: string | null; startDate: Date }
  type ArticleRow = { id: string; slug: string; title: string; category: string; content: string | Record<string, unknown>; coverImage?: string | null }

  let events: EventRow[] = []
  let articles: ArticleRow[] = []

  try {
    const results = await Promise.all([
      prisma.event.findMany({
        where: { published: true },
        orderBy: { startDate: 'desc' },
        take: 2,
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          startDate: true,
        },
      }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: { updatedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          content: true,
          coverImage: true,
        },
      }),
    ])
    events = results[0]
    articles = results[1]
  } catch (error) {
    console.error('Failed to fetch events/articles for home page:', error)
  }

  const eventItems: CampaignFeedItem[] = events.map((event) => ({
    id: `EVENT:${event.id}`,
    href: `/events/${event.id}`,
    title: event.title,
    excerpt: event.description.length > 120
      ? `${event.description.slice(0, 120)}...`
      : event.description,
    category: 'Events',
    readTime: 'Event',
    imageUrl: event.image ?? DEFAULT_EVENT_IMAGE,
    imageTheme: 'from-navy-dark via-navy to-gray-900',
    categoryBadgeClass: 'bg-navy/75 text-white border border-white/20 backdrop-blur-[1px]',
    dateLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' })
      .format(event.startDate)
      .toUpperCase(),
    timeLabel: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' })
      .format(event.startDate),
    isRegistration: true,
  }))

  const articleItems: CampaignFeedItem[] = articles.map((article) => {
    const contentText =
      typeof article.content === 'string'
        ? article.content
        : JSON.stringify(article.content)
    const category = article.category === 'Rights' ? 'Rights' : 'Awareness'
    return {
      id: `ARTICLE:${article.id}`,
      href: `/hub/${article.slug}`,
      title: article.title,
      excerpt: contentText.slice(0, 140) || 'Read the latest CEGRAD update.',
      category,
      readTime: '3 min read',
      imageUrl: article.coverImage ?? DEFAULT_ARTICLE_IMAGE,
      imageTheme:
        category === 'Rights'
          ? 'from-red/10 via-red/5 to-white'
          : 'from-navy-light via-white to-gray-100',
      categoryBadgeClass:
        'bg-navy text-white border border-white/20 backdrop-blur-[1px]',
      isRegistration: false,
    }
  })

  // Combine: events first, then article. If DB is empty fall back gracefully.
  const items = [...eventItems, ...articleItems]

  return <EventsCampaignClient items={items} />
}

