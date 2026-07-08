import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PublicLayout } from '@/src/components/templates/public-layout'
import { Heading } from '@/src/components/atoms/heading/heading'
import { Text } from '@/src/components/atoms/text/text'
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
      <article className="mx-auto max-w-5xl py-8">
        
        {/* Back Navigation - Outside the grid, top left */}
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
              {article.category === 'Rights' ? 'Know Your Rights' : article.category}
            </span>

            <Heading as="h1" size={{ base: '3xl', sm: '4xl', lg: '5xl' }} weight="extrabold" tone="default" leading="tight">
              {article.title}
            </Heading>
            
            <Text size="sm" weight="medium" tone="subtle">
              Updated on{' '}
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(article.updatedAt)}
            </Text>
          </div>

          {/* Right: Cover Image */}
          <div className="order-1 h-64 w-full overflow-hidden rounded-2xl bg-gray-100 md:order-2 md:h-80 lg:h-96">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${article.coverImage || '/icons/default-article.svg'})`,
              }}
              role="img"
              aria-label={`Cover image for ${article.title}`}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="border-t border-gray-200 pt-10">
          <Text as="div" size={{ base: 'base', md: 'lg' }} tone="dark" leading="relaxed" className="whitespace-pre-wrap md:leading-loose">
            {contentText || 'No content available.'}
          </Text>
        </div>
      </article>
    </PublicLayout>
  )
}
