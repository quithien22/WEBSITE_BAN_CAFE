# Task 4.1 – Thiết kế repository và quy trình làm việc

| Mục | Nội dung |
|---|---|
| Tài liệu | Assignment 2 – Task 4.1 (thiết kế) |
| Phiên bản | 1.0 – 17/10/2026 |
| Căn cứ | Đề bài Assignment 2 (mục 6.1, mục 9), SRS (NFR-13, NFR-15, NFR-16, NFR-19) |
| Nguyên tắc | **Thiết kế là nguồn chuẩn.** Code phải khớp thiết kế. Nếu lệch: sửa code, hoặc sửa thiết kế bằng pull request có ghi lý do. Không sửa thiết kế chỉ vì code đang như vậy |

Các quyết định trong tài liệu này (monorepo, npm workspaces, GitHub Flow, Prisma migration) sẽ được ghi thành ADR ở Task 3: `001-monorepo`, `004-postgresql-prisma-migration`.

---

## 1. Cấu trúc repository đích

```
brewlite/
├── apps/
│   ├── web/                      # Next.js (App Router, TypeScript), mobile-first / PWA
│   │   ├── src/
│   │   │   ├── app/              # route: /menu, (Sprint 2) /menu/[id], /cart, /checkout, /orders...
│   │   │   ├── components/       # UI dùng chung và theo tính năng (menu/, cart/...)
│   │   │   ├── hooks/            # useProducts, ...
│   │   │   ├── lib/              # api.ts, format.ts
│   │   │   └── types/            # kiểu dữ liệu khớp API contract
│   │   ├── public/images/products/
│   │   ├── .env.example          # (tùy chọn) trỏ về .env.example gốc
│   │   └── package.json
│   └── api/                      # NestJS (TypeScript) theo module / domain
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── prisma/           # PrismaModule, PrismaService
│       │   ├── products/         # module, controller, service, dto, product-options.ts
│       │   ├── health/           # HealthController
│       │   └── common/           # filter, interceptor logging, constants
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/       # BẮT BUỘC có, commit vào repo
│       │   └── seed.ts
│       ├── test/                 # test chạy qua HTTP (supertest)
│       └── package.json
├── docs/
│   ├── requirements/             # Task 1
│   ├── diagrams/                 # Task 2
│   ├── architecture/             # Task 3 (+ adr/)
│   ├── sprint1/                  # Task 4 (các tài liệu thiết kế này)
│   ├── traceability-matrix.md
│   └── deployment.md             # Task 5
├── tests/                        # Integration / E2E (Sprint 2)
├── .github/
│   ├── workflows/ci.yml          # Task 4.4
│   ├── workflows/cd.yml          # Task 5.3 (Sprint 2)
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   └── CODEOWNERS
├── docker-compose.yml            # Sprint 1: chỉ db; Sprint 2: thêm api, web
├── package.json                  # npm workspaces
├── .nvmrc                        # 22
├── .editorconfig
├── .prettierrc
├── .gitignore
├── .env.example
└── README.md
```

---

## 2. Hợp đồng lệnh (script contract)

CI và mọi thành viên chỉ dùng các lệnh dưới đây. Mỗi app **bắt buộc** có đúng tên script.

**Ở thư mục gốc**

| Lệnh | Tác dụng |
|---|---|
| `npm ci` | Cài dependency toàn bộ workspace |
| `npm run dev:api` | Chạy API chế độ watch (cổng 4000) |
| `npm run dev:web` | Chạy web chế độ dev (cổng 3000) |
| `npm run db:up` / `db:down` | Bật / tắt PostgreSQL bằng Docker Compose |
| `npm run db:migrate` | Áp dụng migration vào database local |
| `npm run db:seed` | Nạp dữ liệu mẫu (chạy lại nhiều lần không lỗi, không trùng) |
| `npm run lint` | Lint mọi workspace |
| `npm test` | Unit/component test mọi workspace |
| `npm run build` | Build mọi workspace |
| `npm run ci` | `lint` rồi `test` rồi `build` – chạy trước khi đẩy code |

**Trong từng app**

| App | Scripts bắt buộc |
|---|---|
| `apps/api` | `start:dev`, `lint`, `test`, `build`, `prisma:generate`, `prisma:migrate`, `prisma:seed` |
| `apps/web` | `dev`, `lint`, `test`, `build`, `start` |

## 3. Cổng và biến môi trường

| Biến | Dùng ở | Giá trị mẫu | Ghi chú |
|---|---|---|---|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | docker compose | `brewlite`, `change_me_local_only`, `brewlite`, `5432` | Chỉ cho local |
| `DATABASE_URL` | api | `postgresql://brewlite:…@localhost:5432/brewlite?schema=public` | |
| `API_PORT` | api | `4000` | |
| `CORS_ORIGIN` | api | `http://localhost:3000` | Cho phép nhiều origin, ngăn cách bằng dấu phẩy |
| `NEXT_PUBLIC_API_URL` | web | `http://localhost:4000` | Biến `NEXT_PUBLIC_*` nằm trong bundle, **không** để secret |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | api (Sprint 2) | chuỗi ngẫu nhiên dài, `1d` | Chỉ ghi giá trị giả trong `.env.example` |

Cổng cố định: **web 3000, api 4000, postgres 5432** (khớp tiêu chí AC-N13.1 trong SRS).

---

## 4. Chiến lược nhánh (GitHub Flow)

| Nhánh | Mục đích | Quy tắc |
|---|---|---|
| `main` | Luôn ở trạng thái chạy được, là nguồn để triển khai | Được bảo vệ; chỉ nhận code qua pull request |
| `feature/<issue>-<mô-tả-ngắn>` | Tính năng, ví dụ `feature/12-menu-api` | Tách từ `main`, sống ngắn (tối đa vài ngày) |
| `fix/<issue>-<mô-tả>` | Sửa lỗi | Như trên |
| `docs/<mô-tả>` | Sửa tài liệu, sơ đồ | Như trên |
| `chore/<mô-tả>`, `ci/<mô-tả>` | Cấu hình, hạ tầng, pipeline | Như trên |

**Bảo vệ `main`** (Settings → Branches → Branch protection rule hoặc Rulesets):

1. Bắt buộc pull request, tối thiểu **1 người duyệt** (không phải tác giả).
2. Bắt buộc các status check **`api`** và **`web`** (xem `04-ci-design.md`) phải xanh.
3. Bắt buộc nhánh được cập nhật theo `main` trước khi merge.
4. Cấm force-push và cấm xóa `main`.
5. Tự hủy phê duyệt cũ khi có commit mới.
6. Chỉ cho **Squash merge**, tự xóa nhánh sau khi merge.

> Lưu ý: bảo vệ nhánh trên repo **private** có thể cần gói trả phí. Dùng repo public hoặc GitHub Student Developer Pack, và kiểm tra trước ở Sprint 1.

## 5. Quy tắc pull request

| Quy tắc | Chi tiết |
|---|---|
| Kích thước | Dưới khoảng 400 dòng thay đổi; lớn hơn thì tách |
| Tiêu đề | Theo Conventional Commits, ví dụ `feat(api): thêm GET /products` |
| Liên kết issue | Mô tả có `Closes #<số>` |
| Mô tả | Đủ các mục của template bên dưới |
| Duyệt | Ít nhất 1 người; tác giả không tự duyệt |
| Thay đổi tài liệu / sơ đồ / yêu cầu | Phải có mục **"Lý do thay đổi"** trong PR; sơ đồ phải kèm cả file nguồn và bản kết xuất |
| Merge | Squash; tiêu đề commit squash là tiêu đề PR |

**Mẫu `.github/PULL_REQUEST_TEMPLATE.md`**

```markdown
## Mục tiêu
<!-- PR này làm gì, vì sao -->

## Liên kết
Closes #

## Thay đổi chính
-

## Lý do thay đổi (bắt buộc nếu sửa docs / yêu cầu / sơ đồ / kiến trúc)
-

## Cách kiểm tra
<!-- lệnh chạy, ảnh chụp màn hình nếu có thay đổi giao diện -->

## Checklist (Definition of Done)
- [ ] `npm run ci` chạy xanh ở máy local
- [ ] Có test mới hoặc cập nhật test cho thay đổi
- [ ] Đã cập nhật tài liệu / README / `.env.example` nếu cần
- [ ] Đã cập nhật `docs/traceability-matrix.md` nếu liên quan FR/NFR
- [ ] Không có secret trong code, log, ảnh chụp
```

## 6. Quy ước commit (Conventional Commits)

Định dạng: `<type>(<scope>): <mô tả ngắn, thể mệnh lệnh, tối đa 72 ký tự>`

| type | Dùng khi |
|---|---|
| `feat` | Thêm tính năng |
| `fix` | Sửa lỗi |
| `docs` | Chỉ đổi tài liệu, sơ đồ |
| `test` | Thêm / sửa test |
| `refactor` | Đổi cấu trúc code, không đổi hành vi |
| `chore` | Cấu hình, dependency, script |
| `ci` | Pipeline CI/CD |
| `build` | Dockerfile, build config |

| scope | Ý nghĩa |
|---|---|
| `api`, `web`, `db`, `docs`, `ci`, `docker`, `repo` | Phần bị ảnh hưởng |

Ví dụ:
- `feat(api): thêm GET /products có lọc search và category`
- `test(web): kiểm thử trạng thái loading, empty, error của menu`
- `ci: chặn merge khi lint, test hoặc build thất bại`
- `docs(requirements): sửa FR-14 vì mã khuyến mãi không phân biệt hoa thường`

Với commit `docs`, phần thân commit (hoặc PR) có dòng `Why: <lý do>`. Tham chiếu issue ở cuối: `Refs #12`.

## 7. Phiên bản và tag

| Mốc | Tag | Ghi chú |
|---|---|---|
| Kết thúc Sprint 1 | `v0.1.0` | MVP xem menu + CI |
| Kết thúc Sprint 2 | `v1.0.0` | Bản bàn giao, kèm release notes |
| Image Docker (Task 5) | commit SHA hoặc `vX.Y.Z` | Xem `docs/deployment.md` |

Semantic Versioning: `MAJOR.MINOR.PATCH`. Release notes viết trong GitHub Releases.

## 8. Issue board và nhãn

**Bảng (GitHub Projects)**: cột `Backlog` → `Sprint 1` / `Sprint 2` → `In progress` → `In review` → `Done`.

| Nhóm nhãn | Giá trị |
|---|---|
| Loại | `feature`, `bug`, `tech`, `docs` |
| Ưu tiên | `must`, `should`, `could` |
| Khu vực | `web`, `api`, `db`, `ci`, `docs` |
| Sprint | `sprint-1`, `sprint-2` |

Mẫu issue (`.github/ISSUE_TEMPLATE/story.md`): **Câu chuyện** (Là… tôi muốn… để…), **Yêu cầu liên quan** (FR/NFR), **Tiêu chí chấp nhận** (AC-xx), **Ghi chú kỹ thuật**, **Ước lượng** (story point).

## 9. Tệp gốc bắt buộc

**`.gitignore`** phải loại trừ: `node_modules/`, `.env`, `.env.*` (trừ `.env.example`), `.next/`, `dist/`, `coverage/`, `*.log`, `.DS_Store`, thư mục dữ liệu Docker cục bộ.

**`.env.example`** (chỉ giá trị giả):

```dotenv
# --- Database (docker compose) ---
POSTGRES_USER=brewlite
POSTGRES_PASSWORD=change_me_local_only
POSTGRES_DB=brewlite
POSTGRES_PORT=5432
DATABASE_URL=postgresql://brewlite:change_me_local_only@localhost:5432/brewlite?schema=public

# --- API (apps/api) ---
NODE_ENV=development
API_PORT=4000
CORS_ORIGIN=http://localhost:3000

# --- Web (apps/web) ---
NEXT_PUBLIC_API_URL=http://localhost:4000

# --- Sprint 2 ---
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1d
```

**`.editorconfig` / `.prettierrc`**: UTF-8, LF, thụt lề 2 khoảng trắng, dấu nháy đơn, dấu chấm phẩy, `printWidth` 100, `trailingComma: all`.

**`CODEOWNERS`**: `/docs/ @<trưởng-nhóm>`, `/.github/ @<trưởng-nhóm>`, `/apps/api/ @<phụ-trách-api>`, `/apps/web/ @<phụ-trách-web>`.

**`README.md`** (Sprint 1 có các mục): Giới thiệu và luồng nghiệp vụ → Yêu cầu cài đặt (Node 22, Docker) → Chạy nhanh 5 bước (`cp .env.example .env`, `npm ci`, `npm run db:up`, `npm run db:migrate && npm run db:seed`, `npm run dev:api` và `npm run dev:web`) → Bảng lệnh → Cấu trúc thư mục → Mục lục `docs/` → Quy trình làm việc (nhánh, PR, commit) → Cách chạy test → (Task 5 bổ sung: build, deploy, rollback).

## 10. Công cụ tùy chọn (không bắt buộc)

`husky` + `lint-staged` (lint file đã staged trước khi commit) và `commitlint` (kiểm tra định dạng commit). Chỉ bật nếu cả nhóm đồng ý, vì CI vẫn là chốt chặn cuối cùng.
