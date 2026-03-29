import { FormLayout } from '@/src/components/templates/form-layout'
import { ReportForm } from '@/src/components/organisms/report-form'

type NewReportPageProps = {
  searchParams?: Promise<{
    name?: string
    email?: string
  }>
}

export default async function NewReportPage({ searchParams }: NewReportPageProps) {
  const params = (await searchParams) ?? {}
  const hasAccount = Boolean(params.name && params.email)
  const initialContact = params.email?.trim() ?? ''

  return (
    <FormLayout title={hasAccount ? 'New Report' : 'Anonymous Report'}>
      <ReportForm canToggleAnonymous={hasAccount} initialContact={initialContact} />
    </FormLayout>
  )
}
