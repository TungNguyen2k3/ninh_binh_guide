# Hướng dẫn chạy dự án tại máy local

## Yêu cầu

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | 18.x trở lên |
| npm | 9.x trở lên |
| Git | Bất kỳ |

> Không cần cài PostgreSQL hay Cloudinary — dự án dùng database và storage đã có sẵn trên cloud.

---

## 1. Clone source code

```bash
git clone https://github.com/TungNguyen2k3/ninh_binh_guide.git
cd ninh_binh_guide
```

---

## 2. Cài đặt Backend

### 2.1. Cài dependencies

```bash
cd backend
npm install
```

### 2.2. Tạo file `.env`

Tạo file `backend/.env` với nội dung sau:

```env
# Database — dùng URL Railway có sẵn, không cần cài PostgreSQL local
DATABASE_URL=postgresql://postgres:abcxyz@junction.proxy.rlwy.net:12345/railway

# JWT — giữ nguyên để đồng bộ với dữ liệu DB
JWT_SECRET=6386c35ebe99320b8d3bf52ceae5dedce8901eee0f5229ea11cf8cb326685b2a
JWT_REFRESH_SECRET=b0741d25b384d79fa2e13e7572e8b9ab9c728051838bdce29013e87c9d9344ef

PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Cloudinary — dùng tài khoản có sẵn, không cần đăng ký
CLOUDINARY_CLOUD_NAME=dksdroytv
CLOUDINARY_API_KEY=449843538689685
CLOUDINARY_API_SECRET=eDvqQQTGAw3024aUsVSmLa_ZSTM
```

> **Lưu ý:** Thay `DATABASE_URL` bằng URL thực tế được cung cấp kèm tài liệu bàn giao.

### 2.3. Đồng bộ Prisma schema

```bash
npx prisma generate
```

> Không cần `prisma db push` hay seed vì database đã có dữ liệu.

### 2.4. Khởi động backend

```bash
npm run dev
```

Backend chạy tại: `http://localhost:4000`

Kiểm tra: mở trình duyệt vào `http://localhost:4000/api/v1/health` — kết quả `{ "status": "ok" }` là thành công.

---

## 3. Cài đặt Frontend

### 3.1. Cài dependencies

Mở terminal mới (giữ terminal backend vẫn chạy):

```bash
cd frontend
npm install
```

### 3.2. Tạo file `.env`

Tạo file `frontend/.env` với nội dung:

```env
NUXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3.3. Khởi động frontend

```bash
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

---

## 4. Tài khoản thử nghiệm

| Role | Email | Mật khẩu |
|------|-------|----------|
| Admin | admin@ninhbinh.vn | admin123456 |
| Staff | staff@ninhbinh.vn | staff123456 |
| Tourist | tourist@test.com | tourist123456 |

---

## 5. Lưu ý

- Chạy **backend trước**, frontend sau.
- Cả hai terminal phải cùng chạy song song trong suốt quá trình sử dụng.
- Nếu gặp lỗi `EADDRINUSE: address already in use 4000`, có tiến trình khác đang chiếm cổng — tắt đi hoặc đổi `PORT` trong `.env`.
- Dữ liệu địa điểm, tour, ảnh, audio đã có sẵn trong database — không cần seed lại.
