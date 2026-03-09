import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  sizes: { size: string; stock: number }[];
}

// SSG - 빌드 시 생성, 1시간마다 revalidate
async function getProducts() {
  const res = await fetch(`${process.env.API_URL || 'http://localhost:4000/api'}/products?limit=12`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { products: [] };
  return res.json();
}

export default async function HomePage() {
  const { products } = await getProducts();

  return (
    <div className="pt-16">
      {/* 히어로 */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6">
        <p className="text-white/40 text-sm tracking-[0.3em] mb-4">LIMITED EDITION</p>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
          FIND YOUR<br />
          <span className="text-[#E8FF00]">SOLE</span>
        </h1>
        <p className="text-white/50 mb-8 max-w-md">
          한정판 스니커즈를 가장 빠르게. 놓치면 후회할 드롭.
        </p>
        <Link
          href="/products"
          className="bg-[#E8FF00] text-black font-bold px-8 py-3 hover:bg-white transition-colors tracking-widest text-sm"
        >
          SHOP NOW
        </Link>
      </section>

      {/* 상품 그리드 */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-widest">NEW DROPS</h2>
          <Link href="/products" className="text-white/40 text-sm hover:text-white transition-colors">
            전체보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: Product) => {
            const totalStock = product.sizes.reduce((sum: number, s: { stock: number }) => sum + s.stock, 0);
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="bg-white/5 aspect-square relative overflow-hidden mb-3">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {totalStock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white/70 text-sm tracking-widest">SOLD OUT</span>
                    </div>
                  )}
                  {totalStock > 0 && totalStock <= 5 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5">
                      잔여 {totalStock}
                    </div>
                  )}
                </div>
                <p className="text-white/40 text-xs tracking-widest mb-1">{product.brand}</p>
                <p className="text-sm font-medium mb-1 line-clamp-1">{product.name}</p>
                <p className="text-[#E8FF00] font-bold">{product.price.toLocaleString()}원</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}