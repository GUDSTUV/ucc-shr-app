import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'
import { Text } from '@/src/components/atoms/text/text'

function formatEventDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

function getDateBadge(dateLabel: string) {
  const [day = '--', month = '---'] = dateLabel.split(' ')
  return {
    day,
    month: month.toUpperCase(),
  }
}

export async function HomeEventsPreview() {
  const now = new Date()
  const previewEvents = await prisma.event.findMany({
    where: {
      published: true,
      startDate: {
        gte: now,
      },
    },
    orderBy: { startDate: 'asc' },
    take: 2,
    select: {
      id: true,
      title: true,
      startDate: true,
      venue: true,
    },
  })

  return (
    <section className="mt-6 space-y-2">
      <div className="flex items-center justify-between">
        <Text as="h2" size="base" weight="bold" tone="navy">Upcoming Events</Text>
        <Link href="/events" className="text-xs font-semibold text-gray-500 hover:text-navy">
          View all
        </Link>
      </div>

      <div className="space-y-2.5">
        {previewEvents.map((event) => {
          const badge = getDateBadge(formatEventDate(event.startDate))

          return (
          <article key={event.id} className="rounded-2xl border border-gray-200 bg-gray-100 px-3 py-3.5 shadow-sm hover:border-navy/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-200 text-navy">
                <Text as="span" size="sm" weight="bold" className="leading-none">{badge.day}</Text>
                <Text as="span" size="xs" weight="semibold" className="mt-0.5 text-[9px] leading-none">{badge.month}</Text>
              </div>

              <div className="min-w-0">
                <Text as="h3" size="sm" weight="bold" tone="navy" className="line-clamp-2 leading-tight">{event.title}</Text>
                <Text size="xs" tone="muted" className="mt-1">{event.venue}</Text>
              </div>
            </div>
          </article>
          )
        })}

        {previewEvents.length === 0 ? (
          <article className="rounded-2xl border border-gray-200 bg-gray-100 px-3 py-3.5 text-sm text-gray-600 shadow-sm">
            No upcoming events yet.
          </article>
        ) : null}
      </div>
    </section>
  )
}
