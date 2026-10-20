# Task 2 – Mô hình hóa hệ thống

| Sơ đồ | Tệp nguồn (PlantUML) | Tệp kết xuất | Đối chiếu |
|---|---|---|---|
| Task 2.1 – Activity diagram (swimlane) | `activity-checkout.puml` | `activity-checkout.svg` | SRS FR-06…FR-28; use-case UC-01 (luồng chính, A1–A8, E1–E15) |
| Task 2.2 – Sequence diagram | `sequence-checkout.puml` | `sequence-checkout.svg` | `usecase-spec-checkout.md` bước 5–22; ADR-005, ADR-007 |
| Task 2.3 – Class diagram (domain) | `class-domain.puml` | `class-domain.svg` | SRS mục 1.4 và 5; `sprint1/03-mvp-design.md` mục 3; ADR-010 |

Phiên bản hiện tại: **1.1**. Các tệp `.svg` **chưa được tạo** (cần kết xuất bằng PlantUML, xem bên dưới). Đề bài yêu cầu lưu cả tệp nguồn lẫn bản kết xuất.

## Kết xuất ảnh

```bash
# Cần Java + Graphviz, tải plantuml.jar từ https://plantuml.com/download
java -jar plantuml.jar -tsvg docs/diagrams/*.puml
# hoặc dùng extension "PlantUML" trong VS Code (Alt+D để xem trước, chuột phải để xuất SVG/PNG)
# hoặc dán nội dung vào https://www.plantuml.com/plantuml để xem và tải về
```

Sau khi kết xuất, commit cả `.puml` lẫn `.svg` (ràng buộc C-12 trong `context-and-scope.md`).

## Truy vết nhanh

| Chủ đề | Activity | Sequence | Class |
|---|---|---|---|
| Hết hàng / không đủ hàng (FR-09, FR-18) | Có (UI và máy chủ) | Có (loop optimistic locking, 409) | `Product.stock`, `Product.version` |
| Chưa đăng nhập (FR-02, FR-05) | Có (nhánh /login) | Có (401) | `User`, `Role` |
| Tìm kiếm, lọc menu (FR-07) | Có (v1.1) | Không (ngoài UC-01) | `Product.name`, `Product.category` |
| Thanh toán thất bại, thử lại, hủy (FR-21, FR-26) | Có (vòng repeat) | Có (alt thất bại, replay) | `PaymentStatus`, `OrderStatus` |
| Idempotency (FR-20) | Có | Có (alt key tồn tại + mục A5) | `Payment.idempotencyKey` |
| Transaction tạo đơn và tồn kho (NFR-08) | Có | Có (BEGIN, COMMIT, ROLLBACK) | `Order.version` |
| Sổ điểm thưởng (FR-15, FR-22, FR-26) | Có (v1.1) | Có (v1.1) | `LoyaltyTransaction`, `LoyaltyTxType` |

## Lịch sử thay đổi

### v1.1 – 17/10/2026

Lý do: đồng bộ với thiết kế Sprint 1 (`docs/sprint1/03-mvp-design.md`), quyết định kiến trúc ở Task 3 và để các sơ đồ không mâu thuẫn nhau.

| Sơ đồ | Thay đổi | Lý do |
|---|---|---|
| Class | `Product.id`, `Topping.id` đổi sang UUID; các lớp còn lại giữ `int` | Id catalog xuất hiện trên URL `/products/:id`; `Order.id` giữ số nguyên vì là mã đơn hiển thị cho khách (ADR-010) |
| Class | Thêm `Role.MANAGER` | Use-case UC-07 và FR-29 cần vai trò quản lý, kế thừa STAFF |
| Class | `Product.imageUrl`, `OrderItem.imageUrl` có thể null; thêm ràng buộc `{>= 0}` cho giá, tồn kho, điểm | Khớp schema Sprint 1 và CHECK trong database (NFR-08) |
| Class | Thêm `OrderItem.productId`, lớp `ToppingSnapshot`; `OrderItem.sugar` là số nguyên | Lưu được tham chiếu sản phẩm; mô tả đúng cấu trúc topping chụp lại; khớp mức đường 0…100 |
| Sequence | Ghi sổ `LoyaltyTransaction` (REDEEM khi đặt đơn, EARN khi PAID) | Khớp class diagram: `User.loyaltyPoints` là số dư của sổ cái |
| Sequence | Ghi chú giai đoạn 2 và 3 chỉ chạy khi đã có đơn `PENDING` | Tránh hiểu nhầm luồng tiếp tục sau lỗi ở giai đoạn 1 |
| Sequence | Lifeline Payment Service ghi rõ là `PaymentGateway` mô phỏng | Khớp ADR-005 |
| Activity | Thêm nhánh tìm kiếm, lọc menu | Phủ FR-07 |
| Activity | Ghi sổ `LoyaltyTransaction` | Khớp class và sequence |
| Cả ba | Bỏ tham chiếu tới tệp code trong phần ghi chú đầu tệp | Thiết kế là nguồn chuẩn, không dẫn chiếu ngược từ code |

## Việc cần sửa ở code để khớp thiết kế

Bản thiết kế (sơ đồ và tài liệu Task 1, 3) là chuẩn. Backend và frontend được sửa theo thiết kế, không vẽ lại sơ đồ theo code hiện có.

- Thêm model `LoyaltyTransaction` vào `schema.prisma` (kèm migration); `User.loyaltyPoints` giữ vai trò số dư. Ghi sổ REDEEM khi đặt đơn, EARN khi `PAID`, REFUND và REVOKE khi hủy đơn.
- Đổi `Product.id` và `Topping.id` sang UUID; sửa seed, DTO, kiểu ở frontend (`types/product.ts`) và dữ liệu giỏ hàng lưu trong trình duyệt.
- Thêm `MANAGER` vào enum `Role` (chỉ cần khi làm FR-29).
- Thêm khóa ngoại `Order.promotionId` tới `Promotion`; giữ `couponCode` làm bản chụp tại thời điểm đặt đơn.
- Thêm `OrderItem.productId`; lưu topping dạng `ToppingSnapshot[]` (JSON) gồm `toppingId`, `name`, `price`.
- Với mọi chi tiết trong Activity và Sequence mà code hiện tại làm khác, sửa code theo sơ đồ.
