'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../giohang/CartContext';
import { api } from '@/lib/api';

// Định nghĩa kiểu dữ liệu từ Backend
interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    imageUrl: string;
    stock: number;
    isFeatured: boolean;
    isActive: boolean;
}

interface Topping {
    id: number;
    name: string;
    price: number;
    isActive: boolean;
}

interface SizeOption {
    id: string;
    name: string;
    extraPrice: number;
}

const DEFAULT_SIZES: SizeOption[] = [
    { id: 'S', name: 'Size S (Nhỏ)', extraPrice: 0 },
    { id: 'M', name: 'Size M (Vừa)', extraPrice: 6000 },
    { id: 'L', name: 'Size L (Lớn)', extraPrice: 12000 },
];

export default function MenuPage() {
    const { addToCart } = useCart();

    // Dữ liệu từ API
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['Tất cả']);
    const [toppingsList, setToppingsList] = useState<Topping[]>([]);

    // Trạng thái bộ lọc & tải trang
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Quản lý Modal chi tiết món
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('S');
    const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);

    // 1. Tải danh mục và danh sách Toppings từ Backend khi trang tải lần đầu
    useEffect(() => {
        let isMounted = true;
        async function fetchInitialData() {
            try {
                const [cats, tops] = await Promise.all([
                    api<string[]>('/products/categories').catch(() => []),
                    api<Topping[]>('/toppings').catch(() => []),
                ]);

                if (isMounted) {
                    if (cats && cats.length > 0) {
                        setCategories(['Tất cả', ...cats]);
                    }
                    if (tops && tops.length > 0) {
                        setToppingsList(tops);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi tải danh mục hoặc topping:', err);
            }
        }

        fetchInitialData();
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Tải danh sách sản phẩm theo danh mục đang chọn từ API /api/products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const query = selectedCategory !== 'Tất cả'
                ? `?category=${encodeURIComponent(selectedCategory)}&limit=100`
                : '?limit=100';

            const res = await api<{ items: Product[]; total: number }>(`/products${query}`);
            setProducts(res.items || []);
        } catch (err: any) {
            console.error('Lỗi khi tải danh sách sản phẩm:', err);
            setError(err.message || 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Mở modal khi bấm vào món
    const handleOpenModal = (item: Product) => {
        if (item.stock <= 0) return; // Không cho mở modal nếu đã hết hàng
        setSelectedProduct(item);
        setSelectedSize('S');
        setSelectedToppings([]);
        setQuantity(1);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    // Toggle topping trong modal
    const handleToggleTopping = (toppingId: number) => {
        setSelectedToppings((prev) =>
            prev.includes(toppingId)
                ? prev.filter((id) => id !== toppingId)
                : [...prev, toppingId]
        );
    };

    // Tính tiền cho món đang mở trong modal
    const currentSizeObj = DEFAULT_SIZES.find((s) => s.id === selectedSize) || DEFAULT_SIZES[0];
    const sizeExtra = currentSizeObj?.extraPrice || 0;
    const toppingsTotal = selectedToppings.reduce((total, id) => {
        const t = toppingsList.find((item) => item.id === id);
        return total + (t?.price || 0);
    }, 0);
    const unitPrice = (selectedProduct?.price || 0) + sizeExtra + toppingsTotal;
    const totalPrice = unitPrice * quantity;

    // Thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!selectedProduct) return;

        const chosenToppings = selectedToppings
            .map((id) => toppingsList.find((t) => t.id === id))
            .filter(Boolean)
            .map((t) => ({
                id: String(t!.id),
                name: t!.name,
                price: t!.price,
            }));

        addToCart({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            image: selectedProduct.imageUrl,
            sizeId: selectedSize,
            sizeName: currentSizeObj ? currentSizeObj.name : 'Mặc định',
            toppings: chosenToppings,
            price: unitPrice,
            quantity: quantity,
        });

        handleCloseModal();
    };

    return (
        <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Tiêu đề trang */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold text-[#53382c] tracking-wide mb-3">
                        Thực Đơn Cà Phê
                    </h1>
                    <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
                        Thưởng thức hương vị nguyên bản từ những hạt cà phê rang mộc tuyển chọn.
                    </p>
                </div>

                {/* Thanh chọn danh mục (Tabs) */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-[#53382c] text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-[#eae3d8] border border-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Trạng thái Đang tải (Skeleton / Loading) */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                                <div className="h-48 bg-gray-200 w-full" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                    <div className="h-5 bg-gray-200 rounded w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Trạng thái Lỗi */}
                {!loading && error && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
                        <p className="text-red-500 font-medium mb-3">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-5 py-2 bg-[#53382c] hover:bg-[#3d2920] text-white text-sm rounded-xl font-medium transition-colors shadow-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Trạng thái Không có sản phẩm */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
                        <p className="text-gray-500 text-sm sm:text-base">
                            Hiện chưa có món nào trong danh mục này.
                        </p>
                    </div>
                )}

                {/* Danh sách món ăn (Grid Cards) */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((item) => {
                            const isOutOfStock = item.stock <= 0;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleOpenModal(item)}
                                    className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col group ${
                                        isOutOfStock
                                            ? 'opacity-70 cursor-not-allowed'
                                            : 'cursor-pointer hover:-translate-y-1'
                                    }`}
                                >
                                    {/* Ảnh món */}
                                    <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {item.isFeatured && (
                                            <span className="absolute top-2.5 left-2.5 bg-[#53382c] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                                                Nổi bật
                                            </span>
                                        )}
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Hết hàng
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#53382c] transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {item.description || 'Hương vị thơm ngon đậm đà đặc trưng.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                            <span className="font-bold text-[#53382c] text-base">
                                                {item.price.toLocaleString('vi-VN')}đ
                                            </span>

                                            {/* Nút bấm xem & chọn món */}
                                            <button
                                                type="button"
                                                disabled={isOutOfStock}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenModal(item);
                                                }}
                                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shadow-sm ${
                                                    isOutOfStock
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#53382c] hover:bg-[#3d2920] text-white'
                                                }`}
                                            >
                                                <span>{isOutOfStock ? 'Hết' : '+'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* MODAL POPUP CHI TIẾT MÓN (HIỆN TRỰC TIẾP TRÊN TRANG MENU) */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Nút đóng X */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                            ✕
                        </button>

                        {/* Chi tiết sản phẩm trong Modal */}
                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                                {/* Ảnh món */}
                                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
                                    <img
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Thông tin món */}
                                <div>
                                    <span className="text-xs font-semibold px-3 py-1 bg-[#F5EDE6] text-[#6F4E37] rounded-full">
                                        {selectedProduct.category}
                                    </span>
                                    <h2 className="text-2xl font-bold text-[#2B2118] mt-2 mb-1">
                                        {selectedProduct.name}
                                    </h2>
                                    <p className="text-xl font-bold text-[#6F4E37] mb-2">
                                        {selectedProduct.price.toLocaleString('vi-VN')}đ
                                    </p>
                                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                        {selectedProduct.description || 'Thức uống được pha chế tươi ngon mỗi ngày.'}
                                    </p>
                                    <div className="mt-3 text-xs text-gray-400">
                                        Tồn kho: <span className="font-medium text-gray-700">{selectedProduct.stock}</span> ly
                                    </div>
                                </div>
                            </div>

                            {/* Tùy chọn Size */}
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                                    Chọn Size:
                                </label>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {DEFAULT_SIZES.map((size) => {
                                        const isSelected = selectedSize === size.id;
                                        return (
                                            <button
                                                key={size.id}
                                                type="button"
                                                onClick={() => setSelectedSize(size.id)}
                                                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                                    isSelected
                                                        ? 'border-[#53382c] bg-[#53382c] text-white shadow-sm'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="text-xs sm:text-sm font-medium">{size.name}</div>
                                                <div className={`text-[11px] ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                                                    {size.extraPrice === 0 ? 'Mặc định' : `+${size.extraPrice.toLocaleString('vi-VN')}đ`}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tùy chọn Topping tải từ Backend */}
                            {toppingsList.length > 0 && (
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                                        Thêm Topping:
                                    </label>
                                    <div className="space-y-2">
                                        {toppingsList.map((topping) => {
                                            const isChecked = selectedToppings.includes(topping.id);
                                            return (
                                                <label
                                                    key={topping.id}
                                                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                                        isChecked
                                                            ? 'border-[#6F4E37] bg-[#FDF9F5]'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleTopping(topping.id)}
                                                            className="w-4 h-4 accent-[#53382c] rounded cursor-pointer"
                                                        />
                                                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                                                            {topping.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-semibold text-[#6F4E37]">
                                                        +{topping.price.toLocaleString('vi-VN')}đ
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Số lượng và Nút mua */}
                            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                    <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 text-sm font-semibold">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((prev) => Math.min(selectedProduct.stock, prev + 1))}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="w-full sm:flex-1 py-3 bg-[#53382c] hover:bg-[#3d2920] text-white font-medium rounded-xl transition-all shadow-sm text-sm sm:text-base"
                                >
                                    Thêm vào giỏ hàng • {totalPrice.toLocaleString('vi-VN')}đ
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}