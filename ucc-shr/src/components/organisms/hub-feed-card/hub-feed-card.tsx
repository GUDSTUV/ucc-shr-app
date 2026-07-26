import Link from 'next/link'
import { Bookmark, CalendarClock, CalendarPlus } from 'lucide-react'
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
  showBookmark?: boolean
  googleCalendarUrl?: string
  isSaved: boolean
  isSaving: boolean
  onToggleSave?: () => void
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
  showBookmark = true,
  googleCalendarUrl,
  isSaved,
  isSaving,
  onToggleSave,
}: HubFeedCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Image wrapper — the whole image is a link to detail */}
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
        {/* Transparent link overlay covering the whole image */}
        <Link href={href} className="absolute inset-0 z-0" aria-label={`View ${title}`} />

        {dateLabel ? (
          <div className="absolute left-4 top-4 z-10 rounded-lg bg-white px-3 py-1 text-sm font-bold text-gray-900">
            {dateLabel}
          </div>
        ) : null}

        {/* Bookmark button — z-10 so it sits above the link overlay */}
        {showBookmark && (
          <Button
            type="button"
            variant="ghost"
            aria-label={isSaved ? 'Remove from saved items' : 'Save item'}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleSave?.()
            }}
            disabled={isSaving}
            className={`absolute right-4 top-4 z-10 !p-0 !h-11 !w-11 inline-flex items-center justify-center !rounded-full transition ${
              isSaved ? '!bg-navy !text-white' : '!bg-white !text-navy'
            }`}
          >
            <Bookmark size={18} />
          </Button>
        )}

        <div className={`absolute bottom-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${categoryBadgeClass}`}>
          {category.toUpperCase()}
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-navy">
          {timeLabel ? (
            <span className="inline-flex items-center gap-1 text-gray-600">
              <CalendarClock size={12} />
              {timeLabel}
            </span>
          ) : null}
        </div>

        <Link href={href} className="block group">
          <Heading as="h2" size={{ base: 'lg', lg: 'xl' }} weight="semibold" tone="default" leading="tight" className="line-clamp-2 group-hover:text-navy transition-colors">{title}</Heading>
        </Link>
        <Text size="sm" tone="muted" className="line-clamp-3">{excerpt}</Text>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {googleCalendarUrl ? (
          <div className="flex items-center justify-between pt-1">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <CalendarPlus size={13} />
              Add to Calendar
            </a>
          </div>
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
