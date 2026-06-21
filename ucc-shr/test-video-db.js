const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.siteContent.findUnique({ where: { key: 'awarenessVideoUrl' } })
  .then(res => console.log('awarenessVideoUrl:', typeof res?.value, res?.value))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
