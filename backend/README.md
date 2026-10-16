## CHẠY BACKEND
# 1 Database
#MỞ
docker compose up -d
docker compose up -d db
#TẮT
docker compose down

# 2 Backend
cd backend
cp .env.example .env
npm install && npx prisma generate && npx prisma db push && npm run seed
npm run start:dev       

# 3 Frontend
cd frontend
npm run dev


# Đã tạo
## Gốc
- main.ts, app.module.ts
  → Frontend: không có file riêng. Chỉ cần frontend chạy ở địa chỉ khớp `FRONTEND_URL` (để backend cho phép CORS) và gọi API tới cổng 4000.

## config/
- configuration.ts, env.validation.ts
  → Frontend: không có file tương ứng. Địa chỉ API phía frontend nên cấu hình trong `.env` của frontend, khớp với PORT của backend.

## prisma/
- prisma.module.ts, prisma.service.ts
  → Frontend: không liên quan.

## common/
- Decorator `public`
  → Frontend: các trang không cần đăng nhập: `app/thuc-don` (`components/pages/thucdon/MenuPage.tsx`), `components/pages/auth/Login.tsx`, `Register.tsx`, `ForgotPassoword.tsx`.
- Decorator `current-user`, guard `jwt-auth`
  → Frontend: các trang cần biết người dùng: `components/pages/thanhtoan/CheckoutPage.tsx`, `components/pages/chitietdonhang/OrderDetailPage.tsx`, và `components/Header.tsx` (nút Đăng nhập/Đăng ký sau này đổi thành tên người dùng).
- Decorator `roles`, guard `roles`
  → Frontend: chưa có giao diện cho nhân viên (STAFF), nên chưa có file tương ứng.
- Filter lỗi, interceptor bọc phản hồi
  → Frontend: không có file riêng. Mọi trang gọi API sẽ nhận chung một định dạng lỗi và phản hồi.

## modules/auth/
- module, controller, service, jwt.strategy
  → Frontend: `Login.tsx`, `Register.tsx`, `ForgotPassoword.tsx` (trong `components/pages/auth/`), và `components/Header.tsx` (hiển thị trạng thái đăng nhập).
- DTO đăng ký
  → Frontend: `Register.tsx` (họ tên, email, số điện thoại, mật khẩu, nhập lại mật khẩu).
- DTO đăng nhập
  → Frontend: `Login.tsx` (email, mật khẩu).
- DTO quên mật khẩu
  → Frontend: `ForgotPassoword.tsx` (email).

## modules/users/
- module, controller, service
  → Frontend: `Header.tsx` (tên người dùng), `CheckoutPage.tsx` (ô "Người nhận" lấy họ tên và số điện thoại), `OrderDetailPage.tsx`.
- update-profile.dto
  → Frontend: chưa có trang hồ sơ cá nhân, nên chưa có file tương ứng.

## modules/products/
- module, controller, service
  → Frontend: `components/pages/thucdon/MenuPage.tsx` (hiện đang để cứng `MENU_ITEMS`, sau này lấy từ API).
- DTO truy vấn
  → Frontend: các tab danh mục (`CATEGORIES`) trong `MenuPage.tsx`.
- DTO tạo, DTO cập nhật
  → Frontend: chưa có giao diện quản trị món, nên chưa có file tương ứng.

## modules/toppings/
- module, controller
  → Frontend: phần popup chọn topping trong `MenuPage.tsx`.


# Còn thiếu

## toppings/
- toppings.service.ts, dto/topping.dto.ts
  → Frontend: `MenuPage.tsx` (danh sách topping) và `components/pages/context/CartContext.tsx` (topping lưu trong từng món của giỏ).

## promotions/
- module, controller, service, dto/apply-promotion.dto.ts
  → Frontend: chưa có ô nhập mã trong `CheckoutPage.tsx` (mình đã bỏ dòng CHAO10 cố định). Các nơi nhắc tới mã CHAO10: `Register.tsx`, `OrderSuccess.tsx`, `OrderFailed.tsx`, `OrderDetailPage.tsx`.

## orders/
- module, controller, service
  → Frontend: `components/pages/giohang/CartPage.tsx`, `components/pages/thanhtoan/CheckoutPage.tsx` (tạo đơn), `OrderSuccess.tsx`, `OrderDetailPage.tsx`.
- create-order.dto.ts
  → Frontend: dữ liệu
 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


