# BrewLite – Đặc tả yêu cầu phần mềm rút gọn (SRS) (Task 1.2)

| Mục | Nội dung |
|---|---|
| Dự án | BrewLite – Ứng dụng đặt cà phê không dùng tiền mặt |
| Tài liệu | SRS rút gọn – Assignment 2, Task 1.2 |
| Phiên bản | 1.0 |
| Ngày lập | 17/10/2026 |
| Tài liệu liên quan | `context-and-scope.md`, `usecase-spec-checkout.md` |

---

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này liệt kê các yêu cầu chức năng (FR) và phi chức năng (NFR) của BrewLite, kèm mức ưu tiên và tiêu chí chấp nhận kiểm chứng được, làm cơ sở cho thiết kế (Task 2–3), hiện thực (Task 4–5) và viết test.

### 1.2 Quy ước

**Mức ưu tiên MoSCoW**

| Mức | Ý nghĩa |
|---|---|
| **Must** | Bắt buộc có trong MVP; thiếu thì luồng end-to-end không hoàn chỉnh |
| **Should** | Quan trọng, nên có trong MVP; làm sau Must |
| **Could** | Có thì tốt, làm nếu còn thời gian |
| **Won't** | Không làm ở phiên bản này (ghi nhận để không bị hiểu nhầm là sót) |

**Cột "Hiện trạng"** phản ánh mã nguồn trong thư mục `backend/` và `frontend/my-app/` tại thời điểm lập tài liệu, để nhóm biết việc còn lại:

| Ký hiệu | Ý nghĩa |
|---|---|
| ✔ | Đã có trong mã nguồn |
| ◐ | Có một phần |
| ✘ | Chưa có |

**Tiêu chí chấp nhận** viết theo dạng Cho / Khi / Thì (Given / When / Then) hoặc điều kiện đo được, để viết test trực tiếp.

### 1.3 Vai trò (actor)

| Actor | Mô tả |
|---|---|
| Khách hàng | Người dùng đặt đồ uống; có thể là khách chưa đăng nhập khi chỉ xem menu |
| Nhân viên quầy | Người pha chế; vai trò `STAFF` |
| Quản lý | Kế thừa mọi quyền của Nhân viên, thêm quyền quản trị cửa hàng |
| Cổng thanh toán (mô phỏng) | Hệ thống ngoài giả lập MoMo (Ví) và VNPay (Thẻ) |

### 1.4 Vòng đời trạng thái đơn hàng (dùng xuyên suốt tài liệu)

```
PENDING ──► PAID ──► PREPARING ──► READY ──► COMPLETED
   │          │
   │          └──► CANCELLED
   ├──► PAYMENT_FAILED ──► PENDING (thử lại) | CANCELLED
   └──► CANCELLED
```

`COMPLETED` và `CANCELLED` là trạng thái kết thúc.

---

## 2. Sơ đồ use-case tổng quát

Sơ đồ use-case tổng quát của toàn hệ thống nằm ở:

- Nguồn PlantUML: `docs/requirements/diagrams/usecase-overview.puml`
- Bản đã vẽ trên draw.io: `CÁC SƠ ĐỒ/USECASE/usecase(cnpm)_tongquat.drawio.png` (nguồn `BrewLite_UseCase_Con.drawio`, trang UC-0)

Danh sách use-case mức cao:

| Mã UC | Tên use-case | Actor chính | Yêu cầu liên quan |
|---|---|---|---|
| UC-01 | Đặt và thanh toán đơn hàng (**use-case trọng tâm**, xem `usecase-spec-checkout.md`) | Khách hàng; Cổng thanh toán | FR-17…FR-23 (kèm FR-14, FR-15) |
| UC-02 | Tài khoản và xác thực (đăng ký, đăng nhập, đăng xuất, quên mật khẩu) | Khách hàng, Nhân viên | FR-01…FR-05 |
| UC-03 | Xem thực đơn và chi tiết sản phẩm | Khách hàng | FR-06…FR-10 |
| UC-04 | Quản lý giỏ hàng (kèm mã khuyến mãi, điểm thưởng) | Khách hàng | FR-11…FR-16 |
| UC-05 | Theo dõi đơn hàng (lịch sử, chi tiết, hủy đơn) | Khách hàng | FR-24…FR-26 |
| UC-06 | Xử lý đơn tại quầy | Nhân viên | FR-27, FR-28 |
| UC-07 | Quản trị cửa hàng | Quản lý | FR-29…FR-31 |

> Ghi chú đối chiếu: file draw.io đánh số theo cây phân rã (UC-1 tài khoản, UC-2 thực đơn, UC-3 giỏ hàng, UC-4 đặt hàng và thanh toán, UC-5 theo dõi đơn, UC-6 xử lý đơn, UC-7 quản trị). Bảng trên là bản đánh số của SRS; bảng ánh xạ ở mục 6 giúp đối chiếu hai cách đánh số.

---

## 3. Yêu cầu chức năng (FR)

### 3.1 Tài khoản và xác thực

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-01 | Hệ thống cho phép khách hàng **đăng ký** tài khoản bằng họ tên, email, mật khẩu và số điện thoại (không bắt buộc) | Must | ✔ |
| FR-02 | Hệ thống cho phép người dùng **đăng nhập** bằng email và mật khẩu, trả về JWT và thông tin người dùng | Must | ✔ |
| FR-03 | Hệ thống cho phép người dùng **đăng xuất**, xóa phiên đăng nhập ở trình duyệt | Must | ✔ |
| FR-04 | Hệ thống cho phép yêu cầu **quên mật khẩu** bằng email, thông báo không tiết lộ email đã đăng ký hay chưa | Could | ◐ (giao diện + API ghi log mô phỏng, chưa gửi email thật) |
| FR-05 | Hệ thống **phân quyền theo vai trò** (`CUSTOMER`, `STAFF`): các API của khách yêu cầu JWT; API cập nhật trạng thái đơn chỉ cho `STAFF` | Must | ✔ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-01 | **AC-01.1** Cho email chưa tồn tại, họ tên ≥ 2 ký tự, mật khẩu ≥ 8 ký tự gồm cả chữ và số; khi gửi đăng ký thì nhận HTTP 201 kèm `accessToken` và `user`, và mật khẩu trong CSDL được lưu dạng băm (bcrypt).<br>**AC-01.2** Khi đăng ký bằng email đã tồn tại thì nhận HTTP 409 với thông báo "Email đã được sử dụng".<br>**AC-01.3** Khi mật khẩu < 8 ký tự hoặc thiếu chữ hoặc thiếu số, hoặc email sai định dạng, hoặc số điện thoại không đúng dạng `0xxxxxxxxx`/`+84xxxxxxxxx` thì nhận HTTP 400 và không tạo tài khoản.<br>**AC-01.4** Email được chuẩn hóa chữ thường và cắt khoảng trắng trước khi lưu. |
| FR-02 | **AC-02.1** Cho tài khoản đúng, khi đăng nhập đúng email và mật khẩu thì nhận HTTP 200 kèm JWT có chứa `sub`, `email`, `role`.<br>**AC-02.2** Khi sai email hoặc sai mật khẩu thì nhận HTTP 401 với cùng một thông báo "Email hoặc mật khẩu không đúng" (không phân biệt hai trường hợp).<br>**AC-02.3** Gọi `GET /auth/me` với JWT hợp lệ trả về thông tin người dùng (không chứa mật khẩu); không có JWT hoặc JWT sai thì HTTP 401. |
| FR-03 | **AC-03.1** Khi người dùng chọn đăng xuất, token bị xóa khỏi trình duyệt và các trang yêu cầu đăng nhập chuyển hướng về trang đăng nhập. |
| FR-04 | **AC-04.1** Khi gửi email bất kỳ (có hoặc không tồn tại) thì nhận HTTP 200 với cùng một thông báo.<br>**AC-04.2** Email sai định dạng thì HTTP 400. |
| FR-05 | **AC-05.1** Khách (`CUSTOMER`) gọi `PATCH /orders/:id/status` thì nhận HTTP 403.<br>**AC-05.2** Người chưa đăng nhập gọi `POST /orders`, `GET /orders/me`, `POST /payments` thì nhận HTTP 401.<br>**AC-05.3** Tài khoản `STAFF` gọi `PATCH /orders/:id/status` với trạng thái hợp lệ thì thành công. |

### 3.2 Thực đơn và sản phẩm

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-06 | Hệ thống hiển thị **danh sách menu** gồm tên, mô tả, danh mục, giá cơ bản, ảnh, tình trạng còn hàng; chỉ hiển thị sản phẩm đang bán; khách chưa đăng nhập vẫn xem được | Must | ✔ |
| FR-07 | Hệ thống cho phép **tìm kiếm theo tên** (không phân biệt hoa thường) và **lọc theo danh mục**, và lọc sản phẩm nổi bật | Should | ✔ |
| FR-08 | Hệ thống hiển thị **chi tiết sản phẩm** kèm tùy chọn: size (S, M, L với phụ phí 0 / 6.000 / 12.000 đ), topping đang bán, mức đường (0%, 30%, 50%, 70%, 100%), mức đá (Không đá, Ít đá, Đá bình thường); giá cập nhật theo tùy chọn đã chọn | Must | ✔ |
| FR-09 | Hệ thống hiển thị rõ **còn hàng / hết hàng** và không cho thêm sản phẩm hết hàng vào đơn | Must | ✔ (máy chủ chặn khi đặt đơn) |
| FR-10 | Hệ thống hiển thị **danh sách khuyến mãi đang chạy** (còn hạn, còn lượt dùng) | Should | ✔ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-06 | **AC-06.1** `GET /products` trả HTTP 200 với mảng sản phẩm; mỗi phần tử có `id`, `name`, `category`, `price`, `imageUrl`, `inStock`; không có sản phẩm `isActive = false`.<br>**AC-06.2** Không cần JWT để gọi.<br>**AC-06.3** Trang menu có trạng thái **đang tải**, **rỗng** (không có sản phẩm) và **lỗi** (không gọi được API) hiển thị riêng biệt. |
| FR-07 | **AC-07.1** `GET /products?search=cà phê` trả các sản phẩm có tên chứa chuỗi, không phân biệt hoa thường.<br>**AC-07.2** `GET /products?category=X` chỉ trả sản phẩm thuộc danh mục X.<br>**AC-07.3** Tìm kiếm không có kết quả thì trả mảng rỗng (HTTP 200) và giao diện hiện trạng thái rỗng. |
| FR-08 | **AC-08.1** `GET /products/:id` với id hợp lệ trả sản phẩm kèm `options.sizes`, `options.toppings`, `options.sugarLevels`, `options.iceLevels`.<br>**AC-08.2** Id không tồn tại hoặc sản phẩm đã ẩn thì HTTP 404.<br>**AC-08.3** Chọn size M + 2 topping giá 5.000 đ và 7.000 đ cho sản phẩm giá 30.000 đ thì đơn giá hiển thị là 30.000 + 6.000 + 5.000 + 7.000 = 48.000 đ. |
| FR-09 | **AC-09.1** Sản phẩm có `stock = 0` trả `inStock = false` và giao diện hiển thị "hết hàng".<br>**AC-09.2** Đặt đơn có sản phẩm hết hàng thì bị từ chối (xem FR-18). |
| FR-10 | **AC-10.1** `GET /promotions` chỉ trả mã đang `isActive`, trong khoảng `startsAt`…`endsAt`, và còn lượt dùng (`usedCount < usageLimit` hoặc không giới hạn).<br>**AC-10.2** Phản hồi không lộ trường nội bộ như `id`, `usedCount`. |

### 3.3 Giỏ hàng

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-11 | Hệ thống cho phép **thêm món, sửa số lượng, xóa món, xóa toàn bộ giỏ**. Các món cùng sản phẩm và cùng tùy chọn (size, đường, đá, topping) được **gộp** thành một dòng. Mỗi dòng tối đa 20 ly | Must | ✔ |
| FR-12 | Hệ thống **tính tổng tiền** giỏ hàng: tạm tính, giảm giá khuyến mãi, giảm giá điểm thưởng, tổng thanh toán | Must | ✔ |
| FR-13 | Hệ thống **lưu giỏ hàng** trong trình duyệt, không mất khi tải lại trang | Should | ✔ |
| FR-14 | Hệ thống cho phép **áp mã khuyến mãi** ở giỏ hàng: kiểm tra mã hợp lệ, hạn dùng, lượt dùng, đơn tối thiểu; loại giảm theo % (có trần tối đa) hoặc số tiền cố định; cho phép gỡ mã | Should | ✔ |
| FR-15 | Hệ thống cho phép **dùng điểm thưởng** để giảm giá (1 điểm = 500 đ), không vượt số điểm đang có và không vượt giá trị đơn sau giảm giá. Yêu cầu đã đăng nhập | Should | ✔ |
| FR-16 | Hệ thống cho phép **ghi chú cho quầy** (tối đa 200 ký tự) | Could | ✔ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-11 | **AC-11.1** Thêm hai lần cùng sản phẩm, size, đường, đá, topping thì giỏ có **một** dòng với số lượng cộng dồn.<br>**AC-11.2** Cùng sản phẩm nhưng khác size hoặc khác topping thì là **hai** dòng riêng.<br>**AC-11.3** Số lượng mỗi dòng luôn trong khoảng 1…20; cố tăng quá 20 thì giữ 20.<br>**AC-11.4** Xóa món làm dòng biến mất; "xóa toàn bộ" làm giỏ rỗng và trang giỏ hàng hiện trạng thái rỗng. |
| FR-12 | **AC-12.1** Tạm tính = tổng của (đơn giá × số lượng) mọi dòng.<br>**AC-12.2** Tổng thanh toán = tạm tính − giảm khuyến mãi − (điểm dùng × 500).<br>**AC-12.3** Tổng thanh toán không bao giờ âm. |
| FR-13 | **AC-13.1** Thêm món, tải lại trang (F5) thì giỏ hàng, ghi chú, mã đã áp, điểm đã chọn vẫn còn. |
| FR-14 | **AC-14.1** `POST /promotions/validate` với mã hợp lệ và `subtotal` đủ điều kiện trả `valid = true` và số tiền `discount`.<br>**AC-14.2** Mã không tồn tại, bị tắt, chưa tới ngày bắt đầu thì `valid = false` với thông báo "Mã giảm giá không hợp lệ".<br>**AC-14.3** Mã quá hạn thì thông báo "Mã giảm giá đã hết hạn"; hết lượt thì "Mã giảm giá đã hết lượt sử dụng"; `subtotal` < đơn tối thiểu thì thông báo nêu số tiền tối thiểu.<br>**AC-14.4** Mã `PERCENT` 10% cho tạm tính 100.000 đ giảm 10.000 đ; nếu có `maxDiscount` = 8.000 đ thì chỉ giảm 8.000 đ. Mã `FIXED` không giảm quá tạm tính.<br>**AC-14.5** Mã không phân biệt hoa thường (`chao10` = `CHAO10`). |
| FR-15 | **AC-15.1** Không cho dùng nhiều điểm hơn số điểm đang có; vượt thì bị từ chối ở bước đặt đơn.<br>**AC-15.2** Số điểm × 500 không vượt (tạm tính − giảm giá).<br>**AC-15.3** Người chưa đăng nhập không dùng được điểm. |
| FR-16 | **AC-16.1** Ghi chú > 200 ký tự bị từ chối (HTTP 400) khi đặt đơn.<br>**AC-16.2** Ghi chú hợp lệ được lưu trong đơn và hiển thị ở màn hình xác nhận. |

### 3.4 Đặt đơn

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-17 | Hệ thống cho phép khách đã đăng nhập **tạo đơn hàng** ở trạng thái `PENDING` từ giỏ hàng. **Giá luôn do máy chủ tính lại**, không tin giá từ client | Must | ✔ |
| FR-18 | Hệ thống **kiểm tra và giữ tồn kho** khi tạo đơn; thiếu hàng thì từ chối toàn bộ đơn; tồn kho không bao giờ âm kể cả khi nhiều khách đặt đồng thời | Must | ✔ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-17 | **AC-17.1** Cho JWT hợp lệ và giỏ hợp lệ, `POST /orders` trả HTTP 201 với đơn có `status = PENDING`, `subtotal`, `discount`, `total` do máy chủ tính.<br>**AC-17.2** Client gửi giá bất kỳ (kể cả giá thấp hơn) thì tổng tiền đơn vẫn theo giá trong CSDL.<br>**AC-17.3** Giỏ rỗng thì HTTP 400 "Giỏ hàng đang trống"; hơn 30 dòng, size/đường/đá không hợp lệ, số lượng ngoài 1…20 thì HTTP 400.<br>**AC-17.4** Sản phẩm không tồn tại hoặc đã ngừng bán, hoặc topping không hợp lệ thì HTTP 400 và không có đơn nào được tạo.<br>**AC-17.5** Đơn có ghi một dòng nhật ký trạng thái `PENDING`.<br>**AC-17.6** Mã khuyến mãi áp trong đơn được máy chủ kiểm tra lại và tăng lượt dùng; điểm đã dùng bị trừ khỏi tài khoản — tất cả trong cùng một transaction với việc tạo đơn. |
| FR-18 | **AC-18.1** Cho sản phẩm tồn 5, đặt 3 thì tồn còn 2.<br>**AC-18.2** Đặt 6 thì HTTP 409 với thông báo "chỉ còn 5 phần"; không đơn nào được tạo, tồn kho không đổi.<br>**AC-18.3** Sản phẩm tồn 0 thì HTTP 409 "đã hết hàng".<br>**AC-18.4** Với tồn 1 và 10 request đặt đồng thời mỗi request 1 ly, đúng **1** request thành công, tồn cuối là 0 (không âm).<br>**AC-18.5** Nếu bất kỳ bước nào của transaction lỗi thì toàn bộ thay đổi (kho, mã, điểm, đơn) được hoàn tác. |

### 3.5 Thanh toán

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-19 | Hệ thống cho phép **thanh toán đơn không dùng tiền mặt** bằng **Ví** (mô phỏng MoMo) hoặc **Thẻ** (mô phỏng VNPay). Thanh toán thành công chuyển đơn sang `PAID` | Must | ✔ |
| FR-20 | Hệ thống **chống thanh toán trùng (idempotency)**: mỗi yêu cầu thanh toán bắt buộc kèm header `Idempotency-Key` (8–100 ký tự). Gửi lại cùng khóa trả đúng kết quả cũ và **không gọi cổng thanh toán lần nữa** | Must | ✔ |
| FR-21 | Hệ thống **xử lý thanh toán thất bại**: đơn chuyển `PAYMENT_FAILED`, ghi lý do, giữ giỏ hàng; khách có thể thử lại hoặc đổi phương thức, hoặc hủy | Must | ✔ |
| FR-22 | Hệ thống **cộng điểm thưởng đúng một lần** cho mỗi đơn khi thanh toán thành công (1 điểm mỗi 10.000 đ của tổng đơn) | Should | ✔ |
| FR-23 | Hệ thống hiển thị **màn hình xác nhận đơn** (thành công) hoặc **màn hình lỗi** (thất bại) sau thanh toán, kèm mã đơn, tổng tiền, phương thức, mã giao dịch | Must | ✔ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-19 | **AC-19.1** Với đơn `PENDING` của chính khách, `POST /payments` (method `WALLET` hoặc `CARD`) thành công trả `success = true`, `payment.status = SUCCESS` có `transactionId`, và đơn chuyển `PAID`.<br>**AC-19.2** Method khác `WALLET`/`CARD` thì HTTP 400.<br>**AC-19.3** Đơn không phải của khách đang đăng nhập, hoặc không tồn tại thì HTTP 404.<br>**AC-19.4** Đơn không ở `PENDING` hoặc `PAYMENT_FAILED` (đã `PAID`, `CANCELLED`…) thì HTTP 409 "Đơn hàng không ở trạng thái chờ thanh toán".<br>**AC-19.5** Số tiền thanh toán luôn bằng `total` của đơn trong CSDL, không nhận số tiền từ client. |
| FR-20 | **AC-20.1** Thiếu hoặc sai độ dài `Idempotency-Key` thì HTTP 400.<br>**AC-20.2** Gửi hai lần cùng khóa và cùng đơn: lần hai trả cùng kết quả với `replayed = true`; cổng thanh toán chỉ được gọi **một** lần; chỉ có **một** bản ghi thanh toán.<br>**AC-20.3** Gửi đồng thời hai request cùng khóa: chỉ một request được xử lý, request còn lại nhận kết quả đã có hoặc HTTP 409 "đang được xử lý".<br>**AC-20.4** Dùng cùng khóa cho một đơn khác hoặc một người dùng khác thì HTTP 422.<br>**AC-20.5** Đơn đang có giao dịch chờ (dưới 2 phút) thì yêu cầu thanh toán mới với khóa khác bị HTTP 409 "đang được xử lý thanh toán". |
| FR-21 | **AC-21.1** Khi cổng từ chối (hoặc không phản hồi), `payment.status = FAILED` có `failureReason`, đơn chuyển `PAYMENT_FAILED`, `success = false`.<br>**AC-21.2** Sau thất bại, gửi thanh toán lại với khóa **mới** thì đơn chuyển lại `PENDING` rồi `PAID` nếu thành công.<br>**AC-21.3** Giỏ hàng ở trình duyệt vẫn còn sau thất bại.<br>**AC-21.4** Nếu đơn bị hủy trong lúc cổng đang xử lý thì giao dịch được ghi `REFUNDED` (thành công) hoặc `FAILED`, đơn không bị đổi sang `PAID`. |
| FR-22 | **AC-22.1** Đơn có tổng 85.000 đ thanh toán thành công thì điểm của khách tăng 8.<br>**AC-22.2** Gửi lại thanh toán (replay) không cộng điểm lần hai.<br>**AC-22.3** Thanh toán thất bại không cộng điểm. |
| FR-23 | **AC-23.1** Thanh toán thành công thì chuyển tới `/orders/{id}/success` và giỏ hàng bị xóa.<br>**AC-23.2** Thanh toán thất bại thì chuyển tới `/orders/{id}/failed` kèm nút thử lại.<br>**AC-23.3** Lỗi mạng khi thanh toán hiển thị thông báo và giữ nguyên giỏ hàng. |

### 3.6 Lịch sử và theo dõi đơn

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-24 | Hệ thống hiển thị **lịch sử đơn** của khách, sắp xếp mới nhất trước; lọc theo trạng thái, tháng, tìm theo mã đơn; phân trang | Must | ✔ |
| FR-25 | Hệ thống hiển thị **chi tiết đơn**: món, tùy chọn, giá, thanh toán, lịch sử trạng thái; trang **tự làm mới** định kỳ để khách theo dõi tiến trình | Must | ✔ (làm mới mỗi 8 giây) |
| FR-26 | Hệ thống cho phép khách **hủy đơn** khi đơn ở `PENDING`, `PAYMENT_FAILED` hoặc `PAID` (chưa pha chế); hủy thì hoàn tồn kho, hoàn lượt mã, hoàn điểm đã dùng, thu hồi điểm đã cộng, và đánh dấu giao dịch đã trả thành `REFUNDED` | Should | ✔ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-24 | **AC-24.1** `GET /orders/me` chỉ trả đơn của khách đang đăng nhập, sắp xếp `createdAt` giảm dần.<br>**AC-24.2** `?status=PAID` chỉ trả đơn `PAID`; `?month=2026-10` chỉ trả đơn tạo trong tháng đó; tháng sai định dạng thì HTTP 400.<br>**AC-24.3** `?search=1042` hoặc `#1042` trả đúng đơn mã 1042 của khách (nếu có); không khớp thì danh sách rỗng.<br>**AC-24.4** Phân trang: `pageSize` mặc định 10, tối đa 50; phản hồi có `total`, `page`, `pageSize`, `totalPages`.<br>**AC-24.5** Khách chưa có đơn thì giao diện hiện trạng thái rỗng. |
| FR-25 | **AC-25.1** `GET /orders/:id` trả đơn kèm `items`, `payment` (giao dịch mới nhất), `timeline` (lịch sử trạng thái) và cờ `canCancel`.<br>**AC-25.2** Khách xem đơn của người khác thì HTTP 404 (không lộ sự tồn tại).<br>**AC-25.3** Khi nhân viên đổi trạng thái, trang chi tiết đơn của khách hiển thị trạng thái mới trong tối đa 10 giây mà không cần tải lại. |
| FR-26 | **AC-26.1** Hủy đơn `PAID` thì đơn thành `CANCELLED`, tồn kho tăng lại đúng số đã giữ, lượt dùng mã giảm một, điểm đã dùng được hoàn, điểm đã cộng bị thu hồi (không xuống dưới 0), thanh toán `SUCCESS` thành `REFUNDED`.<br>**AC-26.2** Hủy đơn `PREPARING`, `READY` thì HTTP 400 "Đơn đang được pha chế nên không thể hủy".<br>**AC-26.3** Hủy đơn đã `CANCELLED` thì HTTP 400 "Đơn hàng đã được hủy trước đó"; hủy đơn `COMPLETED` cũng bị từ chối (HTTP 400).<br>**AC-26.4** Hủy đơn của người khác thì HTTP 404. |

### 3.7 Xử lý đơn tại quầy

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-27 | Hệ thống cho phép **nhân viên cập nhật trạng thái đơn** theo đúng thứ tự `PAID → PREPARING → READY → COMPLETED`; chuyển sai thứ tự bị từ chối; mỗi lần chuyển ghi nhật ký trạng thái | Must | ✔ (API); ✘ (giao diện) |
| FR-28 | Hệ thống hiển thị cho nhân viên **danh sách đơn cần pha** (đơn đã thanh toán, chưa hoàn tất) kèm tùy chọn và ghi chú | Should | ✘ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-27 | **AC-27.1** `STAFF` gọi `PATCH /orders/:id/status` với `PREPARING` trên đơn `PAID` thì thành công; sau đó `READY`, rồi `COMPLETED`.<br>**AC-27.2** Nhảy bước (vd `PAID → READY`) hoặc đi lùi thì HTTP 400 "Không thể chuyển trạng thái đơn hàng từ … sang …".<br>**AC-27.3** Giá trị ngoài `PREPARING`/`READY`/`COMPLETED` thì HTTP 400.<br>**AC-27.4** Đơn `PENDING` chưa thanh toán không thể chuyển `PREPARING`.<br>**AC-27.5** Hai nhân viên cập nhật cùng lúc: chỉ một thành công, người kia nhận HTTP 409.<br>**AC-27.6** Mỗi lần chuyển thêm một dòng vào nhật ký trạng thái. |
| FR-28 | **AC-28.1** Nhân viên thấy các đơn `PAID`, `PREPARING`, `READY` mới nhất trước, không thấy đơn `PENDING` hoặc `PAYMENT_FAILED`.<br>**AC-28.2** Khách (`CUSTOMER`) gọi API này bị HTTP 403. |

### 3.8 Quản trị cửa hàng

| ID | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|
| FR-29 | Quản lý **thêm / sửa / ẩn sản phẩm, điều chỉnh tồn kho, quản lý topping và mã khuyến mãi** | Could | ✘ (chỉnh bằng Prisma Studio / seed) |
| FR-30 | Quản lý xem **báo cáo doanh thu** và thống kê sản phẩm bán chạy | Won't | ✘ |
| FR-31 | Quản lý **tạo, khóa, phân quyền tài khoản nhân viên** | Won't | ✘ |
| FR-32 | Khách **đặt lại đơn cũ** bằng một thao tác từ lịch sử | Won't | ✘ |

**Tiêu chí chấp nhận**

| ID | Tiêu chí chấp nhận |
|---|---|
| FR-29 | **AC-29.1** (nếu làm) Chỉ vai trò quản lý gọi được; khách và nhân viên nhận HTTP 403. *Lưu ý: enum `Role` hiện chỉ có `CUSTOMER` và `STAFF`, cần bổ sung vai trò quản lý (ví dụ `MANAGER`) trước khi làm FR-29.*<br>**AC-29.2** Sản phẩm bị ẩn không còn xuất hiện ở `GET /products` nhưng đơn cũ vẫn hiển thị tên sản phẩm.<br>**AC-29.3** Tồn kho không thể đặt thành số âm. |
| FR-30, FR-31, FR-32 | Không làm ở MVP; không có tiêu chí chấp nhận. Ghi nhận để đối chiếu phạm vi. |

---

## 4. Yêu cầu phi chức năng (NFR)

| ID | Nhóm | Yêu cầu | Ưu tiên | Hiện trạng |
|---|---|---|---|---|
| NFR-01 | Hiệu năng | `GET /products` và `GET /products/:id` phản hồi nhanh với dữ liệu mẫu | Should | ✔ (cần đo) |
| NFR-02 | Hiệu năng | Trang menu tải và hiển thị được nội dung trên điện thoại qua mạng 4G trong thời gian chấp nhận được | Should | ◐ (cần đo) |
| NFR-03 | Hiệu năng | Thanh toán (cổng mô phỏng) hoàn tất và trả kết quả trong thời gian ngắn | Should | ✔ (cổng giả lập ~0,4 giây) |
| NFR-04 | Bảo mật | Mật khẩu băm bằng bcrypt; xác thực bằng JWT có thời hạn; API riêng tư yêu cầu JWT | Must | ✔ |
| NFR-05 | Bảo mật | Toàn bộ dữ liệu đầu vào được validate ở backend (whitelist trường, từ chối trường lạ) và ở frontend | Must | ✔ (backend); ◐ (frontend) |
| NFR-06 | Bảo mật | Khách chỉ truy cập được đơn của chính mình; giá và số tiền thanh toán luôn do máy chủ quyết định; API nhân viên giới hạn theo vai trò | Must | ✔ |
| NFR-07 | Bảo mật | Secret (JWT_SECRET, mật khẩu CSDL) không nằm trong repository hoặc log CI; chỉ có `.env.example`; production dùng HTTPS | Must | ◐ (chưa triển khai production) |
| NFR-08 | Toàn vẹn dữ liệu | Đặt đơn, hủy đơn, thanh toán thực hiện trong transaction; tồn kho, lượt mã, điểm thưởng nhất quán khi truy cập đồng thời (khóa lạc quan) | Must | ✔ |
| NFR-09 | Tính khả dụng | Giao diện **mobile-first**, dùng được từ chiều rộng 360 px; mọi màn hình dữ liệu có trạng thái tải, rỗng, lỗi; thông báo lỗi bằng tiếng Việt, dễ hiểu | Must | ✔ (desktop-first theo thiết kế, cần kiểm tra mobile) |
| NFR-10 | Tính khả dụng | **PWA**: có web app manifest, cài được lên màn hình chính | Could | ✘ |
| NFR-11 | Tính khả dụng | Giao diện tiếng Việt, tiền hiển thị theo VND (vd `48.000đ`) | Should | ✔ |
| NFR-12 | Tương thích | Chạy đúng trên bản mới và bản liền trước của Chrome, Edge, Safari (iOS) và Firefox | Should | ◐ (cần kiểm tra) |
| NFR-13 | Khả năng triển khai | `docker compose up --build` chạy đủ web, API, database ở local; có tài khoản và dữ liệu demo | Must | ✔ |
| NFR-14 | Khả năng triển khai | Có URL frontend production qua HTTPS, URL API, database production không public trực tiếp | Must | ✘ |
| NFR-15 | Khả năng triển khai | Pipeline CI (cài đặt → lint → test → build) và CD (build image → push registry → deploy → smoke test) có cách rollback | Must | ✘ |
| NFR-16 | Khả năng triển khai | Database tái tạo được bằng **migration** và **seed** | Must | ◐ (có seed; đang dùng `prisma db push`, chưa có migration) |
| NFR-17 | Vận hành | Có endpoint **health check** `GET /health` và ghi log hoạt động; cấu hình qua biến môi trường | Must | ◐ (có `GET /` trả trạng thái, chưa có `/health`) |
| NFR-18 | Khả năng kiểm thử | Có unit test cho nghiệp vụ quan trọng, integration test cho tạo đơn / thanh toán, ít nhất một end-to-end test từ menu đến xác nhận đơn | Must | ◐ (có unit test; chưa có integration, e2e) |
| NFR-19 | Khả năng bảo trì | Mã backend tổ chức theo module / domain; tài liệu thay đổi cùng commit / pull request; có ma trận truy vết yêu cầu → thiết kế → code → test | Should | ◐ |

### Tiêu chí chấp nhận cho yêu cầu phi chức năng

| ID | Tiêu chí chấp nhận (đo được) |
|---|---|
| NFR-01 | **AC-N01.1** Với dữ liệu seed, 95% yêu cầu `GET /products` có thời gian phản hồi **< 500 ms** (đo local bằng 50 lần gọi liên tiếp).<br>**AC-N01.2** `GET /products/:id` có p95 **< 500 ms**. |
| NFR-02 | **AC-N02.1** Trên Chrome DevTools giả lập 4G và thiết bị di động, trang `/menu` hiển thị nội dung sản phẩm trong **≤ 3 giây** (không tính lần tải đầu của môi trường lạnh trên nền tảng triển khai miễn phí). |
| NFR-03 | **AC-N03.1** `POST /payments` thành công trả kết quả trong **≤ 3 giây** trong 95% lần đo với cổng mô phỏng. |
| NFR-04 | **AC-N04.1** Không có mật khẩu dạng rõ trong CSDL (băm bắt đầu bằng `$2`).<br>**AC-N04.2** JWT hết hạn hoặc bị sửa thì mọi API riêng tư trả HTTP 401.<br>**AC-N04.3** JWT hết hạn sau thời gian cấu hình (`JWT_EXPIRES_IN`). |
| NFR-05 | **AC-N05.1** Gửi trường không khai báo trong DTO thì HTTP 400.<br>**AC-N05.2** Gửi kiểu dữ liệu sai (chuỗi thay vì số) thì HTTP 400.<br>**AC-N05.3** Biểu mẫu đăng ký, đăng nhập, thanh toán hiện thông báo lỗi ngay ở giao diện trước khi gọi API khi dữ liệu sai rõ ràng. |
| NFR-06 | **AC-N06.1** Khách A gọi `GET /orders/{id của B}` thì HTTP 404.<br>**AC-N06.2** Gọi API tạo đơn kèm trường giá do client tự đặt thì bị từ chối hoặc bị bỏ qua; tổng tiền luôn theo CSDL.<br>**AC-N06.3** `CUSTOMER` gọi API chỉ dành cho `STAFF` thì HTTP 403. |
| NFR-07 | **AC-N07.1** Tìm trong lịch sử Git và log CI không thấy giá trị thật của `JWT_SECRET` hoặc mật khẩu CSDL production.<br>**AC-N07.2** Truy cập `http://` production được chuyển sang `https://` hoặc bị từ chối.<br>**AC-N07.3** `.env` thật nằm trong `.gitignore`. |
| NFR-08 | **AC-N08.1** 10 request đặt hàng đồng thời cho sản phẩm tồn 1 chỉ có 1 đơn thành công, tồn cuối là 0.<br>**AC-N08.2** Lỗi giữa chừng khi tạo đơn không để lại thay đổi nào về kho, mã, điểm.<br>**AC-N08.3** Hủy đơn hai lần liên tiếp không hoàn kho hai lần. |
| NFR-09 | **AC-N09.1** Ở chiều rộng 360 px, các trang menu, chi tiết, giỏ hàng, thanh toán, lịch sử đơn không cuộn ngang và thao tác chính (thêm món, thanh toán) bấm được.<br>**AC-N09.2** Mỗi trang lấy dữ liệu có đủ ba trạng thái tải / rỗng / lỗi.<br>**AC-N09.3** Thông báo lỗi từ API hiển thị bằng tiếng Việt; không hiện mã lỗi kỹ thuật hoặc stack trace. |
| NFR-10 | **AC-N10.1** (nếu làm) Lighthouse PWA nhận ra manifest hợp lệ và trình duyệt di động đề nghị "Thêm vào màn hình chính". |
| NFR-11 | **AC-N11.1** Mọi số tiền hiển thị có dấu phân cách nghìn và hậu tố `đ`. |
| NFR-12 | **AC-N12.1** Luồng menu → giỏ → thanh toán → xác nhận chạy không lỗi trên Chrome, Edge, Firefox (máy tính) và Safari iOS hoặc Chrome Android (điện thoại). |
| NFR-13 | **AC-N13.1** Trên máy sạch đã cài Docker, chạy `docker compose up --build` thì sau tối đa vài phút truy cập được `http://localhost:3000` (web) và `http://localhost:4000` (API), đăng nhập được bằng tài khoản demo trong README. |
| NFR-14 | **AC-N14.1** URL frontend mở được bằng HTTPS; gọi `GET {API}/health` trả HTTP 200.<br>**AC-N14.2** Không kết nối được trực tiếp tới cổng PostgreSQL production từ Internet. |
| NFR-15 | **AC-N15.1** Mở pull request thì CI tự chạy cài đặt, lint, test, build; một bước lỗi thì PR không merge được.<br>**AC-N15.2** Push tag hoặc merge vào nhánh chính thì pipeline tạo image gắn commit SHA hoặc phiên bản, đẩy registry, triển khai, chạy smoke test.<br>**AC-N15.3** Smoke test thất bại thì pipeline dừng và README mô tả cách rollback. |
| NFR-16 | **AC-N16.1** Trên database trống, chạy migration và seed tạo lại được đầy đủ bảng và dữ liệu mẫu (sản phẩm, topping, khuyến mãi, tài khoản demo).<br>**AC-N16.2** Chạy seed hai lần không tạo dữ liệu trùng hoặc lỗi. |
| NFR-17 | **AC-N17.1** `GET /health` trả HTTP 200 kèm trạng thái ứng dụng (và trạng thái kết nối database); khi database không kết nối được thì trả mã lỗi.<br>**AC-N17.2** Cấu hình (URL database, JWT secret, cổng, origin frontend) đọc từ biến môi trường, không cứng trong mã. |
| NFR-18 | **AC-N18.1** `npm test` ở backend chạy thành công, bao phủ ít nhất: state machine đơn hàng, giữ tồn kho, khuyến mãi, thanh toán idempotent.<br>**AC-N18.2** Có integration test cho `POST /orders` và `POST /payments`.<br>**AC-N18.3** Có ít nhất một end-to-end test đi từ menu tới xác nhận đơn. |
| NFR-19 | **AC-N19.1** Mỗi FR mức Must có một dòng trong `docs/traceability-matrix.md`.<br>**AC-N19.2** Mọi thay đổi tài liệu có commit hoặc PR kèm lý do. |

---

## 5. Quy tắc nghiệp vụ dùng chung

| Mã | Quy tắc |
|---|---|
| BR-01 | Đơn giá một dòng = giá cơ bản sản phẩm + phụ phí size + tổng giá topping; thành tiền = đơn giá × số lượng. Phụ phí size: S = 0, M = 6.000 đ, L = 12.000 đ |
| BR-02 | Tạm tính = tổng thành tiền các dòng. Giảm giá khuyến mãi tính trên tạm tính. Giảm giá điểm = số điểm × 500 đ. Tổng = tạm tính − giảm khuyến mãi − giảm điểm |
| BR-03 | Khuyến mãi `PERCENT`: giảm = ⌊tạm tính × giá trị / 100⌋, không vượt `maxDiscount` (nếu có), không vượt tạm tính. Khuyến mãi `FIXED`: giảm = min(giá trị, tạm tính) |
| BR-04 | Mã khuyến mãi hợp lệ khi đang bật, trong khoảng thời gian áp dụng, còn lượt dùng, tạm tính đạt đơn tối thiểu |
| BR-05 | Điểm tích lũy = ⌊tổng đơn / 10.000⌋, chỉ cộng một lần khi đơn thanh toán thành công |
| BR-06 | Mỗi dòng đơn tối đa 20 ly; một đơn tối đa 30 dòng; mỗi dòng tối đa 10 topping |
| BR-07 | Tồn kho trừ ngay khi tạo đơn (giữ hàng) và hoàn lại khi hủy đơn |
| BR-08 | Mỗi giao dịch thanh toán gắn với một `Idempotency-Key` duy nhất; giao dịch ở trạng thái chờ quá 2 phút không còn chặn đơn |
| BR-09 | Khách chỉ hủy được đơn khi chưa pha chế (`PENDING`, `PAYMENT_FAILED`, `PAID`) |
| BR-10 | Chỉ chuyển trạng thái đơn theo vòng đời ở mục 1.4 |

---

## 6. Bảng ánh xạ mã use-case

| Mã trong SRS | Mã trong draw.io (`BrewLite_UseCase_Con.drawio`) |
|---|---|
| UC-01 Đặt và thanh toán đơn hàng | UC-4 (4.1 Đặt hàng, 4.2 Thanh toán) cùng 3.1.7 và 3.1.8 |
| UC-02 Tài khoản và xác thực | UC-1 |
| UC-03 Xem thực đơn và chi tiết | UC-2 |
| UC-04 Quản lý giỏ hàng | UC-3 |
| UC-05 Theo dõi đơn hàng | UC-5 |
| UC-06 Xử lý đơn tại quầy | UC-6 |
| UC-07 Quản trị cửa hàng | UC-7 |

---

## 7. Tổng hợp mức ưu tiên

| Ưu tiên | Số lượng | Mã yêu cầu |
|---|---|---|
| **Must** | FR: 18; NFR: 12 | FR-01, 02, 03, 05, 06, 08, 09, 11, 12, 17, 18, 19, 20, 21, 23, 24, 25, 27; NFR-04, 05, 06, 07, 08, 09, 13, 14, 15, 16, 17, 18 |
| **Should** | FR: 8; NFR: 6 | FR-07, 10, 13, 14, 15, 22, 26, 28; NFR-01, 02, 03, 11, 12, 19 |
| **Could** | FR: 3; NFR: 1 | FR-04, 16, 29; NFR-10 |
| **Won't** | FR: 3 | FR-30, 31, 32 |
| **Tổng** | FR: 32; NFR: 19 | |

### Khoảng cách hiện trạng cần xử lý ở các task sau

Các yêu cầu **Must** chưa đạt hoàn toàn (theo cột "Hiện trạng"): FR-27 (thiếu giao diện nhân viên), NFR-07, NFR-14, NFR-15 (chưa triển khai production, chưa CI/CD), NFR-16 (chưa có migration), NFR-17 (chưa có `GET /health`), NFR-18 (chưa có integration và e2e test), NFR-05 (kiểm tra thêm validate ở frontend).
