export type ReportNotes = {
  reporterId?: string | null
  reporterEmail?: string | null
  contact?: string | null
  phone?: string | null
  witnesses?: string[]
  counsellorId?: string | null
  counsellorName?: string | null
  investigatorId?: string | null
  investigatorName?: string | null
  adminUpdates?: ReportAdminUpdate[]
}

export type ReportAdminUpdate = {
  id: string
  at: string
  by: string
  status: 'RECEIVED' | 'REVIEWING' | 'REFERRED' | 'RESOLVED' | 'CLOSED'
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
