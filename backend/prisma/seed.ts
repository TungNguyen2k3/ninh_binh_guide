import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SALT_ROUNDS = 12

const seeds = [
  {
    email: 'admin@ninhbinh.vn',
    password: 'Admin@123456',
    name: 'Admin',
    role: 'admin' as const,
  },
  {
    email: 'staff@ninhbinh.vn',
    password: 'Staff@123456',
    name: 'Staff Demo',
    role: 'staff' as const,
  },
]

async function main() {
  console.log('Seeding default accounts...')

  for (const seed of seeds) {
    const passwordHash = await bcrypt.hash(seed.password, SALT_ROUNDS)

    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {},
      create: {
        email: seed.email,
        passwordHash,
        name: seed.name,
        role: seed.role,
      },
    })

    console.log(`  ✓ ${user.role}: ${user.email}`)
  }

  console.log('Done.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
