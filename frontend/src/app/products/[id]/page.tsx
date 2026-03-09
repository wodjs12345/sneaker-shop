import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/product/AddToCartButton';

interface ProductSize {
  id: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  description: string;
  sizes: ProductSize[];
}

// SSR - 매 요청마다 최신 재고 반영
async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(
    `${process.env.API_URL || 'http://localhost:4000/api'}/products/${id}`,
    { cache: 'no-store' } // SSR
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6 pb-20">
      <div className="grid md:grid-cols-2 gap-12">
        {/* 이미지 */}
        <div className="bg-white/5 aspect-square relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col justify-center">
          <p className="text-white/40 text-sm tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl text-[#E8FF00] font-black mb-6">
            {product.price.toLocaleString()}원
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">{product.description}</p>

          {/* 클라이언트 컴포넌트 - 사이즈 선택 + 장바구니 */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}