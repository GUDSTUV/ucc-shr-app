import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarClock, MapPin } from 'lucide-react'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { prisma } from '@/src/lib/prisma'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      venue: true,
      startDate: true,
      endDate: true,
      published: true,
    },
  })

  if (!event || !event.published) {
    notFound()
  }

  return (
    <PublicLayout>
      <section className="space-y-4">
        <Link href="/hub" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-dark">
          <ArrowLeft size={16} />
          Back to Hub
        </Link>

        <p className="inline-flex rounded-full bg-navy-light px-3 py-1 text-xs font-semibold text-navy">Event</p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900">{event.title}</h1>
      </section>

      <article className="mt-5 space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div
          className="h-56 rounded-xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgb(15 23 42 / 0.08), rgb(15 23 42 / 0.25)), url(${event.image || '/icons/default-event.svg'})`,
          }}
        />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarClock size={16} className="text-navy" />
          <span>
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(event.startDate)}
            {event.endDate
              ? ` - ${new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(event.endDate)}`
              : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-navy" />
          <span>{event.venue}</span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">{event.description}</p>
      </article>
    </PublicLayout>
  )
}
