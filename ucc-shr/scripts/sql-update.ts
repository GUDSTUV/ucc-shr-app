import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Updating existing reports from RESOLVED to CLOSED...')
  // Cannot cast directly if we use prepared statements easily, but we can just run raw query
  await prisma.$executeRawUnsafe(`UPDATE "Report" SET status = 'CLOSED'::"ReportStatus" WHERE status = 'RESOLVED'::"ReportStatus"`)
  
  // We can also just update REVIEWING and REFERRED via table update instead of altering enum,
  // but if the enum doesn't have the new values yet (because db push failed), we can't update to UNDER_REVIEW!
  // Wait, UNDER_REVIEW is not in the enum yet in the DB.
  // So we must alter the enum first, or just run db push after we get rid of the duplicate values (RESOLVED/CLOSED).
  // Wait, if db push failed because of 'RESOLVED', what about 'REVIEWING'? Db push will try to drop 'REVIEWING' and 'REFERRED' and fail too!
  // So we need to add the new values to the enum first:
  console.log('Adding new enum values...')
  try {
    await prisma.$executeRawUnsafe(`ALTER TYPE "ReportStatus" ADD VALUE IF NOT EXISTS 'UNDER_REVIEW'`)
    await prisma.$executeRawUnsafe(`ALTER TYPE "ReportStatus" ADD VALUE IF NOT EXISTS 'UNDER_INVESTIGATION'`)
  } catch (e: any) {
    console.log('Values might already exist or error:', e.message)
  }

  console.log('Mapping old values to new values...')
  await prisma.$executeRawUnsafe(`UPDATE "Report" SET status = 'UNDER_REVIEW'::"ReportStatus" WHERE status = 'REVIEWING'::"ReportStatus"`)
  await prisma.$executeRawUnsafe(`UPDATE "Report" SET status = 'UNDER_INVESTIGATION'::"ReportStatus" WHERE status = 'REFERRED'::"ReportStatus"`)

  console.log('Done mapping rows. Now you can run db push.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
