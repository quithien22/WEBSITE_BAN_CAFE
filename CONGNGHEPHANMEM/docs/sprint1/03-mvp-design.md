# Task 4.3 – Thiết kế MVP Sprint 1: Xem menu

| Mục | Nội dung |
|---|---|
| Tài liệu | Assignment 2 – Task 4.3 (thiết kế) |
| Phiên bản | 1.0 – 17/10/2026 |
| Căn cứ | SRS: FR-06, FR-07, FR-08 (phần API), FR-09, NFR-01, NFR-05, NFR-09, NFR-11, NFR-16, NFR-17 |
| Nguyên tắc | Đây là **hợp đồng thiết kế**. Web và API phải khớp tài liệu này, không ngược lại |

---

## 1. Phạm vi Sprint 1

| Có trong Sprint 1 | Để Sprint 2 |
|---|---|
| `GET /products` (kèm `search`, `category`) | Trang chi tiết sản phẩm và chọn tùy chọn trên giao diện |
| `GET /products/:id` (API, kèm `options`) | Giỏ hàng, đăng nhập, đặt đơn, thanh toán |
| `GET /health` | `featured` filter, PWA |
| Màn hình `/menu` mobile-first: loading, empty, error | Click vào thẻ sản phẩm để mở chi tiết |
| Migration + seed, PostgreSQL qua Docker Compose | |
| Test API và test component, CI | |

## 2. Kiến trúc Sprint 1

```
Trình duyệt (điện thoại)
        │  HTTP  (NEXT_PUBLIC_API_URL)
        ▼
 Next.js  apps/web  :3000   ── fetch ──►  NestJS  apps/api  :4000
                                              │  Prisma
                                              ▼
                                        PostgreSQL :5432 (Docker, volume)
```

Luồng: người dùng mở `/menu` → hook `useProducts` gọi `GET /products` → API đọc bảng `Product` (chỉ `isActive = true`) → trả mảng JSON → giao diện render thẻ sản phẩm.

---

## 3. Mô hình dữ liệu (Sprint 1)

### 3.1 Prisma schema

```prisma
model Product {
  id          String   @id @default(uuid()) @db.Uuid
  name        String   @unique @db.VarChar(120)
  description String   @default("") @db.VarChar(500)
  category    String   @db.VarChar(50)
  price       Int                       // VND, số nguyên >= 0
  imageUrl    String?  @db.VarChar(300)
  stock       Int      @default(0)      // >= 0
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  version     Int      @default(0)      // khóa lạc quan, dùng từ Sprint 2
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive, category])
}

model Topping {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @unique @db.VarChar(80)
  price     Int                          // VND >= 0
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

### 3.2 Ràng buộc ở mức database (viết trong file migration SQL)

```sql
ALTER TABLE "Product" ADD CONSTRAINT product_price_nonneg CHECK (price >= 0);
ALTER TABLE "Product" ADD CONSTRAINT product_stock_nonneg CHECK (stock >= 0);
ALTER TABLE "Topping" ADD CONSTRAINT topping_price_nonneg CHECK (price >= 0);
```

Lý do: tồn kho không bao giờ âm kể cả khi code lỗi (NFR-08).

### 3.3 Hằng số tùy chọn (trong code API, không lưu database)

| Hằng số | Giá trị |
|---|---|
| Size | `S` (+0 đ), `M` (+6.000 đ), `L` (+12.000 đ) |
| Mức đường | `0`, `30`, `50`, `70`, `100` (%) |
| Mức đá | `NONE` (Không đá), `LESS` (Ít đá), `NORMAL` (Đá bình thường) |

Đặt tại `apps/api/src/products/product-options.ts`; Sprint 2 dùng lại chính file này để tính giá đơn hàng.

---

## 4. API contract

Quy ước chung: JSON, UTF-8; tiền là **số nguyên VND**; id là **UUID**; không cần JWT cho các endpoint ở tài liệu này; thông báo lỗi bằng tiếng Việt.

### 4.1 `GET /products`

| Tham số query | Kiểu | Bắt buộc | Quy tắc |
|---|---|---|---|
| `search` | string | không | Cắt khoảng trắng hai đầu; rỗng coi như không có; tối đa 100 ký tự; so khớp **chứa**, không phân biệt hoa thường |
| `category` | string | không | Khớp **chính xác** với giá trị `category`; tối đa 50 ký tự |

Khi có cả hai thì áp dụng đồng thời (AND). Tham số lạ bị từ chối (400).

**200 OK** – mảng `ProductSummary`, sắp xếp theo `name` tăng dần:

```json
[
  {
    "id": "6f1c1d1e-7f56-4f0e-9b87-1d6f2f5e0a11",
    "name": "Cà phê sữa đá",
    "description": "Cà phê phin đậm vị, sữa đặc.",
    "category": "Cà phê",
    "price": 29000,
    "imageUrl": "/images/products/ca-phe-sua-da.webp",
    "inStock": true,
    "isFeatured": true
  }
]
```

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | string (UUID) | |
| `name` | string | |
| `description` | string | Có thể rỗng |
| `category` | string | |
| `price` | integer | Giá cơ bản (size S, chưa topping) |
| `imageUrl` | string hoặc null | Đường dẫn tương đối trong `apps/web/public` hoặc URL đầy đủ |
| `inStock` | boolean | `stock > 0` |
| `isFeatured` | boolean | |

**Không** trả: `stock` (số lượng chính xác), `isActive`, `version`, `createdAt`, `updatedAt`.

| Tình huống | Kết quả |
|---|---|
| Không có sản phẩm khớp | `200` và `[]` |
| `search` dài hơn 100 ký tự | `400` |
| Tham số không được khai báo | `400` |
| Lỗi database | `500` thông báo chung, không lộ chi tiết |

Chỉ trả sản phẩm `isActive = true`.

### 4.2 `GET /products/:id`

**200 OK** – `ProductDetail` = `ProductSummary` cộng `options`:

```json
{
  "id": "6f1c1d1e-7f56-4f0e-9b87-1d6f2f5e0a11",
  "name": "Cà phê sữa đá",
  "description": "Cà phê phin đậm vị, sữa đặc.",
  "category": "Cà phê",
  "price": 29000,
  "imageUrl": "/images/products/ca-phe-sua-da.webp",
  "inStock": true,
  "isFeatured": true,
  "options": {
    "sizes": [
      { "code": "S", "label": "Size S", "extraPrice": 0 },
      { "code": "M", "label": "Size M", "extraPrice": 6000 },
      { "code": "L", "label": "Size L", "extraPrice": 12000 }
    ],
    "toppings": [
      { "id": "a3b8…", "name": "Trân châu đen", "price": 7000 }
    ],
    "sugarLevels": [0, 30, 50, 70, 100],
    "iceLevels": [
      { "code": "NONE", "label": "Không đá" },
      { "code": "LESS", "label": "Ít đá" },
      { "code": "NORMAL", "label": "Đá bình thường" }
    ]
  }
}
```

`options.toppings` chỉ gồm topping `isActive = true`, sắp xếp theo `name`.

| Tình huống | Kết quả |
|---|---|
| Id không tồn tại hoặc sản phẩm đã ẩn | `404` `"Không tìm thấy sản phẩm"` |
| Id không đúng định dạng UUID | `400` `"Mã sản phẩm không hợp lệ"` |

### 4.3 `GET /health`

| Tình huống | HTTP | Body |
|---|---|---|
| Ứng dụng và database bình thường | `200` | `{"status":"ok","timestamp":"…","uptimeSeconds":123,"checks":{"database":"up"}}` |
| Database không kết nối được (quá 2 giây) | `503` | `{"status":"error","timestamp":"…","checks":{"database":"down"}}` |

Kiểm tra database bằng truy vấn `SELECT 1`. Dùng cho Docker healthcheck, smoke test sau deploy (Task 5) và CI.

### 4.4 Định dạng lỗi chung

```json
{ "statusCode": 404, "message": "Không tìm thấy sản phẩm", "error": "Not Found" }
```

`message` có thể là mảng chuỗi khi lỗi validate nhiều trường.

### 4.5 Thiết lập chung cho API

| Hạng mục | Thiết kế |
|---|---|
| Validation | `ValidationPipe` bật `whitelist`, `forbidNonWhitelisted`, `transform` |
| CORS | Chỉ cho các origin trong `CORS_ORIGIN` |
| Cổng | `API_PORT` (mặc định 4000) |
| Logging | Mỗi request ghi một dòng: method, đường dẫn, mã trạng thái, thời gian (ms); không ghi header `Authorization` hoặc body nhạy cảm |
| Tắt êm | Bật shutdown hooks để ngắt kết nối Prisma |
| Tiền tố | Không dùng tiền tố `/api` (đường dẫn đúng như tài liệu) |

---

## 5. Cấu trúc code API

```
apps/api/src/
├── main.ts                       # pipe, CORS, logger, port
├── app.module.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts    # GET /products, GET /products/:id
│   ├── products.service.ts       # truy vấn + ánh xạ sang DTO
│   ├── product-options.ts        # size, đường, đá
│   ├── dto/
│   │   ├── list-products.query.ts
│   │   ├── product-summary.dto.ts
│   │   └── product-detail.dto.ts
│   ├── products.service.spec.ts
│   └── products.controller.spec.ts
├── health/
│   ├── health.module.ts
│   ├── health.controller.ts
│   └── health.controller.spec.ts
└── common/
    ├── logging.interceptor.ts
    └── http-exception.filter.ts  # (tùy chọn) chuẩn hóa lỗi
```

Nguyên tắc: controller mỏng (nhận request, gọi service); service chứa truy vấn và ánh xạ; **không** trả thẳng entity Prisma, luôn qua DTO để không lộ trường nội bộ.

---

## 6. Thiết kế giao diện web

### 6.1 Route và nguyên tắc

| Route | Nội dung |
|---|---|
| `/` | Chuyển hướng sang `/menu` |
| `/menu` | Màn hình thực đơn |

Mobile-first: thiết kế cho **360 px** trước, mở rộng lên màn lớn. Không cuộn ngang. Vùng bấm tối thiểu 44 × 44 px.

### 6.2 Bố cục (điện thoại)

```
┌────────────────────────────┐
│ ☕ BrewLite                │  Header (cố định)
├────────────────────────────┤
│ 🔍 Tìm đồ uống…         ✕  │  Ô tìm kiếm (cố định dưới header)
│ [Tất cả][Cà phê][Trà][…]   │  Chip danh mục, cuộn ngang
├────────────────────────────┤
│ ┌──────────┐ ┌──────────┐  │
│ │  ảnh 1:1 │ │  ảnh 1:1 │  │
│ │ Tên món  │ │ Tên món  │  │
│ │ Mô tả…   │ │ Mô tả…   │  │
│ │ 29.000đ  │ │ 45.000đ  │  │
│ └──────────┘ └──────────┘  │
│ ┌──────────┐ ┌──────────┐  │
│ │ [Hết hàng phủ lên ảnh]│  │  Thẻ hết hàng: ảnh mờ, nhãn "Hết hàng"
│ └──────────┘ └──────────┘  │
└────────────────────────────┘
```

| Màn hình | Số cột | Ghi chú |
|---|---|---|
| Dưới 640 px | 2 | Khoảng cách 12 px |
| 640 đến dưới 1024 px | 3 | |
| Từ 1024 px | 4 | Nội dung tối đa 1200 px, canh giữa |

### 6.3 Thành phần (component)

| Component | Vị trí | Props chính | Trách nhiệm |
|---|---|---|---|
| `MenuPage` | `app/menu/page.tsx` | – | Đọc `?q=` và `?category=` từ URL, ghép các thành phần, quyết định hiển thị trạng thái |
| `SearchBox` | `components/menu/` | `value`, `onChange` | Ô nhập, nút xóa; gọi `onChange` sau **300 ms** ngừng gõ (debounce) |
| `CategoryChips` | `components/menu/` | `categories`, `selected`, `onSelect` | Chip "Tất cả" và các danh mục; chip đang chọn nổi bật; `aria-pressed` |
| `ProductGrid` | `components/menu/` | `products` | Lưới thẻ theo breakpoint |
| `ProductCard` | `components/menu/` | `product` | Ảnh, tên, mô tả (tối đa 2 dòng), giá; nhãn "Hết hàng" khi `inStock = false` |
| `MenuSkeleton` | `components/menu/` | `count = 6` | 6 thẻ khung xám khi đang tải |
| `EmptyState` | `components/menu/` | `variant`, `onReset?` | Hai biến thể, xem 6.5 |
| `ErrorState` | `components/menu/` | `onRetry` | Thông báo lỗi và nút **Thử lại** |

Danh sách chip danh mục được suy ra từ chính dữ liệu `GET /products` **không lọc** (lần tải đầu), không cần API riêng.

### 6.4 Lấy dữ liệu

| Hạng mục | Thiết kế |
|---|---|
| Hook | `useProducts({ search, category })` trả `{ products, status, error, refetch }`; `status` là `loading`, `success` hoặc `error` |
| Gọi API | `lib/api.ts`: `getProducts(params, signal)`, `getProduct(id, signal)`; cơ sở URL lấy từ `NEXT_PUBLIC_API_URL` |
| Hủy request | Dùng `AbortController`: đổi bộ lọc thì hủy request cũ để không hiện kết quả cũ |
| Thời gian chờ | 10 giây; quá hạn coi là lỗi |
| Lỗi | `lib/api.ts` ném `ApiError { status, message }`; giao diện chỉ hiện thông báo tiếng Việt, không hiện mã lỗi kỹ thuật |
| Đồng bộ URL | Bộ lọc nằm trên URL (`/menu?q=trà&category=Trà`) để tải lại trang vẫn giữ bộ lọc |
| Định dạng tiền | `lib/format.ts`: `formatVND(48000)` trả `"48.000đ"` |

### 6.5 Các trạng thái bắt buộc

| Trạng thái | Điều kiện | Hiển thị | Thuộc tính truy cập |
|---|---|---|---|
| **Loading** | Đang gọi API | `MenuSkeleton` (6 thẻ); giữ nguyên ô tìm kiếm và chip | `aria-busy="true"`, vùng `role="status"` |
| **Success** | Có ít nhất một sản phẩm | Lưới sản phẩm | |
| **Empty – không có dữ liệu** | Mảng rỗng, **không** có bộ lọc | "Thực đơn đang được cập nhật. Bạn quay lại sau nhé." | |
| **Empty – lọc không ra** | Mảng rỗng, **có** `search` hoặc `category` | "Không tìm thấy đồ uống phù hợp" và nút **Xóa bộ lọc** | |
| **Error** | Lỗi mạng, hết thời gian, mã 5xx | "Không tải được thực đơn. Kiểm tra kết nối rồi thử lại." và nút **Thử lại** (gọi lại API) | `role="alert"` |

Lỗi `400` do tham số (không xảy ra khi người dùng thao tác bình thường) cũng hiển thị như Error.

### 6.6 Giao diện: màu và chữ

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--brand` | `#6F4E37` | Header, chip chọn, nút |
| `--bg` | `#FBF6EE` | Nền trang |
| `--surface` | `#FFFFFF` | Thẻ sản phẩm |
| `--text` | `#2B2118` | Chữ chính |
| `--muted` | `#74665B` | Mô tả, chữ phụ |
| `--danger` | `#B3261E` | Thông báo lỗi |
| `--ok` | `#2F7D4F` | Trạng thái còn hàng, thành công |

Tương phản chữ/nền tối thiểu 4.5 : 1. Chữ tiếng Việt, tiền hiển thị `48.000đ`.

### 6.7 Ảnh sản phẩm

| Quy tắc | Chi tiết |
|---|---|
| Vị trí | `apps/web/public/images/products/<slug>.webp` |
| Tỷ lệ | 1 : 1, tối đa 640 × 640 px, dưới 100 KB mỗi ảnh |
| Thiếu ảnh | `imageUrl` rỗng hoặc ảnh lỗi thì hiện ảnh thay thế (biểu tượng ly cà phê trên nền `--bg`) |
| Văn bản thay thế | `alt` = tên sản phẩm |

---

## 7. Dữ liệu mẫu (seed)

Yêu cầu seed: chạy lại nhiều lần không lỗi và không nhân đôi dữ liệu (dùng `upsert` theo `name`); có sản phẩm **hết hàng** và sản phẩm **bị ẩn** để kiểm thử.

**Sản phẩm**

| Tên | Danh mục | Giá (đ) | Tồn kho | Hiển thị | Nổi bật |
|---|---|---|---|---|---|
| Cà phê đen đá | Cà phê | 25.000 | 50 | có | không |
| Cà phê sữa đá | Cà phê | 29.000 | 50 | có | có |
| Bạc xỉu | Cà phê | 32.000 | 40 | có | có |
| Americano | Cà phê | 35.000 | 30 | có | không |
| Trà đào cam sả | Trà | 42.000 | 40 | có | có |
| Trà vải | Trà | 40.000 | 40 | có | không |
| Trà sen vàng | Trà | 40.000 | 25 | có | không |
| Trà sữa trân châu | Trà sữa | 45.000 | 60 | có | có |
| Trà sữa matcha | Trà sữa | 48.000 | **0** | có | không |
| Cookies & Cream đá xay | Đá xay | 55.000 | 20 | có | không |
| Matcha đá xay | Đá xay | 55.000 | 20 | có | không |
| Bánh tiramisu | Bánh ngọt | 38.000 | 15 | có | không |
| Croissant bơ | Bánh ngọt | 30.000 | 15 | có | không |
| Bánh thử nghiệm (ẩn) | Bánh ngọt | 20.000 | 10 | **không** | không |

**Topping**

| Tên | Giá (đ) |
|---|---|
| Trân châu đen | 7.000 |
| Thạch dừa | 5.000 |
| Pudding | 8.000 |
| Kem cheese | 10.000 |

Danh mục hợp lệ: `Cà phê`, `Trà`, `Trà sữa`, `Đá xay`, `Bánh ngọt`. Một số sản phẩm để `imageUrl = null` có chủ ý để kiểm thử ảnh thay thế.

---

## 8. Kế hoạch kiểm thử

### 8.1 Công cụ

| Phần | Công cụ | Chạy bằng |
|---|---|---|
| API | Jest, `@nestjs/testing`, supertest, **Prisma được mock** (không cần database) | `npm test -w apps/api` |
| Web | Vitest, React Testing Library, jsdom, mock `fetch` | `npm test -w apps/web` |

Test tích hợp với database thật được làm ở Sprint 2 (`tests/`, TECH-10). Mục tiêu bao phủ (không chặn merge): dòng lệnh từ 70% trở lên cho module `products` và `components/menu`.

### 8.2 Test API

| ID | Kịch bản | Tiêu chí |
|---|---|---|
| API-T01 | `GET /products` trả 200 và mảng chỉ chứa sản phẩm `isActive` | AC-06.1 |
| API-T02 | Mỗi phần tử có đúng các trường của `ProductSummary`, không có `stock`, `isActive`, `version` | AC-06.1 |
| API-T03 | `stock = 0` thì `inStock = false`; `stock > 0` thì `true` | AC-09.1 |
| API-T04 | Không cần JWT vẫn gọi được | AC-06.2 |
| API-T05 | `search` không phân biệt hoa thường, so khớp chứa | AC-07.1 |
| API-T06 | `category` lọc chính xác | AC-07.2 |
| API-T07 | Kết hợp `search` và `category` | AC-07.1, 07.2 |
| API-T08 | Không có kết quả trả 200 và `[]` | AC-07.3 |
| API-T09 | `search` quá 100 ký tự hoặc tham số lạ trả 400 | NFR-05 |
| API-T10 | `GET /products/:id` hợp lệ trả 200 kèm `options` đủ size, topping, đường, đá | AC-08.1 |
| API-T11 | Id không tồn tại hoặc sản phẩm ẩn trả 404 | AC-08.2 |
| API-T12 | Id sai định dạng trả 400 | NFR-05 |
| API-T13 | Topping ẩn không có trong `options.toppings` | AC-08.1 |
| API-T14 | `GET /health` trả 200 khi database ổn, 503 khi database lỗi | NFR-17 |

### 8.3 Test web

| ID | Kịch bản | Tiêu chí |
|---|---|---|
| WEB-T01 | Đang tải thì hiện skeleton và `aria-busy` | AC-06.3 |
| WEB-T02 | Có dữ liệu thì hiện tên và giá dạng `29.000đ` | AC-06.3, AC-N11.1 |
| WEB-T03 | `inStock = false` thì hiện nhãn "Hết hàng" | AC-09.1 |
| WEB-T04 | Mảng rỗng và không có bộ lọc thì hiện empty "đang được cập nhật" | AC-06.3 |
| WEB-T05 | Mảng rỗng khi có bộ lọc thì hiện empty "Không tìm thấy" và nút Xóa bộ lọc hoạt động | AC-07.3 |
| WEB-T06 | Lỗi mạng thì hiện Error; bấm **Thử lại** gọi lại API và hiện dữ liệu | AC-06.3, AC-N09.3 |
| WEB-T07 | Gõ vào ô tìm kiếm: sau 300 ms gọi API với `search` đúng, không gọi mỗi phím | AC-07.1 |
| WEB-T08 | Chọn chip danh mục gọi API với `category` đúng và cập nhật URL | AC-07.2 |
| WEB-T09 | Thông báo lỗi là tiếng Việt, không lộ mã lỗi hoặc stack trace | AC-N09.3 |
| WEB-T10 | `formatVND`: `0` → `0đ`, `48000` → `48.000đ`, `1250000` → `1.250.000đ` | AC-N11.1 |

---

## 9. Truy vết Sprint 1

| Yêu cầu | Story | Thiết kế | API / Code | Test |
|---|---|---|---|---|
| FR-06 | US-01, US-02 | `03-…md` mục 4.1, 6 | `GET /products`, `MenuPage` | API-T01, 02, 04; WEB-T01, 02 |
| FR-07 | US-03 | mục 4.1, 6.3 | `search`, `category`, `SearchBox`, `CategoryChips` | API-T05 … 09; WEB-T05, 07, 08 |
| FR-08 (API) | US-04 | mục 4.2 | `GET /products/:id` | API-T10 … 13 |
| FR-09 | US-01, US-02 | mục 4.1, 6.5 | `inStock`, nhãn "Hết hàng" | API-T03; WEB-T03 |
| NFR-09 | US-02 | mục 6 | `MenuSkeleton`, `EmptyState`, `ErrorState` | WEB-T01, 04, 06 |
| NFR-11 | US-02 | mục 6.4 | `formatVND` | WEB-T02, 10 |
| NFR-16 | TECH-06 | mục 3 | `prisma/migrations`, `seed.ts` | chạy `db:migrate` và `db:seed` hai lần |
| NFR-17 | TECH-07 | mục 4.3 | `GET /health` | API-T14 |

Các dòng này được chép vào `docs/traceability-matrix.md` khi hiện thực.

## 10. Kịch bản demo nghiệm thu Sprint 1

1. Máy sạch: `git clone`, `cp .env.example .env`, `npm ci`.
2. `npm run db:up`, `npm run db:migrate`, `npm run db:seed` (chạy seed lần hai để chứng minh không trùng).
3. `npm run dev:api`, mở `http://localhost:4000/products` (thấy 13 sản phẩm, không có sản phẩm ẩn) và `/products/<id>` (thấy `options`) và `/health`.
4. `npm run dev:web`, mở `http://localhost:3000/menu` ở chế độ điện thoại 360 px.
5. Thấy lưới sản phẩm; "Trà sữa matcha" có nhãn "Hết hàng".
6. Gõ "trà" thấy danh sách lọc; chọn chip "Đá xay"; gõ chuỗi không có thật thấy empty có nút Xóa bộ lọc.
7. Tắt API, tải lại: thấy Error; bật lại API, bấm Thử lại: thấy dữ liệu.
8. `npm run ci` xanh; mở PR cho thấy CI chạy.
