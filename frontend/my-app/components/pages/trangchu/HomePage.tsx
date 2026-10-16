'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Coffee, 
  CupSoda, 
  IceCream, 
  Cookie, 
  Star, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const categories = [
    { name: 'Cà phê', icon: Coffee },
    { name: 'Trà', icon: CupSoda },
    { name: 'Trà sữa', icon: CupSoda },
    { name: 'Đá xay', icon: IceCream },
    { name: 'Bánh', icon: Cookie },
  ];

  const favoriteProducts = [
    {
      id: 1,
      name: 'Cà phê sữa đá',
      desc: 'Đậm vị cà phê, ngọt ngào sữa đặc',
      price: '45.000đ',
      image: '/images/menu/ca-phe-sua-da.jpg',
    },
    {
      id: 2,
      name: 'Trà đào cam sả',
      desc: 'Trà thơm cùng đào và cam tươi',
      price: '45.000đ',
      image: '/images/menu/tra-dao-cam-sa.jpg',
    },
    {
      id: 3,
      name: 'Latte êm dịu',
      desc: 'Espresso hòa cùng sữa tươi',
      price: '55.000đ',
      image: '/images/menu/latte-em-diu.jpg',
    },
    {
      id: 4,
      name: 'Matcha sữa tươi',
      desc: 'Trà xanh Nhật Bản, sữa thanh mát',
      price: '55.000đ',
      image: '/images/menu/matcha-sua-tuoi.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#2B2118]">
      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10 lg:px-20 space-y-16">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-[#F5EBDD] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            
            {/* Cột trái: Văn bản */}
            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-wider text-[#6F4E37] uppercase">
                Cà phê Việt - Nhịp sống mới
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#2B2118]">
                Đặt cà phê chỉ vài chạm, không tiền mặt
              </h1>
              <p className="text-sm sm:text-base leading-relaxed text-[#74665B]">
                Ly cà phê bạn yêu, pha mới khi bạn đến. Đặt trước trên BrewLite, thanh toán gọn và nhận tại cửa hàng — không cần xếp hàng.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/thuc-don"
                  className="rounded-xl bg-[#6F4E37] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-opacity-90"
                >
                  Đặt ngay
                </Link>
                <Link
                  href="/thuc-don"
                  className="rounded-xl border border-[#2B2118]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#2B2118] transition-all hover:bg-[#F5EBDD]"
                >
                  Khám phá thực đơn
                </Link>
              </div>

              {/* Đánh giá */}
              <div className="flex items-center gap-2 pt-4 text-xs font-medium text-[#74665B]">
                <div className="flex text-amber-500">
                  <Star size={16} fill="currentColor" />
                </div>
                <span><strong>4,9/5</strong> từ hơn 2.000 khách hàng yêu cà phê</span>
              </div>
              <p className="text-xs text-[#74665B]/80">
                MoMo · VNPay · Thẻ ngân hàng 100% không tiền mặt. 100% thuận tiện.
              </p>
            </div>

            {/* Cột phải: Banner ảnh */}
            <div className="relative">
              <div className="relative h-[320px] sm:h-[400px] w-full overflow-hidden rounded-2xl shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
                  alt="BrewLite Coffee"
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Card thông tin món nổi bật đè lên ảnh */}
              <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/90 p-4 backdrop-blur-md shadow-lg border border-white/40 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EBDD] text-[#6F4E37]">
                  <Coffee size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2B2118]">Cà phê sữa đá</h4>
                  <p className="text-xs text-[#74665B]">Một chút đậm đà · từ 45.000đ</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* HÔM NAY BẠN MUỐN UỐNG GÌ? */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#2B2118]">Hôm nay bạn muốn uống gì?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href="/thuc-don"
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#F5EBDD]/60 p-6 transition-all hover:bg-[#F5EBDD] hover:shadow-sm"
                >
                  <Icon size={28} className="text-[#6F4E37]" strokeWidth={1.5} />
                  <span className="text-sm font-bold text-[#2B2118]">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ĐƯỢC YÊU THÍCH NHẤT */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#2B2118]">Được yêu thích nhất</h2>
              <p className="text-xs sm:text-sm text-[#74665B] mt-1">Những hương vị khiến bạn muốn quay lại.</p>
            </div>
            
            {/* Nút điều hướng */}
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5D9CD] bg-white text-[#74665B] hover:bg-[#F5EBDD]">
                <ChevronLeft size={18} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5D9CD] bg-white text-[#74665B] hover:bg-[#F5EBDD]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Lưới sản phẩm */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteProducts.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E5D9CD] bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="h-48 w-full overflow-hidden rounded-xl bg-[#F5EBDD]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 font-bold text-[#2B2118] text-base">{p.name}</h3>
                  <p className="mt-1 text-xs text-[#74665B] line-clamp-1">{p.desc}</p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2B2118]">{p.price}</span>
                  <Link
                    href="/thuc-don"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5EBDD] text-[#6F4E37] transition-colors hover:bg-[#6F4E37] hover:text-white"
                  >
                    <Plus size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang & Nút xem tất cả */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="rounded-full bg-[#F5EBDD] px-3 py-1 text-xs font-bold text-[#6F4E37]">
              1/2
            </span>
            <Link href="/thuc-don" className="text-xs font-bold text-[#2B2118] hover:underline">
              Xem tất cả món
            </Link>
          </div>
        </section>

        {/* BANNER KHUYẾN MÃI */}
        <section className="rounded-2xl bg-[#F5EBDD]/80 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#E5D9CD]">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6F4E37]">
              Ưu đãi cho lần gặp đầu tiên
            </span>
            <h2 className="text-2xl font-extrabold text-[#2B2118]">Chào bạn mới, giảm ngay 10%</h2>
            <p className="text-xs sm:text-sm text-[#74665B]">
              Nhập CHAO10 cho đơn từ 100.000đ. Một khởi đầu thật thơm, thật nhẹ nhàng.
            </p>
            <p className="text-[11px] text-[#74665B]/70">Áp dụng đến 31/10/2026 · Giảm tối đa 30.000đ</p>
          </div>

          <Link
            href="/thuc-don"
            className="shrink-0 rounded-xl bg-[#6F4E37] px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Nhận ưu đãi
          </Link>
        </section>

      </main>
    </div>
  );
}