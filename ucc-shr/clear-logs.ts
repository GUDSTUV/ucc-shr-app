import 'dotenv/config'
import { prisma } from './src/lib/prisma'

async function main() {
  const result = await prisma.auditLog.deleteMany({})
  console.log(`Deleted ${result.count} audit logs.`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
