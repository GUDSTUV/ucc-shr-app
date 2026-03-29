import Link from 'next/link'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { Badge } from '@/src/components/atoms/badge'
import { Button } from '@/src/components/atoms/button'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/prisma'
import { redirect } from 'next/navigation'

function formatUpdatedAt(value: Date) {
  return `Updated ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(value)}`
}

export default async function AdminArticlesPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin/login')
  }

  const articles = await prisma.article.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      published: true,
      updatedAt: true,
    },
  })

  return (
    <AdminLayout title="Articles">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Manage awareness and policy-related publications.</p>
        <Link href="/admin/articles/new">
          <Button size="sm">Create Article</Button>
        </Link>
      </div>

      <section className="space-y-3">
        {articles.map((article) => (
          <article key={article.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{article.title}</h2>
                <p className="mt-1 text-xs text-gray-500">{formatUpdatedAt(article.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={article.published ? 'success' : 'gray'}>
                  {article.published ? 'Published' : 'Draft'}
                </Badge>
                <button type="button" className="text-sm font-semibold text-navy hover:text-navy-dark">
                  Edit
                </button>
              </div>
            </div>
          </article>
        ))}

        {articles.length === 0 ? (
          <article className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm">
            No articles yet.
          </article>
        ) : null}
      </section>
    </AdminLayout>
  )
}
