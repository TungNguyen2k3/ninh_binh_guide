# Ninh Bình Audio Guide — Project Context

## Tổng quan dự án
Ứng dụng web (PWA) giúp du khách tự khám phá các địa điểm tham quan tại Ninh Bình không cần hướng dẫn viên.
Du khách mua gói tham quan tại quầy vé → đăng nhập → xem bản đồ + nghe thuyết minh audio từng địa điểm.

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | Nuxt.js 3, Vue 3 Composition API, Tailwind CSS, Pinia |
| Backend | Node.js, Fastify, 3-layer architecture |
| Database | PostgreSQL (Prisma ORM) |
| Auth | Custom JWT (access token 1h + refresh token 7d) |
| Storage | Cloudinary (audio mp3, images) — free tier |
| Cache | node-cache (in-memory, không cần Redis) |
| i18n | Tiếng Việt + English (nuxt-i18n) |
| Deploy | Railway (backend + DB) + Vercel (frontend) — free tier |

## Kiến trúc Backend — 3-layer (đơn giản, phù hợp dự án nhỏ)
```
src/
├── routes/        # Fastify routes + Zod validation
├── services/      # Business logic (auth, location, ticket, package)
├── repositories/  # Database access — Prisma queries
├── middlewares/   # authenticate, requireRole
├── lib/           # jwt.ts, bcrypt.ts, cloudinary.ts, cache.ts, errors.ts
└── app.ts         # Fastify setup, register routes
```
Không dùng Clean Architecture 4 tầng — quá nặng cho scale này.

## Roles & quyền hạn
| Role | Quyền |
|---|---|
| `admin` | Quản lý toàn bộ: users, locations, packages, tickets, thống kê |
| `staff` | Tạo ticket cho du khách tại quầy, xem lịch sử ticket |
| `tourist` | Xem địa điểm trong gói đã mua, nghe audio, xem bản đồ |

## Auth flow
1. Staff tạo ticket (package + tourist info) → hệ thống sinh `ticket_code`
2. Tourist đăng ký / đăng nhập (email hoặc phone + password)
3. Tourist nhập `ticket_code` → kích hoạt gói → gắn với account
4. Server trả JWT: `{ userId, role, ticketId, packageId, expiresAt }`
5. Mọi request gửi `Authorization: Bearer <token>` → middleware verify + attach user

## Package types
- `all_locations`: mua 1 lần, truy cập toàn bộ địa điểm đang active
- `custom`: chỉ truy cập các địa điểm trong danh sách `package_locations`

## Database — key tables
- `users` — admin, staff, tourist (role enum)
- `locations` — nội dung song ngữ, audio_vi_url, audio_en_url, lat/lng
- `packages` — gói tham quan, validity_hours, type
- `package_locations` — many-to-many: packages ↔ locations
- `tickets` — do staff tạo, có ticket_code + expires_at
- `ticket_users` — tourist kích hoạt ticket → bảng liên kết user ↔ ticket

## Conventions
- **File naming**: kebab-case cho files, PascalCase cho class/interface
- **API prefix**: `/api/v1/`
- **Error format**: `{ success: false, error: { code, message, details? } }`
- **Success format**: `{ success: true, data: {...}, meta?: { pagination } }`
- **Language**: Code + comments bằng tiếng Anh, PR/commit message tiếng Anh
- **i18n keys**: snake_case, ví dụ `location.title`, `error.unauthorized`

## Môi trường
- Development: `localhost:3000` (frontend), `localhost:4000` (backend)
- Database: PostgreSQL local (hoặc `npx prisma db push` với Railway DB URL)
- Env file: `.env` (không commit), `.env.example` (commit)

## Agents
- `backend-agent` — toàn bộ backend: routes, services, repositories, middleware, lib
- `frontend-agent` — Nuxt 3, Pinia, composables, i18n, Leaflet, audio player
- `location-content-agent` — business logic: location, package, audio, bản đồ
- `git-agent` — branch, commit convention, PR flow, gitignore
- `test-agent` — unit test, integration test, mock pattern, coverage
