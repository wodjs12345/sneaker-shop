import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// 상품 목록 (SSG용 - 페이징, 필터)
router.get('/', async (req: Request, res: Response) => {
  const { page = '1', limit = '12', brand } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = brand ? { brand: String(brand) } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      include: { sizes: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return res.json({
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// 상품 상세 (SSR용 - 재고 실시간)
router.get('/:id', async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { sizes: true },
  });

  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  return res.json(product);
});

// 상품 등록 (관리자)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { name, description, price, imageUrl, brand, sizes } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl,
      brand,
      sizes: {
        create: sizes.map((s: { size: string; stock: number }) => ({
          size: s.size,
          stock: s.stock,
        })),
      },
    },
    include: { sizes: true },
  });

  return res.status(201).json(product);
});

// 재고 수정 (관리자)
router.patch('/:id/sizes/:sizeId', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { stock } = req.body;

  const updated = await prisma.productSize.update({
    where: { id: req.params.sizeId },
    data: { stock },
  });

  return res.json(updated);
});

export default router;