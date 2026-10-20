# BrewLite – Bối cảnh, Stakeholder và Phạm vi (Task 1.1)

| Mục | Nội dung |
|---|---|
| Dự án | BrewLite – Ứng dụng đặt cà phê không dùng tiền mặt |
| Môn học | Công nghệ Phần mềm – Trường Đại học Sài Gòn, Khoa CNTT |
| Tài liệu | Assignment 2 – Task 1.1 |
| Phiên bản | 1.0 |
| Ngày lập | 17/10/2026 |
| Công nghệ bắt buộc | Next.js (frontend), NestJS (backend), PostgreSQL (CSDL), Docker |

---

## 1. Bối cảnh và vấn đề nghiệp vụ

### 1.1 Vấn đề

Một cửa hàng cà phê quy mô nhỏ đang vận hành theo cách truyền thống: khách xếp hàng tại quầy, xem bảng giá, gọi món bằng lời, trả tiền mặt rồi chờ. Cách làm này gây ra các vấn đề sau:

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Khách phải xếp hàng để xem menu và gọi món, nhất là giờ cao điểm | Mất thời gian, bỏ về, giảm doanh thu |
| P2 | Tùy chỉnh đồ uống (size, đường, đá, topping) truyền đạt bằng lời | Dễ nhầm đơn, pha sai, phải làm lại |
| P3 | Thanh toán tiền mặt, tìm tiền thừa | Chậm, sai sót, khó đối soát |
| P4 | Không biết còn hàng hay hết hàng cho đến khi gọi món | Khách bị từ chối sau khi đã chờ |
| P5 | Khách không biết đơn của mình đã được pha tới đâu | Phải hỏi lại nhân viên nhiều lần |
| P6 | Khuyến mãi và tích điểm quản lý thủ công | Áp sai mã, khó giới hạn lượt dùng |
| P7 | Không lưu lịch sử mua hàng | Khách không đặt lại được món quen, cửa hàng không có dữ liệu |

### 1.2 Giải pháp đề xuất

BrewLite là ứng dụng web mobile-first (hướng PWA) cho phép khách hàng đặt đồ uống và thanh toán không dùng tiền mặt ngay trên điện thoại, đồng thời cho nhân viên quầy nhận và cập nhật tiến độ pha chế.

Luồng nghiệp vụ tối thiểu của hệ thống:

```
Xem menu → Chọn tùy chọn → Giỏ hàng → Đặt đơn → Thanh toán → Theo dõi đơn
```

### 1.3 Mục tiêu sản phẩm

| Mã | Mục tiêu | Cách đo |
|---|---|---|
| G1 | Khách hoàn thành một đơn từ lúc mở menu đến lúc thanh toán xong trong thời gian ngắn | Luồng end-to-end chạy được, demo không lỗi |
| G2 | Không bán quá số lượng tồn kho, không trừ tiền hai lần | Kiểm thử đồng thời và kiểm thử idempotency đạt |
| G3 | Khách luôn biết trạng thái đơn của mình | Trang chi tiết đơn tự làm mới và hiển thị đúng trạng thái |
| G4 | Hệ thống triển khai được lên môi trường truy cập qua HTTPS | URL production hoạt động tại thời điểm nghiệm thu |
| G5 | Người ngoài nhóm clone repository và chạy được theo README | Chạy `docker compose up` thành công |

---

## 2. Stakeholder

### 2.1 Bảng stakeholder

| ID | Stakeholder | Vai trò / mô tả | Mức ảnh hưởng | Mức quan tâm |
|---|---|---|---|---|
| SH-01 | Khách hàng | Người đặt đồ uống và thanh toán qua ứng dụng; dùng chủ yếu trên điện thoại | Cao | Cao |
| SH-02 | Nhân viên quầy (barista) | Nhận đơn đã thanh toán, pha chế, cập nhật trạng thái, giao đồ cho khách | Cao | Cao |
| SH-03 | Quản lý cửa hàng | Quản lý menu, tồn kho, khuyến mãi, nhân viên, theo dõi doanh thu | Cao | Trung bình |
| SH-04 | Giảng viên / khách hàng nghiệm thu | Đặt yêu cầu bài tập, chấm điểm theo tiêu chí Assignment 2 | Rất cao | Rất cao |
| SH-05 | Nhóm phát triển (Nhóm 07) | Phân tích, thiết kế, hiện thực, kiểm thử, triển khai | Cao | Rất cao |
| SH-06 | Đơn vị thanh toán (Ví MoMo / Thẻ VNPay – mô phỏng) | Nhận yêu cầu thanh toán và trả kết quả thành công hoặc thất bại | Trung bình | Thấp |

### 2.2 Mục tiêu và kỳ vọng của từng stakeholder

| Stakeholder | Mục tiêu | Kỳ vọng cụ thể |
|---|---|---|
| **Khách hàng** (SH-01) | Gọi đồ uống nhanh, không phải xếp hàng, không dùng tiền mặt | Menu rõ ràng, chọn được size/đường/đá/topping; biết giá cuối cùng trước khi trả; thanh toán an toàn, không bị trừ tiền hai lần; biết khi nào đồ sẵn sàng; xem lại được đơn cũ; dùng được mã giảm giá và điểm thưởng |
| **Nhân viên quầy** (SH-02) | Nhận đúng đơn, pha đúng yêu cầu, ít phải hỏi lại khách | Chỉ thấy đơn đã thanh toán; thấy đủ tùy chọn và ghi chú; cập nhật trạng thái bằng thao tác đơn giản; không thể nhảy sai bước trạng thái |
| **Quản lý** (SH-03) | Vận hành cửa hàng hiệu quả, kiểm soát doanh thu và tồn kho | Quản lý được sản phẩm, tồn kho, khuyến mãi, tài khoản nhân viên; có báo cáo doanh thu; quyền cao hơn nhân viên |
| **Giảng viên / nghiệm thu** (SH-04) | Đánh giá năng lực áp dụng quy trình từ yêu cầu đến triển khai | Đủ tạo phẩm theo từng task, có lịch sử commit rõ, truy vết được yêu cầu → thiết kế → code → test, URL production hoạt động, tài liệu và README đầy đủ |
| **Nhóm phát triển** (SH-05) | Hoàn thành đúng hạn, đúng chất lượng, học được quy trình chuyên nghiệp | Phạm vi vừa sức, yêu cầu rõ ràng và kiểm thử được, công cụ CI/CD ổn định |
| **Đơn vị thanh toán** (SH-06) | Nhận yêu cầu hợp lệ, không bị gọi trùng | Mỗi giao dịch gửi một lần; mã giao dịch được ghi nhận; xử lý được lỗi và phản hồi chậm |

### 2.3 Xung đột lợi ích đã nhận diện

| Xung đột | Cách giải quyết |
|---|---|
| Khách muốn hủy đơn bất cứ lúc nào, nhân viên không muốn bỏ công pha đã làm | Chỉ cho khách hủy khi đơn ở trạng thái PENDING, PAYMENT_FAILED hoặc PAID (chưa pha). Từ PREPARING trở đi không được hủy |
| Quản lý muốn nhiều khuyến mãi, hệ thống cần chống lạm dụng | Mỗi mã có đơn tối thiểu, hạn dùng và giới hạn lượt dùng; máy chủ kiểm tra lại khi đặt đơn |
| Giảng viên yêu cầu đầy đủ chức năng, nhóm có thời gian giới hạn | Phân loại MoSCoW trong SRS; tập trung hoàn thiện luồng end-to-end trước, quản trị cửa hàng để mở rộng |

---

## 3. Phạm vi

### 3.1 Trong phạm vi MVP (In-scope)

| # | Nhóm chức năng | Nội dung |
|---|---|---|
| IS-1 | Xác thực | Đăng ký, đăng nhập, đăng xuất, JWT, phân quyền khách hàng / nhân viên |
| IS-2 | Menu | Xem danh sách đồ uống, tìm kiếm theo tên, lọc theo danh mục, hiển thị còn hàng / hết hàng |
| IS-3 | Chi tiết sản phẩm | Chọn size (S/M/L), topping, mức đường, mức đá; tính giá theo tùy chọn |
| IS-4 | Giỏ hàng | Thêm, sửa số lượng, xóa món; tính tổng tiền; lưu giỏ khi tải lại trang; ghi chú cho quầy |
| IS-5 | Khuyến mãi và điểm | Xem khuyến mãi đang chạy, áp mã giảm giá, dùng điểm thưởng, tích điểm sau thanh toán |
| IS-6 | Đặt đơn | Tạo đơn (PENDING), kiểm tra và giữ tồn kho, tính lại giá ở máy chủ |
| IS-7 | Thanh toán | Ví / Thẻ **mô phỏng**, chống thanh toán trùng bằng `Idempotency-Key`, xử lý thất bại và thử lại |
| IS-8 | Theo dõi đơn | Xác nhận đơn, lịch sử đơn (lọc, phân trang), chi tiết và tiến trình đơn, hủy đơn |
| IS-9 | Xử lý đơn tại quầy | Nhân viên cập nhật trạng thái PAID → PREPARING → READY → COMPLETED (tối thiểu qua API) |
| IS-10 | Hạ tầng và chất lượng | Docker Compose, CI/CD, kiểm thử, health check, triển khai production qua HTTPS |

### 3.2 Phạm vi mở rộng (làm nếu còn thời gian)

| # | Nội dung | Ghi chú |
|---|---|---|
| EX-1 | Giao diện cho nhân viên: danh sách đơn cần pha và nút cập nhật trạng thái | Hiện mới có API cập nhật trạng thái |
| EX-2 | Quản lý sản phẩm, tồn kho, topping và khuyến mãi dành cho quản lý | Hiện chỉnh bằng Prisma Studio hoặc seed |
| EX-3 | Quên mật khẩu có gửi email thật | Hiện chỉ có giao diện và API ghi log mô phỏng |
| EX-4 | PWA: cài đặt lên màn hình chính, hoạt động một phần khi mất mạng | Frontend hiện chưa có manifest và service worker |
| EX-5 | Thông báo đẩy khi đơn sẵn sàng | Cần PWA |

### 3.3 Ngoài phạm vi (Out-of-scope / Won't)

| # | Nội dung | Lý do |
|---|---|---|
| OS-1 | Tích hợp cổng thanh toán thật (MoMo, VNPay, thẻ ngân hàng thật) | Cần hợp đồng, chứng chỉ, ngoài khả năng bài tập; dùng cổng mô phỏng |
| OS-2 | Giao hàng tận nơi, theo dõi shipper, tính phí vận chuyển | BrewLite phục vụ nhận tại quầy |
| OS-3 | Báo cáo doanh thu và thống kê nâng cao | Ưu tiên thấp so với luồng đặt đơn |
| OS-4 | Quản lý nhân sự, ca làm, chấm công, lương | Không thuộc nghiệp vụ đặt đồ uống |
| OS-5 | Nhiều chi nhánh, nhiều cửa hàng | MVP chỉ một cửa hàng |
| OS-6 | Đặt lại đơn cũ bằng một thao tác | Có trong bản thiết kế giao diện nhưng không làm ở MVP |
| OS-7 | Đăng nhập bằng mạng xã hội (Google, Facebook) | Không bắt buộc |
| OS-8 | Ứng dụng di động native (iOS, Android) | Dùng web mobile-first / PWA |
| OS-9 | Hóa đơn điện tử, xuất hóa đơn VAT | Ngoài phạm vi môn học |
| OS-10 | Hoàn tiền thực qua cổng thanh toán | Hệ thống chỉ đánh dấu giao dịch REFUNDED |

---

## 4. Giả định

| ID | Giả định | Nếu sai thì |
|---|---|---|
| A-01 | Cửa hàng có một điểm bán duy nhất, khách nhận đồ tại quầy | Cần thêm giao hàng, nhiều chi nhánh (đã loại khỏi phạm vi) |
| A-02 | Khách có điện thoại có trình duyệt hiện đại và kết nối Internet | Cần chế độ offline, tăng công sức PWA |
| A-03 | Cổng thanh toán là mô phỏng, luôn phản hồi trong vài giây, có thể ép thất bại để demo | Phải xử lý timeout và đối soát thật |
| A-04 | Mỗi khách hàng được định danh bằng email duy nhất | Cần định danh bằng số điện thoại |
| A-05 | Giá niêm yết, phụ phí size và giá topping do máy chủ quyết định; tiền tệ là VND, số nguyên | Cần xử lý số thập phân và đa tiền tệ |
| A-06 | Một điểm thưởng quy đổi 500 đ; mỗi 10.000 đ của tổng đơn sau giảm giá được 1 điểm | Thay đổi hằng số trong cấu hình giá |
| A-07 | Nhân viên đã có tài khoản được cấp sẵn (seed); khách tự đăng ký | Cần chức năng quản lý tài khoản nhân viên |
| A-08 | Nhóm có thể dùng nền tảng triển khai miễn phí hoặc giá thấp (Render, Railway, Fly.io…) | Chuyển sang VPS |
| A-09 | Tồn kho tính theo từng sản phẩm, không tính nguyên liệu | Cần mô hình công thức, nguyên liệu |
| A-10 | Dữ liệu mẫu (menu, topping, khuyến mãi, tài khoản demo) đủ để kiểm thử và nghiệm thu | Bổ sung seed |

---

## 5. Ràng buộc

### 5.1 Ràng buộc kỹ thuật

| ID | Ràng buộc |
|---|---|
| C-01 | Frontend bắt buộc dùng **Next.js**, hướng mobile-first / PWA |
| C-02 | Backend bắt buộc dùng **NestJS**, tổ chức theo module / domain |
| C-03 | Cơ sở dữ liệu bắt buộc là **PostgreSQL**; có migration hoặc seed tái tạo được |
| C-04 | Đóng gói và chạy bằng **Docker**; có `docker-compose.yml` chạy web, API, database ở local |
| C-05 | Nhóm có thể bổ sung công nghệ khác nhưng không thay thế ba thành phần bắt buộc trên (đang dùng thêm Prisma, TailwindCSS, Zustand) |
| C-06 | Xác thực bằng JWT; mật khẩu không lưu dạng rõ |
| C-07 | Production phải truy cập qua HTTPS; database production không public trực tiếp |
| C-08 | Secret không xuất hiện trong repository hoặc log CI (chỉ commit `.env.example`) |

### 5.2 Ràng buộc quy trình

| ID | Ràng buộc |
|---|---|
| C-09 | Năm task thực hiện **tuần tự**; task sau chỉ nghiệm thu khi task trước đã có tạo phẩm trên kho mã nguồn |
| C-10 | Mọi thay đổi tài liệu và sơ đồ đi qua commit / pull request, ghi rõ lý do |
| C-11 | Pull request không được merge nếu lint, test hoặc build thất bại |
| C-12 | Sơ đồ phải lưu cả tệp nguồn (.puml, .drawio) và bản kết xuất (.png, .svg, .pdf) |

### 5.3 Ràng buộc nguồn lực

| ID | Ràng buộc |
|---|---|
| C-13 | Thời gian: một học kỳ (học kỳ I, năm học 2026–2027), hai Sprint |
| C-14 | Nhân lực: nhóm sinh viên Nhóm 07, vừa học vừa làm |
| C-15 | Chi phí: ưu tiên dịch vụ miễn phí hoặc chi phí rất thấp |

---

## 6. Rủi ro ban đầu

Điểm rủi ro = Xác suất (1–3) × Tác động (1–3).

| ID | Rủi ro | Xác suất | Tác động | Điểm | Biện pháp giảm thiểu |
|---|---|---|---|---|---|
| R-01 | Bán quá tồn kho khi nhiều khách đặt cùng lúc | 2 | 3 | 6 | Transaction, khóa lạc quan (`version`), kiểm thử đồng thời |
| R-02 | Khách bị trừ tiền hai lần khi bấm thanh toán nhiều lần hoặc mạng chập chờn | 2 | 3 | 6 | `Idempotency-Key` bắt buộc, ràng buộc unique, kiểm thử gửi lại |
| R-03 | Trễ tiến độ vì làm tuần tự năm task | 3 | 2 | 6 | Chia Sprint, theo dõi backlog, ưu tiên MoSCoW |
| R-04 | Triển khai production thất bại hoặc không truy cập được lúc chấm | 2 | 3 | 6 | Thử triển khai sớm từ Sprint 1, health check, smoke test, quy trình rollback |
| R-05 | Lộ secret (JWT_SECRET, mật khẩu CSDL) lên repository hoặc log | 2 | 3 | 6 | `.gitignore`, `.env.example`, secret của CI, rà soát trước mỗi lần merge |
| R-06 | Tài liệu, sơ đồ và mã nguồn mâu thuẫn nhau | 3 | 2 | 6 | Ma trận truy vết, review chéo, sửa tài liệu cùng pull request với code |
| R-07 | Nền tảng triển khai miễn phí bị giới hạn (ngủ đông, hết hạn mức, mất dữ liệu) | 2 | 2 | 4 | Chọn nền tảng có persistent storage, sao lưu seed |
| R-08 | Thành viên vắng hoặc phân công không đều | 2 | 2 | 4 | Phân công rõ trên issue board, họp ngắn mỗi tuần |
| R-09 | Chuyển trạng thái đơn sai thứ tự gây dữ liệu không nhất quán | 1 | 3 | 3 | State machine kiểm tra chuyển trạng thái, unit test |
| R-10 | Cổng thanh toán mô phỏng chậm hoặc lỗi làm treo đơn ở trạng thái xử lý | 2 | 2 | 4 | Giao dịch chờ có thời hạn (2 phút), xem như lỗi nếu cổng không phản hồi |
| R-11 | Thiếu chức năng quản trị khiến dữ liệu chỉ sửa được bằng công cụ lập trình | 3 | 1 | 3 | Ghi rõ là phạm vi mở rộng; dùng seed và Prisma Studio khi demo |

---

## 7. Tài liệu liên quan

| Tài liệu | Đường dẫn |
|---|---|
| SRS (yêu cầu chức năng, phi chức năng, tiêu chí chấp nhận) | `docs/requirements/srs.md` |
| Đặc tả use-case "Đặt và thanh toán đơn hàng" | `docs/requirements/usecase-spec-checkout.md` |
| Sơ đồ use-case tổng quát (nguồn PlantUML) | `docs/requirements/diagrams/usecase-overview.puml` |
| Sơ đồ use-case trọng tâm (nguồn PlantUML) | `docs/requirements/diagrams/usecase-checkout.puml` |
| Sơ đồ use-case đã vẽ trên draw.io | `CÁC SƠ ĐỒ/USECASE/` và `BrewLite_UseCase_Con.drawio` |
