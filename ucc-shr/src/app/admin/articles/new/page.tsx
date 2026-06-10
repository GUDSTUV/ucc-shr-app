import { requireAdmin } from '@/src/lib/auth/guards'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { NewArticleForm } from './newArticleForm'

export default async function NewArticlePage() {
  await requireAdmin()

  return (
    <AdminLayout title="Create New Article">
      <NewArticleForm />
    </AdminLayout>
  )
}
