'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((r) => r.data),
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (isLoading) return <div className="pt-24 text-center text-white/40">로딩중...</div>;

  const items = cart?.cartItems || [];
  const total = items.reduce(
    (sum: number, item: { product: { price: number }; quantity: number }) =>
      sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">장바구니가 비어있습니다.</p>
        <Link href="/products" className="text-[#E8FF00] hover:underline text-sm">
          쇼핑 계속하기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-3xl mx-auto px-6 pb-20">
      <h1 className="text-2xl font-bold tracking-widest mb-10">CART</h1>

      <div className="space-y-4 mb-10">
        {items.map((item: {
          id: string;
          product: { name: string; brand: string; price: number; imageUrl: string };
          productSize: { size: string };
          quantity: number;
        }) => (
          <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4">
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-20 h-20 object-cover bg-white/5"
            />
            <div className="flex-1">
              <p className="text-white/40 text-xs tracking-widest">{item.product.brand}</p>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-white/40 text-sm">SIZE {item.productSize.size}</p>
              <p className="text-[#E8FF00] font-bold mt-1">
                {(item.product.price * item.quantity).toLocaleString()}원
              </p>
            </div>
            <button
              onClick={() => removeItem.mutate(item.id)}
              className="text-white/30 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/20 pt-6 flex items-center justify-between mb-6">
        <span className="text-white/60">총 금액</span>
        <span className="text-2xl font-black text-[#E8FF00]">{total.toLocaleString()}원</span>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-[#E8FF00] text-black font-bold py-4 text-center tracking-widest hover:bg-white transition-colors"
      >
        주문하기
      </Link>
    </div>
  );
}