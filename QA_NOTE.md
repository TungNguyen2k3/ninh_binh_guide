# QA Test Report — Ninh Bình Audio Guide

**Tested by:** test-agent  
**Date:** 2026-05-02  
**Sprint:** Sprint 2 — Location & Package Management  
**Environment:** localhost:4000 (Fastify backend)

---

## Unit Test Results

| # | Service | Test case | Status |
|---|---------|-----------|--------|
| 1 | LocationService | creates location when slug is unique | ✅ Pass |
| 2 | LocationService | throws ConflictError when slug already exists | ✅ Pass |
| 3 | LocationService | creates location with minimal required fields | ✅ Pass |
| 4 | LocationService | updates location successfully | ✅ Pass |
| 5 | LocationService | throws NotFoundError when location does not exist (update) | ✅ Pass |
| 6 | LocationService | throws ConflictError when new slug is taken by another location | ✅ Pass |
| 7 | LocationService | allows updating to same slug (own slug) | ✅ Pass |
| 8 | LocationService | deletes location successfully | ✅ Pass |
| 9 | LocationService | throws NotFoundError when location does not exist (delete) | ✅ Pass |
| 10 | LocationService | uploads vi audio and updates audioViUrl | ✅ Pass |
| 11 | LocationService | uploads en audio and updates audioEnUrl | ✅ Pass |
| 12 | PackageService | creates package with type all_locations | ✅ Pass |
| 13 | PackageService | creates package with type custom | ✅ Pass |
| 14 | PackageService | assigns locations to custom package | ✅ Pass |
| 15 | PackageService | throws ValidationError when assigning locations to all_locations package | ✅ Pass |
| 16 | PackageService | allows clearing locations from custom package (empty array) | ✅ Pass |
| 17 | PackageService | deletes package successfully | ✅ Pass |
| 18 | PackageService | throws NotFoundError when package does not exist (delete) | ✅ Pass |
| 19 | PackageService | throws NotFoundError when package does not exist (update) | ✅ Pass |
| 20 | PackageService | updates package successfully when it exists | ✅ Pass |

Sprint 1 auth tests (unchanged):

| # | Service | Test case | Status |
|---|---------|-----------|--------|
| 21 | AuthService | creates user and returns tokens when email is provided | ✅ Pass |
| 22 | AuthService | creates user and returns tokens when phone is provided | ✅ Pass |
| 23 | AuthService | throws ValidationError when neither email nor phone is provided (register) | ✅ Pass |
| 24 | AuthService | throws ConflictError when email already exists | ✅ Pass |
| 25 | AuthService | throws ConflictError when phone already exists | ✅ Pass |
| 26 | AuthService | returns tokens when credentials are valid (email) | ✅ Pass |
| 27 | AuthService | returns tokens when credentials are valid (phone) | ✅ Pass |
| 28 | AuthService | throws ValidationError when neither email nor phone is provided (login) | ✅ Pass |
| 29 | AuthService | throws UnauthorizedError when user not found | ✅ Pass |
| 30 | AuthService | throws UnauthorizedError when password is incorrect | ✅ Pass |
| 31 | AuthService | rotates refresh tokens on successful login | ✅ Pass |
| 32 | AuthService | returns new token pair when refresh token is valid | ✅ Pass |
| 33 | AuthService | throws UnauthorizedError when token not found in DB | ✅ Pass |
| 34 | AuthService | throws UnauthorizedError when token is expired in DB and cleans it up | ✅ Pass |
| 35 | AuthService | deletes refresh token from DB | ✅ Pass |
| 36 | AuthService | does not throw when token does not exist | ✅ Pass |
| 37 | AuthService | returns public user without passwordHash | ✅ Pass |
| 38 | AuthService | throws NotFoundError when user does not exist (getMe) | ✅ Pass |

---

## API Test Cases (Manual / curl)

Các lệnh curl để test thủ công sau khi có backend chạy.

**Setup — lấy admin token trước:**
```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninhbinh.vn","password":"Admin@123456"}' \
  | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).data.accessToken))")
```

### Location API Tests

| # | Scenario | Curl | Expected |
|---|----------|------|----------|
| 1 | GET all locations | `curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/v1/admin/locations` | 200, `data.locations` array có 5 items, `data.total: 5` |
| 2 | GET với search | `curl -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/v1/admin/locations?search=trang"` | 200, chỉ trả locations có tên chứa "trang" |
| 3 | GET với pagination | `curl -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/v1/admin/locations?page=1&limit=2"` | 200, array 2 items, `total` phản ánh tổng số |
| 4 | POST tạo location mới | `curl -s -X POST http://localhost:4000/api/v1/admin/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nameVi":"Hang Múa","nameEn":"Mua Cave","slug":"hang-mua","latitude":20.2286,"longitude":105.9657,"descriptionVi":"Mô tả hang múa","descriptionEn":"Mua Cave description"}'` | 201, location object có `id` được sinh |
| 5 | POST duplicate slug | `curl -s -X POST http://localhost:4000/api/v1/admin/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nameVi":"Tràng An 2","nameEn":"Trang An 2","slug":"trang-an","latitude":20.25,"longitude":105.90}'` | 409, `{ success: false, error: { code: "CONFLICT" } }` |
| 6 | POST slug không hợp lệ | `curl -s -X POST http://localhost:4000/api/v1/admin/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nameVi":"Test","nameEn":"Test","slug":"Tràng An!","latitude":20.0,"longitude":106.0}'` | 422, `{ success: false, error: { code: "VALIDATION_ERROR" } }` |
| 7 | PUT update location | `curl -s -X PUT http://localhost:4000/api/v1/admin/locations/<id> -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nameVi":"Tràng An Cập Nhật"}'` | 200, `data.nameVi: "Tràng An Cập Nhật"` |
| 8 | PUT id không tồn tại | `curl -s -X PUT http://localhost:4000/api/v1/admin/locations/nonexistent-id -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"nameVi":"Test"}'` | 404, `{ success: false, error: { code: "NOT_FOUND" } }` |
| 9 | DELETE location | `curl -s -X DELETE http://localhost:4000/api/v1/admin/locations/<id> -H "Authorization: Bearer $TOKEN"` | 204, no body |
| 10 | Không có token | `curl -s http://localhost:4000/api/v1/admin/locations` | 401, `{ success: false, error: { code: "UNAUTHORIZED" } }` |
| 11 | Staff token vào admin | (đăng nhập bằng staff account, lấy token, gọi admin route) `curl -s -H "Authorization: Bearer $STAFF_TOKEN" http://localhost:4000/api/v1/admin/locations` | 403, `{ success: false, error: { code: "FORBIDDEN" } }` |

**Upload audio (multipart):**
```bash
curl -s -X POST http://localhost:4000/api/v1/admin/locations/<id>/audio/vi \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/audio.mp3"
```
Expected: 200, `data.audioViUrl` chứa Cloudinary URL.

**Upload image (multipart):**
```bash
curl -s -X POST http://localhost:4000/api/v1/admin/locations/<id>/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```
Expected: 200, `data.imageUrl` chứa Cloudinary URL.

### Package API Tests

| # | Scenario | Curl | Expected |
|---|----------|------|----------|
| 12 | GET all packages | `curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/v1/admin/packages` | 200, array có 2 packages, mỗi package có `locations` array nested |
| 13 | GET package by id | `curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/v1/admin/packages/<id>` | 200, package object với `locations` nested |
| 14 | POST tạo package custom | `curl -s -X POST http://localhost:4000/api/v1/admin/packages -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Gói Test","type":"custom","validityHours":8,"price":50000}'` | 201, package object có `id` |
| 15 | POST assign locations vào custom | `curl -s -X POST http://localhost:4000/api/v1/admin/packages/<custom-id>/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"locationIds":["<loc-id-1>","<loc-id-2>"]}'` | 200, package với `locations` array cập nhật |
| 16 | POST assign locations vào all_locations | `curl -s -X POST http://localhost:4000/api/v1/admin/packages/<all-id>/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"locationIds":["<loc-id-1>"]}'` | 422, `{ success: false, error: { code: "VALIDATION_ERROR" } }` |
| 17 | POST assign với empty array | `curl -s -X POST http://localhost:4000/api/v1/admin/packages/<custom-id>/locations -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"locationIds":[]}'` | 200, `locations: []` |
| 18 | DELETE package | `curl -s -X DELETE http://localhost:4000/api/v1/admin/packages/<id> -H "Authorization: Bearer $TOKEN"` | 204, no body |

---

## Edge Cases Found

Không phát hiện bug trong quá trình viết test. Các edge case sau đã được verify qua unit test:

1. **Same-slug update không bị block**: Khi update location với slug trùng chính nó (không đổi slug), service so sánh `existing.id !== id` nên không throw ConflictError. Logic đúng.
2. **assignLocations với empty array cho all_locations**: Service chỉ block khi `locationIds.length > 0`, nên gọi `assignLocations('pkg-all', [])` KHÔNG throw — đây là hành vi hợp lý vì clear locations khỏi all_locations package là vô hại (package vẫn truy cập all locations).
3. **uploadAudioFile chỉ update đúng field**: Vi và En audio được lưu vào field riêng biệt (`audioViUrl` vs `audioEnUrl`), không ghi đè lẫn nhau.
4. **cache.del được gọi sau mọi write operation**: Sau create/update/delete, cache key `locations:all` và `packages:all` được invalidate để tránh stale data.

---

## Coverage Summary

Kết quả thực tế từ `npm test -- --coverage` (2026-05-02):

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| auth.service.ts | 96.42% | 91.17% | 100% | 96.42% |
| location.service.ts | 82.35% | 100% | 75% | 82.35% |
| package.service.ts | 95% | 100% | 85.71% | 95% |
| **All files** | **92.61%** | **95.16%** | **86.36%** | **92.61%** |

- **Unit tests**: 38 pass / 38 total (0 fail)
- **Test files**: 3 (auth.service.test.ts, location.service.test.ts, package.service.test.ts)
- **Service coverage**: 92.61% statements — vượt ngưỡng 70% yêu cầu

Các dòng chưa được cover:
- `location.service.ts` lines 11-13: `list()` method (không có test case cho list)
- `location.service.ts` lines 57-62: `uploadImageFile()` method (chưa có test)
- `auth.service.ts` lines 151-152, 156-157: nhánh xử lý JWT decode edge case
- `package.service.ts` lines 14-15: `list()` method (không có test case cho list)
