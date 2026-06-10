import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'superadmin@cegrad.edu.gh'
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true
    },
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true
    }
  })

  console.log(`SUPER_ADMIN account created successfully!`)
  console.log(`Email: ${user.email}`)
  console.log(`Password: ${password}`)
  
  
  const adminEmail = 'admin@cegrad.edu.gh'
  const adminPassword = 'password123'
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10)
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHashedPassword,
      role: 'ADMIN',
      emailVerified: true
    },
    create: {
      email: adminEmail,
      name: 'Support Admin',
      password: adminHashedPassword,
      role: 'ADMIN',
      emailVerified: true
    }
  })
  
  console.log(`\nADMIN account created successfully!`)
  console.log(`Email: ${adminUser.email}`)
  console.log(`Password: ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
