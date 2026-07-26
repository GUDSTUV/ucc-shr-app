import { prisma } from './src/lib/prisma'

async function main() {
  const saved = await prisma.savedResource.findMany()
  console.log('All saved resources:', saved)

  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log('Users:', users)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
