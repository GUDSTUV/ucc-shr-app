import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { redirect } from 'next/navigation'

function formatEventDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export default async function AdminEventsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

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

  return (
    <AdminLayout title="Events">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Coordinate prevention workshops and awareness campaigns.</p>
        <Button size="sm">Create Event</Button>
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
            <div className="mt-4 flex gap-3 text-sm font-semibold">
              <button type="button" className="text-navy hover:text-navy-dark">
                Edit
              </button>
              <button type="button" className="text-navy hover:text-navy-dark">
                Publish
              </button>
            </div>
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
