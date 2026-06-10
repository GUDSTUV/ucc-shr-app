import { requireAdmin } from '@/src/lib/auth/guards'
import { AdminLayout } from '@/src/components/templates/admin-layout'
import { NewEventForm } from './newEventForm'

export default async function NewEventPage() {
  await requireAdmin()

  return (
    <AdminLayout title="Create Event">
      <NewEventForm />
    </AdminLayout>
  )
}
