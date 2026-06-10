import { AdminLayout } from '@/src/components/templates/admin-layout'
import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { NewBannerForm } from './new-banner-form'

export default async function NewBannerPage() {
  await requireSuperAdmin()

  return (
    <AdminLayout 
      title="Add New Banner" 
      description="Upload an image and set a title for a new homepage campaign banner."
    >
      <div className="max-w-2xl">
        <NewBannerForm />
      </div>
    </AdminLayout>
  )
}
