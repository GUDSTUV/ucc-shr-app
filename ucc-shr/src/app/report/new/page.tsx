import { redirect } from 'next/navigation'
import { FormLayout } from '@/src/components/templates/form-layout'
import { ReportForm } from '@/src/components/organisms/report-form'
import { auth } from '@/src/lib/auth/auth'

export default async function NewReportPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/report')
  }

  const initialContact = session.user.email?.trim() ?? ''

  return (
    <FormLayout title="New Report">
      <ReportForm initialContact={initialContact} />
    </FormLayout>
  )
}
