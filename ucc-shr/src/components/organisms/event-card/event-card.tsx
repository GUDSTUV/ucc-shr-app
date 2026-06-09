import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Text } from '@/src/components/atoms/text/text'

export interface EventCardProps {
  href: string
  imageUrl?: string
  title: string
  venue: string
  dateLabel: string
  description?: string
}

export function EventCard({ href, imageUrl, title, venue, dateLabel, description }: EventCardProps) {
  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div
        className="mb-3 h-36 md:h-44 rounded-[10px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgb(15 23 42 / 0.12), rgb(15 23 42 / 0.3)), url(${imageUrl || '/icons/default-event.svg'})`,
        }}
      />
      <Text as="h3" size="sm" weight="semibold" className="text-gray-900">{title}</Text>
      <Text size="xs" tone="muted" className="mt-2 flex items-center gap-2">
        <CalendarDays size={14} />
        <span>{dateLabel}</span>
      </Text>
      <Text size="xs" tone="muted" className="mt-1 flex items-center gap-2">
        <MapPin size={14} />
        <span>{venue}</span>
      </Text>
      {description ? <Text size="sm" tone="muted" className="mt-2 line-clamp-3">{description}</Text> : null}
      <div className="mt-3">
        <Link href={href}>
          <Button variant="primary" size="sm" fullWidth>
            Register Now
          </Button>
        </Link>
      </div>
    </article>
  )
}
