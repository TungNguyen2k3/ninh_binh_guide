# Sprint Planning — Ninh Bình Audio Guide

## Tổng quan: 5 sprints × 2 tuần = 10 tuần

---

## Sprint 1 — Foundation & Auth (Tuần 1–2)

### Mục tiêu
Dựng skeleton dự án hoàn chỉnh, implement module Auth end-to-end.

### Backend tasks
- [ ] **S1-B1** Khởi tạo Fastify project, cấu trúc Clean Architecture
- [ ] **S1-B2** Setup Prisma schema (users, refresh_tokens)
- [ ] **S1-B3** Migration: create users + refresh_tokens tables
- [ ] **S1-B4** Domain: `User` entity, `IUserRepository`, `IJwtService`, `IHashService`
- [ ] **S1-B5** Infrastructure: `JwtService` (HS256, sign/verify), `BcryptService`
- [ ] **S1-B6** Infrastructure: `UserRepository` (Prisma), `RefreshTokenRepository`
- [ ] **S1-B7** Use cases: `RegisterUseCase`, `LoginUseCase`
- [ ] **S1-B8** Use cases: `RefreshTokenUseCase`, `LogoutUseCase`
- [ ] **S1-B9** Middleware: `authenticate`, `requireRole`
- [ ] **S1-B10** Routes: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- [ ] **S1-B11** Global error handler + response format helpers
- [ ] **S1-B12** Rate limiting trên login endpoint (5 req/15min/IP)

### Frontend tasks
- [ ] **S1-F1** Khởi tạo Nuxt 3 project, cài Tailwind, Pinia, i18n
- [ ] **S1-F2** Layout: `default.vue` (tourist), `admin.vue`, `staff.vue`
- [ ] **S1-F3** Auth store: state, login/logout/refresh actions
- [ ] **S1-F4** Global auth middleware (route protection)
- [ ] **S1-F5** Page: `/auth/login` (form email/phone + password)
- [ ] **S1-F6** Page: `/auth/register` (tourist tự đăng ký)
- [ ] **S1-F7** UI components: `AppButton`, `AppInput`, `AppToast`
- [ ] **S1-F8** `utils/api.ts` — $fetch wrapper với auto-attach token + refresh

### Definition of Done
- Tourist có thể register, login, nhận JWT, logout
- Admin và staff login được
- Token refresh hoạt động (httpOnly cookie)
- Route protection hoạt động cho tất cả roles

---

## Sprint 2 — Location & Package Management (Tuần 3–4)

### Mục tiêu
Admin quản lý đầy đủ nội dung địa điểm và gói tham quan.

### Backend tasks
- [ ] **S2-B1** Prisma schema: `locations`, `packages`, `package_locations`
- [ ] **S2-B2** Domain entities + interfaces cho Location, Package
- [ ] **S2-B3** `S3StorageService` — upload file, get signed URL
- [ ] **S2-B4** Use cases Location: Create, Update, Delete, List, GetDetail
- [ ] **S2-B5** Use case: `UploadAudioUseCase` — nhận mp3, upload S3, update location
- [ ] **S2-B6** Use cases Package: Create, Update, List, AssignLocations
- [ ] **S2-B7** Routes admin locations + packages (requireRole('admin'))

### Frontend tasks
- [ ] **S2-F1** Admin layout với sidebar navigation
- [ ] **S2-F2** Page: `/admin/locations` — table + search + pagination
- [ ] **S2-F3** Page: `/admin/locations/new` + `/admin/locations/[id]/edit`
- [ ] **S2-F4** Form upload audio mp3 + preview
- [ ] **S2-F5** Page: `/admin/packages` — CRUD packages
- [ ] **S2-F6** UI: assign locations vào custom package (multi-select)

### Definition of Done
- Admin CRUD đầy đủ locations với audio upload
- Admin CRUD packages, assign locations
- Dữ liệu mẫu: 5–10 địa điểm Ninh Bình thật

---

## Sprint 3 — Ticket System (Tuần 5–6)

### Mục tiêu
Staff tạo vé, tourist kích hoạt vé và truy cập nội dung.

### Backend tasks
- [ ] **S3-B1** Prisma schema: `tickets`, `ticket_users`
- [ ] **S3-B2** `TicketCodeGenerator` service
- [ ] **S3-B3** Use cases: `CreateTicketUseCase`, `ListTicketsUseCase`
- [ ] **S3-B4** Use case: `ActivateTicketUseCase` (tourist nhập code → liên kết account)
- [ ] **S3-B5** Use case: `CheckTicketAccessUseCase` (location có thuộc gói không?)
- [ ] **S3-B6** Routes staff: tạo + list tickets
- [ ] **S3-B7** Route tourist: `POST /auth/activate-ticket`
- [ ] **S3-B8** Admin stats: `GET /admin/stats/tickets`

### Frontend tasks
- [ ] **S3-F1** Staff layout (simplified, mobile-friendly)
- [ ] **S3-F2** Page: `/staff/tickets` — list tickets đã tạo
- [ ] **S3-F3** Page: `/staff/tickets/new` — form tạo ticket (chọn package, nhập tên/phone khách)
- [ ] **S3-F4** Print/share ticket code (QR hoặc text)
- [ ] **S3-F5** Page: `/auth/activate` — tourist nhập mã vé
- [ ] **S3-F6** Flow sau activate: redirect → `/explore`
- [ ] **S3-F7** Admin page: `/admin/tickets` — view all + filter

### Definition of Done
- Staff tạo ticket → nhận code `NBG-XXXXXX`
- Tourist activate ticket → JWT update với ticketId
- Tourist bị redirect về activate nếu chưa có ticket

---

## Sprint 4 — Tourist Experience (Tuần 7–8)

### Mục tiêu
Trải nghiệm cốt lõi của du khách: bản đồ + audio + nội dung địa điểm.

### Backend tasks
- [ ] **S4-B1** Route tourist: `GET /locations` (filtered by ticket)
- [ ] **S4-B2** Route tourist: `GET /locations/:slug` (detail + signed audio URL)
- [ ] **S4-B3** Caching Redis: locations list (TTL 5 phút), audio URLs (TTL 2h)
- [ ] **S4-B4** i18n response: trả `nameVi`/`nameEn` theo `Accept-Language` header

### Frontend tasks
- [ ] **S4-F1** Page: `/explore` — bottom tab navigation (Bản đồ / Danh sách)
- [ ] **S4-F2** Component: `MapView.vue` (Leaflet, markers, click → panel)
- [ ] **S4-F3** Component: `LocationCard.vue` — thumbnail, tên, mô tả ngắn
- [ ] **S4-F4** Page: `/explore/[slug]` — chi tiết địa điểm (ảnh, mô tả đầy đủ)
- [ ] **S4-F5** Component: `AudioPlayer.vue` (play/pause, progress, speed)
- [ ] **S4-F6** Language switcher (vi/en) trong header — lưu vào cookie
- [ ] **S4-F7** Location list view (alternative to map)
- [ ] **S4-F8** Loading states + skeleton screens

### Definition of Done
- Tourist xem bản đồ với markers địa điểm trong gói
- Click marker → xem thông tin + nghe audio
- Đổi ngôn ngữ → toàn bộ nội dung switch vi/en

---

## Sprint 5 — Polish & Deploy (Tuần 9–10)

### Mục tiêu
Hoàn thiện UX cần thiết, deploy lên nền tảng free — không Docker, không cần setup phức tạp.

### Nền tảng deploy (free tier, không Docker)

| Thành phần | Nền tảng | Ghi chú |
|---|---|---|
| Backend (Fastify) | **Railway** | Deploy từ GitHub, free tier đủ dùng, tự cấp domain |
| Frontend (Nuxt) | **Vercel** | Connect GitHub → auto deploy, CDN sẵn |
| Database (PostgreSQL) | **Railway** (plugin) | Tạo thẳng trong Railway project, không cần setup |
| File storage (audio/image) | **Cloudinary** free tier | Upload mp3/ảnh, có CDN, 25GB free |
| Redis (cache) | Bỏ Redis | Dùng in-memory cache đơn giản thay thế, đủ cho MVP |

### Backend tasks
- [ ] **S5-B1** Bỏ Redis — thay bằng `node-cache` (in-memory, zero config)
- [ ] **S5-B2** Thay `S3StorageService` → `CloudinaryService` (upload audio + image)
- [ ] **S5-B3** Helmet.js + CORS whitelist Vercel domain
- [ ] **S5-B4** Health check: `GET /health` (Railway dùng để check liveness)
- [ ] **S5-B5** `env.validation.ts` — validate biến môi trường khi khởi động
- [ ] **S5-B6** `railway.toml` — cấu hình start command + healthcheck path

### Frontend tasks
- [ ] **S5-F1** Error pages: 401, 403, 404
- [ ] **S5-F2** Toast notifications (success, error)
- [ ] **S5-F3** Empty states: ticket hết hạn, không có địa điểm
- [ ] **S5-F4** Loading skeleton cho map + location list
- [ ] **S5-F5** `vercel.json` — cấu hình rewrite cho Nuxt SPA

### Deploy tasks (1 lần, ~1 giờ)
- [ ] **S5-D1** Tạo Railway project → add PostgreSQL plugin → lấy `DATABASE_URL`
- [ ] **S5-D2** Push backend lên GitHub → connect Railway → set env vars
- [ ] **S5-D3** Chạy `prisma migrate deploy` qua Railway CLI (1 lệnh)
- [ ] **S5-D4** Push frontend lên GitHub → connect Vercel → set `NUXT_PUBLIC_API_URL`
- [ ] **S5-D5** Tạo Cloudinary account → lấy credentials → update env vars

### Env vars cần thiết
```bash
# Backend (Railway)
DATABASE_URL=          # tự sinh từ Railway PostgreSQL plugin
JWT_SECRET=            # random string 32 ký tự
JWT_REFRESH_SECRET=    # random string 32 ký tự
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=           # https://your-app.vercel.app

# Frontend (Vercel)
NUXT_PUBLIC_API_URL=   # https://your-backend.railway.app/api/v1
```

### Definition of Done
- Backend live trên Railway, database migrate xong
- Frontend live trên Vercel, gọi được API
- Admin, staff, tourist test được end-to-end trên điện thoại thật

---

## Backlog (Post-MVP)
- Thống kê chi tiết hơn cho admin (heatmap bản đồ)
- Đánh giá / rating từng địa điểm
- Gợi ý lộ trình tham quan tối ưu
- Notification khi ticket sắp hết hạn
- Multiple packages trong 1 ticket
- QR code quét thay vì nhập code tay
