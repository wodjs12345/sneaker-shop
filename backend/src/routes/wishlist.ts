import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// 위시리스트 조회
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const wishlists = await prisma.wishlist.findMany({
    where: { userId: req.user!.userId },
    include: { product: { include: { sizes: true } } },
  });
  return res.json(wishlists);
});

// 위시리스트 추가
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;

  const wishlist = await prisma.wishlist.create({
    data: { userId: req.user!.userId, productId },
  });

  return res.status(201).json(wishlist);
});

// 위시리스트 삭제
router.delete('/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.wishlist.deleteMany({
    where: { userId: req.user!.userId, productId: req.params.productId },
  });

  return res.json({ message: '위시리스트에서 삭제되었습니다.' });
});

export default router;