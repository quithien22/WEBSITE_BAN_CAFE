# Task 4.4 – Thiết kế Continuous Integration

| Mục | Nội dung |
|---|---|
| Tài liệu | Assignment 2 – Task 4.4 (thiết kế) |
| Phiên bản | 1.0 – 17/10/2026 |
| Căn cứ | Đề bài mục 6.4; SRS: NFR-15, NFR-18, NFR-07 |
| Nền tảng | GitHub Actions (nếu dùng nền tảng khác thì giữ nguyên các bước và tên check) |

---

## 1. Yêu cầu

Pipeline CI chạy **tự động khi mở pull request**:

```
Install → Lint → Unit Test → Build
```

**Bắt buộc:** pull request **không được merge** nếu lint, test hoặc build thất bại.
**Minh chứng:** link PR đã chạy CI; ảnh hoặc log của một lần pipeline **thành công** và một lần pipeline **phát hiện lỗi**.

## 2. Thiết kế pipeline

```
 Pull request → main            Push vào main
        │                              │
        └────────────┬─────────────────┘
                     ▼
   ┌─────────── job: api ───────────┐   ┌─────────── job: web ───────────┐
   │ Install → Prisma generate →    │   │ Install → Lint →               │
   │ Lint → Unit Test → Build       │   │ Unit Test → Build              │
   └───────────────┬────────────────┘   └───────────────┬────────────────┘
                   └──────────────┬─────────────────────┘
                                  ▼
                       Status checks: api, web
                     (bắt buộc xanh mới được merge)
```

| Quyết định | Lý do |
|---|---|
| Hai job song song `api` và `web` | Nhanh hơn, và biết ngay phần nào lỗi |
| Tên job cố định `api`, `web` | Branch protection tham chiếu theo tên này |
| Mỗi job chạy đúng thứ tự Install → Lint → Test → Build | Khớp đề bài, lỗi nhẹ (lint) dừng trước khi tốn thời gian build |
| Dùng `npm ci` | Cài đúng theo `package-lock.json`, lặp lại được |
| Không cần secret ở Sprint 1 | Chưa deploy; tránh nguy cơ lộ secret |
| `permissions: contents: read` | Quyền tối thiểu cho token của workflow |
| `concurrency` hủy lần chạy cũ cùng nhánh | Tiết kiệm phút chạy |
| Không kết nối database thật | Test API mock Prisma; `prisma generate` không cần kết nối |

## 3. Bản nháp `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  NODE_VERSION: "22"

jobs:
  api:
    name: api
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      # Giá trị giả, chỉ để prisma generate chạy được; KHÔNG phải secret
      DATABASE_URL: postgresql://ci:ci@localhost:5432/ci?schema=public
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - name: Install
        run: npm ci
      - name: Prisma generate
        run: npm run prisma:generate -w apps/api
      - name: Lint
        run: npm run lint -w apps/api
      - name: Unit test
        run: npm test -w apps/api
      - name: Build
        run: npm run build -w apps/api

  web:
    name: web
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      NEXT_PUBLIC_API_URL: http://localhost:4000
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run lint -w apps/web
      - name: Unit test
        run: npm test -w apps/web
      - name: Build
        run: npm run build -w apps/web
```

> Phiên bản action (`checkout@v4`, `setup-node@v4`) là bản chủ đạo tại thời điểm viết thiết kế. Trước khi dùng, kiểm tra trên GitHub Marketplace phiên bản chính mới nhất và ghim theo số phiên bản chính.

## 4. Quy tắc để pipeline chạy đúng

| # | Quy tắc | Lý do |
|---|---|---|
| 1 | `package-lock.json` ở gốc được commit | `npm ci` bắt buộc có |
| 2 | Mỗi app có đủ script `lint`, `test`, `build` (xem `01-…md`, mục 2) | CI chỉ gọi các script này |
| 3 | `npm test` **không** chạy chế độ watch và **không** cần database, mạng | Chạy ổn định trên CI |
| 4 | Lint lỗi (error) làm job thất bại; cảnh báo không chặn nhưng nên bằng 0 | Giữ chất lượng |
| 5 | Build web không phụ thuộc API đang chạy (không gọi API lúc build) | Build trên CI không có API |
| 6 | Không in secret ra log; `.env` thật không bao giờ commit | NFR-07 |
| 7 | Chạy `npm run ci` ở máy local trước khi đẩy code | Giảm vòng lặp sửa lỗi |

## 5. Bảo vệ nhánh `main` (liên kết với CI)

| Thiết lập | Giá trị |
|---|---|
| Require a pull request before merging | Bật, 1 phê duyệt |
| Require status checks to pass | Bật; chọn check **`api`** và **`web`** |
| Require branches to be up to date | Bật |
| Do not allow bypassing | Bật (kể cả quản trị viên, nếu gói cho phép) |
| Block force pushes, block deletions | Bật |
| Merge method | Chỉ Squash |

Thứ tự thực hiện: tạo workflow và cho chạy **ít nhất một lần** trước, sau đó mới chọn được tên check trong danh sách điều kiện bắt buộc.

## 6. Kế hoạch minh chứng

Làm hai pull request mẫu, giữ lại (không xóa nhánh, không đóng PR bằng cách xóa) để chấm điểm.

| PR | Nhánh | Cách tạo | Kết quả mong đợi | Lưu |
|---|---|---|---|---|
| **PR-xanh** | `ci/demo-pass` | Thay đổi nhỏ hợp lệ (ví dụ cập nhật README) | `api` và `web` xanh, nút Merge sáng | Link PR, ảnh màn hình tab Checks |
| **PR-đỏ (lint)** | `ci/demo-fail-lint` | Cố ý thêm biến không dùng hoặc vi phạm quy tắc lint | Bước **Lint** đỏ, nút Merge bị khóa | Link PR, ảnh, log bước Lint |
| **PR-đỏ (test)** | `ci/demo-fail-test` | Cố ý làm một test thất bại | Bước **Unit test** đỏ, Merge bị khóa | Log bước Unit test |
| **PR-đỏ (build)** | `ci/demo-fail-build` | Cố ý gây lỗi kiểu TypeScript | Bước **Build** đỏ, Merge bị khóa | Log bước Build |

Đề bài chỉ cần một lần lỗi; làm đủ ba lỗi (lint, test, build) chứng minh cả ba cổng chặn hoạt động. Ghi kết quả vào `docs/sprint1/ci-evidence.md` theo bảng:

| Lần chạy | PR | Kết quả | Bước lỗi | Link run | Ảnh / log |
|---|---|---|---|---|---|
| 1 | … | Thành công | – | … | … |
| 2 | … | Thất bại | Lint | … | … |

## 7. Phạm vi mở rộng ở Sprint 2 (chỉ để định hướng, chưa làm ở Sprint 1)

| Hạng mục | Ghi chú |
|---|---|
| Job `integration` | Dùng service container PostgreSQL, chạy migration rồi integration test |
| Job `e2e` | Chạy `docker compose` rồi test end-to-end |
| `cd.yml` | Push hoặc tag → quality gate → build Docker image gắn SHA → push registry → deploy → migration an toàn → smoke test `GET /health` → dừng và rollback khi lỗi |
| Secret | Lưu ở GitHub Secrets (môi trường `production`), không ghi vào log |
