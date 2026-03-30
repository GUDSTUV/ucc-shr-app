import Link from 'next/link'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { EventActions } from './event-actions'

type PageProps = {
  searchParams?: Promise<{
    success?: string | string[]
  }>
}

function formatEventDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  await requireSuperAdmin()

  const events = await prisma.event.findMany({
    orderBy: {
      startDate: 'asc',
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      venue: true,
      published: true,
    },
  })

  const now = new Date()
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const successParamRaw = resolvedSearchParams?.success
  const successParam = Array.isArray(successParamRaw) ? successParamRaw[0] : successParamRaw
  const successMessageByKey: Record<string, string> = {
    'event-created-published': 'Event created and published successfully.',
    'event-created-draft': 'Event created as a draft successfully.',
    'event-updated': 'Event updated successfully.',
  }
  const successMessage = successParam ? successMessageByKey[successParam] : null

  return (
    <AdminLayout title="Events">
      {successMessage ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {successMessage}
        </div>
      ) : null}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Coordinate prevention workshops and awareness campaigns.</p>
        <Link href="/admin/events/new">
          <Button size="sm">Create Event</Button>
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{event.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{formatEventDate(event.startDate)}</p>
                <p className="text-xs text-gray-500">{event.venue}</p>
              </div>
              <Badge
                variant={
                  !event.published
                    ? 'gray'
                    : event.startDate > now
                      ? 'navy'
                      : 'success'
                }
              >
                {!event.published ? 'Draft' : event.startDate > now ? 'Scheduled' : 'Open'}
              </Badge>
            </div>
            <EventActions eventId={event.id} currentPublished={event.published} />
          </article>
        ))}

        {events.length === 0 ? (
          <article className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm">
            No events yet.
          </article>
        ) : null}
      </section>
    </AdminLayout>
  )
}
