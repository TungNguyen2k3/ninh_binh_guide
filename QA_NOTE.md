# QA Test Report — Sprint 1–4

**Tested by:** test-agent
**Date:** 2026-05-02
**Environment:** localhost:4000 (Fastify) + localhost:3000 (Nuxt 3)

---

## Unit Test Results

| File | Tests | Status |
|---|---|---|
| auth.service.test.ts | 18 | Pass |
| location.service.test.ts | 11 | Pass |
| package.service.test.ts | 9 | Pass |
| ticket.service.test.ts | 9 | Pass |
| tourist.service.test.ts | 10 | Pass |
| **Total** | **57** | **57/57** |

**Coverage:**
| Service | Statements | Branch | Functions | Lines |
|---|---|---|---|---|
| auth.service.ts | 96.42% | 91.17% | 100% | 96.42% |
| location.service.ts | 82.35% | 100% | 75% | 82.35% |
| package.service.ts | 95% | 100% | 85.71% | 95% |
| ticket.service.ts | 83.09% | 94.73% | 55.55% | 83.09% |
| tourist.service.ts | 100% | 78.04% | 100% | 100% |
| **All files** | **92.21%** | **89.34%** | **80%** | **92.21%** |

Uncovered lines:
- `auth.service.ts`: lines 151-152, 156-157
- `location.service.ts`: lines 11-13, 57-62
- `package.service.ts`: lines 14-15
- `ticket.service.ts`: lines 57-62, 65-68, 94-95
- `tourist.service.ts`: branch lines 74, 80-83, 96, 98 (cache hit paths)

## TypeScript Check
- Backend: 0 errors (`npx tsc --noEmit`)
- Frontend: 0 errors (`npx nuxi typecheck`)

---

## Kịch bản test UI — bạn cần test thủ công

### Chuẩn bị
```
1. Backend: cd backend && npx prisma db push && npm run db:seed && npm run dev
2. Frontend: cd frontend && npm run dev
3. Mo: http://localhost:3000
```

### A. Auth flows (Sprint 1)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| A1 | Vao localhost:3000 chua login | Redirect /auth/login |
| A2 | Login sai password | Toast do "Email/SDT... khong dung" |
| A3 | Login admin@ninhbinh.vn / Admin@123456 | Redirect /admin/locations |
| A4 | Login staff@ninhbinh.vn / Staff@123456 | Redirect /staff/tickets |
| A5 | Dang ky tourist moi | Redirect /auth/activate (chua co ticket) |
| A6 | F5 refresh sau login admin | Van con login, dung trang |
| A7 | Logout | Redirect /auth/login |
| A8 | Doi ngon ngu VI→EN roi F5 | Giu nguyen EN |

### B. Admin Locations (Sprint 2)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| L1 | /admin/locations | 5 dia diem seed, ten tieng Viet |
| L2 | Search "trang" | Chi Trang An |
| L3 | Toggle badge Hoat dong | Doi thanh Tam dung ngay |
| L4 | Toggle lai | Ve Hoat dong |
| L5 | Click Sua | Form dien san du lieu |
| L6 | Sua ten → Luu | Toast thanh cong, list cap nhat |
| L7 | Them dia diem slug moi | Xuat hien trong list |
| L8 | Them slug trung | Toast loi slug da ton tai |
| L9 | Xoa → confirm | Bien khoi list |

### C. Admin Packages (Sprint 2)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| P1 | /admin/packages | 2 packages seed |
| P2 | Toggle trang thai | Cap nhat ngay |
| P3 | Them goi custom | Xuat hien |
| P4 | Gan dia diem (custom) | Checkbox, pre-check dung |
| P5 | Gan dia diem (all_locations) | Banner "tu dong gom tat ca" |

### D. Staff — Tao ve (Sprint 3)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| S1 | Login staff → /staff/tickets | List tickets (co 2 demo) |
| S2 | Click "Tao ve moi" | Form: ten khach + SDT + chon goi |
| S3 | Form: dropdown goi co 2 goi active | Hien dung danh sach |
| S4 | Dien form → Submit | Man hinh ket qua, code NBG-XXXXXX hien to |
| S5 | Click "Copy ma ve" | Toast "Da copy ma ve" |
| S6 | Click "Tao ve khac" | Form reset trong |
| S7 | Click "Created tickets" → list | Ve moi xuat hien dau list |
| S8 | Badge ve: Cho kich hoat / Da kich hoat / Het han | Dung trang thai |

### E. Tourist — Kich hoat ve (Sprint 3)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| T1 | Dang ky tourist moi | Redirect /auth/activate (chua co ve) |
| T2 | /auth/activate — nhap NBG-DEMO01 | Validate format, nut Kich hoat |
| T3 | Submit NBG-DEMO01 | Toast thanh cong → redirect /explore |
| T4 | F5 o /explore | Van vao duoc (ticketId restored) |
| T5 | Nhap code sai format (ABC) | Loi validation ngay |
| T6 | Nhap code khong ton tai | Loi "khong tim thay ma ve" |
| T7 | Kich hoat lai code da dung | Toast "da kich hoat truoc do" |

### F. Admin — Xem tat ca ve (Sprint 3)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| F1 | Admin → /admin/tickets | Grid tat ca ve |
| F2 | Search "DEMO" | Chi demo tickets |
| F3 | Badge trang thai | Dung: pending/activated/expired |

### G. Mobile (375px)

| # | Kiem tra | Ket qua mong doi |
|---|---|---|
| M1 | Staff /staff/tickets mobile | List cards, khong vo layout |
| M2 | Form tao ve mobile | Fields stack doc |
| M3 | Man hinh ket qua mobile | Code to, copy button ro |
| M4 | /auth/activate mobile | Input lon, de nhap |

### H. Tourist — Kham pha ban do (Sprint 4)

| # | Hanh dong | Ket qua mong doi |
|---|---|---|
| H1 | Tourist co ticket → vao /explore | Ban do Ninh Binh hien voi markers |
| H2 | Markers hien dung vi tri | 5 dia diem (hoac theo goi) |
| H3 | Click marker | Panel slide-up hien ten + mo ta ngan |
| H4 | Click "Xem chi tiet" trong panel | Chuyen sang trang /explore/slug |
| H5 | Tab "Danh sach" | List cards cac dia diem |
| H6 | Click card | Trang chi tiet |
| H7 | Trang chi tiet | Anh + mo ta day du + audio player |
| H8 | Nhan Play audio (can co file audio) | Phat am thanh |
| H9 | Click thanh seek | Tua den vi tri do |
| H10 | Chon toc do 1.5x | Audio phat nhanh hon |
| H11 | Doi ngon ngu VI→EN | Ten dia diem, mo ta doi sang EN |
| H12 | Doi ngon ngu EN→VI | Ve lai tieng Viet |
| H13 | Tourist chua co ticket vao /explore | Redirect /auth/activate |
| H14 | F5 o /explore voi ticket active | Van vao duoc (ticketId restored) |
| H15 | Dia diem khong co audio | Hien thong bao "Chua co audio" |

---

## Bugs da fix Sprint 1–3

| # | Bug | Fix |
|---|---|---|
| B1 | response.accessToken undefined | response.data.accessToken |
| B2 | Cross-origin cookie | Nuxt devProxy /api |
| B3 | Login redirect loop (SSR) | import.meta.server return trong middleware |
| B4 | i18n keys raw string | Locale files sai thu muc |
| B5 | Admin mobile layout vo | fixed header, block outer |
| B6 | Table bi cat | Bo overflow-hidden khoi card |
| B7 | Toggle trang thai khong cap nhat | isActive thieu trong UpdateSchema |
| B8 | @fastify/multipart crash | Downgrade v8 cho Fastify v4 |
| B9 | Ticket code khong hien | res.data thay vi res.data.ticket |
| B10 | Activate khong redirect | ticketId state rieng + initialize() goi /auth/my-ticket |
| B11 | Staff 403 khi load packages | Them GET /staff/packages endpoint |
| B12 | Missing template redirect pages | Them <template><div/> + import.meta.client |
| B13 | TicketCard khong resolve | AdminTicketCard (prefix thu muc) |
| B14 | API call trong SSR | onMounted thay await top-level |

## Coverage Summary
- Unit tests: 57/57 pass
- Service coverage (statements): auth 96.42% / location 82.35% / package 95% / ticket 83.09% / tourist 100% / all files 92.21%
- TypeScript: 0 errors (backend + frontend)
