const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.campaignBanner.count()
  
  if (count === 0) {
    await prisma.campaignBanner.create({
      data: {
        title: 'Speak Up. Report Harassment.',
        imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        linkUrl: '/report',
        isActive: true
      }
    })
    console.log('Seeded initial campaign banner.')
  } else {
    console.log('Campaign banners already exist.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
