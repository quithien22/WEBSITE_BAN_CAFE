'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Khớp luật của RegisterDto ở backend
const PW_RULE = /^(?=.*[A-Za-z])(?=.*\d).+$/;

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Za-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (pw.length >= 12) s++;
  return s; // 0..4
}

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State cho việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (password.length < 8 || !PW_RULE.test(password))
      return setError('Mật khẩu tối thiểu 8 ký tự, có cả chữ và số');
    if (password !== confirm) return setError('Mật khẩu nhập lại không khớp');
    if (!agree) return setError('Bạn cần đồng ý với Điều khoản sử dụng');

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.replace(/[\s.-]/g, '') || undefined,
        password,
      });
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  }

  // Tính toán độ mạnh mật khẩu hiện tại
  const currentStrength = strength(password);

  return (
    <div className="w-full flex justify-center py-10 font-sans">
      <div className="w-[1280px] flex gap-[10px] items-start">
        
        {/* Cột trái: Hình ảnh */}
        <div className="w-1/2 flex flex-col gap-6">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Coffee shop table"
            className="w-full h-[400px] object-cover rounded-2xl"
          />
          <div className="flex flex-col gap-3 mt-4">
            <span className="bg-[#F5EBDD] text-[#6F4E37] text-[13px] font-semibold font-['Inter'] px-3 py-1 rounded w-max">
              Mỗi lần ghé, thêm một niềm vui
            </span>
            <h2 className="text-[28px] font-bold text-[#2B2118] font-['Inter']">
              Gia nhập nhà BrewLite
            </h2>
            <p className="text-[#74665B] text-[15px] font-['Inter'] leading-relaxed">
              Tích điểm mỗi đơn, nhận ưu đãi riêng và lưu hương vị bạn yêu. Ly đầu tiên giảm 10% với CHAO10.
            </p>
          </div>
        </div>

        {/* Cột phải: Form Đăng ký */}
        <div className="w-1/2 px-16 flex flex-col">
          <h2 className="text-[36px] font-bold text-[#2B2118] font-['Inter'] leading-[150%] mb-1">
            Tạo tài khoản
          </h2>
          <p className="text-[#74665B] text-[16px] font-['Inter'] leading-[150%] mb-4">
            Một phút đăng ký, nhiều ngày cà phê ngon.
          </p>

          {/* Hiển thị thông báo lỗi */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 font-['Inter']">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {/* Input Họ và tên */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2B2118] text-sm font-bold font-['Inter']">Họ và tên</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
                className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 text-[#2B2118] placeholder-[#74665B] font-['Inter'] focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            {/* Input Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2B2118] text-sm font-bold font-['Inter']">Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 text-[#2B2118] placeholder-[#74665B] font-['Inter'] focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            {/* Input Số điện thoại */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2B2118] text-sm font-bold font-['Inter']">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 text-[#2B2118] placeholder-[#74665B] font-['Inter'] focus:outline-none focus:border-[#6F4E37]"
              />
              <span className="text-[#74665B] text-[12px] font-['Inter'] mt-1">
                Dùng để thông báo khi đơn sẵn sàng.
              </span>
            </div>

            {/* Input Mật khẩu */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2B2118] text-sm font-bold font-['Inter']">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 text-[#2B2118] placeholder-[#74665B] font-['Inter'] tracking-normal focus:outline-none focus:border-[#6F4E37]"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74665B] hover:text-[#6F4E37]"
                >
                  {/* SVG Đổi tuỳ theo trạng thái showPassword (có thể thay bằng icon mắt mở/đóng tùy ý) */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              {/* Thanh hiển thị độ mạnh mật khẩu động */}
              <div className="flex gap-2 mt-1">
                <div className={`h-1 flex-1 rounded transition-colors ${currentStrength >= 1 ? 'bg-[#27AE60]' : 'bg-[#E5D9CD]'}`}></div>
                <div className={`h-1 flex-1 rounded transition-colors ${currentStrength >= 2 ? 'bg-[#27AE60]' : 'bg-[#E5D9CD]'}`}></div>
                <div className={`h-1 flex-1 rounded transition-colors ${currentStrength >= 3 ? 'bg-[#27AE60]' : 'bg-[#E5D9CD]'}`}></div>
                <div className={`h-1 flex-1 rounded transition-colors ${currentStrength >= 4 ? 'bg-[#27AE60]' : 'bg-[#E5D9CD]'}`}></div>
              </div>
              <span className={`text-[12px] font-['Inter'] mt-1 ${currentStrength >= 3 ? 'text-[#27AE60]' : 'text-[#74665B]'}`}>
                {currentStrength >= 3 ? 'Mật khẩu mạnh' : 'Mật khẩu cần ít nhất 8 ký tự, có chữ và số'}
              </span>
            </div>

            {/* Input Nhập lại mật khẩu */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2B2118] text-sm font-bold font-['Inter']">Nhập lại mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full border border-[#E5D9CD] rounded-lg px-4 py-3 text-[#2B2118] placeholder-[#74665B] font-['Inter'] tracking-normal focus:outline-none focus:border-[#6F4E37]"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#74665B] hover:text-[#6F4E37]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Checkbox Điều khoản */}
            <div className="flex items-start gap-2 mt-2">
              <input 
                type="checkbox" 
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5D9CD] text-[#6F4E37] focus:ring-[#6F4E37] mt-1 cursor-pointer" 
              />
              <label 
                onClick={() => setAgree(!agree)}
                className="text-[#2B2118] text-sm font-['Inter'] leading-relaxed cursor-pointer select-none"
              >
                Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.
              </label>
            </div>

            {/* Nút Đăng ký */}
            <button 
              disabled={loading}
              className="w-full bg-[#6F4E37] text-white font-bold font-['Inter'] py-4 rounded-lg mt-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>

            {/* Link Đăng nhập */}
            <p className="text-center text-[#74665B] text-sm font-['Inter'] mt-2">
              Đã có tài khoản? <Link href="/login" className="text-[#6F4E37] font-bold hover:underline">Đăng nhập</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}