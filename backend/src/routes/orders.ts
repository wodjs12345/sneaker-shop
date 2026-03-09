import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// 내 주문 목록
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: {
      orderItems: {
        include: { product: true, productSize: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(orders);
});

// 주문 생성
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { items } = req.body;
  // items: [{ productId, productSizeId, quantity }]

  // 재고 확인 + 총액 계산
  let totalPrice = 0;
  for (const item of items) {
    const size = await prisma.productSize.findUnique({
      where: { id: item.productSizeId },
      include: { product: true },
    });

    if (!size || size.stock < item.quantity) {
      return res.status(400).json({ message: `${size?.product.name} 재고가 부족합니다.` });
    }

    totalPrice += size.product.price * item.quantity;
  }

  // 트랜잭션으로 주문 생성 + 재고 감소
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalPrice,
        orderItems: {
          create: items.map((item: { productId: string; productSizeId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            productSizeId: item.productSizeId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 재고 감소
    for (const item of items) {
      await tx.productSize.update({
        where: { id: item.productSizeId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  return res.status(201).json(order);
});

// 결제 완료 처리 (토스페이먼츠 webhook or 클라이언트 confirm)
router.patch('/:id/pay', authenticate, async (req: AuthRequest, res: Response) => {
  const { paymentKey, paymentMethod } = req.body;

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: {
      status: 'PAID',
      paymentKey,
      paymentMethod,
      paidAt: new Date(),
    },
  });

  return res.json(order);
});

export default router;