import { Badge } from '@/src/components/atoms/badge'

export type ReportStatus = 'RECEIVED' | 'REVIEWING' | 'REFERRED' | 'RESOLVED' | 'CLOSED'

const config: Record<ReportStatus, { label: string; variant: 'navy' | 'warning' | 'success' | 'gray' }> = {
  RECEIVED: { label: 'Received', variant: 'navy' },
  REVIEWING: { label: 'Reviewing', variant: 'warning' },
  REFERRED: { label: 'Referred', variant: 'warning' },
  RESOLVED: { label: 'Resolved', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'gray' },
}

export interface StatusBadgeProps {
  status: ReportStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const state = config[status]
  return <Badge variant={state.variant}>{state.label}</Badge>
}
