'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert('회원가입이 완료되었습니다!');
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-widest mb-2 text-[#E8FF00]">SOLE</h1>
        <p className="text-white/40 mb-10 text-sm">계정을 만들고 한정판을 먼저 만나세요</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#E8FF00] transition-colors placeholder:text-white/30"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#E8FF00] transition-colors placeholder:text-white/30"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호 (6자 이상)"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#E8FF00] transition-colors placeholder:text-white/30"
            required
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#E8FF00] transition-colors placeholder:text-white/30"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8FF00] text-black font-bold py-3 tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? '가입 중...' : 'SIGN UP'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[#E8FF00] hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}