import React from 'react';

export default function Footer() {
  return (
    <div className="w-full bg-[#2B2118] flex justify-center font-sans">
      
      {/* Container giới hạn chiều rộng 1440px và padding theo thiết kế (px-20 py-12) */}
      <footer className="w-[1440px] px-[80px] py-[48px] flex flex-col gap-8">
        
        {/* Phần Logo BrewLite */}
        <div>
          <a href="/" className="text-[#F5EBDD] text-[28px] font-bold font-['Inter'] tracking-tighter">
            BrewLite
          </a>
        </div>

        {/* Phần Nội dung chính (chia 3 cột) */}
        <div className="flex justify-between items-start text-[#F5EBDD] text-[13px] leading-[190%] font-['Inter'] font-normal border-b border-[#F5EBDD]/20 pb-8">
          
          {/* Cột 1: Thông tin liên hệ */}
          <div className="flex flex-col">
            <h3 className="font-bold text-[16px]">Một ly ngon, một ngày nhẹ nhàng.</h3>
            <p>Mở cửa mỗi ngày · 07:00 – 22:00</p>
            <p>Hotline: 1900 1042 · hello@brewlite.vn</p>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="flex flex-col">
            <h3 className="font-bold text-[16px]">Khám phá BrewLite</h3>
            <a href="/menu" className="hover:text-white transition-colors">Thực đơn · Khuyến mãi · Về chúng tôi</a>
            <a href="/contact" className="hover:text-white transition-colors">Liên hệ · Lịch sử đơn hàng</a>
            <a href="#" className="hover:text-white transition-colors">Facebook · Instagram · YouTube</a>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="flex flex-col">
            <h3 className="font-bold text-[16px]">Luôn bên bạn</h3>
            <a href="#" className="hover:text-white transition-colors">Hướng dẫn đặt hàng · Câu hỏi thường gặp</a>
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng · Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Thanh toán an toàn, không tiền mặt</a>
          </div>

        </div>

        {/* Phần Copyright */}
        <div className="text-[#F5EBDD] text-[16px] font-['Inter'] font-normal leading-[190%]">
          © 2026 BrewLite. Cà phê thật ngon, thanh toán thật gọn.
        </div>
        
      </footer>
    </div>
  );
}