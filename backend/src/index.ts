import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import wishlistRouter from './routes/wishlist';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // cookie 허용
}));
app.use(express.json());
app.use(cookieParser());

// 테스트 API
app.get('/', (req,res) => {
	res.send('Backend 서버 작동 중!');
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/wishlist', wishlistRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;