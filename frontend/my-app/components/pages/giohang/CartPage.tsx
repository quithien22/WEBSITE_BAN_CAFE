'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    totalPrice,
  } = useCart();

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900">Giỏ hàng của bạn</h1>
          <p className="text-stone-500 mt-1">
            Bạn đang có <span className="font-semibold text-amber-900">{items.length} món</span> trong giỏ
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-200">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-800">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-stone-500 mb-6">Hãy chọn thêm vài ly cafe thơm ngon nhé!</p>
            <Link
              href="/thuc-don"
              className="inline-flex items-center px-6 py-3 bg-amber-900 hover:bg-amber-800 text-white font-medium rounded-xl transition shadow-sm"
            >
              Xem thực đơn ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center gap-4 transition hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-stone-800 text-lg">{item.name}</h3>
                    <p className="text-sm font-medium text-stone-600 mt-0.5">
                      {item.sizeName}
                    </p>
                    {item.toppings && item.toppings.length > 0 && (
                      <p className="text-xs text-amber-900/80 mt-1">
                        <span className="font-semibold">Topping:</span>{' '}
                        {item.toppings.map((t) => t.name).join(', ')}
                      </p>
                    )}
                    <span className="font-semibold text-amber-900 inline-block mt-1">
                      {item.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  {/* Tăng / giảm số lượng */}
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-semibold text-stone-800 min-w-[2.5rem] text-center bg-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Thành tiền và nút Xóa */}
                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <p className="font-bold text-stone-900">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-red-500 transition p-1"
                      title="Xóa món này"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-6">
                <h2 className="text-xl font-bold text-stone-900 mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 border-b border-stone-100 pb-4 mb-4 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Tạm tính</span>
                    <span className="font-medium text-stone-900">
                      {subtotal.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-stone-900">
                      {shippingFee.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-stone-900">Tổng cộng</span>
                  <span className="text-2xl font-black text-amber-900">
                    {totalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <Link
                  href="/thanh-toan"
                  className="w-full block text-center py-3.5 px-4 bg-amber-900 hover:bg-amber-800 text-white font-semibold rounded-xl transition duration-200 shadow-md hover:shadow-lg"
                >
                  Tiến hành thanh toán
                </Link>

                <div className="mt-4 text-center">
                  <Link
                    href="/thuc-don"
                    className="text-sm font-medium text-stone-500 hover:text-amber-900 transition"
                  >
                    ← Tiếp tục chọn món
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}