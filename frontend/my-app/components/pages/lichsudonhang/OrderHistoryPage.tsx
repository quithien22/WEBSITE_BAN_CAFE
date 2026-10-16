'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, ChevronDown, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

type StatusType = 
  | 'preparing' 
  | 'pending_payment' 
  | 'paid' 
  | 'ready' 
  | 'completed' 
  | 'cancelled' 
  | 'failed';

interface OrderRecord {
  id: string;
  createdAt: string;
  total: string;
  status: StatusType;
  statusText: string;
}

const ORDERS_DATA: OrderRecord[] = [
  { id: '#1042', createdAt: '09/10/2026 · 09:30', total: '144.900đ', status: 'preparing', statusText: 'Đang pha chế' },
  { id: '#1041', createdAt: '08/10/2026 · 15:12', total: '55.000đ', status: 'pending_payment', statusText: 'Chờ thanh toán' },
  { id: '#1040', createdAt: '07/10/2026 · 08:45', total: '90.000đ', status: 'paid', statusText: 'Đã thanh toán' },
  { id: '#1039', createdAt: '06/10/2026 · 12:20', total: '84.000đ', status: 'ready', statusText: 'Sẵn sàng' },
  { id: '#1038', createdAt: '05/10/2026 · 09:15', total: '110.000đ', status: 'completed', statusText: 'Hoàn thành' },
  { id: '#1037', createdAt: '03/10/2026 · 16:30', total: '45.000đ', status: 'cancelled', statusText: 'Đã hủy' },
  { id: '#1036', createdAt: '01/10/2026 · 10:05', total: '49.000đ', status: 'failed', statusText: 'Thanh toán thất bại' },
];

function StatusBadge({ status, text }: { status: StatusType; text: string }) {
  const styles: Record<StatusType, string> = {
    preparing: 'bg-[#FDF3E7] text-[#D97706]',
    pending_payment: 'bg-[#FEF3C7] text-[#B45309]',
    paid: 'bg-[#E8F5EC] text-[#287346]',
    ready: 'bg-[#E0F2FE] text-[#0369A1]',
    completed: 'bg-[#E8F5EC] text-[#287346]',
    cancelled: 'bg-[#F3F4F6] text-[#6B7280]',
    failed: 'bg-[#FEE2E2] text-[#DC2626]',
  };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {text}
    </span>
  );
}

export default function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#2B2118]">
      <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 lg:px-20 space-y-10">
        
        {/* TIÊU ĐỀ TRANG */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B2118]">Những lần ghé BrewLite</h1>
          <p className="mt-2 text-sm text-[#74665B]">
            Theo dõi đơn đang chuẩn bị hoặc đặt lại hương vị quen thuộc.
          </p>
        </div>

        {/* BỘ LỌC ĐƠN HÀNG */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          
          {/* Lọc Trạng thái */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#2B2118]">Trạng thái</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border border-[#E5D9CD] bg-white p-3.5 pr-10 text-sm outline-none focus:border-[#6F4E37]">
                <option>Tất cả trạng thái</option>
                <option>Đang pha chế</option>
                <option>Hoàn thành</option>
                <option>Đã hủy</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-3.5 text-[#74665B]" size={18} />
            </div>
          </div>

          {/* Lọc Khoảng thời gian */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#2B2118]">Khoảng thời gian</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value="Tháng 10/2026"
                className="w-full rounded-xl border border-[#E5D9CD] bg-white p-3.5 pr-10 text-sm outline-none cursor-pointer"
              />
              <Calendar className="absolute right-3.5 top-3.5 text-[#74665B]" size={18} />
            </div>
          </div>

          {/* Ô Tìm kiếm đơn */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#2B2118]">Tìm đơn</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#E5D9CD] bg-white p-3.5 pr-10 text-sm outline-none focus:border-[#6F4E37]"
              />
              <Search className="absolute right-3.5 top-3.5 text-[#74665B]" size={18} />
            </div>
          </div>

        </div>

        {/* BẢNG LỊCH SỬ ĐƠN HÀNG */}
        <div className="overflow-hidden rounded-2xl border border-[#E5D9CD] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5EBDD]/50 border-b border-[#E5D9CD] text-xs font-bold text-[#74665B]">
                <tr>
                  <th className="py-4 px-6">Mã đơn</th>
                  <th className="py-4 px-6">Ngày đặt</th>
                  <th className="py-4 px-6">Tổng tiền</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D9CD]">
                {ORDERS_DATA.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FCFAF7]/80 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-[#2B2118]">{order.id}</td>
                    <td className="py-4 px-6 text-xs text-[#74665B]">{order.createdAt}</td>
                    <td className="py-4 px-6 font-bold text-[#2B2118]">{order.total}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} text={order.statusText} />
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link
                        href="/chi-tiet-don-hang"
                        className="inline-block rounded-xl border border-[#2B2118]/20 bg-white px-4 py-2 text-xs font-bold text-[#2B2118] transition-colors hover:bg-[#F5EBDD]"
                      >
                        Xem chi tiết
                      </Link>
                      <button className="text-xs font-bold text-[#6F4E37] hover:underline">
                        Đặt lại
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thanh phân trang dưới bảng */}
          <div className="flex items-center justify-between border-t border-[#E5D9CD] px-6 py-4 text-xs text-[#74665B]">
            <span>Hiển thị 7 / 7 đơn hàng</span>
            <div className="flex items-center gap-2">
              <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5D9CD] bg-gray-100 text-gray-400 cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5EBDD] font-bold text-[#6F4E37]">
                1
              </span>
              <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5D9CD] bg-gray-100 text-gray-400 cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* CÁC TRẠNG THÁI HIỂN THỊ (MINH HỌA TRẠNG THÁI RỖNG CHUẨN FIGMA) */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#2B2118]">Các trạng thái hiển thị</h2>
          
          <div className="rounded-2xl border border-dashed border-[#E5D9CD] bg-[#F5EBDD]/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-[#74665B]">
              <FileText size={36} strokeWidth={1.2} />
            </div>
            <h3 className="text-xl font-bold text-[#2B2118]">Chưa có đơn hàng nào</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#74665B]">
              Ly cà phê đầu tiên của bạn đang chờ. Đặt một món ngon và bắt đầu tích điểm nhé.
            </p>
            <Link
              href="/thuc-don"
              className="mt-6 inline-block rounded-xl bg-[#6F4E37] px-6 py-3 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              Khám phá thực đơn
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}