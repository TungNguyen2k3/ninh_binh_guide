# CHƯƠNG 3: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG

---

## 3.1. Môi trường phát triển

### 3.1.1. Phần cứng

| Thành phần | Cấu hình |
|-----------|---------|
| CPU | Intel Core i5 thế hệ 10 trở lên |
| RAM | Tối thiểu 8 GB |
| Ổ cứng | SSD 256 GB |
| Mạng | Kết nối Internet ổn định (upload ≥ 10 Mbps) |

### 3.1.2. Phần mềm

| Phần mềm | Phiên bản | Mục đích |
|---------|-----------|---------|
| Node.js | v22.16.0 | Runtime JavaScript phía server |
| npm | v10.x | Quản lý gói thư viện |
| Git | v2.40+ | Quản lý phiên bản mã nguồn |
| Visual Studio Code | v1.88+ | Trình soạn thảo mã nguồn |
| Postman / curl | — | Kiểm thử API |
| PostgreSQL | v15 (Railway) | Hệ quản trị cơ sở dữ liệu |

### 3.1.3. Bảng tổng hợp công nghệ và thư viện

#### Backend

| Thư viện | Phiên bản | Chức năng |
|---------|-----------|---------|
| Fastify | 4.29.1 | Web framework hiệu năng cao |
| @prisma/client | 5.22.0 | ORM tương tác PostgreSQL |
| @fastify/cookie | 9.4.0 | Xử lý cookie httpOnly |
| @fastify/cors | 9.0.1 | Cấu hình Cross-Origin Resource Sharing |
| @fastify/helmet | 11.1.1 | Bảo mật HTTP headers |
| @fastify/multipart | 8.3.1 | Xử lý upload file |
| @fastify/rate-limit | 9.1.0 | Giới hạn tốc độ request |
| jsonwebtoken | 9.0.2 | Tạo và xác thực JWT |
| bcryptjs | 2.4.3 | Mã hóa mật khẩu (12 rounds) |
| cloudinary | 2.10.0 | Upload và quản lý media (ảnh/audio) |
| node-cache | 5.1.2 | Cache in-memory (TTL 5 phút) |
| zod | 3.23.8 | Validation schema dữ liệu đầu vào |
| dotenv | 17.4.2 | Quản lý biến môi trường |
| tsx | 4.19.0 | Chạy TypeScript trực tiếp (dev) |
| TypeScript | 5.5.4 | Ngôn ngữ lập trình có kiểu tĩnh |
| Vitest | 2.1.0 | Framework kiểm thử đơn vị |

#### Frontend

| Thư viện | Phiên bản | Chức năng |
|---------|-----------|---------|
| Nuxt | 3.13.0 | Framework Vue.js fullstack với SSR |
| Vue.js | 3.5.0 | Framework UI reactive |
| Pinia | 2.2.2 | Quản lý state toàn cục |
| @pinia/nuxt | 0.5.5 | Tích hợp Pinia với Nuxt |
| @nuxtjs/i18n | 9.5.6 | Đa ngôn ngữ VI/EN |
| @nuxtjs/tailwindcss | 6.12.1 | CSS utility-first |
| Leaflet | 1.9.4 | Bản đồ tương tác OpenStreetMap |
| Vue Router | 4.4.3 | Điều hướng trang |
| TypeScript | 5.5.4 | Kiểm tra kiểu tĩnh cho Vue/Nuxt |

#### Dịch vụ đám mây

| Dịch vụ | Mục đích |
|---------|---------|
| Railway | Deploy backend Fastify + PostgreSQL |
| Vercel | Deploy frontend Nuxt 3 |
| Cloudinary | Lưu trữ và phân phối file audio MP3 và ảnh JPEG/PNG |
| GitHub | Lưu trữ mã nguồn và kích hoạt CI/CD tự động |

---

## 3.2. Cấu trúc dự án

### 3.2.1. Cấu trúc thư mục tổng thể

```
ninh-binh-guide/
├── backend/                    # Fastify API server
│   ├── prisma/
│   │   ├── schema.prisma       # Định nghĩa 10 bảng CSDL
│   │   ├── seed.ts             # Tài khoản mặc định + packages
│   │   ├── seed-locations.ts   # 15 địa điểm tham quan
│   │   └── seed-tours.ts       # 15 lịch trình tour gợi ý
│   ├── src/
│   │   ├── lib/                # Tiện ích dùng chung
│   │   │   ├── env.ts          # Validate biến môi trường (Zod)
│   │   │   ├── jwt.ts          # Tạo/xác thực JWT
│   │   │   ├── bcrypt.ts       # Mã hóa mật khẩu
│   │   │   ├── cloudinary.ts   # Upload media
│   │   │   ├── cache.ts        # node-cache wrapper
│   │   │   ├── errors.ts       # Custom error classes
│   │   │   └── response.ts     # Chuẩn hóa response JSON
│   │   ├── middlewares/
│   │   │   ├── authenticate.ts # Xác thực JWT
│   │   │   └── require-role.ts # Kiểm tra quyền theo role
│   │   ├── repositories/       # Tầng truy cập CSDL
│   │   │   ├── user.repo.ts
│   │   │   ├── location.repo.ts
│   │   │   ├── package.repo.ts
│   │   │   ├── ticket.repo.ts
│   │   │   ├── tour.repo.ts
│   │   │   └── refresh-token.repo.ts
│   │   ├── services/           # Tầng nghiệp vụ
│   │   │   ├── auth.service.ts
│   │   │   ├── location.service.ts
│   │   │   ├── package.service.ts
│   │   │   ├── ticket.service.ts
│   │   │   ├── tourist.service.ts
│   │   │   ├── tour.service.ts
│   │   │   └── user.service.ts
│   │   ├── routes/             # Tầng định tuyến HTTP
│   │   │   ├── auth.route.ts
│   │   │   ├── admin.route.ts
│   │   │   ├── staff.route.ts
│   │   │   └── tourist.route.ts
│   │   ├── schemas/            # Zod validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── location.schema.ts
│   │   │   ├── package.schema.ts
│   │   │   ├── ticket.schema.ts
│   │   │   ├── tour.schema.ts
│   │   │   └── user.schema.ts
│   │   └── app.ts              # Khởi tạo Fastify, đăng ký routes
│   ├── railway.toml            # Cấu hình deploy Railway
│   └── package.json
│
└── frontend/                   # Nuxt 3 SPA/SSR
    ├── components/
    │   ├── admin/              # SpotManager, TourStopManager, AudioUpload...
    │   ├── explore/            # MapView, AudioBar, LocationCard, ToursMap
    │   └── App*.vue            # Button, Input, Toast, Confirm...
    ├── composables/
    │   ├── useGeolocation.ts   # GPS + Haversine distance
    │   └── useToast.ts         # Thông báo toast
    ├── layouts/
    │   ├── default.vue         # Tourist: header + bottom nav
    │   ├── admin.vue           # Admin: sidebar
    │   └── staff.vue           # Staff: top nav
    ├── middleware/
    │   └── auth.global.ts      # Route guard theo role
    ├── pages/
    │   ├── auth/               # login, register, activate
    │   ├── admin/              # dashboard, locations, packages, tickets, tours, users
    │   ├── staff/              # tickets/
    │   └── explore/            # index, list, [slug], tours/
    ├── plugins/
    │   └── auth.client.ts      # Khởi tạo auth state client-side
    ├── stores/                 # Pinia stores
    │   ├── auth.store.ts
    │   ├── location.store.ts
    │   ├── package.store.ts
    │   ├── ticket.store.ts
    │   ├── tourist.store.ts
    │   └── tour.store.ts
    ├── i18n/locales/
    │   ├── vi.json             # Tiếng Việt
    │   └── en.json             # Tiếng Anh
    ├── nuxt.config.ts
    └── vercel.json             # Cấu hình deploy Vercel
```

---

## 3.3. Cài đặt Backend

### 3.3.1. Kiến trúc 3 lớp (Three-Layer Architecture)

Hệ thống backend được xây dựng theo mô hình 3 lớp tách biệt rõ ràng:

```
HTTP Request
    ↓
Routes (Fastify + Zod validation)     ← Nhận và validate đầu vào
    ↓
Services (Business Logic)             ← Xử lý nghiệp vụ, cache
    ↓
Repositories (Data Access)            ← Truy vấn Prisma ORM
    ↓
PostgreSQL Database
```

**Ưu điểm của kiến trúc này:**
- Tách biệt trách nhiệm rõ ràng, dễ kiểm thử từng lớp độc lập
- Service không phụ thuộc trực tiếp vào Prisma — dễ mock trong unit test
- Repository tập trung tất cả truy vấn DB, tránh SQL rải rác

### 3.3.2. Khởi tạo ứng dụng (`app.ts`)

```typescript
// Đăng ký plugins
fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin || origin.endsWith('.vercel.app')) return cb(null, true)
    if (env.CORS_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, ''))
        .includes(origin.replace(/\/$/, ''))) return cb(null, true)
    if (origin.startsWith('http://localhost')) return cb(null, true)
    cb(new Error('Not allowed by CORS'), false)
  },
  credentials: true,
})

// Đăng ký routes với prefix
fastify.register(authRoutes,    { prefix: '/api/v1/auth',  ...services })
fastify.register(adminRoutes,   { prefix: '/api/v1/admin', ...services })
fastify.register(staffRoutes,   { prefix: '/api/v1/staff', ...services })
fastify.register(touristRoutes, { prefix: '/api/v1',       ...services })
```

### 3.3.3. Xác thực và phân quyền

**Cơ chế JWT kép (Access Token + Refresh Token):**

```
Đăng nhập thành công
    → Access Token (1 giờ, lưu trong memory/Pinia store)
    → Refresh Token (7 ngày, httpOnly cookie, SameSite=None/Lax)

Khi Access Token hết hạn:
    → useApiFetch() bắt HTTP 401
    → Tự động gọi POST /api/v1/auth/refresh (gửi cookie)
    → Nhận Access Token mới → retry request gốc
    → Nếu Refresh Token cũng hết → clearState() → redirect login
```

**Middleware xác thực:**

```typescript
// middlewares/authenticate.ts
export async function authenticate(request, reply) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) throw new UnauthorizedError()
  const payload = verifyAccessToken(token)  // jsonwebtoken.verify()
  request.user = { userId: payload.userId, role: payload.role }
}

// middlewares/require-role.ts
export function requireRole(...roles: string[]) {
  return async (request, reply) => {
    if (!roles.includes(request.user.role)) throw new ForbiddenError()
  }
}
```

### 3.3.4. Quản lý địa điểm (Location Module)

**Upload ảnh và audio lên Cloudinary:**

```typescript
// location.service.ts
async uploadLocationImage(locationId: string, buffer: Buffer, filename: string) {
  const location = await this.locationRepo.findById(locationId)
  const url = await uploadImage(buffer, `loc-${locationId}-img-${Date.now()}`)
  const image = await this.locationRepo.addImage(locationId, { url })
  // Auto-set làm ảnh bìa nếu chưa có
  if (!location.imageUrl) {
    await this.locationRepo.update(locationId, { imageUrl: url })
  }
  cache.del(`location:detail:${location.slug}:vi`)
  cache.del(`location:detail:${location.slug}:en`)
  return image
}
```

**Cơ chế cache in-memory:**

```typescript
// Cache key: "location:detail:{slug}:{lang}"
// TTL: 300 giây (5 phút)
// Xóa cache khi: update, upload ảnh, upload audio, xóa ảnh

async getLocationDetail(slug: string, userId: string, lang: 'vi' | 'en') {
  const cacheKey = `location:detail:${slug}:${lang}`
  const cached = cache.get<object>(cacheKey)
  if (cached) return cached        // Cache HIT — trả ngay, không truy vấn DB
  
  const location = await this.locationRepo.findBySlugFull(slug)
  // ... xử lý logic ...
  cache.set(cacheKey, result, 300) // Cache MISS — lưu vào cache
  return result
}
```

### 3.3.5. Quản lý vé tham quan (Ticket Module)

**Sinh mã vé duy nhất:**

```typescript
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Loại I, O, 0, 1
  const rand = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `NBG-${rand}` // Ví dụ: NBG-A3B7KP
}
```

**Luồng kích hoạt vé với 5 guard checks:**

```typescript
async activateTicket(code: string, userId: string) {
  const ticket = await this.ticketRepo.findByCode(code)
  if (!ticket) throw new NotFoundError('Ticket')           // (1) Mã vé không tồn tại
  if (ticket.isCancelled) throw new ForbiddenError(...)   // (2) Vé đã bị hủy
  if (ticket.expiresAt < new Date()) throw new ForbiddenError(...) // (3) Hết hạn kích hoạt
  
  const alreadyActivated = ticket.ticketUsers.find(tu => tu.userId !== userId)
  if (alreadyActivated) throw new ConflictError(...)       // (4) Đã có người khác kích hoạt
  
  const selfActivated = ticket.ticketUsers.find(tu => tu.userId === userId)
  if (selfActivated) return { ticket, alreadyOwned: true } // (5) Idempotent — bỏ qua
  
  // Tính expiresAt từ lúc kích hoạt (không phải từ lúc tạo)
  const expiresAt = new Date(Date.now() + ticket.package.validityHours * 3600 * 1000)
  await this.ticketRepo.activateTicket(ticket.id, userId, expiresAt)
  return { ticket, alreadyOwned: false }
}
```

### 3.3.6. Module Lịch trình Tour (Tour Module)

```typescript
// tour.service.ts — Lấy danh sách tour active cho tourist
async getActiveTours() {
  return this.tourRepo.findAll({ isActive: true })
  // Trả về: tours + stops + location(nameVi, nameEn, slug, lat, lng, imageUrl, audioUrl)
}

// tour.repo.ts — Truy vấn với đầy đủ thông tin điểm dừng
findAll(opts?: { isActive?: boolean }) {
  return this.prisma.tour.findMany({
    where: opts?.isActive !== undefined ? { isActive: opts.isActive } : {},
    orderBy: { displayOrder: 'asc' },
    include: {
      stops: {
        orderBy: { order: 'asc' },
        include: {
          location: {
            select: {
              id: true, nameVi: true, nameEn: true, slug: true,
              latitude: true, longitude: true,
              imageUrl: true, audioViUrl: true, audioEnUrl: true
            }
          }
        }
      }
    }
  })
}
```

### 3.3.7. Thống kê Dashboard (Stats)

```typescript
// Endpoint: GET /api/v1/admin/stats
// Trả về: 4 thẻ thống kê + recent tickets + chart data (7d/30d)
async stats() {
  const [total, activatedCount] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticketUser.count(),
  ])
  
  // 5 vé gần nhất
  const recentTickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' }, take: 5,
    include: { package: { select: { name: true } }, ticketUsers: { select: { userId: true } } }
  })
  
  // Chart data: nhóm theo ngày trong 30 ngày qua (xử lý tại application layer)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000)
  const [ticketsLast30, usersLast30] = await Promise.all([...])
  // buildChartData(7) và buildChartData(30)
  
  return { total, activatedCount, recentTickets, chart: { '7d': ..., '30d': ... } }
}
```

---

## 3.4. Cài đặt Frontend

### 3.4.1. Cơ chế gọi API chuẩn hóa (`useApiFetch`)

Toàn bộ trang admin và store đều dùng composable này để đảm bảo:
- Tự động inject `Authorization: Bearer <token>`
- Tự động refresh token khi nhận HTTP 401
- Deduplicate concurrent refresh requests

```typescript
// utils/api.ts
export function useApiFetch() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl  // '/api/v1' (dev) hoặc Railway URL (prod)

  async function apiFetch<T>(url: string, options = {}): Promise<T> {
    const authStore = useAuthStore()
    const headers = authStore.accessToken
      ? { Authorization: `Bearer ${authStore.accessToken}` } : {}
    
    try {
      return await $fetch<T>(url, { baseURL, headers, credentials: 'include', ...options })
    } catch (err) {
      if (err?.response?.status === 401) {
        // Deduplicate: nhiều request fail cùng lúc chỉ refresh 1 lần
        if (!isRefreshing) {
          isRefreshing = true
          refreshPromise = authStore.refreshTokens().finally(() => {
            isRefreshing = false; refreshPromise = null
          })
        }
        const refreshed = await refreshPromise
        if (refreshed) return $fetch<T>(url, { baseURL, ...buildOptions(buildHeaders()) })
        authStore.clearState()
        await navigateTo('/auth/login')
      }
      throw err
    }
  }
  return { apiFetch }
}
```

### 3.4.2. Quản lý state với Pinia

```typescript
// stores/auth.store.ts — Các trạng thái xác thực quan trọng
state: (): AuthState => ({
  user: null,
  accessToken: null,    // Chỉ lưu trong memory (không localStorage)
  ticketId: null,       // ID vé đang active của tourist
  ticketExpiresAt: null // Thời điểm hết hạn vé — dùng cho countdown
})

getters: {
  isAuthenticated: state => !!state.accessToken,
  isAdmin: state => state.user?.role === 'admin',
  isStaff: state => state.user?.role === 'staff',
  isTourist: state => state.user?.role === 'tourist',
  hasActiveTicket: state => !!state.ticketId
}
```

**Khôi phục state khi reload trang:**

```typescript
// plugins/auth.client.ts — Chạy trước mọi route
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  await authStore.initialize()
  // 1. Gọi POST /auth/refresh (dùng httpOnly cookie)
  // 2. Nếu thành công → GET /auth/me → lấy user info
  // 3. Nếu là tourist → GET /auth/my-ticket → lấy ticketId + expiresAt
})
```

### 3.4.3. Component AudioBar (Thanh phát audio)

Thanh audio sticky ở phía dưới trang chi tiết địa điểm, quản lý toàn bộ playlist bao gồm audio tổng quan và từng khu vực con:

```typescript
// components/explore/AudioBar.vue
interface AudioTrack {
  id: string        // 'main' hoặc spotId
  name: string      // 'Tổng quan' hoặc tên khu vực
  audioUrl: string | null
}

// Khi chọn track mới: dừng audio cũ, tạo Audio element mới
watch(() => activeTrack.value?.audioUrl, (url) => {
  isPlaying.value = false
  if (audio) { audio.pause(); audio.src = ''; audio = null }
  if (url) {
    audio = new Audio(url)
    audio.playbackRate = speed.value
    audio.addEventListener('timeupdate', () => currentTime.value = audio?.currentTime ?? 0)
    audio.addEventListener('durationchange', () => duration.value = audio?.duration ?? 0)
    audio.addEventListener('ended', () => isPlaying.value = false)
  }
}, { immediate: true })
```

**Fallback ngôn ngữ audio:** Nếu audio EN chưa có → dùng audio VI, và ngược lại:

```typescript
// tourist.service.ts
audioUrl: lang === 'vi'
  ? (location.audioViUrl ?? location.audioEnUrl ?? null)
  : (location.audioEnUrl ?? location.audioViUrl ?? null)
```

### 3.4.4. Component MapView (Bản đồ Leaflet)

```typescript
// components/explore/MapView.vue
// Hỗ trợ 2 chế độ:

// Chế độ bình thường: hiển thị tất cả địa điểm trong gói vé
props.locations.forEach((loc) => {
  L.marker([loc.latitude, loc.longitude], { icon: createIcon() })
    .addTo(map).on('click', () => emit('select', loc))
})

// Chế độ tour: numbered markers + polyline nối theo thứ tự
props.tourStops.forEach((stop, idx) => {
  L.marker([stop.location.latitude, stop.location.longitude],
    { icon: createNumberedIcon(idx + 1) })
    .addTo(map).on('click', () => emit('selectTourStop', stop))
})
L.polyline(latlngs, { color: '#16a34a', weight: 3, dashArray: '8,6' }).addTo(map)
```

**GPS định vị — không pan bản đồ:**

```typescript
function locateUser() {
  map.locate({ setView: false })   // setView: false — bản đồ không nhảy về vị trí user
  map.once('locationfound', (e) => {
    userMarker = L.circleMarker(e.latlng, { radius: 10, fillColor: '#3B82F6', ... }).addTo(map)
    emit('locate', e.latlng.lat, e.latlng.lng)  // Frontend tính khoảng cách trên card
  })
}
```

### 3.4.5. Component SpotManager (Quản lý khu vực con)

```typescript
// Tạo spot ngay trong DB khi nhấn "+ Thêm khu vực"
async function addDraftSpot(): Promise<void> {
  const res = await $fetch(`/admin/locations/${locationId}/spots`, {
    method: 'POST',
    body: { nameVi: 'Khu vực mới', nameEn: 'New area',
            order: spots.length + draftSpots.length }
  })
  draftSpots.push({ id: res.data.id, nameVi: '', nameEn: '', ... })
  // Form hiển thị ngay để user điền thông tin
  // Upload ảnh/audio có thể làm ngay mà không cần save tên trước
}

// Sắp xếp thứ tự: nhập số → reassign order cho tất cả spots
async function setOrder(spotId: string, newPos: number): Promise<void> {
  const reordered = [...sortedSpots.value]
  const [moved] = reordered.splice(currentIdx, 1)
  reordered.splice(clampedPos - 1, 0, moved)
  await Promise.all(reordered.map((s, i) =>
    $fetch(`/admin/locations/${locationId}/spots/${s.id}`,
      { method: 'PUT', body: { order: i } })
  ))
}
```

### 3.4.6. Composable định vị GPS (`useGeolocation`)

```typescript
// composables/useGeolocation.ts
export function useGeolocation() {
  const position = useState<{ lat: number; lng: number } | null>('geo_position', () => null)

  function haversineKm(lat1, lon1, lat2, lon2): number {
    const R = 6371  // Bán kính Trái Đất (km)
    const r = (x: number) => (x * Math.PI) / 180
    const dLat = r(lat2 - lat1), dLon = r(lon2 - lon1)
    const a = Math.sin(dLat/2)**2 + Math.cos(r(lat1))*Math.cos(r(lat2))*Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  function formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
  }

  return { position, distanceTo: (lat, lng) => haversineKm(...) || null, formatDistance, setPosition }
}
```

### 3.4.7. Đa ngôn ngữ (i18n)

```typescript
// nuxt.config.ts
i18n: {
  locales: [
    { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
    { code: 'en', name: 'English', file: 'en.json' }
  ],
  defaultLocale: 'vi',
  strategy: 'no_prefix',          // URL không có prefix /vi/ hoặc /en/
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_locale',     // Ghi nhớ ngôn ngữ qua cookie
  }
}

// Trong component:
const { locale } = useI18n()
// Chuyển ngôn ngữ cho cả nội dung API và giao diện:
watch(locale, (lang) => touristStore.fetchLocations(lang))
```

---

## 3.5. Triển khai hệ thống (Deployment)

### 3.5.1. Kiến trúc triển khai tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└──────────────────────┬──────────────────┬───────────────────┘
                       │                  │
              ┌────────▼────────┐ ┌───────▼────────┐
              │   Vercel CDN    │ │  Railway Cloud  │
              │   (Frontend)    │ │   (Backend)     │
              │  Nuxt 3 SSR     │ │  Fastify API    │
              │  ninh-binh-     │ │  ninhbinhguide  │
              │  guide.vercel   │ │  -production    │
              │  .app           │ │  .up.railway    │
              └────────┬────────┘ │  .app           │
                       │          └───────┬────────┘
              HTTPS    │ NUXT_PUBLIC_      │
              Request  │ API_URL           │ Prisma ORM
                       │                  ▼
                       │          ┌───────────────┐
                       └─────────►│   Railway DB  │
                        API calls │  PostgreSQL   │
                                  └───────────────┘
                                          
              ┌─────────────────────────────────────┐
              │          Cloudinary CDN              │
              │   Audio MP3 + Ảnh JPEG/PNG/WebP     │
              │   (Phân phối toàn cầu qua CDN)      │
              └─────────────────────────────────────┘
```

### 3.5.2. Triển khai Backend trên Railway

**Cấu hình `railway.toml`:**

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"
# npm run build = prisma generate + tsc

[deploy]
startCommand = "npx prisma db push && npx tsx prisma/seed.ts && npx tsx prisma/seed-locations.ts && npx tsx prisma/seed-tours.ts && node dist/app.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

**Quy trình khởi động tự động:**

| Bước | Lệnh | Mục đích |
|------|------|---------|
| 1 | `prisma db push` | Đồng bộ schema với PostgreSQL |
| 2 | `tsx prisma/seed.ts` | Tạo tài khoản admin/staff + packages mặc định |
| 3 | `tsx prisma/seed-locations.ts` | Tạo 15 địa điểm tham quan |
| 4 | `tsx prisma/seed-tours.ts` | Tạo 15 lịch trình tour gợi ý |
| 5 | `node dist/app.js` | Khởi động server Fastify |

**Biến môi trường Railway:**

| Biến | Mô tả |
|------|-------|
| `DATABASE_URL` | PostgreSQL connection string (tự sinh bởi Railway) |
| `JWT_SECRET` | Khóa bí mật access token (≥ 32 ký tự) |
| `JWT_REFRESH_SECRET` | Khóa bí mật refresh token (khác JWT_SECRET) |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | URL Vercel frontend |
| `CLOUDINARY_CLOUD_NAME` | Tên cloud Cloudinary |
| `CLOUDINARY_API_KEY` | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret Cloudinary |

### 3.5.3. Triển khai Frontend trên Vercel

**Cấu hình `vercel.json`:**

```json
{
  "framework": "nuxtjs",
  "buildCommand": "nuxt build",
  "devCommand": "nuxt dev",
  "installCommand": "npm install"
}
```

**Biến môi trường Vercel:**

| Biến | Giá trị |
|------|--------|
| `NUXT_PUBLIC_API_URL` | `https://ninhbinhguide-production.up.railway.app/api/v1` |

**Xử lý CORS cross-origin trong production:**

- Frontend Vercel (`*.vercel.app`) gọi API Railway (domain khác)
- Backend cho phép mọi subdomain `*.vercel.app` để hỗ trợ cả preview và production
- Cookie `refreshToken`: `sameSite: 'none', secure: true` (bắt buộc cho cross-origin)
- Cookie `refreshToken`: `sameSite: 'lax'` khi development (same-origin qua devProxy)

### 3.5.4. Cấu hình Nuxt DevProxy (Development)

Để tránh lỗi CORS trong môi trường phát triển, Nuxt proxy tất cả request `/api/*` đến backend:

```typescript
// nuxt.config.ts
nitro: {
  devProxy: {
    '/api': {
      target: 'http://localhost:4000/api',
      changeOrigin: true
    }
  }
}
```

**Lợi ích:** Frontend gọi `/api/v1/auth/login` → Nuxt proxy → `http://localhost:4000/api/v1/auth/login`. Cookie được gửi same-origin, không có vấn đề CORS hay SameSite.

---

## 3.6. Kết quả giao diện

### 3.6.1. Giao diện Tourist — Du khách

**Màn hình Bản đồ (`/explore`):**
- Bản đồ Leaflet hiển thị marker cho mỗi địa điểm trong gói vé
- Nút 📍 định vị GPS: thêm chấm xanh tại vị trí user, toast thông báo địa điểm gần nhất
- Click marker → bottom sheet: ảnh bìa, tên, khoảng cách, nút "Xem chi tiết" và "Chỉ đường"
- Chế độ tour: numbered markers ① ② ③ + polyline nối khi truy cập `/explore?tour=[id]`

**Màn hình Danh sách (`/explore/list`):**
- Lưới 2 cột hiển thị card địa điểm: ảnh bìa 160px, tên, mô tả 2 dòng
- Badge Audio và số khu vực con
- Khi GPS bật: hiển thị khoảng cách `1.2km` và sắp xếp theo gần nhất

**Màn hình Chi tiết địa điểm (`/explore/[slug]`):**
- Carousel ảnh với dot indicator
- Chips thông tin tham quan: 🕐 giờ mở cửa, 🎫 giá vé, ⏱ thời gian, 🌤 mùa tốt, 📍 địa chỉ, 🧭 chỉ đường
- Nội dung: Tổng quan, Lịch sử, Điểm nổi bật
- Danh sách khu vực con với ảnh thumbnail và mô tả
- **Sticky AudioBar** phía dưới: chip chọn khu vực (Tổng quan, Hang Cả, Đền Trần...) + player compact (▶, thanh tiến trình, thời gian, tốc độ)

**Màn hình Lịch trình (`/explore/tours` và `/explore/tours/[id]`):**
- Danh sách 15 tour phân loại theo badge (Phổ biến, Tâm linh, Thiên nhiên...)
- Chi tiết tour: mini-map Leaflet với numbered markers + polyline, timeline điểm dừng
- Nút "Mở bản đồ đầy đủ" → chuyển sang `/explore?tour=[id]`

### 3.6.2. Giao diện Admin — Quản trị viên

**Dashboard (`/admin`):**
- 4 thẻ thống kê: địa điểm, gói, vé, user
- Biểu đồ thanh CSS thuần: số vé và user mới theo ngày (7 ngày/30 ngày)
- Danh sách 5 vé gần nhất với badge kích hoạt

**Quản lý địa điểm (`/admin/locations/[id]/edit`):**
- 3 tab: Cơ bản (thông tin + ảnh gallery + audio), Nội dung (văn bản VI/EN), Khu vực
- Tab Cơ bản: upload tối đa 5 ảnh (ảnh đầu làm bìa), audio VI/EN với mini player custom
- Tab Nội dung: toggle VI/EN, 3 textarea (Tổng quan, Lịch sử, Điểm nổi bật), form thông tin tham quan có cấu trúc
- Tab Khu vực: SpotManager với tạo spot ngay, upload ảnh/audio per spot, sắp xếp thứ tự bằng ô số

**Quản lý tour (`/admin/tours/[id]/edit`):**
- Form thông tin tour (tên VI/EN, thời gian, badge, ghi chú)
- TourStopManager: thêm điểm dừng bằng dropdown location, giờ/thời gian/ghi chú per stop, reorder bằng ô số

### 3.6.3. Giao diện Staff — Nhân viên quầy vé

**Tạo vé (`/staff/tickets/new`):**
- Form: tên khách, SĐT, chọn gói, ghi chú
- Sau tạo: màn hình xác nhận với mã vé `NBG-XXXXXX` font mono lớn
- Nút copy mã vé vào clipboard

---

## 3.7. Kiểm thử hệ thống

### 3.7.1. Kiểm thử đơn vị (Unit Testing)

Hệ thống sử dụng **Vitest** để kiểm thử tầng Service với pattern mock Repository:

```typescript
// Ví dụ: auth.service.test.ts
vi.mock('../repositories/user.repo.js', () => ({
  UserRepo: vi.fn().mockImplementation(() => ({
    findByEmail: vi.fn(),
    create: vi.fn(),
  }))
}))

it('should register successfully with email', async () => {
  mockUserRepo.findByEmail.mockResolvedValue(null)  // Chưa tồn tại
  mockUserRepo.create.mockResolvedValue(fakeUser)
  const result = await authService.register({ email: 'test@test.com', password: '12345678', name: 'Test' })
  expect(result.accessToken).toBeDefined()
  expect(result.user.email).toBe('test@test.com')
})
```

**Kết quả kiểm thử:**

| Module | Số test | Pass | Fail | Ghi chú |
|--------|---------|------|------|---------|
| AuthService | 18 | 18 | 0 | Đăng ký, đăng nhập, refresh, logout |
| LocationService | 15 | 15 | 0 | CRUD, upload, cache invalidation |
| PackageService | 12 | 12 | 0 | CRUD, assign locations |
| TicketService | 14 | 14 | 0 | Tạo vé, kích hoạt, 5 guard checks |
| TouristService | 12 | 7 | 5 | 5 test lỗi do field visitingGuide đã thay thế bằng các trường cấu trúc nhưng test chưa cập nhật |
| **Tổng** | **71** | **66** | **5** | |

> **Ghi chú:** 5 test thất bại trong TouristService là do quá trình tái cấu trúc tính năng thuyết minh tham quan — field `visitingGuide` được thay thế bằng 6 trường có cấu trúc (`openTime`, `closeTime`, `admissionFee`, `estimatedDuration`, `address`, `bestTime`). Các test case sẽ được cập nhật trong phiên bản tiếp theo.

### 3.7.2. Kịch bản kiểm thử chức năng

| Mã | Chức năng | Đầu vào | Kết quả mong đợi | Kết quả thực tế |
|----|-----------|---------|--------------------|----------------|
| TC01 | Đăng ký tài khoản | Email hợp lệ + mật khẩu ≥ 8 ký tự | Tài khoản tạo thành công, nhận JWT | ✅ Đạt |
| TC02 | Đăng nhập | Email/SĐT + mật khẩu đúng | Nhận access token + refresh cookie | ✅ Đạt |
| TC03 | Kích hoạt vé hợp lệ | Mã NBG-XXXXXX còn hiệu lực | ticketUser tạo thành công, expiresAt = now + validityHours | ✅ Đạt |
| TC04 | Kích hoạt vé đã hết hạn | Mã có expiresAt < now | HTTP 403 "Ticket đã hết hạn" | ✅ Đạt |
| TC05 | Kích hoạt vé người khác đã dùng | Mã đã có TicketUser khác | HTTP 409 Conflict | ✅ Đạt |
| TC06 | Xem danh sách địa điểm | Tourist với gói all_locations | Trả về tất cả địa điểm active | ✅ Đạt |
| TC07 | Xem chi tiết địa điểm | Slug hợp lệ | Trả về thông tin đầy đủ + audio fallback EN→VI | ✅ Đạt |
| TC08 | Upload audio | File MP3 < 50MB | Audio lên Cloudinary, URL lưu DB | ✅ Đạt |
| TC09 | Upload ảnh gallery | File ảnh hợp lệ | Ảnh lên Cloudinary, ảnh đầu làm bìa | ✅ Đạt |
| TC10 | Tạo địa điểm thiếu tọa độ | latitude = null | HTTP 422 với fieldErrors.latitude | ✅ Đạt |
| TC11 | Slug trùng lặp | Slug đã tồn tại | HTTP 409 Conflict | ✅ Đạt |
| TC12 | Tạo vé (Staff) | Thông tin khách + packageId | Vé tạo thành công với mã NBG- | ✅ Đạt |
| TC13 | Xem tour active | Tourist gọi GET /tours | Danh sách tour có stops + location info | ✅ Đạt |
| TC14 | Refresh token | httpOnly cookie hợp lệ | Access token mới trả về | ✅ Đạt |
| TC15 | Admin xem thống kê | GET /admin/stats | 4 metrics + recentTickets + chartData | ✅ Đạt |
| TC16 | Đổi role người dùng | PUT /admin/users/:id/role | Role cập nhật, không thể đổi chính mình | ✅ Đạt |
| TC17 | CORS cross-origin | Origin từ *.vercel.app | Response có Access-Control-Allow-Origin | ✅ Đạt |
| TC18 | Sắp xếp thứ tự spot | Nhập số thứ tự mới | Tất cả spots được reassign order 0,1,2... | ✅ Đạt |
| TC19 | Audio fallback ngôn ngữ | Location chỉ có audioVi, user chọn EN | audioUrl = audioViUrl (fallback) | ✅ Đạt |
| TC20 | Cache invalidation | Update location sau khi có cache | Cache bị xóa, request tiếp theo lấy từ DB | ✅ Đạt |

### 3.7.3. Kiểm thử hiệu năng

| Endpoint | Phương thức | Thời gian phản hồi (có cache) | Thời gian phản hồi (không cache) |
|----------|------------|------------------------------|----------------------------------|
| `GET /api/v1/locations` | Tourist list | ~35ms | ~180ms |
| `GET /api/v1/locations/:slug` | Tourist detail | ~12ms | ~95ms |
| `GET /api/v1/tours` | Tour list | ~25ms | ~140ms |
| `GET /api/v1/admin/stats` | Dashboard stats | — | ~220ms |
| `POST /api/v1/auth/login` | Auth | — | ~280ms |

> **Cache hiệu quả**: Với node-cache TTL 5 phút, endpoint chi tiết địa điểm giảm 87% thời gian phản hồi so với truy vấn DB trực tiếp.

### 3.7.4. Kiểm thử tương thích

| Trình duyệt / Thiết bị | Kết quả |
|------------------------|---------|
| Chrome 147 (Desktop) | ✅ Hoạt động đầy đủ |
| Chrome 147 (Mobile Android) | ✅ Responsive, GPS hoạt động |
| Safari iOS 18.5 | ✅ Hoạt động, audio cần tương tác trước |
| Microsoft Edge 147 | ✅ Hoạt động đầy đủ |
| Firefox 127 | ✅ Hoạt động đầy đủ |

> **Lưu ý Safari:** Chính sách autoplay của iOS/Safari yêu cầu người dùng tương tác (touch) trước khi audio có thể phát — đây là hạn chế của nền tảng, không phải lỗi ứng dụng. Ứng dụng xử lý bằng cách hiển thị nút Play rõ ràng.
