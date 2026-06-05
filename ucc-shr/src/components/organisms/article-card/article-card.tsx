import Link from 'next/link'
import { ArticleMeta } from '@/src/components/molecules/article-meta'

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
      <h3 className="text-[15px] md:text-base font-semibold text-gray-900 line-clamp-2">{title}</h3>
      <div className="mt-1">
        <ArticleMeta author={author} date={date} category={category} />
      </div>
      {excerpt ? <p className="mt-2 text-[13px] text-gray-600 line-clamp-3 flex-1">{excerpt}</p> : null}
      <Link href={`/hub/${slug}`} className="mt-3 inline-block text-[13px] font-semibold text-navy hover:underline">
        Read more
      </Link>
    </article>
  )
}
