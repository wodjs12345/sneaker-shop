import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// 장바구니 조회
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          product: true,
          productSize: true,
        },
      },
    },
  });

  return res.json(cart || { cartItems: [] });
});

// 장바구니 추가
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { productId, productSizeId, quantity = 1 } = req.body;

  // 재고 확인
  const size = await prisma.productSize.findUnique({ where: { id: productSizeId } });
  if (!size || size.stock < quantity) {
    return res.status(400).json({ message: '재고가 부족합니다.' });
  }

  // cart 없으면 생성
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 이미 있는 아이템이면 수량 증가
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, productSizeId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, productSizeId, quantity },
    });
  }

  return res.json({ message: '장바구니에 추가되었습니다.' });
});

// 장바구니 아이템 삭제
router.delete('/:itemId', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) return res.status(404).json({ message: '장바구니가 없습니다.' });

  await prisma.cartItem.deleteMany({
    where: { id: req.params.itemId, cartId: cart.id },
  });

  return res.json({ message: '삭제되었습니다.' });
});

export default router;