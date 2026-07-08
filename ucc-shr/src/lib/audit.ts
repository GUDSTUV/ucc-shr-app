import { prisma } from '@/src/lib/prisma'
import type { AuditAction, AuditResource } from '@prisma/client'

type LogActivityParams = {
  userId: string
  action: AuditAction
  resourceType: AuditResource
  resourceId: string
  details?: Record<string, unknown> | null
}

/**
 * Records an audit log entry. Fire-and-forget — errors are logged but never
 * thrown so they don't disrupt the primary operation.
 */
export async function logActivity({
  userId,
  action,
  resourceType,
  resourceId,
  details = null,
}: LogActivityParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        details: details ? JSON.parse(JSON.stringify(details)) : undefined,
      },
    })
  } catch (error) {
    // Never let audit logging break the primary flow
    console.error('[AuditLog] Failed to write audit entry:', error)
  }
}

/**
 * Cleanup: delete audit logs older than the specified number of days.
 * Default retention is 365 days (1 year) as agreed with user.
 */
export async function purgeOldAuditLogs(retentionDays = 365): Promise<number> {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - retentionDays)

  const result = await prisma.auditLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  })

  return result.count
}
