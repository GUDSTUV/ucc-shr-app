import { Badge } from '@/src/components/atoms/badge'

export type ReportStatus = 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'

const config: Record<ReportStatus, { label: string; variant: 'navy' | 'warning' | 'success' | 'gray' }> = {
  RECEIVED: { label: 'Received', variant: 'navy' },
  UNDER_REVIEW: { label: 'Reviewing', variant: 'warning' },
  UNDER_INVESTIGATION: { label: 'Referred', variant: 'warning' },
  CLOSED: { label: 'Resolved', variant: 'success' },
}

export interface StatusBadgeProps {
  status: ReportStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const state = config[status]
  return <Badge variant={state.variant}>{state.label}</Badge>
}
