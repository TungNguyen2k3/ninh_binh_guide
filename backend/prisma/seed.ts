/// <reference types="node" />
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

const locationSeeds = [
  {
    slug: 'trang-an',
    nameVi: 'Tràng An',
    nameEn: 'Trang An',
    descriptionVi: 'Quần thể danh thắng Tràng An — Di sản Thế giới kép của UNESCO, nổi tiếng với hệ thống hang động và cảnh quan sông núi hùng vĩ.',
    descriptionEn: 'Trang An Landscape Complex — a UNESCO dual World Heritage Site, renowned for its cave system and dramatic river-mountain scenery.',
    latitude: 20.2539,
    longitude: 105.8412,
    displayOrder: 1,
  },
  {
    slug: 'hang-mua',
    nameVi: 'Hang Múa',
    nameEn: 'Mua Cave',
    descriptionVi: 'Đỉnh Hang Múa nhìn ra đồng lúa bậc thang và sông Ngô Đồng — điểm check-in nổi tiếng nhất Ninh Bình với 500 bậc đá.',
    descriptionEn: 'Mua Cave peak overlooks terraced rice fields and the Ngo Dong River — the most iconic viewpoint in Ninh Binh, reached by 500 stone steps.',
    latitude: 20.2276,
    longitude: 105.9118,
    displayOrder: 2,
  },
  {
    slug: 'bich-dong',
    nameVi: 'Chùa Bích Động',
    nameEn: 'Bich Dong Pagoda',
    descriptionVi: 'Chùa hang nằm trong núi đá vôi, được mệnh danh là "Nam thiên đệ nhị động" — động đẹp thứ hai trời Nam.',
    descriptionEn: 'Cave pagoda nestled inside a limestone mountain, known as the second most beautiful grotto in the southern sky.',
    latitude: 20.2195,
    longitude: 105.9073,
    displayOrder: 3,
  },
  {
    slug: 'tam-coc',
    nameVi: 'Tam Cốc',
    nameEn: 'Tam Coc',
    descriptionVi: 'Ba hang động tự nhiên trên sông Ngô Đồng — Hang Cả, Hang Hai và Hang Ba — nơi được ví như "Hạ Long trên cạn".',
    descriptionEn: 'Three natural caves along the Ngo Dong River — Hang Ca, Hang Hai and Hang Ba — often called the "Halong Bay on land".',
    latitude: 20.2203,
    longitude: 105.9108,
    displayOrder: 4,
  },
  {
    slug: 'hoa-lu',
    nameVi: 'Cố đô Hoa Lư',
    nameEn: 'Hoa Lu Ancient Capital',
    descriptionVi: 'Kinh đô đầu tiên của Việt Nam phong kiến tập quyền (thế kỷ X), nơi thờ phụng vua Đinh Tiên Hoàng và Lê Đại Hành.',
    descriptionEn: 'First capital of centralised feudal Vietnam (10th century), housing temples dedicated to King Dinh Tien Hoang and Le Dai Hanh.',
    latitude: 20.2750,
    longitude: 105.9066,
    displayOrder: 5,
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

  console.log('Seeding locations...')

  for (const loc of locationSeeds) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    })
    console.log(`  ✓ location: ${loc.slug}`)
  }

  console.log('Seeding packages...')

  const allPkg = await prisma.package.upsert({
    where: { id: 'pkg-all' },
    update: {},
    create: {
      id: 'pkg-all',
      name: 'Goi Toan Canh',
      description: 'Tat ca dia diem',
      type: 'all_locations',
      validityHours: 24,
      price: 150000,
    },
  })
  console.log(`  ✓ package: ${allPkg.name}`)

  const customPkg = await prisma.package.upsert({
    where: { id: 'pkg-basic' },
    update: {},
    create: {
      id: 'pkg-basic',
      name: 'Goi Co Ban',
      description: 'Trang An + Hang Mua + Bich Dong',
      type: 'custom',
      validityHours: 12,
      price: 80000,
    },
  })
  console.log(`  ✓ package: ${customPkg.name}`)

  // Assign 3 locations to the custom package
  const slugsForBasic = ['trang-an', 'hang-mua', 'bich-dong']
  const basicLocations = await prisma.location.findMany({
    where: { slug: { in: slugsForBasic } },
    select: { id: true },
  })

  if (basicLocations.length > 0) {
    await prisma.packageLocation.createMany({
      data: basicLocations.map((loc) => ({ packageId: customPkg.id, locationId: loc.id })),
      skipDuplicates: true,
    })
    console.log(`  ✓ assigned ${basicLocations.length} locations to ${customPkg.name}`)
  }

  console.log('Done.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
