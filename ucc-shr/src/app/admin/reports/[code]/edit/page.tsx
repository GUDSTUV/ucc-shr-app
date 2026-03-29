import { redirect } from 'next/navigation'

type PageProps = {
  params: Promise<{ code: string }>
}

export default async function AdminReportEditPage({ params }: PageProps) {
  const { code } = await params
  redirect(`/admin/reports/${encodeURIComponent(code)}`)
}
