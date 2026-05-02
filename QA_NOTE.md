# QA Test Report — Sprint 1 + Sprint 2

**Tested by:** test-agent
**Date:** 2026-05-02
**Environment:** localhost:4000 (Fastify) + localhost:3000 (Nuxt 3)

---

## Unit Test Results

| File | Tests | Status |
|---|---|---|
| auth.service.test.ts | 18 | ✅ Pass |
| location.service.test.ts | 11 | ✅ Pass |
| package.service.test.ts | 9 | ✅ Pass |
| **Total** | **38** | **✅ 38/38** |

**Coverage:**
| Service | Statements | Branch | Functions | Lines |
|---|---|---|---|---|
| auth.service.ts | 96.42% | 91.17% | 100% | 96.42% |
| location.service.ts | 82.35% | 100% | 75% | 82.35% |
| package.service.ts | 95% | 100% | 85.71% | 95% |
| **All files** | **92.61%** | **95.16%** | **86.36%** | **92.61%** |

Uncovered lines:
- `auth.service.ts`: lines 151-152, 156-157
- `location.service.ts`: lines 11-13, 57-62
- `package.service.ts`: lines 14-15

## TypeScript Check
- Backend: ✅ 0 errors (`npx tsc --noEmit`)
- Frontend: ✅ 0 errors (`npx nuxi typecheck`)

---

## Kịch bản test UI — bạn cần test thủ công

### Chuẩn bị
- Backend chạy: `cd backend && npm run dev`
- Frontend chạy: `cd frontend && npm run dev`
- Mở: `http://localhost:3000`

### A. Auth flows

| # | Hành động | Kết quả mong đợi | Ghi chú |
|---|---|---|---|
| A1 | Vào `localhost:3000` (chưa login) | Redirect → `/auth/login` | |
| A2 | Login email sai password | Toast đỏ: "Email/SĐT hoặc mật khẩu không đúng" | |
| A3 | Login 6 lần liên tiếp sai | Lần 6: Toast "Quá nhiều lần thử, vui lòng chờ 15 phút" | Rate limit |
| A4 | Login `admin@ninhbinh.vn` / `Admin@123456` | Redirect → `/admin/locations` | |
| A5 | Login `staff@ninhbinh.vn` / `Staff@123456` | Redirect → `/staff` | |
| A6 | Đăng ký tourist mới (email mới) | Redirect → `/explore` | Auto-login sau đăng ký |
| A7 | **F5 refresh** sau khi đăng nhập admin | Vẫn còn đăng nhập, thấy admin dashboard | Cookie session |
| A8 | Logout | Redirect → `/auth/login` | URL thay đổi ngay |
| A9 | F5 sau khi logout | Vẫn ở `/auth/login` (không auto-login lại) | |
| A10 | Dùng URL `/admin` khi đang là tourist | Redirect về `/explore` | Guard |
| A11 | Đổi ngôn ngữ VI → EN | Toàn bộ UI đổi sang tiếng Anh | |
| A12 | F5 sau khi đổi ngôn ngữ | Vẫn hiển thị EN (cookie persist) | |

### B. Admin Locations

| # | Hành động | Kết quả mong đợi | Ghi chú |
|---|---|---|---|
| L1 | Vào `/admin/locations` | Thấy 5 địa điểm, tên hiển thị đúng (Tràng An, Hang Múa...) | Không thấy raw key |
| L2 | Tìm kiếm "tràng" | Chỉ còn "Tràng An" | Debounce 400ms |
| L3 | Xóa text tìm kiếm | Về đủ 5 địa điểm | |
| L4 | Click badge "Hoạt động" | Toggle ngay thành "Tạm dừng" (không cần reload) | isActive fix |
| L5 | Click lại badge "Tạm dừng" | Toggle lại thành "Hoạt động" | |
| L6 | Click **Sửa** địa điểm | Vào form, dữ liệu điền sẵn | |
| L7 | Sửa tên VI → Lưu | Toast "Cập nhật thành công", list cập nhật | |
| L8 | Click **Thêm địa điểm** → điền form hợp lệ → Lưu | Địa điểm mới xuất hiện | |
| L9 | Thêm với slug đã tồn tại (vd: "trang-an") | Toast lỗi "Slug đã tồn tại" | |
| L10 | Click **Xóa** → confirm | Địa điểm biến khỏi list | |
| L11 | Click **Xóa** → cancel | Địa điểm vẫn còn | |
| L12 | Upload audio .mp3 *(cần Cloudinary)* | Spinner quay → xong có audio player | |
| L13 | Upload ảnh *(cần Cloudinary)* | Spinner quay → xong có thumbnail | |

### C. Admin Packages

| # | Hành động | Kết quả mong đợi | Ghi chú |
|---|---|---|---|
| P1 | Vào `/admin/packages` | Thấy "Goi Co Ban" + "Goi Toan Canh" | |
| P2 | Toggle trạng thái package | Cập nhật ngay | isActive fix |
| P3 | Thêm gói mới type "Tùy chọn" | Xuất hiện trong list | |
| P4 | Thêm gói mới type "Tất cả địa điểm" | Xuất hiện trong list | |
| P5 | Click **Gán địa điểm** (gói Custom) | Trang checkbox, các địa điểm đã assign được pre-check | |
| P6 | Chọn thêm/bỏ địa điểm → Lưu thay đổi | Toast thành công, số địa điểm cập nhật | |
| P7 | Click **Gán địa điểm** (gói all_locations) | Banner "Gói này tự động gồm tất cả địa điểm" | Không có checkbox |
| P8 | Xóa package | Biến khỏi list | |

### D. Mobile/Responsive (test trên DevTools 375px)

| # | Kiểm tra | Kết quả mong đợi |
|---|---|---|
| M1 | Admin Locations trang mobile | Header cố định trên cùng, không lẫn vào table |
| M2 | Bottom nav admin mobile | 5 icon hiện đúng: 📊📍🎫🎟👥, active icon đổi màu |
| M3 | Bảng Locations mobile | Scroll ngang được, cột Actions thấy đủ Sửa/Xóa |
| M4 | Form thêm địa điểm mobile | Fields stack dọc, không bị cắt |
| M5 | Login page mobile | Form căn giữa, không bị zoom khi focus input |
| M6 | Packages page mobile | Tương tự Locations |

---

## Bugs đã fix trong Sprint 1+2

| # | Bug | Fix |
|---|---|---|
| B1 | Response unwrapping sai (`response.accessToken` undefined) | Đổi thành `response.data.accessToken` |
| B2 | Login fail do cross-origin cookie | Thêm Nuxt devProxy `/api` → `localhost:4000/api` |
| B3 | URL không thay đổi sau login | Dùng `window.location.href` thay `navigateTo()` |
| B4 | i18n keys hiển thị raw | Sprint 2 agent ghi vào `locales/` thay vì `i18n/locales/` |
| B5 | Admin mobile layout vỡ | Outer div: `flex` → `block`; header: `sticky` → `fixed` |
| B6 | Table bị cắt bên phải | Bỏ `overflow-hidden` khỏi card container |
| B7 | Toggle trạng thái không cập nhật | `UpdateLocationSchema` và `UpdatePackageSchema` thiếu `isActive` |
| B8 | @fastify/multipart crash | Downgrade v9→v8 (v9 yêu cầu Fastify v5) |
| B9 | Cloudinary error không rõ | Thêm `assertCloudinaryConfigured()` trước upload |

---

## Checklist trước khi release

- [ ] Unit tests: 38/38 pass
- [ ] TypeScript: 0 errors backend + frontend
- [ ] Auth flows A1-A12: pass
- [ ] Location CRUD L1-L11: pass
- [ ] Package CRUD P1-P8: pass
- [ ] Mobile M1-M6: pass
- [ ] Cloudinary credentials: điền vào backend/.env
