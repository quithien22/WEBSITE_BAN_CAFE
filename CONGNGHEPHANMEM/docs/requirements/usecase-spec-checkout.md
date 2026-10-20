# Đặc tả use-case UC-01: Đặt và thanh toán đơn hàng (Task 1.3)

| Mục | Nội dung |
|---|---|
| Dự án | BrewLite |
| Tài liệu | Assignment 2 – Task 1.3 |
| Phiên bản | 1.0 |
| Ngày lập | 17/10/2026 |
| Lý do chọn | Đây là use-case có giá trị nghiệp vụ cao nhất (tạo doanh thu), chạm mọi thành phần kỹ thuật (UI, API, JWT, transaction, tồn kho, cổng thanh toán, idempotency), và là cơ sở cho sequence diagram ở Task 2.2 |

---

## 1. Sơ đồ use-case

- Nguồn PlantUML: `docs/requirements/diagrams/usecase-checkout.puml`
- Bản đã vẽ trên draw.io (đã có sẵn trong thư mục sơ đồ):
  - `CÁC SƠ ĐỒ/USECASE/USECASE_CON/BrewLite_UseCase_Con-UC-4a · Đặt hàng.drawio.png`
  - `CÁC SƠ ĐỒ/USECASE/USECASE_CON/BrewLite_UseCase_Con-UC-4b Thanh toan .drawio.png`

Tóm tắt quan hệ trong sơ đồ:

| Use-case | Quan hệ | Use-case / actor liên quan |
|---|---|---|
| UC-01 Đặt và thanh toán đơn hàng | «include» | UC-01.1 Đăng nhập (xác thực JWT) |
| | «include» | UC-01.2 Kiểm tra và giữ tồn kho |
| | «include» | UC-01.3 Tạo đơn `PENDING` (máy chủ tính lại giá) |
| | «include» | UC-01.4 Thanh toán không dùng tiền mặt |
| UC-01.4 Thanh toán | «include» | UC-01.4.1 Chọn phương thức (Ví / Thẻ) |
| | «include» | UC-01.4.2 Chống thanh toán trùng (Idempotency-Key) |
| | «include» | UC-01.4.3 Cộng điểm thưởng |
| | «include» | UC-01.4.4 Hiển thị xác nhận đơn |
| UC-01.5 Áp mã khuyến mãi | «extend» UC-01 | Tùy chọn |
| UC-01.6 Dùng điểm thưởng | «extend» UC-01 | Tùy chọn |
| UC-01.7 Xử lý thanh toán thất bại | «extend» UC-01.4 | Khi cổng thanh toán từ chối hoặc không phản hồi |
| UC-01.8 Thử lại / đổi phương thức | «extend» UC-01.7 | Sau khi thất bại |
| UC-01.9 Hủy đơn | «extend» UC-01.7 | Khách bỏ thanh toán sau khi thất bại (luồng A8) |
| Actor | Khách hàng (chính); Cổng thanh toán (phụ) | |

---

## 2. Thông tin chung

| Mục | Mô tả |
|---|---|
| **Mã use-case** | UC-01 |
| **Tên** | Đặt và thanh toán đơn hàng |
| **Mức độ** | Mục tiêu người dùng (user goal) |
| **Actor chính** | **Khách hàng** (đã đăng nhập, vai trò `CUSTOMER`) |
| **Actor phụ** | **Cổng thanh toán (mô phỏng)** – Ví MoMo hoặc Thẻ VNPay; **Hệ thống BrewLite** (Next.js UI + NestJS API + PostgreSQL) |
| **Stakeholder quan tâm** | Khách: thanh toán nhanh, không bị trừ tiền hai lần. Nhân viên quầy: chỉ nhận đơn đã thanh toán, đầy đủ tùy chọn. Quản lý: không bán quá tồn kho, đối soát được giao dịch |
| **Mô tả ngắn** | Khách hàng xác nhận giỏ hàng, hệ thống tạo đơn và giữ tồn kho, khách chọn phương thức thanh toán không dùng tiền mặt, hệ thống gọi cổng thanh toán và ghi nhận kết quả, sau đó thông báo kết quả cho khách |
| **Trigger** | Khách hàng bấm nút **"Xác nhận thanh toán"** ở trang `/checkout` khi giỏ hàng có ít nhất một món |

### 2.1 Tiền điều kiện (Preconditions)

| # | Tiền điều kiện |
|---|---|
| PRE-1 | Khách hàng đã **đăng nhập**, có JWT hợp lệ chưa hết hạn |
| PRE-2 | Giỏ hàng **không rỗng**, mỗi dòng có sản phẩm, size, số lượng hợp lệ (1…20) |
| PRE-3 | Các sản phẩm trong giỏ đang bán (`isActive`) và các topping đã chọn đang bán |
| PRE-4 | Hệ thống (API, database) đang hoạt động |
| PRE-5 | Cổng thanh toán mô phỏng sẵn sàng (nếu không, kết quả được xem là thanh toán thất bại) |

### 2.2 Hậu điều kiện (Postconditions)

**Khi thành công (Success guarantee)**

| # | Hậu điều kiện |
|---|---|
| POST-S1 | Có một đơn hàng mới, trạng thái `PAID`; nhật ký trạng thái có `PENDING` rồi `PAID` |
| POST-S2 | Có một bản ghi thanh toán `SUCCESS` gắn với `Idempotency-Key` và `transactionId` |
| POST-S3 | Tồn kho các sản phẩm đã bị trừ đúng số lượng đặt |
| POST-S4 | Nếu dùng mã khuyến mãi: lượt dùng mã tăng một. Nếu dùng điểm: điểm bị trừ khỏi tài khoản |
| POST-S5 | Điểm thưởng của đơn được cộng cho khách **đúng một lần** (`pointsAwarded = true`) |
| POST-S6 | Giỏ hàng ở trình duyệt được xóa; khách thấy trang xác nhận `/orders/{id}/success` |
| POST-S7 | Đơn hiện ở danh sách "đơn cần pha" của nhân viên (đơn `PAID`) |

**Khi thất bại (Minimal guarantee)**

| # | Hậu điều kiện |
|---|---|
| POST-F1 | Không bao giờ trừ tiền khách hai lần; không bao giờ bán quá tồn kho (tồn kho không âm) |
| POST-F2 | Nếu lỗi xảy ra **trước khi đơn được tạo** (hết hàng, mã không hợp lệ, điểm không đủ, dữ liệu sai): **không có đơn nào được tạo** và kho, mã, điểm không đổi (hoàn tác toàn bộ) |
| POST-F3 | Nếu thanh toán thất bại: đơn ở `PAYMENT_FAILED`, giao dịch `FAILED` có lý do, **giỏ hàng được giữ nguyên**, tồn kho vẫn đang giữ cho đơn cho tới khi khách thử lại hoặc hủy |
| POST-F4 | Khách được thông báo rõ kết quả và hướng xử lý tiếp (thử lại, đổi phương thức, hủy) |

---

## 3. Luồng chính (Main success scenario)

| Bước | Actor | Hành động | Ghi chú kỹ thuật |
|---|---|---|---|
| 1 | Khách hàng | Mở trang giỏ hàng, kiểm tra các món, tổng tiền, (tùy chọn) áp mã khuyến mãi, dùng điểm, ghi chú cho quầy | Giỏ hàng lưu ở trình duyệt (FR-11…FR-16) |
| 2 | Khách hàng | Bấm "Thanh toán" để sang trang `/checkout` | Trang yêu cầu đăng nhập (PRE-1) |
| 3 | Next.js UI | Hiển thị danh sách món, tổng tiền, hai phương thức: Ví điện tử, Thẻ ngân hàng | |
| 4 | Khách hàng | Chọn phương thức thanh toán (Ví hoặc Thẻ) | |
| 5 | Khách hàng | Bấm **"Xác nhận thanh toán"** (trigger) | UI khóa nút, hiện "Đang xử lý thanh toán…" để tránh bấm lặp |
| 6 | Next.js UI | Gọi `POST /orders` kèm JWT (`Authorization: Bearer …`) với danh sách món, mã khuyến mãi, điểm, ghi chú | Không gửi giá |
| 7 | NestJS API | Xác thực JWT, validate dữ liệu đầu vào | NFR-04, NFR-05 |
| 8 | NestJS API | **Bắt đầu transaction.** Đọc sản phẩm và topping từ database, kiểm tra còn bán | |
| 9 | NestJS API | **Tính lại giá** từ dữ liệu database: đơn giá = giá cơ bản + phụ phí size + topping; tạm tính | BR-01, BR-02 |
| 10 | NestJS API | **Giữ tồn kho** bằng khóa lạc quan (kiểm tra đủ hàng, trừ kho theo `version`) | FR-18, BR-07 |
| 11 | NestJS API | Nếu có mã: kiểm tra hợp lệ, tính giảm giá, tăng lượt dùng. Nếu có điểm: kiểm tra đủ điểm và không vượt giá trị đơn, trừ điểm | BR-03, BR-04 |
| 12 | NestJS API | Tạo đơn `PENDING` cùng các dòng đơn và nhật ký trạng thái; **commit transaction**; trả đơn (HTTP 201) | FR-17 |
| 13 | Next.js UI | Nhận đơn, lưu mã đơn đang chờ; sinh `Idempotency-Key` mới | Khóa 8–100 ký tự |
| 14 | Next.js UI | Gọi `POST /payments` kèm JWT, header `Idempotency-Key`, body `{orderId, method}` | FR-19, FR-20 |
| 15 | NestJS API | Kiểm tra đơn thuộc về khách, đang `PENDING` hoặc `PAYMENT_FAILED`, không có giao dịch đang chờ | |
| 16 | NestJS API | **Giữ chỗ khóa idempotency**: tạo bản ghi thanh toán `PENDING` (ràng buộc unique theo khóa) | Chống gọi trùng song song |
| 17 | NestJS API | Gọi **Cổng thanh toán** (ngoài transaction) với số tiền = `total` của đơn | Số tiền lấy từ database |
| 18 | Cổng thanh toán | Xử lý và trả kết quả **thành công** kèm `transactionId` | Mô phỏng ~0,4 giây |
| 19 | NestJS API | **Bắt đầu transaction.** Cập nhật thanh toán thành `SUCCESS`; chuyển đơn `PENDING → PAID` (kiểm tra state machine + khóa lạc quan); ghi nhật ký trạng thái | FR-19, BR-10 |
| 20 | NestJS API | Cộng điểm thưởng cho khách đúng một lần (cờ `pointsAwarded`); **commit transaction**; trả `{success: true, replayed: false, payment, order}` | FR-22, BR-05 |
| 21 | Next.js UI | Xóa giỏ hàng, làm mới số điểm của khách, chuyển tới `/orders/{id}/success` | FR-23 |
| 22 | Khách hàng | Thấy xác nhận đơn: mã đơn, món, tổng tiền, phương thức, mã giao dịch, điểm được cộng | Use-case kết thúc thành công |

---

## 4. Luồng thay thế (Alternative flows)

| Mã | Điều kiện | Luồng xử lý | Kết quả |
|---|---|---|---|
| **A1** | Ở bước 2, khách **chưa đăng nhập** (hoặc token đã bị xóa) | UI chuyển khách tới `/login`. Sau khi đăng nhập (UC-02), khách quay lại giỏ hàng (giỏ vẫn còn vì lưu ở trình duyệt) và tiếp tục từ bước 2 | Quay lại luồng chính |
| **A2** | Ở bước 1, khách **áp mã khuyến mãi** | UI gọi `POST /promotions/validate` với mã và tạm tính. Hợp lệ thì hiển thị số tiền giảm và tổng mới; không hợp lệ thì hiển thị lý do. Ở bước 11 máy chủ **kiểm tra lại** mã | Quay lại bước 2 |
| **A3** | Ở bước 1, khách **dùng điểm thưởng** | Khách nhập số điểm (không vượt số điểm đang có và giá trị đơn sau giảm giá). UI tính tiền giảm = điểm × 500 đ. Máy chủ kiểm tra lại ở bước 11 | Quay lại bước 2 |
| **A4** | Ở bước 4, khách chọn **phương thức khác** (Ví hoặc Thẻ) | Hệ thống dùng nhà cung cấp tương ứng (Ví → MoMo, Thẻ → VNPay) ở bước 17 | Tiếp tục luồng chính |
| **A5** | Ở bước 14, **client gửi lại** yêu cầu thanh toán với **cùng `Idempotency-Key`** (bấm lặp, mạng chập chờn, tự thử lại) | Máy chủ tìm thấy bản ghi thanh toán cùng khóa. Nếu giao dịch đã xong: trả **đúng kết quả cũ** với `replayed = true`, **không gọi cổng thanh toán**, **không cộng điểm lần hai**. Nếu giao dịch đang xử lý (`PENDING`): trả HTTP 409 "đang được xử lý, vui lòng đợi" | Khách thấy cùng một kết quả |
| **A6** | Ở bước 18, cổng thanh toán **từ chối** hoặc **không phản hồi** | Chuyển sang **E6** | Thanh toán thất bại |
| **A7** | Sau thất bại (E6), khách chọn **thử lại** hoặc **đổi phương thức** | UI hủy đơn dang dở trước đó để hoàn kho, mã, điểm; sau đó tạo đơn mới (bước 6) và thanh toán với **`Idempotency-Key` mới** | Quay lại luồng chính ở bước 6 |
| **A8** | Sau thất bại (E6), khách chọn **hủy đơn** | Khách gọi `POST /orders/:id/cancel`. Hệ thống chuyển đơn `CANCELLED`, hoàn tồn kho, hoàn lượt mã, hoàn điểm đã dùng | Use-case kết thúc, giỏ hàng vẫn còn |

---

## 5. Luồng ngoại lệ (Exception flows)

| Mã | Tại bước | Điều kiện lỗi | Phản ứng của hệ thống | Mã HTTP | Giỏ hàng |
|---|---|---|---|---|---|
| **E1** | 2 | Giỏ hàng rỗng | Hiển thị "Chưa có gì để thanh toán" kèm nút tới thực đơn; nếu vẫn gọi API thì từ chối "Giỏ hàng đang trống" | 400 | — |
| **E2** | 7 | **JWT thiếu, sai hoặc hết hạn** | Từ chối yêu cầu; UI đưa khách đến trang đăng nhập | 401 | Giữ |
| **E3** | 7 | **Dữ liệu không hợp lệ**: size/đường/đá sai, số lượng ngoài 1…20, quá 30 dòng, ghi chú > 200 ký tự, trường lạ | Từ chối với thông báo tiếng Việt, **không tạo đơn** | 400 | Giữ |
| **E4** | 8 | Sản phẩm không tồn tại hoặc đã ngừng bán; topping không hợp lệ | Từ chối "Có sản phẩm không tồn tại hoặc đã ngừng bán" / "Có topping không hợp lệ"; **hoàn tác transaction** | 400 | Giữ (khách sửa giỏ) |
| **E5** | 10 | **Hết hàng / không đủ hàng** | Từ chối kèm tên món: "…đã hết hàng" hoặc "…chỉ còn N phần"; **hoàn tác transaction**, kho không đổi | 409 | Giữ (khách giảm số lượng hoặc bỏ món) |
| **E5b** | 10 | **Tranh chấp tồn kho**: nhiều khách mua cùng lúc, khóa lạc quan thất bại sau số lần thử tối đa | Từ chối "Nhiều khách đang đặt cùng lúc, vui lòng thử lại"; hoàn tác | 409 | Giữ |
| **E5c** | 11 | **Mã khuyến mãi không hợp lệ** (không tồn tại, bị tắt, hết hạn, hết lượt, chưa đạt đơn tối thiểu) | Từ chối với lý do cụ thể; **hoàn tác transaction** (kể cả kho đã giữ) | 400 | Giữ |
| **E5d** | 11 | **Điểm không đủ** hoặc vượt giá trị đơn | Từ chối "Bạn không đủ điểm thưởng" / "Số điểm sử dụng vượt quá giá trị đơn hàng"; hoàn tác | 400 | Giữ |
| **E6** | 18 | **Thanh toán thất bại**: cổng từ chối, hết thời gian chờ, hoặc ngoại lệ khi gọi cổng | Thanh toán `FAILED` kèm `failureReason`; đơn `PENDING → PAYMENT_FAILED`; **không cộng điểm**; trả `success = false`. UI chuyển tới `/orders/{id}/failed` với nút "Thử lại", "Đổi phương thức", "Hủy đơn" | 200 (`success=false`) | **Giữ nguyên** |
| **E7** | 5–20 | **Mất kết nối mạng** hoặc máy chủ không phản hồi | UI hiển thị "Mất kết nối tới máy chủ. Giỏ hàng vẫn được giữ, bạn thử lại nhé." và mở lại nút xác nhận. Nếu đơn đã tạo mà chưa biết kết quả thanh toán, khách có thể gửi lại cùng `Idempotency-Key` để lấy đúng kết quả (A5) | — | Giữ |
| **E8** | 14 | **Thiếu hoặc sai `Idempotency-Key`** (không có, < 8 hoặc > 100 ký tự) | Từ chối "Thiếu hoặc sai header Idempotency-Key" | 400 | Giữ |
| **E9** | 15 | Đơn **không tồn tại** hoặc **không thuộc về khách** | Từ chối "Không tìm thấy đơn hàng" | 404 | Giữ |
| **E10** | 15 | Đơn **không ở trạng thái chờ thanh toán** (đã `PAID`, `CANCELLED`…) | Từ chối "Đơn hàng không ở trạng thái chờ thanh toán" | 409 | — |
| **E11** | 15 | Đơn **đang có giao dịch chờ** (dưới 2 phút) | Từ chối "Đơn hàng đang được xử lý thanh toán" | 409 | Giữ |
| **E12** | 15–16 | **Khóa idempotency dùng cho đơn khác** hoặc của người khác | Từ chối "Idempotency-Key đã được dùng cho một yêu cầu thanh toán khác" | 422 | Giữ |
| **E13** | 16, 19 | **Cập nhật đồng thời** (hai yêu cầu cùng sửa một đơn): khóa lạc quan `version` thất bại | Chỉ một yêu cầu thành công; yêu cầu còn lại nhận "Đơn hàng vừa được cập nhật, vui lòng thử lại" | 409 | Giữ |
| **E14** | 17–19 | **Đơn bị hủy trong lúc chờ cổng thanh toán** | Thanh toán thành công thì ghi `REFUNDED` ("tiền được hoàn lại"); thất bại thì ghi `FAILED`; đơn **không** chuyển sang `PAID` | 200 | — |
| **E15** | 19 | **Lỗi hệ thống** khi ghi kết quả (database lỗi) | Hoàn tác transaction; giao dịch `PENDING` hết hạn sau 2 phút để không chặn đơn; khách có thể thử lại | 500 | Giữ |

---

## 6. Quy tắc nghiệp vụ áp dụng

| Mã | Quy tắc | Nguồn |
|---|---|---|
| BR-01 | Đơn giá = giá cơ bản + phụ phí size (S 0 / M 6.000 / L 12.000 đ) + tổng giá topping | SRS mục 5 |
| BR-02 | Tổng = tạm tính − giảm khuyến mãi − (điểm dùng × 500 đ); **giá luôn do máy chủ tính** | SRS mục 5 |
| BR-03 | Cách tính khuyến mãi `PERCENT` và `FIXED` | SRS mục 5 |
| BR-04 | Điều kiện hợp lệ của mã khuyến mãi | SRS mục 5 |
| BR-05 | Điểm tích lũy = ⌊tổng / 10.000⌋, cộng đúng một lần khi `PAID` | SRS mục 5 |
| BR-06 | Giới hạn: 20 ly/dòng, 30 dòng/đơn, 10 topping/dòng | SRS mục 5 |
| BR-07 | Tồn kho trừ khi tạo đơn, hoàn khi hủy | SRS mục 5 |
| BR-08 | Một `Idempotency-Key` ứng với đúng một giao dịch; giao dịch chờ quá 2 phút không còn chặn đơn | SRS mục 5 |
| BR-10 | Chỉ chuyển trạng thái đơn theo state machine (`PENDING → PAID`, `PENDING → PAYMENT_FAILED`, `PAYMENT_FAILED → PENDING`…) | SRS mục 1.4 |

---

## 7. Truy vết với yêu cầu

| Phần của use-case | Yêu cầu chức năng | Yêu cầu phi chức năng |
|---|---|---|
| Giỏ hàng, tổng tiền, mã, điểm, ghi chú (bước 1–4, A2, A3) | FR-11, FR-12, FR-13, FR-14, FR-15, FR-16 | NFR-09, NFR-11 |
| Yêu cầu đăng nhập, xác thực JWT (PRE-1, A1, E2) | FR-02, FR-05 | NFR-04, NFR-06 |
| Tạo đơn, validate, tính lại giá (bước 6–9, 12, E3, E4) | FR-17 | NFR-05, NFR-06 |
| Giữ tồn kho, transaction, tranh chấp (bước 8, 10, E5, E5b) | FR-09, FR-18 | NFR-08 |
| Mã khuyến mãi và điểm ở máy chủ (bước 11, E5c, E5d) | FR-14, FR-15 | NFR-08 |
| Thanh toán Ví / Thẻ (bước 14–20, A4) | FR-19 | NFR-03 |
| Chống thanh toán trùng (A5, E8, E11, E12) | FR-20 | NFR-08 |
| Thanh toán thất bại, thử lại, hủy (E6, A7, A8, E14) | FR-21, FR-26 | NFR-08 |
| Cộng điểm thưởng đúng một lần (bước 20) | FR-22 | NFR-08 |
| Màn hình xác nhận / lỗi (bước 21–22, E6, E7) | FR-23 | NFR-09 |
| Đơn xuất hiện cho nhân viên sau khi `PAID` (POST-S7) | FR-27, FR-28 | — |

---

## 8. Tiêu chí chấp nhận của use-case (dùng để viết test ở Task 4–5)

| ID | Kịch bản | Luồng | Kết quả mong đợi | Loại test gợi ý |
|---|---|---|---|---|
| **UC01-T01** | Đặt và thanh toán thành công bằng Ví | Chính | Đơn `PAID`; thanh toán `SUCCESS`; kho giảm đúng; điểm cộng; giỏ xóa; trang success | End-to-end |
| **UC01-T02** | Đặt và thanh toán bằng Thẻ | A4 | Giống T01, nhà cung cấp là VNPay | Integration |
| **UC01-T03** | Tính lại giá ở máy chủ khi client gửi giá thấp | Bước 9 | Tổng đơn theo database, không theo client | Integration |
| **UC01-T04** | Đặt đơn có mã khuyến mãi hợp lệ | A2 | Giảm đúng số tiền; lượt dùng mã tăng một | Integration |
| **UC01-T05** | Đặt đơn có dùng điểm | A3 | Điểm bị trừ; tổng đơn giảm đúng | Integration |
| **UC01-T06** | Chưa đăng nhập đặt đơn | A1, E2 | HTTP 401 / chuyển tới `/login`; không có đơn | Integration, E2E |
| **UC01-T07** | Giỏ rỗng | E1 | HTTP 400; không có đơn | Unit, Integration |
| **UC01-T08** | Dữ liệu không hợp lệ (số lượng 0 hoặc 21, size sai) | E3 | HTTP 400; không có đơn | Integration |
| **UC01-T09** | Hết hàng | E5 | HTTP 409 kèm tên món; không có đơn; kho không đổi | Unit, Integration |
| **UC01-T10** | Hai khách mua món cuối cùng đồng thời | E5b | Đúng một đơn thành công; kho = 0, không âm | Integration |
| **UC01-T11** | Mã khuyến mãi hết hạn / hết lượt / dưới mức tối thiểu | E5c | HTTP 400; kho và điểm được hoàn tác (không có đơn) | Unit, Integration |
| **UC01-T12** | Dùng điểm vượt số đang có | E5d | HTTP 400; không có đơn | Integration |
| **UC01-T13** | Cổng thanh toán từ chối | E6 | Thanh toán `FAILED`; đơn `PAYMENT_FAILED`; không cộng điểm; giỏ còn | Integration, E2E |
| **UC01-T14** | Thử lại sau thất bại bằng khóa mới | A7 | Đơn mới thanh toán thành công; đơn cũ bị hủy, kho hoàn đúng | Integration |
| **UC01-T15** | Gửi lại thanh toán cùng `Idempotency-Key` | A5 | `replayed = true`; cổng chỉ được gọi một lần; không cộng điểm hai lần | Unit, Integration |
| **UC01-T16** | Hai yêu cầu thanh toán song song cùng khóa | A5, E13 | Chỉ một giao dịch được tạo | Integration |
| **UC01-T17** | Thiếu `Idempotency-Key` | E8 | HTTP 400 | Integration |
| **UC01-T18** | Dùng khóa cũ cho đơn khác | E12 | HTTP 422 | Integration |
| **UC01-T19** | Thanh toán đơn của người khác | E9 | HTTP 404 | Integration |
| **UC01-T20** | Thanh toán đơn đã `PAID` | E10 | HTTP 409 | Integration |
| **UC01-T21** | Hủy đơn trong lúc cổng đang xử lý | E14 | Giao dịch `REFUNDED`; đơn không `PAID` | Unit |
| **UC01-T22** | Mất mạng khi thanh toán | E7 | Hiện thông báo; giỏ còn; gửi lại cùng khóa nhận đúng kết quả | E2E (giả lập mạng) |

---

## 9. Ngoài phạm vi của use-case này

| Nội dung | Nơi xử lý |
|---|---|
| Thêm món vào giỏ, chọn size và topping | UC-03, UC-04 |
| Đăng ký, đăng nhập | UC-02 |
| Theo dõi tiến trình sau khi trả tiền, xem lịch sử | UC-05 |
| Nhân viên pha chế và đổi trạng thái | UC-06 |
| Hoàn tiền thật qua cổng thanh toán | Ngoài phạm vi (chỉ đánh dấu `REFUNDED`) |
| Hóa đơn điện tử | Ngoài phạm vi |
| Giao hàng tận nơi | Ngoài phạm vi |
