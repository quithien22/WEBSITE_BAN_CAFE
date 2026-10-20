# Task 4.1 – Product Backlog, Sprint Goal và Definition of Done

| Mục | Nội dung |
|---|---|
| Tài liệu | Assignment 2 – Task 4.1 (thiết kế) |
| Phiên bản | 1.0 – 17/10/2026 |
| Căn cứ | SRS (`docs/requirements/srs.md`), đề bài mục 6 và 7 |
| Ước lượng | Story point theo dãy 1, 2, 3, 5, 8 (1 điểm ≈ nửa ngày làm việc của một người) |

---

## 1. Sprint Goal

| Sprint | Mục tiêu |
|---|---|
| **Sprint 1** | Tạo nền tảng kỹ thuật, tài liệu có kiểm soát phiên bản và một MVP đầu tiên **chạy được** cho luồng **xem menu** (đề bài, mục 6) |
| **Sprint 2** | Hoàn thành luồng end-to-end (chọn tùy chọn, giỏ hàng, đăng nhập, đặt đơn, thanh toán, theo dõi đơn), tự động hóa đóng gói và triển khai production truy cập được (đề bài, mục 7) |

## 2. Product Backlog – Sprint 1

| ID | Loại | Mục | Yêu cầu | Ưu tiên | SP |
|---|---|---|---|---|---|
| TECH-01 | tech | Khởi tạo repository, cấu trúc monorepo, npm workspaces, lint/format | NFR-19 | must | 3 |
| TECH-02 | tech | `README.md`, `.gitignore`, `.env.example`, `.editorconfig`, `.prettierrc` | NFR-07, NFR-13 | must | 2 |
| TECH-03 | tech | Quy ước nhánh, PR, commit; PR template; issue template; bảo vệ `main`; Definition of Done | NFR-19 | must | 2 |
| TECH-04 | docs | Đưa tài liệu Task 1–3 vào `docs/` qua pull request, ghi lý do | NFR-19 | must | 2 |
| TECH-05 | tech | `docker-compose.yml` chạy PostgreSQL local có volume và healthcheck | NFR-13 | must | 2 |
| TECH-06 | tech | Prisma schema `Product`, `Topping`; migration khởi tạo; seed lặp lại được | NFR-16 | must | 5 |
| TECH-07 | tech | Endpoint `GET /health` kiểm tra cả database | NFR-17 | must | 1 |
| US-01 | feature | API `GET /products` | FR-06, FR-09 | must | 3 |
| US-02 | feature | Màn hình menu mobile-first (loading, empty, error) | FR-06, NFR-09, NFR-11 | must | 5 |
| US-03 | feature | Tìm kiếm theo tên và lọc theo danh mục (API và giao diện) | FR-07 | should | 3 |
| US-04 | feature | API `GET /products/:id` kèm tùy chọn size, topping, đường, đá | FR-08 (phần API) | must | 2 |
| TECH-08 | tech | Test API (unit + HTTP) và test component web | NFR-18 | must | 5 |
| TECH-09 | tech | Pipeline CI trên pull request: Install → Lint → Unit Test → Build; chặn merge khi lỗi; minh chứng đạt và lỗi | NFR-15 | must | 3 |
| | | **Tổng Sprint 1** | | | **38** |

**Cắt giảm nếu thiếu thời gian (theo thứ tự):** US-03 (should) trước, sau đó phần polish giao diện. Không cắt TECH-08 và TECH-09 vì là tiêu chí nghiệm thu.

## 3. Product Backlog – Sprint 2 (dự kiến)

| ID | Mục | Yêu cầu | Ưu tiên | SP |
|---|---|---|---|---|
| US-05 | Trang chi tiết sản phẩm, chọn size và topping, đường, đá, giá cập nhật theo tùy chọn | FR-08 | must | 5 |
| US-06 | Giỏ hàng: thêm, sửa, xóa, gộp dòng trùng, tính tổng, lưu qua F5 | FR-11, 12, 13 | must | 5 |
| US-07 | Đăng ký, đăng nhập, đăng xuất, JWT, phân quyền | FR-01, 02, 03, 05 | must | 5 |
| US-08 | Tạo đơn `PENDING`, tính lại giá ở máy chủ, giữ tồn kho trong transaction | FR-17, 18 | must | 8 |
| US-09 | Thanh toán Ví / Thẻ mô phỏng, `Idempotency-Key`, thất bại và thử lại, cộng điểm, màn xác nhận | FR-19 … 23 | must | 8 |
| US-10 | Lịch sử đơn, chi tiết và theo dõi tiến trình, hủy đơn | FR-24, 25, 26 | must / should | 5 |
| US-11 | API nhân viên cập nhật trạng thái đơn (state machine) | FR-27 | must | 3 |
| US-12 | Mã khuyến mãi, điểm thưởng, ghi chú | FR-14, 15, 16 | should | 5 |
| TECH-10 | Integration test cho API tạo đơn và thanh toán | NFR-18 | must | 5 |
| TECH-11 | Ít nhất 1 test end-to-end từ menu đến xác nhận đơn | NFR-18 | must | 5 |
| TECH-12 | `docker-compose.yml` đủ web, api, db; Dockerfile cho web và api | NFR-13 | must | 3 |
| TECH-13 | Pipeline CD: build image gắn SHA, push registry, deploy, migration an toàn, smoke test, rollback | NFR-15 | must | 8 |
| TECH-14 | Triển khai production (HTTPS, database không public, secret trong CI) | NFR-14, NFR-07 | must | 5 |
| TECH-15 | Release `v1.0.0`, release notes, README đầy đủ, video demo, Sprint Review và Retrospective | — | must | 3 |
| US-13 | Giao diện nhân viên: danh sách đơn cần pha | FR-28 | should | 5 |
| US-14 | PWA (manifest, cài lên màn hình chính) | NFR-10 | could | 3 |

## 4. User story chi tiết – Sprint 1

**US-01 – API xem thực đơn**
Là khách hàng, tôi muốn thấy danh sách đồ uống đang bán kèm giá và tình trạng còn hàng, để chọn món mà không cần hỏi nhân viên.
Tiêu chí: AC-06.1, AC-06.2, AC-09.1 (xem `03-mvp-design.md`, mục 5 và 9).

**US-02 – Màn hình menu**
Là khách hàng dùng điện thoại, tôi muốn xem menu rõ ràng và biết khi nào đang tải, trống hoặc lỗi, để không bị bối rối khi mạng chậm.
Tiêu chí: AC-06.3, AC-N09.1, AC-N09.2, AC-N09.3, AC-N11.1.

**US-03 – Tìm kiếm và lọc**
Là khách hàng, tôi muốn gõ tên món hoặc chọn danh mục để tìm nhanh món mình muốn.
Tiêu chí: AC-07.1, AC-07.2, AC-07.3.

**US-04 – API chi tiết sản phẩm**
Là nhà phát triển web, tôi cần API trả chi tiết sản phẩm và các tùy chọn, để Sprint 2 xây trang chọn size và topping.
Tiêu chí: AC-08.1, AC-08.2.

## 5. Definition of Ready (một mục được đưa vào Sprint khi)

- Có câu chuyện rõ ràng và liên kết FR/NFR.
- Có tiêu chí chấp nhận đo được (AC-xx).
- Đã ước lượng story point và có người nhận.
- Không bị chặn bởi mục khác chưa xong.

## 6. Definition of Done (một mục được coi là xong khi)

| # | Điều kiện |
|---|---|
| 1 | Code nằm trên `main` qua pull request đã được duyệt và CI xanh |
| 2 | Đáp ứng đầy đủ tiêu chí chấp nhận (AC-xx) của mục đó |
| 3 | Có test tự động tương ứng (unit, component hoặc HTTP) và test đạt |
| 4 | `npm run ci` xanh ở máy local và trên CI |
| 5 | Không còn cảnh báo lint, không có `console.log` gỡ lỗi, không có mã chết |
| 6 | Chạy được từ trạng thái sạch theo README (clone, cấu hình, chạy) |
| 7 | Tài liệu liên quan đã cập nhật (README, `.env.example`, API contract, sơ đồ nếu đổi) |
| 8 | `docs/traceability-matrix.md` có dòng cho FR/NFR liên quan |
| 9 | Không có secret trong mã nguồn, log, ảnh chụp |
| 10 | Giao diện đạt NFR-09: dùng được ở 360 px, có đủ trạng thái tải, rỗng, lỗi |
| 11 | Issue được đóng bằng `Closes #…` và chuyển sang cột `Done` |

## 7. Điều kiện nghiệm thu Task 4 (Sprint 1 hoàn thành khi)

| # | Điều kiện | Minh chứng |
|---|---|---|
| 1 | Repository có `apps/web`, `apps/api`, `docs`, `README.md`, `.gitignore`, `.env.example` | Link repository |
| 2 | Có chiến lược nhánh, PR, commit, DoD và board có backlog Sprint 1 và 2 | `01-…md`, `02-…md`, ảnh board |
| 3 | Toàn bộ tạo phẩm Task 1–3 nằm trong `docs/`, thay đổi có lịch sử PR | Link các PR |
| 4 | `GET /products`, `GET /products/:id` chạy được, có seed | Demo hoặc ảnh chụp phản hồi |
| 5 | Màn hình menu mobile-first có loading, empty, error | Video ngắn hoặc ảnh chụp 3 trạng thái |
| 6 | Test API và test component đều đạt | Log `npm test` |
| 7 | CI chạy tự động khi mở PR; PR lỗi bị chặn merge | Link PR xanh, ảnh hoặc log của một lần đạt và một lần lỗi |
| 8 | Tag `v0.1.0` | Link release |

## 8. Nghi thức Scrum tối thiểu

| Nghi thức | Khi nào | Sản phẩm |
|---|---|---|
| Sprint Planning | Đầu Sprint | Chọn mục, gán người, cập nhật board |
| Họp ngắn (stand-up) | 2 đến 3 lần mỗi tuần | Ghi chú 3 dòng vào issue hoặc kênh nhóm |
| Sprint Review | Cuối Sprint | Demo bản chạy được cho giảng viên hoặc nhóm |
| Sprint Retrospective | Sau Review | `docs/sprint1/retrospective.md`: tốt, chưa tốt, hành động cải tiến |
