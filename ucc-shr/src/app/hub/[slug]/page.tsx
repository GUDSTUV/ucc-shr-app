import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { prisma } from '@/src/lib/prisma'

type PageProps = {
  params: Promise<{ slug: string }>
}

function getContentText(content: unknown) {
  if (typeof content === 'string') {
    return content
  }

  try {
    return JSON.stringify(content, null, 2)
  } catch {
    return ''
  }
}

export default async function HubArticleDetailPage({ params }: PageProps) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      coverImage: true,
      updatedAt: true,
      published: true,
    },
  })

  if (!article || !article.published) {
    notFound()
  }

  const contentText = getContentText(article.content)

  return (
    <PublicLayout>
      <section className="space-y-4">
        <Link href="/hub" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-dark">
          <ArrowLeft size={16} />
          Back to Hub
        </Link>

        <p className="inline-flex rounded-full bg-navy-light px-3 py-1 text-xs font-semibold text-navy">
          {article.category === 'Rights' ? 'Know Your Rights' : article.category}
        </p>

        <h1 className="text-2xl font-bold leading-tight text-gray-900">{article.title}</h1>
        <p className="text-sm text-gray-500">
          Updated{' '}
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(article.updatedAt)}
        </p>
      </section>

      <article className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div
          className="mb-4 h-52 rounded-xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgb(15 23 42 / 0.08), rgb(15 23 42 / 0.25)), url(${article.coverImage || '/icons/default-article.svg'})`,
          }}
        />
        <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">{contentText || 'No content available.'}</div>
      </article>
    </PublicLayout>
  )
}
