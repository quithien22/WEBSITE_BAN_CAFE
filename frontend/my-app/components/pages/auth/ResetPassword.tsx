'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

// Khớp luật của ResetPassword DTO ở backend
const PW_RULE = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export default function ResetPassword() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (password.length < 8 || !PW_RULE.test(password))
      return setError('Mật khẩu tối thiểu 8 ký tự, có cả chữ và số');
    if (password !== confirm) return setError('Mật khẩu nhập lại không khớp');

    setLoading(true);
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
      });
      setDone(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <p className="text-center py-20">Liên kết không hợp lệ. <Link href="/forgotpassword" className="font-bold text-[#6F4E37]">Gửi lại</Link></p>;
  }

  return (
    <div className="w-full flex justify-center py-20 font-sans">
      <form onSubmit={handleSubmit} className="w-[480px] flex flex-col gap-5 bg-white p-8 rounded-2xl">
        <h2 className="text-[32px] font-bold text-[#2B2118]">Đặt mật khẩu mới</h2>

        <input type="password" required placeholder="Mật khẩu mới" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 focus:outline-none focus:border-[#6F4E37]" />
        <input type="password" required placeholder="Nhập lại mật khẩu mới" value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 focus:outline-none focus:border-[#6F4E37]" />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {done && <p className="text-[#27AE60] text-sm">Đã đổi mật khẩu, đang chuyển đến trang đăng nhập...</p>}

        <button type="submit" disabled={loading || done}
          className="w-full bg-[#6F4E37] text-white font-bold py-4 rounded-lg disabled:opacity-60">
          {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}