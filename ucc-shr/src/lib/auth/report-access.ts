export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type InvestigationOutcome = 'SUBSTANTIATED' | 'NOT_SUBSTANTIATED' | 'INCONCLUSIVE'
export type ActionTaken =
  | 'WARNING_ISSUED'
  | 'DISCIPLINARY_ACTION'
  | 'REFERRAL_TO_MANAGEMENT'
  | 'COUNSELLING_SUPPORT'
  | 'LEGAL_REFERRAL'

export type PriorReport = {
  reported: boolean
  where?: string | null
}

export type ReportNotes = {
  // Reporter identity
  reporterId?: string | null
  reporterEmail?: string | null
  contact?: string | null
  phone?: string | null
  // Confidentiality
  confidentialityRequested?: boolean
  // Incident details
  offenderDescription?: string | null
  priorReport?: PriorReport | null
  witnesses?: string[]
  // Assignment
  counsellorId?: string | null
  counsellorName?: string | null
  investigatorId?: string | null
  investigatorName?: string | null
  // Admin assessment (set by investigator/super admin)
  riskLevel?: RiskLevel | null
  investigationOutcome?: InvestigationOutcome | null
  actionsTaken?: ActionTaken[]
  // Update history
  adminUpdates?: ReportAdminUpdate[]
}

export type ReportAdminUpdate = {
  id: string
  at: string
  by: string
  status: 'RECEIVED' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'CLOSED'
  message: string
}

export function parseReportNotes(value: string | null): ReportNotes {
  if (!value) return {}

  try {
    return JSON.parse(value) as ReportNotes
  } catch {
    return {}
  }
}

export function belongsToUser(notes: string | null, userId: string, userEmail: string | null) {
  if (!notes) return false

  const parsed = parseReportNotes(notes)
  if (parsed.reporterId === userId) return true

  const normalizedEmail = userEmail?.toLowerCase() ?? null
  if (!normalizedEmail) return false

  if (parsed.reporterEmail?.toLowerCase() === normalizedEmail) return true
  if (parsed.contact?.toLowerCase() === normalizedEmail) return true

  const notesLower = notes.toLowerCase()
  return (
    notesLower.includes(`"reporteremail":"${normalizedEmail}"`) ||
    notesLower.includes(`"contact":"${normalizedEmail}"`)
  )
}

/**
 * Returns true if the given user is allowed to see confidential reporter details.
 * SUPER_ADMIN can always see them. Any other role can only see them if they are
 * the specifically assigned investigator/counsellor for this case.
 */
export function canViewConfidentialDetails(
  notes: ReportNotes,
  userId: string,
  userRole: string
): boolean {
  if (userRole === 'SUPER_ADMIN') return true
  const assignedId = notes.counsellorId ?? notes.investigatorId ?? null
  return assignedId === userId
}
