import { randomBytes } from 'crypto'
import { prisma } from '@/src/lib/prisma'

function buildTrackingCode() {
  const year = new Date().getFullYear()
  const token = randomBytes(2).toString('hex').toUpperCase()
  return `UCC-${year}-${token}`
}

/**
 * Generates a unique tracking code for an incident report.
 * Ensures the generated code doesn't already exist in the database.
 */
export async function generateUniqueTrackingCode(): Promise<string> {
  for (let i = 0; i < 8; i += 1) {
    const candidate = buildTrackingCode()
    const exists = await prisma.report.findUnique({
      where: { code: candidate },
      select: { id: true },
    })
    if (!exists) return candidate
  }
  const fallback = randomBytes(3).toString('hex').toUpperCase()
  return `UCC-${new Date().getFullYear()}-${fallback}`
}
