import React from "react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between font-sans">
      {/* ================= HEADER ================= */}
      <div className="w-full bg-[#F5EBDD] flex justify-center">
        <header className="w-[1440px] px-10 py-5 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="text-[#6F4E37] text-3xl font-bold font-serif tracking-wider"
          >
            BrewLite
          </a>

          {/* Menu điều hướng */}
          <nav className="flex gap-8 text-[#2B2118] font-semibold text-sm">
            <a href="/" className="hover:text-[#6F4E37] transition-colors">
              Trang chủ
            </a>
            <a
              href="/thuc-don"
              className="hover:text-[#6F4E37] transition-colors"
            >
              Thực đơn
            </a>
            <a
              href="/promotions"
              className="hover:text-[#6F4E37] transition-colors"
            >
              Khuyến mãi
            </a>
            <a href="/about" className="hover:text-[#6F4E37] transition-colors">
              Về chúng tôi
            </a>
            <a
              href="/contact"
              className="hover:text-[#6F4E37] transition-colors"
            >
              Liên hệ
            </a>
          </nav>

          {/* Công cụ & Tài khoản */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5 text-[#74665B]">
              <button className="hover:text-[#6F4E37] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button className="hover:text-[#6F4E37] transition-colors relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-1.5 -right-2 bg-[#6F4E37] text-[#FFFFFF] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Avatar & Tên người dùng */}
            <div className="flex items-center gap-2 cursor-pointer bg-[#F5EBDD] border border-[#E6D7C3] px-3 py-1.5 rounded-full">
              <span className="bg-[#E6D7C3] text-[#6F4E37] text-xs font-bold h-7 w-7 rounded-full flex items-center justify-center">
                MA
              </span>
              <span className="text-[#2B2118] text-sm font-semibold">
                Minh Anh
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#74665B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </header>
      </div>

      {/* ================= PHẦN NỘI DUNG CHÍNH (MAIN CONTENT) ================= */}
      <main className="w-full flex justify-center py-10">
        <div className="w-[1440px] px-10 flex flex-col gap-6">
          {/* Banner Thông báo thành công */}
          <div className="bg-[#EAF5ED] border border-[#CDEAD2] rounded-2xl p-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#2E7D32]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#2E7D32] tracking-wider uppercase">
              Đã thanh toán
            </span>
            <h1 className="text-3xl font-bold text-[#2B2118]">
              Đặt hàng thành công!
            </h1>
            <p className="text-[#6B5E53] text-sm">
              Cảm ơn Minh Anh. Chúng minh đã nhận đơn và sẽ chuẩn bị thật ngon.
            </p>
            <div className="mt-2">
              <h2 className="text-xl font-bold text-[#2B2118]">
                Đơn hàng #1042
              </h2>
              <p className="text-xs text-[#8C7A6B] mt-1">
                09/10/2026 · 09:30 · Thanh toán qua MoMo
              </p>
            </div>
          </div>

          {/* Grid 2 cột: Món ăn & Tóm tắt đơn hàng */}
          <div className="grid grid-cols-12 gap-6">
            {/* Cột trái (8 phần): Món ngon & Hẹn gặp */}
            <div className="col-span-8 flex flex-col gap-6">
              {/* Danh sách món */}
              <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
                <h3 className="font-bold text-lg text-[#2B2118]">
                  Món ngon của bạn
                </h3>

                {/* Món 1 */}
                <div className="flex items-start justify-between pb-6 border-b border-[#F5F2EC]">
                  <div className="flex gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=120"
                      alt="Cà phê sữa đá"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-[#2B2118]">
                        Cà phê sữa đá
                      </h4>
                      <p className="text-xs text-[#8C7A6B] mt-0.5">
                        Cỡ M · Kem cheese · 50% đường · Ít đá
                      </p>
                      <p className="text-xs font-medium text-[#6B5E53] mt-2">
                        58.000đ × 2 = 118.000đ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Món 2 */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=120"
                      alt="Trà đào cam sả"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-[#2B2118]">
                        Trà đào cam sả
                      </h4>
                      <p className="text-xs text-[#8C7A6B] mt-0.5">
                        Cỡ S · 100% đường · Đã bình thường
                      </p>
                      <p className="text-xs font-medium text-[#6B5E53] mt-2">
                        45.000đ × 1 = 45.000đ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-lg text-xs text-[#6B5E53]">
                  Ghi chú: Pha đậm hơn một chút giúp mình nhé.
                </div>
              </div>

              {/* Thông tin hẹn gặp */}
              <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="font-bold text-sm text-[#8C7A6B]">
                  Hẹn gặp bạn lúc 09:45
                </h3>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#F5EBDD] text-[#6F4E37] rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2B2118]">
                      BrewLite Nguyễn Huệ
                    </h4>
                    <p className="text-xs text-[#8C7A6B]">
                      28 Nguyễn Huệ, Bến Nghé, TP. Hồ Chí Minh
                    </p>
                    <p className="text-xs font-medium text-[#A66E38] mt-1">
                      Dự kiến nhận sau 15 phút. Đọc mã #1042 tại quầy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải (4 phần): Tóm tắt đơn hàng & Nút thao tác */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Box Tóm tắt đơn hàng */}
              <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                <h3 className="font-bold text-lg text-[#2B2118] border-b border-[#F5F2EC] pb-3">
                  Tóm tắt đơn hàng
                </h3>

                <div className="flex justify-between text-sm text-[#6B5E53]">
                  <span>Tạm tính · 3 sản phẩm</span>
                  <span className="font-medium text-[#2B2118]">161.000đ</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B5E53]">
                  <span>Ưu đãi CHAO10 · 10%</span>
                  <span className="font-medium text-[#D9534F]">-16.100đ</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B5E53]">
                  <span>Điểm thưởng sử dụng</span>
                  <span className="font-medium text-[#2B2118]">0đ</span>
                </div>

                <div className="border-t border-[#F5F2EC] pt-4 flex justify-between items-center">
                  <span className="font-bold text-[#2B2118]">Tổng cộng</span>
                  <span className="font-bold text-xl text-[#2B2118]">
                    144.900đ
                  </span>
                </div>

                <p className="text-[11px] text-[#8C7A6B] leading-relaxed">
                  Đã bao gồm thuế. Nhận tại cửa hàng, không có phí giao hàng.
                  <br />
                  Thanh toán an toàn · Không dùng tiền mặt
                </p>
              </div>

              {/* Thông báo điểm thưởng */}
              <div className="bg-[#EAF5ED] border border-[#CDEAD2] rounded-xl p-4 flex items-center gap-3">
                <div className="text-[#2E7D32]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#2E7D32]">
                  Bạn sẽ nhận 14 điểm khi đơn hoàn thành.
                </span>
              </div>

              {/* Các nút bấm hành động */}
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#6F4E37] text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-sm">
                  Theo dõi đơn
                </button>
                <button className="w-full bg-white border border-[#E0D6CC] text-[#2B2118] py-3 rounded-xl font-semibold hover:bg-[#FAF8F5] transition-all">
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <div className="w-full bg-[#2B2118] flex justify-center text-[#F5EBDD]">
        <footer className="w-[1440px] px-[80px] py-[48px] flex flex-col gap-8">
          <div>
            <a
              href="/"
              className="text-[#F5EBDD] text-[28px] font-bold font-['Inter'] tracking-tighter"
            >
              BrewLite
            </a>
          </div>

          <div className="flex justify-between items-start text-[13px] leading-[190%] font-normal border-b border-[#F5EBDD]/20 pb-8">
            <div className="flex flex-col">
              <h3 className="font-bold text-[16px]">
                Một ly ngon, một ngày nhẹ nhàng.
              </h3>
              <p>28 Nguyễn Huệ, Bến Nghé, TP. Hồ Chí Minh</p>
              <p>Mở cửa mỗi ngày · 07:00 – 22:00</p>
              <p>Hotline: 1900 1042 · hello@brewlite.vn</p>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-[16px]">Khám phá BrewLite</h3>
              <a href="/menu" className="hover:text-white transition-colors">
                Thực đơn · Khuyến mãi · Về chúng tôi
              </a>
              <a href="/contact" className="hover:text-white transition-colors">
                Liên hệ · Lịch sử đơn hàng
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Facebook · Instagram · YouTube
              </a>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-[16px]">Luôn bên bạn</h3>
              <a href="#" className="hover:text-white transition-colors">
                Hướng dẫn đặt hàng · Câu hỏi thường gặp
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản sử dụng · Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Thanh toán an toàn, không tiền mặt
              </a>
            </div>
          </div>

          <div className="text-[14px] font-normal leading-[190%]">
            © 2026 BrewLite. Cà phê thật ngon, thanh toán thật gọn.
          </div>
        </footer>
      </div>
    </div>
  );
}
