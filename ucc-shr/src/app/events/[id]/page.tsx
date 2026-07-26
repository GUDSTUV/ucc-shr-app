import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarClock, MapPin, CalendarPlus } from 'lucide-react'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
import { prisma } from '@/src/lib/prisma'

type PageProps = {
  params: Promise<{ id: string }>
}

function buildGCalUrl(event: { title: string; description: string; venue: string; startDate: Date; endDate?: Date | null }) {
  function toGCalDate(d: Date) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  const start = toGCalDate(event.startDate)
  const end = event.endDate
    ? toGCalDate(event.endDate)
    : toGCalDate(new Date(event.startDate.getTime() + 2 * 60 * 60 * 1000))
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description.slice(0, 500),
    location: event.venue,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
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

  const gcalUrl = buildGCalUrl(event)

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(event.startDate)

  const formattedEndDate = event.endDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(event.endDate)
    : null

  return (
    <PublicLayout>
      <article className="mx-auto max-w-5xl py-8">

        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-navy-dark">
            <ArrowLeft size={16} />
            Back to Posts & Events
          </Link>
        </div>

        {/* Header Section: Split layout on md+ screens */}
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">

          {/* Left: Metadata and Title */}
          <div className="flex flex-col items-start space-y-5 order-2 md:order-1">
            <span className="inline-flex rounded-full bg-navy/10 px-3 py-1 text-xs font-bold text-navy uppercase tracking-wider">
              Event
            </span>

            <Heading as="h1" size={{ base: '3xl', sm: '4xl', lg: '5xl' }} weight="extrabold" tone="default" leading="tight">
              {event.title}
            </Heading>

            {/* Date & Venue */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarClock size={15} className="text-navy shrink-0" />
                <span>
                  {formattedDate}
                  {formattedEndDate ? ` — ${formattedEndDate}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={15} className="text-navy shrink-0" />
                <span>{event.venue}</span>
              </div>
            </div>

            {/* Add to Calendar link */}
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-navy-dark transition-colors"
            >
              <CalendarPlus size={15} />
              Add to Google Calendar
            </a>
          </div>

          {/* Right: Cover Image */}
          <div className="order-1 h-64 w-full overflow-hidden rounded-2xl bg-gray-100 md:order-2 md:h-80 lg:h-96">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${event.image || '/icons/default-event.svg'})`,
              }}
              role="img"
              aria-label={`Cover image for ${event.title}`}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="border-t border-gray-200 pt-10">
          <Text as="div" size={{ base: 'base', md: 'lg' }} tone="dark" leading="relaxed" className="whitespace-pre-wrap md:leading-loose">
            {event.description || 'No description available.'}
          </Text>
        </div>
      </article>
    </PublicLayout>
  )
}
