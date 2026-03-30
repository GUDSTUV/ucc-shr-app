import { requireSuperAdmin } from '@/src/lib/auth/guards'
import { NewEventForm } from './newEventForm'

export default async function NewEventPage() {
  await requireSuperAdmin()

  return <NewEventForm />
}
