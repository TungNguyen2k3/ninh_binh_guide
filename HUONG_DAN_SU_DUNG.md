# HƯỚNG DẪN SỬ DỤNG — NINH BÌNH GUIDE
> Phiên bản 1.0 | Ứng dụng hướng dẫn tham quan thông minh tỉnh Ninh Bình

---

# MỤC LỤC

1. [Giới thiệu ứng dụng](#1-giới-thiệu)
2. [Hướng dẫn dành cho Khách tham quan (Tourist)](#2-tourist)
3. [Hướng dẫn dành cho Nhân viên quầy vé (Staff)](#3-staff)
4. [Hướng dẫn dành cho Quản trị viên (Admin)](#4-admin)

---

# 1. GIỚI THIỆU

**Ninh Bình Guide** là ứng dụng web giúp du khách tự khám phá các địa điểm tham quan tại Ninh Bình mà không cần hướng dẫn viên. Ứng dụng cung cấp bản đồ tương tác, thuyết minh audio song ngữ (Tiếng Việt và Tiếng Anh) cho từng địa điểm và khu vực tham quan.

**Địa chỉ truy cập:** `https://ninh-binh-guide.vercel.app`

**Ba vai trò trong hệ thống:**

| Vai trò | Mô tả |
|---------|-------|
| **Admin** | Quản lý toàn bộ hệ thống: địa điểm, gói, vé, người dùng |
| **Staff** | Nhân viên quầy vé — tạo vé cho khách tham quan |
| **Tourist** | Du khách — kích hoạt vé và khám phá địa điểm |

---

# 2. TOURIST — KHÁCH THAM QUAN

## 2.1. Đăng ký tài khoản

1. Truy cập ứng dụng → nhấn **"Sign up"** (Đăng ký)
2. Điền thông tin:
   - **Họ tên**: Tên đầy đủ của bạn
   - **Email hoặc Số điện thoại**: Dùng để đăng nhập sau này
   - **Mật khẩu**: Tối thiểu 8 ký tự
3. Nhấn **"Đăng ký"** → Tài khoản được tạo thành công

> 💡 **Lưu ý**: Bạn có thể đăng ký bằng email *hoặc* số điện thoại, không bắt buộc cả hai.

---

## 2.2. Đăng nhập

1. Nhấn **"Log in"** (Đăng nhập)
2. Nhập email/số điện thoại và mật khẩu đã đăng ký
3. Nhấn **"Đăng nhập"**

---

## 2.3. Kích hoạt vé tham quan

Sau khi mua vé tại quầy, bạn nhận được một **mã vé** dạng `NBG-XXXXXX`. Cần kích hoạt mã này để bắt đầu sử dụng ứng dụng.

**Các bước kích hoạt:**

1. Sau khi đăng nhập, ứng dụng tự động chuyển đến màn hình **"Kích hoạt vé"**
2. Nhập mã vé nhận từ nhân viên quầy (ví dụ: `NBG-A3B7KP`)
3. Nhấn **"Kích hoạt"**
4. Màn hình hiển thị xác nhận: *"Kích hoạt thành công! Chào mừng đến Ninh Bình"*

> ⚠️ **Quan trọng:**
> - Thời hạn vé được tính **từ lúc kích hoạt**, không phải từ lúc mua
> - Thời gian còn lại hiển thị ở góc trên phải màn hình (ví dụ: `⏱ 23g 45p`)
> - Khi còn dưới 1 giờ, thời gian đổi sang màu đỏ để cảnh báo
> - Khi hết hạn, ứng dụng tự động yêu cầu kích hoạt vé mới

---

## 2.4. Khám phá địa điểm — Bản đồ

Màn hình bản đồ hiển thị tất cả địa điểm tham quan trong gói vé của bạn.

### Điều hướng trên bản đồ

- **Phóng to/thu nhỏ**: Dùng ngón tay pinch hoặc nút `+` / `-` trên bản đồ
- **Di chuyển**: Vuốt ngón tay theo hướng muốn di chuyển
- **Xem tên địa điểm**: Giữ ngón tay lên marker để hiện tên

### Các nút điều khiển (góc phải trên bản đồ)

| Nút | Chức năng |
|-----|-----------|
| 📍 | **Vị trí của tôi** — Định vị GPS, hiển thị vị trí hiện tại của bạn bằng chấm xanh và di chuyển bản đồ đến vị trí đó |
| 🗺️ | **Tuyến đường gợi ý** — Bật/tắt đường nét đứt xanh nối các địa điểm theo thứ tự tham quan được đề xuất |

### Xem thông tin địa điểm

1. Nhấn vào **marker** trên bản đồ
2. Panel thông tin hiển thị phía dưới màn hình:
   - Ảnh bìa địa điểm
   - Tên và mô tả ngắn
   - Badge: `🎧 Audio` (có thuyết minh), `📍 N điểm` (số khu vực con)
3. Nhấn **"Xem chi tiết →"** để vào trang chi tiết đầy đủ

---

## 2.5. Khám phá địa điểm — Danh sách

Nhấn tab **"Danh sách"** ở thanh điều hướng phía dưới để xem tất cả địa điểm theo dạng lưới.

- Mỗi thẻ hiển thị: ảnh bìa, tên, mô tả ngắn, badge Audio và số điểm con
- Nhấn vào thẻ để vào trang chi tiết địa điểm

---

## 2.6. Trang chi tiết địa điểm

### Thông tin tham quan (phía dưới tên địa điểm)

Các chip thông tin hiển thị nhanh:

| Icon | Thông tin |
|------|-----------|
| 🕐 | Giờ mở cửa (ví dụ: 7:00 - 17:30) |
| 🎫 | Giá vé tham quan |
| ⏱ | Thời gian tham quan ước tính |
| 🌤 | Thời điểm lý tưởng trong năm |
| 📍 | Địa chỉ |

### Nội dung thuyết minh

Cuộn xuống để đọc:
- **Tổng quan**: Giới thiệu chung về địa điểm
- **Lịch sử hình thành**: Câu chuyện lịch sử và văn hóa
- **Điểm nổi bật**: Những điều không nên bỏ lỡ
- **Các khu vực**: Danh sách điểm con với ảnh và mô tả

### Thanh audio phía dưới màn hình

Thanh audio xuất hiện ở phía dưới và **tiếp tục phát khi bạn cuộn nội dung**.

**Cách sử dụng:**

1. **Chọn khu vực muốn nghe**: Hàng chip phía trên thanh player
   - `Tổng quan` — Audio thuyết minh toàn bộ địa điểm
   - `Hang Cả`, `Đền Trần`,... — Audio riêng cho từng khu vực con
   - Chip màu **xanh đậm** = đang phát; Chip màu **xám** = không có audio
2. **Phát/Dừng**: Nhấn nút ▶ / ⏸ tròn màu xanh
3. **Tua nhanh/chậm**: Nhấn thanh tiến trình để tua đến vị trí bất kỳ
4. **Tốc độ phát**: Nhấn nút `1×` để chuyển sang `1.5×`, `2×`, `0.75×`

> 💡 **Mẹo**: Khi đang tham quan thực tế, hãy chọn đúng khu vực bạn đang đứng để nghe thuyết minh phù hợp nhất.

---

## 2.7. Lịch trình gợi ý

Nhấn tab **"Lịch trình"** (biểu tượng bản đồ) ở thanh điều hướng phía dưới.

Ứng dụng cung cấp 4 lịch trình mẫu:

| Lịch trình | Thời gian | Phù hợp với |
|-----------|-----------|-------------|
| **Ninh Bình trong 1 ngày** | 1 ngày | Du khách có ít thời gian, muốn xem nhiều nhất |
| **Ninh Bình 2 ngày** | 2 ngày 1 đêm | Muốn khám phá đầy đủ và thoải mái |
| **Hành trình tâm linh** | 1-2 ngày | Quan tâm đến chùa chiền, nhà thờ |
| **Thiên nhiên hoang sơ** | 2 ngày | Yêu thiên nhiên, động vật hoang dã |

Mỗi lịch trình hiển thị:
- Timeline với giờ tham quan cụ thể cho từng điểm
- Thời gian ở mỗi điểm
- Ghi chú thực tế (ăn gì, mặc gì, lưu ý gì)
- Badge 🎧 nếu điểm có audio thuyết minh

---

## 2.8. Chuyển ngôn ngữ

Nhấn **EN** hoặc **VI** ở góc trên phải để chuyển ngôn ngữ giao diện và nội dung thuyết minh.

---

## 2.9. Đăng xuất

Nhấn biểu tượng **→ (mũi tên ra)** ở góc trên phải → đăng xuất khỏi tài khoản.

---

# 3. STAFF — NHÂN VIÊN QUẦY VÉ

## 3.1. Đăng nhập

Dùng tài khoản Staff do Admin cấp. Sau khi đăng nhập, giao diện chuyển sang trang quản lý vé của nhân viên.

---

## 3.2. Tạo vé tham quan mới

**Khi có khách đến quầy mua vé:**

1. Nhấn **"Tạo vé mới"** (góc trên phải)
2. Điền thông tin:
   - **Tên khách** *(bắt buộc)*: Tên đầy đủ của khách
   - **Số điện thoại** *(tuỳ chọn)*: Để liên hệ nếu cần
   - **Gói tham quan** *(bắt buộc)*: Chọn gói phù hợp với nhu cầu khách
   - **Ghi chú** *(tuỳ chọn)*: Ghi chú thêm nếu cần
3. Nhấn **"Tạo vé mới"**

**Sau khi tạo thành công:**
- Mã vé hiển thị lớn ở giữa màn hình (dạng `NBG-XXXXXX`)
- Nhấn **"Copy mã vé"** → đưa mã cho khách
- Khách dùng mã này để kích hoạt trên ứng dụng

> ⚠️ **Lưu ý quan trọng:**
> - Thời hạn vé được tính **từ khi khách kích hoạt**, không phải từ khi tạo
> - Mã vé chỉ dùng được **một lần** cho một tài khoản
> - Nhấn **"Tạo vé mới"** để tiếp tục tạo vé cho khách tiếp theo

---

## 3.3. Xem lịch sử vé đã tạo

Trang chính hiển thị danh sách tất cả vé bạn đã tạo, sắp xếp từ mới đến cũ.

**Trạng thái vé:**

| Trạng thái | Ý nghĩa |
|-----------|---------|
| **Chờ kích hoạt** | Vé đã tạo, khách chưa kích hoạt |
| **Đã kích hoạt** | Khách đã kích hoạt và đang sử dụng |
| **Hết hạn** | Vé đã quá thời hạn sử dụng |

> 💡 Admin có thể xem toàn bộ vé của tất cả nhân viên tại trang quản lý vé riêng.

---

# 4. ADMIN — QUẢN TRỊ VIÊN

## 4.1. Đăng nhập

Dùng tài khoản Admin. Sau khi đăng nhập, giao diện chuyển sang **Dashboard quản trị**.

---

## 4.2. Dashboard

Trang tổng quan hiển thị:

- **4 thẻ thống kê**: Tổng số địa điểm (đang active), gói tham quan, vé, người dùng
- **Biểu đồ hoạt động**: Số vé tạo mới và user mới theo ngày — chọn xem **7 ngày** hoặc **30 ngày**
- **Vé gần đây**: 5 vé được tạo gần nhất với trạng thái kích hoạt

---

## 4.3. Quản lý địa điểm

### Xem danh sách địa điểm

Menu → **Địa điểm** — Hiển thị bảng tất cả địa điểm với:
- Tên VI/EN, slug, tọa độ, trạng thái, có audio hay chưa
- Tìm kiếm theo tên
- Phân trang 20 địa điểm/trang

**Bật/tắt địa điểm**: Click vào badge trạng thái `Hoạt động` / `Tạm dừng` để toggle.

### Tạo địa điểm mới

1. Nhấn **"Thêm địa điểm"**
2. Điền **Tab Cơ bản**:
   - **Tên tiếng Việt** và **tên tiếng Anh** *(bắt buộc)*
   - **Slug (URL)**: Tự sinh từ tên VI, hoặc nhấn "Tự tạo slug" — dùng chữ thường, dấu gạch ngang (ví dụ: `trang-an`)
   - **Vĩ độ / Kinh độ**: Tọa độ GPS của địa điểm (tra trên Google Maps)
   - **Thứ tự hiển thị**: Số nhỏ hiển thị trước
   - **Mô tả ngắn** VI/EN: Hiển thị trong danh sách địa điểm của du khách
3. **Upload ảnh**: Kéo thả hoặc nhấn để chọn ảnh (tối đa 5 ảnh) — ảnh đầu tiên tự dùng làm ảnh bìa
4. **Upload audio**: Tab riêng cho audio VI và audio EN
5. Nhấn **"Lưu thông tin cơ bản"**

### Chỉnh sửa nội dung địa điểm (Tab Nội dung)

Chuyển sang **Tab Nội dung** để nhập:

| Phần | Mô tả |
|------|-------|
| **Mô tả tổng quan** | Hiển thị ở đầu trang chi tiết — mô tả chung về địa điểm |
| **Lịch sử hình thành** | Lịch sử và giá trị văn hóa |
| **Điểm nổi bật** | Những điều đặc sắc không nên bỏ lỡ |
| **Thông tin tham quan** | Giờ mở cửa, giá vé, thời gian ước tính, địa chỉ, thời điểm lý tưởng |

> 💡 Mỗi mục có **2 ngôn ngữ VI/EN** — dùng nút chuyển ngôn ngữ để nhập từng phiên bản.

Nhấn **"Lưu thay đổi"** sau khi nhập xong.

### Quản lý khu vực/điểm con (Tab Khu vực)

Mỗi địa điểm có thể có nhiều khu vực con với ảnh và audio riêng.

**Thêm khu vực mới:**
1. Nhấn **"Thêm khu vực"**
2. Điền tên VI/EN cho khu vực
3. Nhập mô tả VI/EN
4. Upload ảnh cho khu vực đó
5. Upload audio thuyết minh VI/EN
6. Điền tọa độ GPS nếu muốn (tuỳ chọn)
7. Nhấn **"Lưu khu vực"**

**Sắp xếp thứ tự khu vực:**
- Mỗi khu vực có ô số thứ tự ở góc phải header
- Gõ số thứ tự mới → Enter hoặc click ra ngoài → thứ tự tự động cập nhật
- Thứ tự này ảnh hưởng đến thứ tự hiển thị chip audio cho du khách

---

## 4.4. Quản lý gói tham quan

Menu → **Gói tham quan**

### Tạo gói mới

1. Nhấn **"Thêm gói"**
2. Điền thông tin:
   - **Tên gói**: Tên hiển thị khi nhân viên tạo vé
   - **Loại gói**:
     - `Tất cả địa điểm` — Khách xem được mọi địa điểm đang active
     - `Tùy chọn` — Chỉ xem được địa điểm được gán vào gói
   - **Thời hạn (giờ)**: Bao nhiêu giờ kể từ lúc kích hoạt (ví dụ: 24 = 1 ngày, 48 = 2 ngày)
   - **Giá (VND)**: Giá bán vé
3. Nhấn **"Lưu"**
4. Với gói `Tùy chọn`: Nhấn **"Gán địa điểm"** → chọn các địa điểm thuộc gói

---

## 4.5. Quản lý vé

Menu → **Vé**

- Xem **toàn bộ vé** của tất cả nhân viên
- **Tìm kiếm** theo mã vé, tên khách, số điện thoại
- Nhấn **"Tạo vé mới"** để tạo vé (giống Staff nhưng chuyển hướng đúng về trang admin)
- Phân trang 20 vé/trang

---

## 4.6. Quản lý người dùng

Menu → **Người dùng**

### Xem danh sách người dùng

- Bảng hiển thị tên, email/SĐT, vai trò, ngày tạo
- Tìm kiếm theo tên/email
- Lọc theo vai trò: Admin / Staff / Tourist

### Tạo tài khoản mới

1. Nhấn **"Tạo tài khoản"**
2. Điền tên, email/SĐT, mật khẩu
3. Chọn vai trò: **Admin** hoặc **Staff**
4. Nhấn **"Tạo tài khoản"**

> ⚠️ Chỉ Admin mới tạo được tài khoản Admin/Staff. Tài khoản Tourist do khách tự đăng ký.

### Đổi vai trò người dùng

Trong bảng người dùng, cột **Actions** có dropdown chọn vai trò → chọn vai trò mới → tự động lưu.

### Xóa tài khoản

Nhấn **"Xóa"** → xác nhận → tài khoản bị xóa vĩnh viễn.

> ⚠️ Không thể xóa chính tài khoản đang đăng nhập.

---

# 5. CÂU HỎI THƯỜNG GẶP (FAQ)

**Q: Tôi mua vé rồi nhưng khi kích hoạt báo "Mã vé không hợp lệ"?**
→ Kiểm tra lại mã vé xem có gõ đúng không (phân biệt chữ hoa/thường). Liên hệ nhân viên quầy để xác nhận mã.

**Q: Tôi kích hoạt vé xong nhưng không thấy địa điểm nào?**
→ Gói vé bạn mua là gói tùy chọn và chưa được gán địa điểm. Liên hệ quầy vé để được hỗ trợ.

**Q: Audio không phát được?**
→ Kiểm tra âm lượng điện thoại. Đảm bảo trình duyệt được cấp quyền phát âm thanh. Thử tải lại trang.

**Q: Bản đồ không hiển thị vị trí GPS?**
→ Đảm bảo trình duyệt được cấp quyền truy cập vị trí. Vào Cài đặt trình duyệt → Quyền → Vị trí → Cho phép.

**Q: Tôi muốn xem nội dung tiếng Anh?**
→ Nhấn nút **EN** ở góc trên phải màn hình.

**Q: Vé hết hạn nhưng tôi muốn tiếp tục xem?**
→ Mua vé mới tại quầy và kích hoạt mã vé mới.

---

# 6. HỖ TRỢ

Nếu gặp sự cố, vui lòng liên hệ nhân viên tại quầy vé hoặc ban quản lý khu du lịch.

---

*Ninh Bình Guide — Tự khám phá di sản*
