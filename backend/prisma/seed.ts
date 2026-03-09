import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SIZES = ['240', '250', '260', '270', '280', '290', '300']

const products = [
  {
    name: 'Nike Air Force 1 Low',
    brand: 'Nike',
    price: 109000,
    description: '1982년 첫 출시 이후 꾸준한 사랑을 받고 있는 클래식 농구화. 깔끔한 올화이트 디자인으로 어떤 스타일에도 잘 어울립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800',
  },
  {
    name: 'Nike Air Max 90',
    brand: 'Nike',
    price: 139000,
    description: '아이코닉한 에어 쿠셔닝과 레트로 감성이 결합된 스니커즈. 일상적인 착용부터 운동까지 다목적으로 활용 가능합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  },
  {
    name: 'Adidas Stan Smith',
    brand: 'Adidas',
    price: 99000,
    description: '50년 이상의 역사를 자랑하는 테니스화에서 출발한 패션 아이템. 미니멀한 디자인으로 데일리 스니커즈로 제격입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',
  },
  {
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    price: 219000,
    description: '최고의 에너지 리턴을 자랑하는 부스트 폼이 탑재된 러닝화. 장거리 달리기에도 편안한 착화감을 제공합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
  },
  {
    name: 'New Balance 990v5',
    brand: 'New Balance',
    price: 259000,
    description: '미국에서 직접 제조된 프리미엄 라인. 뛰어난 내구성과 안정감으로 러닝과 일상 모두에서 최고의 퍼포먼스를 발휘합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=800',
  },
  {
    name: 'New Balance 574',
    brand: 'New Balance',
    price: 109000,
    description: '클래식한 레트로 디자인과 편안한 착화감의 조화. 캐주얼한 데일리룩에 완벽하게 어울리는 라이프스타일 스니커즈입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800',
  },
  {
    name: 'Converse Chuck Taylor All Star',
    brand: 'Converse',
    price: 79000,
    description: '100년의 역사를 가진 농구화에서 출발한 문화 아이콘. 캔버스 소재와 고무 밑창의 클래식한 조합으로 변함없이 사랑받고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800',
  },
  {
    name: 'Vans Old Skool',
    brand: 'Vans',
    price: 89000,
    description: '스케이트보드 문화에서 탄생한 밴스의 시그니처 모델. 사이드 스트라이프 디자인이 특징이며 스트리트 패션의 필수 아이템입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
  },
  {
    name: 'Nike Dunk Low Retro',
    brand: 'Nike',
    price: 129000,
    description: '1985년 농구화로 출발해 현재는 가장 핫한 스니커즈 중 하나. 다양한 컬러웨이와 콜라보레이션으로 매번 새로운 모습을 선보입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800',
  },
  {
    name: 'Adidas Gazelle',
    brand: 'Adidas',
    price: 119000,
    description: '1960년대 트레이닝화로 시작해 현재는 빈티지 스타일의 대명사. 스웨이드 소재와 심플한 디자인이 특징인 타임리스 스니커즈입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1574150550934-8fb7c6c3ffa2?w=800',
  },
]

async function main() {
  console.log(' Seeding 시작...')

  // 기존 데이터 초기화 (순서 중요 - FK 관계 때문에)
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productSize.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log('  기존 데이터 초기화 완료')

  // 관리자 계정 생성
  const adminPassword = await bcrypt.hash('admin1234', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@shop.com',
      password: adminPassword,
      name: '관리자',
      role: 'ADMIN',
    },
  })
  console.log(`👤 관리자 계정 생성: ${admin.email}`)

  // 테스트 유저 생성
  const userPassword = await bcrypt.hash('user1234', 10)
  const user = await prisma.user.create({
    data: {
      email: 'user@shop.com',
      password: userPassword,
      name: '테스트유저',
      role: 'USER',
    },
  })
  console.log(`👤 테스트 유저 생성: ${user.email}`)

  // 상품 + 사이즈 생성
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        sizes: {
          create: SIZES.map((size) => ({
            size,
            // 사이즈별 재고를 랜덤하게 (0~20개, 일부 품절 포함)
            stock: Math.random() > 0.15 ? Math.floor(Math.random() * 20) + 1 : 0,
          })),
        },
      },
    })
    console.log(` 상품 생성: ${product.name}`)
  }

  // 테스트 유저 장바구니 생성 (상품 2개 담기)
  const allProducts = await prisma.product.findMany({ include: { sizes: true } })

  const cart = await prisma.cart.create({
    data: { userId: user.id },
  })

  const firstProduct = allProducts[0]
  const firstSize = firstProduct.sizes.find((s) => s.stock > 0)

  const secondProduct = allProducts[1]
  const secondSize = secondProduct.sizes.find((s) => s.stock > 0)

  if (firstSize && secondSize) {
    await prisma.cartItem.createMany({
      data: [
        {
          cartId: cart.id,
          productId: firstProduct.id,
          productSizeId: firstSize.id,
          quantity: 1,
        },
        {
          cartId: cart.id,
          productId: secondProduct.id,
          productSizeId: secondSize.id,
          quantity: 2,
        },
      ],
    })
    console.log(' 테스트 장바구니 데이터 생성 완료')
  }

  // 테스트 위시리스트 (상품 3개)
  await prisma.wishlist.createMany({
    data: allProducts.slice(0, 3).map((p) => ({
      userId: user.id,
      productId: p.id,
    })),
  })
  console.log(' 테스트 위시리스트 데이터 생성 완료')

  console.log('\n Seeding 완료!')
  console.log('─────────────────────────────')
  console.log('📧 관리자: admin@shop.com / admin1234')
  console.log('📧 유저:   user@shop.com  / user1234')
  console.log('👟 상품:   10개')
  console.log('📦 사이즈: 상품당 7개 (240~300)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })