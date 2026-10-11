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
          
          {/* Banner Thông báo Lỗi thanh toán / Chưa thể hoàn tất thanh toán */}
          <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-10 flex flex-col items-center text-center gap-3">
            {/* Icon thẻ ngân hàng bị lỗi / dấu X */}
            <div className="relative w-24 h-24 bg-[#FCE8E6] rounded-full flex items-center justify-center text-[#D9534F] mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              {/* Badge dấu X nhỏ góc dưới icon */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#D9534F] shadow-sm border border-[#FCE8E6]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#D9534F] tracking-wider uppercase bg-[#FCE8E6] px-3 py-1 rounded-full">
              Thanh toán thất bại
            </span>
            <h1 className="text-3xl font-bold text-[#2B2118]">
              Chưa thể hoàn tất thanh toán
            </h1>
            <p className="text-[#6B5E53] text-sm max-w-lg">
              Giao dịch chưa được xác nhận hoặc đã hết thời gian chờ. Đừng lo, giỏ hàng của bạn vẫn được giữ lại.
            </p>
          </div>

          {/* Grid 2 cột: Thông tin giao dịch & Tóm tắt đơn hàng */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Cột trái (8 phần): Thông tin giao dịch & Các nút Thử lại / Đổi phương thức */}
            <div className="col-span-8 flex flex-col gap-6">
              
              {/* Box Thông tin giao dịch */}
              <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
                <h3 className="font-bold text-lg text-[#2B2118]">
                  Thông tin giao dịch
                </h3>

                <p className="text-sm text-[#6B5E53]">
                  Mã đơn dự kiến: <span className="font-bold text-[#2B2118]">#1042</span> &nbsp;·&nbsp; Phương thức: <span className="font-bold text-[#2B2118]">MoMo</span> &nbsp;·&nbsp; Thời gian: <span className="font-medium text-[#6B5E53]">09/10/2026 · 09:30</span> &nbsp;·&nbsp; Số tiền: <span className="font-bold text-[#2B2118]">144.900đ</span>
                </p>

                {/* Cảnh báo lỗi */}
                <div className="bg-[#FCE8E6] border border-[#F5C6CB] text-[#721C24] p-3.5 rounded-xl text-xs flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D9534F] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Đơn chưa được thanh toán, cửa hàng chưa bắt đầu pha chế.</span>
                </div>

                <p className="text-xs text-[#8C7A6B]">
                  Nếu tài khoản đã bị trừ tiền, vui lòng không thanh toán lại. Liên hệ <span className="font-semibold text-[#2B2118]">1900 1042</span> để chúng mình kiểm tra và hỗ trợ.
                </p>

                {/* Các nút bấm thao tác giao dịch */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button className="bg-[#6F4E37] text-white py-3 px-6 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-sm flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Thử lại
                  </button>
                  <button className="bg-white border border-[#E0D6CC] text-[#2B2118] py-3 px-6 rounded-xl font-semibold hover:bg-[#FAF8F5] transition-all flex items-center justify-center">
                    Đổi phương thức
                  </button>
                </div>

                <div className="text-center mt-1">
                  <a href="/cart" className="text-xs font-semibold text-[#6F4E37] hover:underline">
                    Quay lại giỏ hàng
                  </a>
                </div>
              </div>

            </div>

            {/* Cột phải (4 phần): Tóm tắt đơn hàng */}
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