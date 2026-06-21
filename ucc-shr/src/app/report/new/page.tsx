import { redirect } from 'next/navigation'
import { FormLayout } from '@/src/components/templates/form-layout'
import { ReportForm } from '@/src/components/organisms/report-form'
import { auth } from '@/src/lib/auth/auth'
import { Heading } from '@/src/components/atoms/heading/heading'

export default async function NewReportPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/report')
  }

  const initialContact = session.user.email?.trim() ?? ''

  return (
    <FormLayout title="New Report" hideTopBar>
      <div className="mb-2">
        <Heading as="h1" size="xl" weight="bold" tone="navy">New Report</Heading>
      </div>
      <ReportForm initialContact={initialContact} />
    </FormLayout>
  )
}
