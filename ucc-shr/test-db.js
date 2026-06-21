const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.siteContent.findUnique({ where: { key: 'awarenessBanner' } })
  .then(res => console.log('awarenessBanner:', typeof res.value, res.value))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
