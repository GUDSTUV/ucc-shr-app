import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { NewArticleForm } from './newArticleForm'

export default async function NewArticlePage() {
  await requireSuperAdmin()

  return <NewArticleForm />
}
