"use client";
import React, { useState } from 'react';
import { Info, ChevronDown, Clock, User, Smartphone, QrCode, CreditCard, Lock } from 'lucide-react';

const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [usePoints, setUsePoints] = useState(false);

  return (
    // Bố cục tổng thể với font chữ và màu văn bản cơ bản[cite: 12]
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#2B2118]">
      
      {/* Container chính với Auto Layout W: 1440px, Padding: 80px ngang, 48px dọc[cite: 11] */}
      <main className="mx-auto max-w-[1440px] px-[80px] py-[48px]">
        
        {/* Tiêu đề trang[cite: 10] */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#2B2118]">Thanh toán</h1>
          <p className="mt-2 text-[15px] text-[#74665B]">Một bước nữa thôi, ly cà phê của bạn sẽ được chuẩn bị.</p>
        </div>

        {/* Thông báo đăng nhập[cite: 10, 12] */}
        <div className="mb-8 flex items-center gap-3 rounded-xl bg-[#F5EBDD] p-4 text-[14px] font-medium text-[#6F4E37]">
          <Info size={18} />
          <span>Bạn đã đăng nhập với tài khoản Minh Anh - minhanh@gmail.com</span>
        </div>

        {/* Lưới chia cột với khoảng cách Gap: 32px[cite: 11] */}
        <div className="grid grid-cols-1 items-start gap-[32px] lg:grid-cols-[1.8fr_1.2fr]">
          
          {/* CỘT TRÁI: Thông tin nhận hàng & Thanh toán[cite: 10] */}
          <div className="space-y-6">
            
            {/* Panel 1: Nhận tại cửa hàng[cite: 10] */}
            <section className="rounded-2xl border border-[#E5D9CD] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Nhận tại cửa hàng</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[13px] font-bold text-[#2B2118]">Cửa hàng</label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-[#E5D9CE] p-4 pr-10 text-[15px] outline-none focus:border-[#6F4E37]">
                      <option>BrewLite Nguyễn Huệ</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-4 text-[#74665B]" size={20} />
                  </div>
                  <p className="mt-2 text-[13px] text-[#74665B]">
                    28 Nguyễn Huệ, Bến Nghé, TP. Hồ Chí Minh Mở cửa 07:00 – 22:00 - Cách bạn khoảng 1,2 km
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold text-[#2B2118]">Thời gian nhận</label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-xl border border-[#E5D9CE] p-4 pr-10 text-[15px] outline-none focus:border-[#6F4E37]">
                      <option>Hôm nay - 09:45</option>
                    </select>
                    <Clock className="absolute right-4 top-4 text-[#74665B]" size={20} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-bold text-[#2B2118]">Người nhận</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="Nguyễn Minh Anh - 0901 234 567"
                      className="w-full rounded-xl border border-[#E5D9CE] p-4 pr-10 text-[15px] outline-none focus:border-[#6F4E37]"
                    />
                    <User className="absolute right-4 top-4 text-[#74665B]" size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#F5EBDD] p-4 text-[13px] text-[#6F4E37]">
                  <Info size={16} />
                  <span>Món được pha mới trước giờ nhận khoảng 5 phút.</span>
                </div>
              </div>
            </section>

            {/* Panel 2: Phương thức thanh toán[cite: 10] */}
            <section className="rounded-2xl border border-[#E5D9CD] bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-xl font-bold">Phương thức thanh toán</h2>
              <span className="mb-5 inline-block rounded-full bg-[#F5EBDD] px-3 py-1 text-[12px] font-medium text-[#6F4E37]">
                Không dùng tiền mặt
              </span>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button 
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${paymentMethod === 'momo' ? 'border-[#6F4E37] bg-[#F5EBDD]' : 'border-[#E5D9CE] bg-white'}`}
                >
                  <Smartphone className="mb-4 text-[#6F4E37]" size={24} />
                  <div className="flex items-center gap-2 font-medium">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === 'momo' ? 'border-[#6F4E37]' : 'border-gray-300'}`}>
                      {paymentMethod === 'momo' && <div className="h-2 w-2 rounded-full bg-[#6F4E37]"></div>}
                    </div>
                    MoMo
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${paymentMethod === 'vnpay' ? 'border-[#6F4E37] bg-[#F5EBDD]' : 'border-[#E5D9CE] bg-white'}`}
                >
                  <QrCode className="mb-4 text-[#74665B]" size={24} />
                  <div className="flex items-center gap-2 font-medium">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === 'vnpay' ? 'border-[#6F4E37]' : 'border-gray-300'}`}>
                      {paymentMethod === 'vnpay' && <div className="h-2 w-2 rounded-full bg-[#6F4E37]"></div>}
                    </div>
                    VNPay
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${paymentMethod === 'card' ? 'border-[#6F4E37] bg-[#F5EBDD]' : 'border-[#E5D9CE] bg-white'}`}
                >
                  <CreditCard className="mb-4 text-[#74665B]" size={24} />
                  <div className="flex items-center gap-2 font-medium">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === 'card' ? 'border-[#6F4E37]' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="h-2 w-2 rounded-full bg-[#6F4E37]"></div>}
                    </div>
                    Thẻ ngân hàng
                  </div>
                </button>
              </div>

              <p className="mt-4 text-[13px] text-[#74665B]">
                Bạn sẽ được chuyển đến ứng dụng MoMo để xác nhận. BrewLite không lưu thông tin thanh toán nhạy cảm.
              </p>
            </section>

            {/* Panel 3: Điểm thưởng BrewLite[cite: 10] */}
            <section className="flex items-center justify-between rounded-2xl border border-[#E5D9CD] bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold">Điểm thưởng BrewLite</h2>
                <p className="mt-1 font-bold text-[#2B2118]">Dùng điểm thưởng</p>
                <p className="text-[13px] text-[#74665B]">Bạn có 320 điểm - 1 điểm = 100đ</p>
                <p className="mt-1 text-[13px] text-[#74665B]">Chưa sử dụng điểm cho đơn này - 0đ</p>
              </div>
              
              {/* Toggle Button */}
              <button 
                onClick={() => setUsePoints(!usePoints)}
                className={`relative h-7 w-12 rounded-full transition-colors ${usePoints ? 'bg-[#6F4E37]' : 'bg-[#E5D9CE]'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${usePoints ? 'right-1' : 'left-1'}`}></span>
              </button>
            </section>

          </div>

          {/* CỘT PHẢI: Tóm tắt đơn hàng[cite: 10] */}
          <div className="space-y-6">
            
            {/* Đơn của bạn[cite: 10] */}
            <section className="rounded-2xl border border-[#E5D9CD] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Đơn của bạn</h2>
              
              <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex gap-4">
                  <img src="/images/menu/ca-phe-sua-da.jpg" alt="Cà phê sữa đá" className="h-[80px] w-[80px] rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-[#2B2118]">Cà phê sữa đá</h3>
                    <p className="text-[13px] text-[#74665B]">Cỡ M - Kem cheese - 50% đường - Ít đá</p>
                    <p className="mt-1 text-[14px] font-medium text-[#74665B]">58.000đ × 2 = 116.000đ</p>
                  </div>
                </div>
                
                {/* Item 2 */}
                <div className="flex gap-4 border-t border-[#E5D9CD] pt-6">
                  <img src="/images/menu/tra-dao-cam-sa.jpg" alt="Trà đào cam sả" className="h-[80px] w-[80px] rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-[#2B2118]">Trà đào cam sả</h3>
                    <p className="text-[13px] text-[#74665B]">Cỡ S - 100% đường - Đá bình thường</p>
                    <p className="mt-1 text-[14px] font-medium text-[#74665B]">45.000đ × 1 = 45.000đ</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#F9F9F9] p-4 text-[13px] text-[#74665B]">
                Ghi chú: Pha đậm hơn một chút giúp mình nhé.
              </div>
            </section>

            {/* Tóm tắt đơn hàng[cite: 10, 12] */}
            <section className="rounded-2xl border border-[#E5D9CD] bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 border-b border-[#E5D9CD] pb-5 text-[14px] text-[#74665B]">
                <div className="flex justify-between">
                  <span>Tạm tính - 3 sản phẩm</span>
                  <span>161.000đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Ưu đãi CHAO10 - 10%</span>
                  <span>-16.100đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Điểm thưởng sử dụng</span>
                  <span>0đ</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[16px] font-bold">Tổng cộng</span>
                <span className="text-[24px] font-bold text-[#6F4E37]">144.900đ</span>
              </div>
              
              <div className="mt-4 text-[13px] text-[#74665B]">
                <p>Đã bao gồm thuế. Nhận tại cửa hàng, không có phí giao hàng.</p>
                <p className="mt-2">Thanh toán an toàn - Không dùng tiền mặt</p>
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F4E37] py-4 text-[15px] font-bold text-white transition-opacity hover:opacity-90">
                <Lock size={18} />
                Xác nhận thanh toán
              </button>

              <p className="mt-4 text-center text-[12px] text-[#74665B]">
                Khi tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách thanh toán của BrewLite.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}