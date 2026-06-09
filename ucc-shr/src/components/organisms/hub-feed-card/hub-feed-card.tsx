import Link from 'next/link'
import { Bookmark, CalendarClock } from 'lucide-react'
import { Button } from '@/src/components/atoms/button'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'

interface HubFeedCardProps {
  href: string
  title: string
  excerpt: string
  category: string
  readTime: string
  imageUrl?: string
  imageTheme: string
  categoryBadgeClass: string
  dateLabel?: string
  timeLabel?: string
  isRegistration?: boolean
  isSaved: boolean
  isSaving: boolean
  onToggleSave: () => void
}

export function HubFeedCard({
  href,
  title,
  excerpt,
  category,
  readTime,
  imageUrl,
  imageTheme,
  categoryBadgeClass,
  dateLabel,
  timeLabel,
  isRegistration,
  isSaved,
  isSaving,
  onToggleSave,
}: HubFeedCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div
        className={`relative h-48 md:h-56 lg:h-52 ${imageUrl ? 'bg-cover bg-center bg-no-repeat' : `bg-linear-to-br ${imageTheme}`}`}
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom right, rgb(15 23 42 / 0.15), rgb(15 23 42 / 0.35)), url(${imageUrl})`,
              }
            : undefined
        }
      >
        {dateLabel ? (
          <div className="absolute left-4 top-4 rounded-lg bg-white px-3 py-1 text-sm font-bold text-gray-900">
            {dateLabel}
          </div>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          aria-label={isSaved ? 'Remove from saved items' : 'Save item'}
          onClick={onToggleSave}
          disabled={isSaving}
          className={`absolute right-4 top-4 !p-0 !h-11 !w-11 inline-flex items-center justify-center !rounded-full transition ${
            isSaved ? '!bg-navy !text-white' : '!bg-white !text-navy'
          }`}
        >
          <Bookmark size={18} />
        </Button>

        <div className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${categoryBadgeClass}`}>
          {category.toUpperCase()}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-navy">
          {timeLabel ? (
            <span className="inline-flex items-center gap-1 text-gray-600">
              <CalendarClock size={12} />
              {timeLabel}
            </span>
          ) : null}
        </div>

        <Heading as="h2" size="xl" weight="semibold" className="leading-tight text-gray-900">{title}</Heading>
        <Text size="sm" tone="muted">{excerpt}</Text>

        {isRegistration ? (
          <Link href={href}>
            <Button variant="primary" fullWidth className="h-12 rounded-xl">
              Register Now
            </Button>
          </Link>
        ) : (
          <div className="flex items-center justify-between">
            <Link href={href} className="text-sm font-semibold text-navy hover:text-navy-dark">
              Read More
            </Link>
            <Text as="span" size="sm" tone="muted">{readTime}</Text>
          </div>
        )}
      </div>
    </article>
  )
}
