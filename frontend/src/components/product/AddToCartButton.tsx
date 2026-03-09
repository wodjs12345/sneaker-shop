'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface ProductSize {
  id: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  sizes: ProductSize[];
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: (data: { productId: string; productSizeId: string }) =>
      api.post('/cart', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      alert('장바구니에 추가되었습니다!');
    },
    onError: () => {
      alert('장바구니 추가에 실패했습니다.');
    },
  });

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    addToCart.mutate({ productId: product.id, productSizeId: selectedSize });
  };

  return (
    <div>
      {/* 사이즈 선택 */}
      <div className="mb-6">
        <p className="text-sm text-white/40 mb-3 tracking-widest">SIZE</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => size.stock > 0 && setSelectedSize(size.id)}
              disabled={size.stock === 0}
              className={`
                w-14 h-10 text-sm border transition-colors
                ${size.stock === 0
                  ? 'border-white/10 text-white/20 cursor-not-allowed line-through'
                  : selectedSize === size.id
                  ? 'border-[#E8FF00] bg-[#E8FF00] text-black font-bold'
                  : 'border-white/30 hover:border-white text-white'
                }
              `}
            >
              {size.size}
            </button>
          ))}
        </div>
      </div>

      {/* 장바구니 버튼 */}
      <button
        onClick={handleAddToCart}
        disabled={addToCart.isPending}
        className="w-full bg-[#E8FF00] text-black font-bold py-4 tracking-widest hover:bg-white transition-colors disabled:opacity-50"
      >
        {addToCart.isPending ? '추가 중...' : '장바구니 담기'}
      </button>
    </div>
  );
}