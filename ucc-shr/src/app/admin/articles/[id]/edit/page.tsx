import { notFound } from 'next/navigation'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { EditArticleForm } from './editArticleForm'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: PageProps) {
  await requireSuperAdmin()

  const { id } = await params

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
      coverImage: true,
      published: true,
    },
  })

  if (!article) {
    notFound()
  }

  const contentText = typeof article.content === 'string' ? article.content : JSON.stringify(article.content)
  const [summary = '', ...rest] = contentText.split(/\n\n/)
  const body = rest.join('\n\n') || contentText

  return (
    <EditArticleForm
      articleId={article.id}
      initialTitle={article.title}
      initialCategory={article.category === 'Rights' ? 'Rights' : 'Awareness'}
      initialSummary={summary}
      initialContent={body}
      initialCoverImage={article.coverImage ?? '/icons/default-article.svg'}
      initialPublished={article.published}
    />
  )
}
