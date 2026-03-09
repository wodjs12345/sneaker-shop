'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const { user, isLoggedIn } = useAuthStore();
  const { totalCount } = useCartStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-primary/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-2xl font-bold tracking-widest text-[#E8FF00]">
          SOLE
        </Link>

        {/* 네비 */}
        <nav className="hidden md:flex gap-8 text-sm text-white/70">
          <Link href="/products" className="hover:text-white transition-colors">ALL</Link>
          <Link href="/products?brand=Nike" className="hover:text-white transition-colors">NIKE</Link>
          <Link href="/products?brand=Adidas" className="hover:text-white transition-colors">ADIDAS</Link>
          <Link href="/products?brand=New Balance" className="hover:text-white transition-colors">NEW BALANCE</Link>
        </nav>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-4">
          {isLoggedIn() ? (
            <>
              <Link href="/wishlist" className="text-white/70 hover:text-white transition-colors">
                <Heart size={20} />
              </Link>
              <Link href="/cart" className="relative text-white/70 hover:text-white transition-colors">
                <ShoppingCart size={20} />
                {totalCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E8FF00] text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalCount()}
                  </span>
                )}
              </Link>
              <Link href="/mypage" className="text-white/70 hover:text-white transition-colors">
                <User size={20} />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-1.5 border border-white/30 rounded hover:border-[#E8FF00] hover:text-[#E8FF00] transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}