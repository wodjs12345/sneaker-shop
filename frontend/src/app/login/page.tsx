'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken);
      router.push('/');
    } catch {
      setError('이메일 또는 비밀번호가 틀렸습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-widest mb-2 text-[#E8FF00]">SOLE</h1>
        <p className="text-white/40 mb-10 text-sm">로그인하고 한정판을 먼저 만나세요</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#E8FF00] transition-colors placeholder:text-white/30"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#E8FF00] transition-colors placeholder:text-white/30"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8FF00] text-black font-bold py-3 tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? '로그인 중...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          계정이 없으신가요?{' '}
          <Link href="/register" className="text-[#E8FF00] hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}