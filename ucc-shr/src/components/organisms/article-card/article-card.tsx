import Link from 'next/link'
import { ArticleMeta } from '@/src/components/molecules/article-meta'
import { Text } from '@/src/components/atoms/text/text'

export interface ArticleCardProps {
  title: string
  slug: string
  excerpt?: string
  author: string
  date: string
  category?: string
}

export function ArticleCard({ title, slug, excerpt, author, date, category }: ArticleCardProps) {
  return (
    <article className="rounded-[12px] border border-gray-100 bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <Text as="h3" size={{ base: 'sm', lg: 'base' }} weight="semibold" className="line-clamp-2 text-gray-900">{title}</Text>
      <div className="mt-1">
        <ArticleMeta author={author} date={date} category={category} />
      </div>
      {excerpt ? <Text size="sm" tone="muted" className="mt-2 line-clamp-3 flex-1">{excerpt}</Text> : null}
      <Link href={`/hub/${slug}`} className="mt-3 inline-block text-[13px] font-semibold text-navy hover:underline">
        Read more
      </Link>
    </article>
  )
}
