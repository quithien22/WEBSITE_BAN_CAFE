"use client";
import React, { useMemo, useState } from 'react';
import { categories, items } from '../data_test/data'; 
import Link from 'next/link';


const money = (v: number) => `${v.toLocaleString('vi-VN')}đ`;

function SearchIcon({ size = 19 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="7" /><path d="m16 16 5 5" /></svg>;
}

export default function MenuPage() {
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  // Lọc dữ liệu hiển thị
  const filtered = useMemo(() => {
    let result = items.filter((p) =>
      (category === 'Tất cả' || p.category === category) &&
      (p.name + ' ' + p.description).toLowerCase().includes(search.trim().toLowerCase()) &&
      (!vegetarianOnly || p.vegetarian) &&
      (priceRange === 'all' || (priceRange === 'under50' ? p.price < 50000 : priceRange === '50to55' ? p.price >= 50000 && p.price <= 55000 : p.price > 55000))
    );
    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    return result;
  }, [category, search, sort, priceRange, vegetarianOnly]);

  const reset = () => { setCategory('Tất cả'); setSearch(''); setPriceRange('all'); setSort('featured'); setVegetarianOnly(false); };

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#2D241E]">
      <main id="top" className="mx-auto max-w-[1256px] px-5 pb-[46px] pt-[47px] xl:px-0">
        <section id="menu">
          <p className="text-[13px] font-semibold tracking-[0.02em] text-[#6F4E37]">Pha mới mỗi ngày</p>
          <h1 className="mt-3 text-[40px] font-extrabold leading-[1.18] tracking-[-1.2px] md:text-[48px]">Chọn vị cho ngày của bạn</h1>
          <p className="mt-3 text-[17px] text-[#817367]">Cà phê đậm đà, trà thanh mát và những chiếc bánh vừa ra lò.</p>

          <div className="mt-[34px] flex flex-wrap gap-3 md:gap-4">
            {categories.map((c) => (
              <button 
                key={c} 
                onClick={() => setCategory(c)} 
                className={`h-[48px] rounded-xl px-6 text-[15px] font-semibold transition-colors ${category === c ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#6F4E37] hover:bg-[#F2E7DC]'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-[37px] grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_270px_220px] md:items-end">
            <label className="block">
              <span className="mb-3 block text-[14px] font-semibold">Tìm món bạn yêu thích</span>
              <span className="flex h-[56px] items-center rounded-xl border border-[#E5D9CE] bg-white px-5 focus-within:border-[#6F4E37]">
                <input 
                  id="menu-search" 
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#948478]" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Tìm cà phê, trà, bánh..." 
                />
                <span className="text-[#997D6B]"><SearchIcon /></span>
              </span>
            </label>
            <label className="block">
              <span className="mb-3 block text-[14px] font-semibold">Sắp xếp</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-[56px] w-full appearance-none rounded-xl border border-[#E5D9CE] bg-white px-4 text-[14px] text-[#59483C] outline-none focus:border-[#6F4E37]">
                <option value="featured">Bán chạy nhất</option>
                <option value="low">Giá thấp đến cao</option>
                <option value="high">Giá cao đến thấp</option>
                <option value="name">Tên A đến Z</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-3 block text-[14px] font-semibold">Khoảng giá</span>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="h-[56px] w-full rounded-xl border border-[#E5D9CE] bg-white px-4 text-[14px] text-[#59483C] outline-none focus:border-[#6F4E37]">
                <option value="all">Tất cả mức giá</option>
                <option value="under50">Dưới 50.000đ</option>
                <option value="50to55">50.000đ – 55.000đ</option>
                <option value="over55">Trên 55.000đ</option>
              </select>
            </label>
          </div>

          <div className="mt-[35px] flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] text-[#817367]">{filtered.length} món đang có sẵn</p>
            <span className="rounded-full bg-[#E4F5E8] px-4 py-2 text-[12px] font-semibold text-[#247A4B]">Pha mới khi bạn đặt</span>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map(p => (
                <article key={p.id} className="overflow-hidden rounded-2xl border border-[#EAE0D7] bg-white p-[14px] shadow-[0_9px_20px_rgba(75,49,30,0.06)]">
                  <img className="h-[218px] w-full rounded-xl object-cover" src={`/images/menu/${p.image}`} alt={p.name} />
                  <h2 className="mt-[16px] text-[18px] font-bold leading-6">{p.name}</h2>
                  <p className="mt-1 min-h-[38px] text-[13px] leading-[19px] text-[#8B7A70]">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <strong className="text-[16px] text-[#6F4E37]">{money(p.price)}</strong>
                    <Link href = "/thanh-toan">
                         <button aria-label={`Thêm ${p.name} vào giỏ`} className="flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#F6EBDD] text-[23px] font-light text-[#916F54] transition hover:bg-[#E6D2BF] cursor-pointer">+</button>
                    </Link>
                    
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex min-h-[315px] flex-col items-center justify-center rounded-2xl border border-[#EAE0D7] bg-white text-center">
              <span className="text-4xl text-[#9C7B62]">⌕</span>
              <h2 className="mt-4 text-[22px] font-bold">Không tìm thấy sản phẩm</h2>
              <p className="mt-2 text-[#817367]">Thử từ khóa khác hoặc bỏ bộ lọc để khám phá thêm món ngon.</p>
              <button onClick={reset} className="mt-5 rounded-lg bg-[#6F4E37] px-5 py-3 font-semibold text-white">Xóa bộ lọc</button>
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#55453A]">
              <input type="checkbox" checked={vegetarianOnly} onChange={(e) => setVegetarianOnly(e.target.checked)} className="h-[17px] w-[17px] accent-[#6F4E37]" /> Chỉ hiển thị món chay
            </label>
            <div className="flex items-center gap-3">
              <button onClick={() => setSort('low')} className={`rounded-lg border px-5 py-3 text-[13px] font-semibold ${sort === 'low' ? 'border-[#6F4E37] text-[#6F4E37]' : 'border-transparent text-[#6F4E37]'}`}>Giá thấp đến cao</button>
              <button onClick={() => setSort('high')} className={`rounded-lg border px-5 py-3 text-[13px] font-semibold ${sort === 'high' ? 'border-[#6F4E37] text-[#6F4E37]' : 'border-transparent text-[#6F4E37]'}`}>Giá cao đến thấp</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}