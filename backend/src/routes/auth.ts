import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../lib/jwt';

const router = Router();
const prisma = new PrismaClient();


  /* try {
    const result=await pool.query('SELECT * FROM users');
      res.json(result.rows);
      }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
 */

//테스트용 유저 전체 검색
router.get('/users', async (req: Request, res: Response) => {

  try {
    const allUser = await prisma.user.findMany();
    return res.json(allUser)
  } catch (error) {
    res.status(500).send('Server Error');
  }
  
});


// 회원가입
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: '이미 사용중인 이메일입니다.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });

  return res.status(201).json({ message: '회원가입 성공', userId: user.id });
});

// 로그인
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 틀렸습니다.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 틀렸습니다.' });
  }

  const payload = { userId: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const refreshTokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, refreshTokenExp },
  });

  // refreshToken은 httpOnly cookie로
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

// 토큰 갱신
router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token 없음' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: '유효하지 않은 refresh token' });
    }

    if (user.refreshTokenExp && user.refreshTokenExp < new Date()) {
      return res.status(401).json({ message: 'Refresh token 만료' });
    }

    const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });
    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ message: '유효하지 않은 token' });
  }
});

// 로그아웃
router.post('/logout', async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await prisma.user.update({
        where: { id: payload.userId },
        data: { refreshToken: null, refreshTokenExp: null },
      });
    } catch {
      // 만료된 토큰이어도 쿠키는 지움
    }
  }

  res.clearCookie('refreshToken');
  return res.json({ message: '로그아웃 성공' });
});

export default router;