import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'

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
    <article className="rounded-[12px] border border-gray-100 bg-white p-4 shadow-sm">
      <div
        className="mb-3 h-36 rounded-[10px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgb(15 23 42 / 0.12), rgb(15 23 42 / 0.3)), url(${imageUrl || '/icons/default-event.svg'})`,
        }}
      />
      <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-gray-600">
        <CalendarDays size={14} />
        <span>{dateLabel}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
        <MapPin size={14} />
        <span>{venue}</span>
      </div>
      {description ? <p className="mt-2 text-[13px] text-gray-600 line-clamp-3">{description}</p> : null}
      <div className="mt-3">
        <Link
          href={href}
          className="inline-flex h-10 items-center justify-center rounded-[10px] bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
        >
          Register Now
        </Link>
      </div>
    </article>
  )
}
