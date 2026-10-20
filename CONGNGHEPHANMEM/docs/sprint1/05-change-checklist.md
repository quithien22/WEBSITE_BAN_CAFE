# Task 4 – Kế hoạch đưa web hiện tại về đúng thiết kế

| Mục | Nội dung |
|---|---|
| Tài liệu | Checklist thay đổi code theo thiết kế Task 4 |
| Phiên bản | 1.0 – 17/10/2026 |
| Nguyên tắc | **Thiết kế dẫn dắt code.** Mở từng mục của thiết kế, đối chiếu với code, mục nào lệch thì **sửa code**. Chỉ sửa thiết kế khi có lý do chính đáng và qua pull request có ghi "Lý do thay đổi" |
| Tài liệu thiết kế | `01-repository-and-workflow.md`, `02-backlog-and-dod.md`, `03-mvp-design.md`, `04-ci-design.md` |

Mỗi giai đoạn = một hoặc nhiều pull request nhỏ vào `main`, theo quy ước commit ở `01-…md`. Làm theo thứ tự, vì giai đoạn sau dựa vào giai đoạn trước.

---

## Giai đoạn 0 – Chuẩn bị

| # | Việc | Kiểm tra |
|---|---|---|
| 0.1 | Tạo repository trên GitHub (hoặc nền tảng tương đương), mời giảng viên | Giảng viên truy cập được |
| 0.2 | Tạo tag hoặc nhánh sao lưu trước khi đổi cấu trúc (ví dụ `backup/before-restructure`) | Có thể quay lại |
| 0.3 | Tạo board với cột `Backlog`, `Sprint 1`, `Sprint 2`, `In progress`, `In review`, `Done`; tạo nhãn theo `01-…md`, mục 8 | Board có đủ cột và nhãn |
| 0.4 | Tạo issue cho từng mục TECH-01…TECH-09 và US-01…US-04 trong `02-…md`; gắn nhãn `sprint-1`; tạo issue Sprint 2 ở cột `Backlog` | Mỗi mục có issue |

## Giai đoạn 1 – Cấu trúc thư mục (TECH-01)

| # | Việc | Kiểm tra |
|---|---|---|
| 1.1 | Đổi tên thư mục backend thành `apps/api` và frontend thành `apps/web` bằng `git mv` (giữ lịch sử commit) | `git log --follow` còn lịch sử |
| 1.2 | Đưa thư mục `CONGNGHEPHANMEM/docs` thành `docs/` ở gốc repo (xem TECH-04) | Có `docs/requirements`, `docs/sprint1` |
| 1.3 | Tạo `tests/` (có thể chỉ có `.gitkeep`) và `.github/workflows/` | Có thư mục |
| 1.4 | Sửa mọi đường dẫn tương đối bị hỏng (import, `tsconfig`, Dockerfile, README) | `npm run build` chạy được ở từng app |
| 1.5 | Đối chiếu cây thư mục với `01-…md`, mục 1 | Khớp, hoặc ghi chú lệch có lý do |

## Giai đoạn 2 – Workspace và script (TECH-01, TECH-02)

| # | Việc | Kiểm tra |
|---|---|---|
| 2.1 | `package.json` ở gốc: `"private": true`, `"workspaces": ["apps/*"]` | `npm ls --workspaces` liệt kê hai app |
| 2.2 | Thêm các script gốc theo `01-…md`, mục 2 (`dev:api`, `dev:web`, `db:*`, `lint`, `test`, `build`, `ci`) | Chạy từng lệnh thành công |
| 2.3 | Mỗi app có đủ script bắt buộc (api: `start:dev`, `lint`, `test`, `build`, `prisma:*`; web: `dev`, `lint`, `test`, `build`, `start`) | `npm run <script> -w apps/<app>` chạy được |
| 2.4 | Một `package-lock.json` ở gốc, xóa lockfile con | Chỉ còn một lockfile; `npm ci` thành công |
| 2.5 | Thêm `.nvmrc` (22), `.editorconfig`, `.prettierrc`, cấu hình ESLint dùng chung | Lint chạy ở cả hai app |
| 2.6 | `.gitignore` đủ mục theo `01-…md`, mục 9; `.env.example` đúng nội dung; **gỡ file `.env` thật khỏi git nếu đã lỡ commit** và đổi mật khẩu liên quan | `git ls-files | grep -E '^\.env$'` không có kết quả |
| 2.7 | `README.md` có đủ mục theo `01-…md`, mục 9 | Người ngoài làm theo được 5 bước chạy nhanh |

## Giai đoạn 3 – Database (TECH-05, TECH-06)

| # | Việc | Kiểm tra |
|---|---|---|
| 3.1 | `docker-compose.yml` có service `db` (PostgreSQL), volume, healthcheck, cổng 5432, biến lấy từ `.env` | `npm run db:up` rồi `docker compose ps` báo `healthy` |
| 3.2 | `schema.prisma` khớp `03-…md`, mục 3.1: `Product` (id UUID, `name` unique, `price`, `stock`, `isActive`, `isFeatured`, `version`…) và `Topping`. Nếu schema hiện tại khác (kiểu id, tên trường, thiếu bảng) thì **đổi theo thiết kế** | So sánh từng trường |
| 3.3 | Dùng **migration**, không dùng `db push`: tạo migration khởi tạo, commit thư mục `prisma/migrations` | Trên database trống, `npm run db:migrate` tạo đủ bảng |
| 3.4 | Thêm ràng buộc `CHECK` trong file migration theo `03-…md`, mục 3.2 | Thử `UPDATE … SET stock = -1` bị từ chối |
| 3.5 | `seed.ts` khớp bảng ở `03-…md`, mục 7 (14 sản phẩm, 4 topping, 1 sản phẩm hết hàng, 1 sản phẩm ẩn), dùng `upsert` | Chạy `db:seed` hai lần: số dòng không đổi, không lỗi |
| 3.6 | Kiểm tra từ trạng thái sạch: `docker compose down -v`, rồi `db:up`, `db:migrate`, `db:seed` | Dữ liệu tái tạo đúng |

> Dữ liệu phát triển có thể tái tạo bằng seed, nên đổi schema hoặc kiểu id là chấp nhận được; không cần giữ dữ liệu cũ.

## Giai đoạn 4 – API (US-01, US-03, US-04, TECH-07)

| # | Việc | Kiểm tra bằng lệnh |
|---|---|---|
| 4.1 | Cấu trúc module `products`, `health`, `prisma`, `common` theo `03-…md`, mục 5 | Đối chiếu cây thư mục |
| 4.2 | `main.ts`: `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`), CORS theo `CORS_ORIGIN`, cổng `API_PORT`, shutdown hooks, logging | Gọi API với tham số lạ nhận 400 |
| 4.3 | `GET /products` đúng hợp đồng mục 4.1: chỉ `isActive`, `search` (chứa, không phân biệt hoa thường), `category` (chính xác), sắp xếp theo `name`, DTO không lộ `stock`, `isActive`, `version` | `curl localhost:4000/products` rồi `?search=trà`, `?category=Đá%20xay` |
| 4.4 | `GET /products/:id` đúng mục 4.2: có `options`, 404 khi ẩn hoặc không tồn tại, 400 khi sai UUID | `curl localhost:4000/products/<uuid>`; thử id ẩn; thử `abc` |
| 4.5 | `product-options.ts` chứa size, đường, đá đúng giá trị | Xem trực tiếp file |
| 4.6 | `GET /health` đúng mục 4.3 (200 khi DB ổn, 503 khi DB lỗi) | `curl localhost:4000/health`; `docker compose stop db` rồi gọi lại |
| 4.7 | Không có endpoint thừa làm lộ dữ liệu; mọi phản hồi lỗi đúng định dạng mục 4.4 | Rà soát controller |

## Giai đoạn 5 – Web (US-02, US-03)

| # | Việc | Kiểm tra |
|---|---|---|
| 5.1 | Route `/` chuyển hướng `/menu`; trang `/menu` theo bố cục `03-…md`, mục 6.2 | Mở ở 360 px, không cuộn ngang |
| 5.2 | Tách component theo mục 6.3: `SearchBox`, `CategoryChips`, `ProductGrid`, `ProductCard`, `MenuSkeleton`, `EmptyState`, `ErrorState` | Mỗi component một file, props đúng bảng |
| 5.3 | `lib/api.ts` (`getProducts`, `getProduct`, `ApiError`, thời gian chờ 10 giây, `AbortController`), `lib/format.ts` (`formatVND`) | Đọc code, chạy test |
| 5.4 | Hook `useProducts`; bộ lọc đồng bộ với URL (`?q=`, `?category=`); debounce 300 ms | Gõ nhanh chỉ sinh một request; F5 giữ bộ lọc |
| 5.5 | Đủ 5 trạng thái theo mục 6.5 (loading, success, empty có hai biến thể, error) với thông báo tiếng Việt và thuộc tính truy cập | Làm lần lượt: chậm mạng, xóa dữ liệu, lọc không ra, tắt API |
| 5.6 | Thẻ hết hàng có nhãn "Hết hàng"; thiếu ảnh thì hiện ảnh thay thế | Xem "Trà sữa matcha" và sản phẩm `imageUrl = null` |
| 5.7 | Màu và chữ theo mục 6.6; lưới 2 / 3 / 4 cột theo breakpoint | Đổi kích thước cửa sổ |
| 5.8 | Biến `NEXT_PUBLIC_API_URL` lấy từ môi trường, không viết cứng địa chỉ | Tìm chuỗi `localhost:4000` trong mã nguồn web: chỉ còn ở `.env.example` |
| 5.9 | Các trang hoặc chức năng của Sprint 2 chưa làm (chi tiết sản phẩm trên giao diện, giỏ hàng…) thì **ẩn khỏi menu điều hướng hoặc ghi rõ "Sắp có"**, không để liên kết chết | Bấm thử mọi liên kết |

> Nếu web hiện tại đã có nhiều trang vượt Sprint 1, vẫn giữ được, nhưng các tiêu chí nghiệm thu Sprint 1 chỉ xét theo phạm vi ở `03-…md`, mục 1. Phần dư ghi vào backlog Sprint 2 và kiểm tra lại theo thiết kế Sprint 2.

## Giai đoạn 6 – Kiểm thử (TECH-08)

| # | Việc | Kiểm tra |
|---|---|---|
| 6.1 | Cài Jest và supertest cho API, Vitest và React Testing Library cho web | `npm test` chạy ở từng app |
| 6.2 | Viết đủ API-T01…API-T14 (mục 8.2); mock Prisma, không cần database | Log liệt kê đủ ID kiểm thử |
| 6.3 | Viết đủ WEB-T01…WEB-T10 (mục 8.3), mock `fetch`; dùng bộ đếm thời gian giả cho debounce | Log liệt kê đủ ID kiểm thử |
| 6.4 | Tên test chứa mã (`API-T05 …`, `WEB-T06 …`) để truy vết | Tìm theo mã được |
| 6.5 | `npm test` không chạy chế độ watch, không cần mạng và database | Chạy trong `docker run node:22` hoặc máy sạch |

## Giai đoạn 7 – CI và bảo vệ nhánh (TECH-03, TECH-09)

| # | Việc | Kiểm tra |
|---|---|---|
| 7.1 | Thêm `.github/workflows/ci.yml` theo `04-…md`, mục 3 | Mở PR thì tab Actions chạy `api` và `web` |
| 7.2 | Thêm `PULL_REQUEST_TEMPLATE.md`, issue template, `CODEOWNERS` | PR mới tự điền mẫu |
| 7.3 | Bật bảo vệ nhánh `main` theo `04-…md`, mục 5 (bắt buộc check `api` và `web`) | PR đỏ bị khóa nút Merge |
| 7.4 | Làm PR-xanh và PR-đỏ theo `04-…md`, mục 6 | Có link PR và ảnh |
| 7.5 | Ghi `docs/sprint1/ci-evidence.md` | Có bảng minh chứng |

## Giai đoạn 8 – Tài liệu và đóng Sprint (TECH-04)

| # | Việc | Kiểm tra |
|---|---|---|
| 8.1 | Đưa tài liệu Task 1–3 vào `docs/` bằng PR, mô tả ghi rõ lý do | PR đã merge |
| 8.2 | Tạo `docs/traceability-matrix.md` với các dòng ở `03-…md`, mục 9 | Có dòng cho FR-06, 07, 08, 09 |
| 8.3 | Chạy kịch bản demo ở `03-…md`, mục 10 từ máy sạch | Mọi bước đạt |
| 8.4 | Tạo tag `v0.1.0` và release notes | Có release |
| 8.5 | Sprint Review và Retrospective, ghi `docs/sprint1/retrospective.md` | Có tệp |
| 8.6 | Đối chiếu mục 7 của `02-…md` (điều kiện nghiệm thu Task 4) | Mọi dòng có minh chứng |

---

## Kiểm tra nhanh toàn bộ (lệnh)

```bash
cp .env.example .env
npm ci
npm run db:up
npm run db:migrate && npm run db:seed && npm run db:seed   # seed hai lần

curl -s localhost:4000/health
curl -s localhost:4000/products | head -c 400
curl -s "localhost:4000/products?search=tr%C3%A0"
curl -s "localhost:4000/products?category=%C4%90%C3%A1%20xay"
curl -s -o /dev/null -w "%{http_code}\n" "localhost:4000/products?abc=1"        # mong đợi 400
curl -s -o /dev/null -w "%{http_code}\n" localhost:4000/products/not-a-uuid      # mong đợi 400

npm run ci    # lint, test, build đều phải xanh
```

## Thứ tự pull request gợi ý

1. `chore(repo): cấu trúc apps/web, apps/api và workspaces`
2. `chore(repo): README, .gitignore, .env.example, cấu hình format`
3. `docs: đưa tài liệu Task 1–3 và thiết kế Sprint 1 vào docs/`
4. `chore(docker): PostgreSQL local bằng Docker Compose`
5. `feat(db): schema, migration khởi tạo và seed`
6. `feat(api): GET /products, GET /products/:id, GET /health` (kèm test API)
7. `feat(web): màn hình menu với loading, empty, error` (kèm test web)
8. `ci: pipeline CI và bảo vệ nhánh main`
9. `docs: minh chứng CI, traceability, retrospective`
