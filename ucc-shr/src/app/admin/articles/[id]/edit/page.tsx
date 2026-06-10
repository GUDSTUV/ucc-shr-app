import { notFound } from 'next/navigation'
import { requireAdmin } from '@/src/lib/auth/guards'
import { prisma } from '@/src/lib/prisma'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { EditArticleForm } from './editArticleForm'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: PageProps) {
  await requireAdmin()

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
    <AdminLayout title="Edit Article">
      <EditArticleForm
        articleId={article.id}
        initialTitle={article.title}
        initialCategory={article.category === 'Rights' ? 'Rights' : 'Awareness'}
        initialSummary={summary}
        initialContent={body}
        initialCoverImage={article.coverImage ?? '/icons/default-article.svg'}
        initialPublished={article.published}
      />
    </AdminLayout>
  )
}
