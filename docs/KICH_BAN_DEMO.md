# Kịch bản Demo Live — Ninh Bình Audio Guide
**Thời lượng**: 6–8 phút | **URL**: ninh-binh-guide.vercel.app

---

## Chuẩn bị trước khi demo

### Tab trình duyệt cần mở sẵn
| Tab | Nội dung | Trạng thái |
|-----|----------|-----------|
| Tab 1 | App — đăng nhập tài khoản **staff** | Đang ở `/staff` |
| Tab 2 | App — đăng nhập tài khoản **tourist chưa có vé** | Đang ở `/explore/list` |
| Tab 3 | App — đăng nhập tài khoản **tourist đã có vé** | Đang ở `/explore/trang-an` |
| Tab 4 | App — đăng nhập tài khoản **admin** | Đang ở `/admin` |

### Tài khoản demo
```
Staff   : staff@ninhbinh.vn   / staff123456
Tourist : tourist@test.com    / tourist123456
Admin   : admin@ninhbinh.vn   / admin123456
```

> **Lưu ý:** Chuẩn bị sẵn 1 tài khoản tourist thứ hai chưa có vé để demo live luồng kích hoạt.

### Data cần chuẩn bị sẵn
- Ít nhất 2 địa điểm có **audio MP3 thật**: Tràng An (VI + EN), Bích Động (VI)
- Ít nhất 1 địa điểm có ảnh gallery đẹp và đầy đủ spots
- Ít nhất 2 gói tham quan active (all_locations + 1 gói custom)
- 1 vé chưa dùng sẵn để demo kích hoạt live

### Màn hình hiển thị
- Zoom trình duyệt: **90%**
- Ẩn thanh bookmark trình duyệt
- Tắt thông báo hệ thống và điện thoại
- Chuẩn bị hotspot điện thoại dự phòng

---

## Act 1 — Luồng vé: Staff tạo → Tourist kích hoạt (1 phút 30 giây)

### Bước 1.1 — Staff tạo vé (40 giây)

**Thao tác:** Chuyển sang **Tab 1** (staff). Bấm **"Tạo vé mới"**.

**Lời thuyết minh:**
> "Bắt đầu từ góc nhìn của nhân viên quầy vé. Khi du khách đến mua vé tham quan, nhân viên chọn gói phù hợp — ở đây tôi chọn gói 'Toàn bộ địa điểm' — điền tên khách và số điện thoại."

**Thao tác:** Điền nhanh:
- Gói: chọn **"Toàn bộ địa điểm"**
- Tên khách: `Nguyen Van A`
- SĐT: `0901234567`

Bấm **"Tạo vé"**.

**Lời thuyết minh:**
> "Hệ thống sinh ngay một mã NBG duy nhất — nhân viên đọc mã này cho khách hoặc chụp màn hình gửi qua Zalo."

**Điểm nhấn:** Toàn bộ quá trình dưới 10 giây, không cần máy in vé.

---

### Bước 1.2 — Tourist kích hoạt vé (50 giây)

**Thao tác:** Chuyển sang **Tab 2** (tourist chưa có vé). Vào trang chi tiết một địa điểm — **thấy banner audio gate** ở dưới màn hình.

**Lời thuyết minh:**
> "Du khách vào xem địa điểm — bản đồ, ảnh, thông tin tham quan đều thấy được. Nhưng khi muốn nghe thuyết minh — hệ thống yêu cầu kích hoạt vé. Bấm vào banner này."

**Thao tác:** Bấm **"Kích hoạt vé"** trên banner. Trang kích hoạt mở ra. Nhập mã vé vừa tạo ở Tab 1.

**Lời thuyết minh:**
> "Nhập mã NBG vừa nhận từ quầy. Hệ thống kiểm tra: mã có tồn tại không, còn hạn kích hoạt không, chưa ai dùng chưa."

**Thao tác:** Bấm **"Kích hoạt"**. Thông báo thành công. Quay lại trang địa điểm.

**Điểm nhấn:** Banner biến mất, AudioBar xuất hiện — nội dung âm thanh được mở khóa ngay lập tức.

---

## Act 2 — Khám phá địa điểm và nghe thuyết minh (2 phút)

### Bước 2.1 — Bản đồ tương tác (20 giây)

**Thao tác:** Chuyển sang **Tab 3** (tourist đã có vé). Vào trang bản đồ `/explore`.

**Lời thuyết minh:**
> "Sau khi kích hoạt, toàn bộ địa điểm trong gói hiện trên bản đồ. Bấm vào marker để xem thông tin nhanh — tên, ảnh đại diện, khoảng cách từ vị trí hiện tại."

**Thao tác:** Bấm nút **GPS locate** — dấu chấm xanh hiện vị trí. Thấy khoảng cách hiện trên các card.

**Điểm nhấn:** GPS không zoom về vị trí — map vẫn tập trung vào Ninh Bình.

---

### Bước 2.2 — Chi tiết địa điểm (30 giây)

**Thao tác:** Bấm vào marker **Tràng An** hoặc chọn từ danh sách. Trang chi tiết mở ra.

**Lời thuyết minh:**
> "Trang chi tiết có đầy đủ: carousel ảnh, giờ mở cửa, giá vé theo từng loại — người lớn, trẻ em — thời gian tham quan ước tính, địa chỉ. Bấm 'Chỉ đường' mở thẳng Google Maps."

*Chỉ vào chip giá vé:*
> "Giá vé hiển thị rõ từng loại — du khách biết chi phí trước khi đến, không bị bất ngờ tại cổng."

---

### Bước 2.3 — Nghe thuyết minh (40 giây)

**Thao tác:** AudioBar đang hiển thị ở dưới. Bấm **Play** trên track "Tổng quan".

**Lời thuyết minh:**
> "Đây là khoảnh khắc cốt lõi của ứng dụng — audio thuyết minh phát ngay, không cần tải thêm gì."

*Để audio chạy 5–10 giây, sau đó bấm nút chuyển ngôn ngữ:*

**Thao tác:** Bấm **"EN"** ở góc trên.

**Lời thuyết minh:**
> "Chuyển sang tiếng Anh — toàn bộ nội dung, tên địa điểm, mô tả và audio đều chuyển tức thì. Khách quốc tế không cần làm gì thêm."

**Thao tác:** Cuộn xuống — thấy danh sách **Spots**. Bấm vào spot đầu tiên trong AudioBar.

**Lời thuyết minh:**
> "Mỗi khu vực con trong địa điểm có bài thuyết minh riêng — du khách có thể chọn nghe theo từng điểm cụ thể mà họ đang đứng."

**Điểm nhấn:** Fallback tự động — nếu chưa có audio tiếng Anh, hệ thống phát tiếng Việt thay thế và thông báo nhỏ.

---

## Act 3 — Tour gợi ý trên bản đồ (1 phút)

### Bước 3.1 — Xem danh sách tour (20 giây)

**Thao tác:** Bấm tab **"Lịch trình"** ở thanh điều hướng.

**Lời thuyết minh:**
> "Ngoài việc khám phá từng địa điểm, app có 15 lịch trình tour gợi ý theo chủ đề — tâm linh, thiên nhiên, chụp ảnh, gia đình. Mỗi tour có badge và thời gian ước tính."

---

### Bước 3.2 — Xem tour trên bản đồ (40 giây)

**Thao tác:** Bấm vào một tour — ví dụ **"Tour 1 ngày khám phá Tràng An"**. Bấm **"Xem trên bản đồ"**.

**Lời thuyết minh:**
> "Bản đồ chuyển sang chế độ tour — các điểm dừng được đánh số theo thứ tự lịch trình. Du khách biết chính xác đi đâu trước, đâu sau."

*Chỉ vào từng marker đánh số:*
> "Mỗi điểm có ghi chú về thời gian gợi ý ở đó bao lâu, nên đến lúc mấy giờ. Đây là lịch trình thực tế — không phải danh sách địa điểm ngẫu nhiên."

**Điểm nhấn:** Marker đánh số thứ tự, khác hẳn chế độ khám phá thông thường.

---

## Act 4 — Admin Panel (1 phút)

### Bước 4.1 — Dashboard tổng quan (20 giây)

**Thao tác:** Chuyển sang **Tab 4** (admin). Dashboard đang hiển thị.

**Lời thuyết minh:**
> "Chuyển sang góc nhìn quản trị viên. Dashboard hiển thị tổng số địa điểm, gói vé, vé đã tạo, người dùng và biểu đồ vé theo thời gian."

---

### Bước 4.2 — Quản lý nội dung địa điểm (40 giây)

**Thao tác:** Bấm **"Địa điểm"** trên sidebar. Danh sách card hiện ra. Bấm **"Sửa"** trên Tràng An.

**Lời thuyết minh:**
> "Toàn bộ nội dung được quản lý qua đây — không cần đụng code. Tab nội dung có đầy đủ tiếng Việt và tiếng Anh song song."

**Thao tác:** Bấm tab **"Media"** — thấy section upload audio.

**Lời thuyết minh:**
> "Upload audio mới chỉ cần kéo thả file MP3. Sau khi upload, Cloudinary CDN phân phối file toàn cầu — audio phát mượt dù du khách đang ở đâu."

**Thao tác:** Bấm tab **"Giá vé"** — thấy danh sách loại vé có thể thêm/xóa.

**Lời thuyết minh:**
> "Giá vé theo từng loại — thêm loại mới không cần developer. Giám khảo muốn thêm 'Người cao tuổi miễn phí' — admin thêm ngay tại đây."

**Điểm nhấn:** Mọi thay đổi nội dung đều không cần can thiệp kỹ thuật.

---

## Câu chuyển tiếp

### Từ slide sang demo
> *"Thay vì tiếp tục mô tả — để tôi cho các thầy/cô thấy trực tiếp. Ứng dụng đang chạy live trên internet ngay lúc này."*
> *(Mở Tab 1, bắt đầu Act 1)*

### Từ demo về slide
> *"Đó là toàn bộ hành trình: từ nhân viên tạo vé đến du khách nghe thuyết minh. Về triển khai và hướng phát triển — quay lại slide."*

---

## 3 Tình huống sự cố và cách xử lý

### Sự cố 1 — Audio không phát được

**Triệu chứng:** Bấm Play nhưng không có âm thanh, hoặc AudioBar không hiện.

**Xử lý:**
1. Kiểm tra volume thiết bị và trình duyệt
2. Nếu Safari iOS: cần tương tác trước (touch) — nói: *"Safari yêu cầu người dùng tương tác trước khi phát audio — đây là chính sách của Apple, không phải lỗi app. Bấm Play một lần là phát được."*
3. Nếu URL Cloudinary lỗi: chuyển sang màn hình admin upload — show luồng upload, giải thích audio đang được sản xuất: *"Audio đang trong giai đoạn ghi âm chuyên nghiệp — tôi show luồng kỹ thuật thay thế."*

> **Chuẩn bị:** Có sẵn 1 file audio test ngắn (10 giây) upload trước để đảm bảo URL còn sống.

---

### Sự cố 2 — Mạng internet yếu/mất

**Triệu chứng:** Trang load chậm, bản đồ không hiển thị marker, API timeout.

**Xử lý:**
1. Bật hotspot điện thoại ngay — đặt tên WiFi dễ nhớ, kết nối trước
2. Trong lúc chờ: *"Để không mất thời gian, tôi chuyển sang video demo đã quay sẵn."*
3. Phát video demo quay sẵn (5–6 phút, lưu local trong tab riêng)

> **Chuẩn bị:** Quay đầy đủ video demo trước ngày thuyết trình, lưu offline.

---

### Sự cố 3 — Kích hoạt vé báo lỗi

**Triệu chứng:** Nhập mã NBG nhưng hệ thống báo "Mã không hợp lệ" hoặc "Vé đã được dùng".

**Xử lý:**
1. Mã có thể đã dùng trong lần test trước — vào **Tab 4 (admin) → Vé** tạo vé mới ngay trên sân khấu
2. Nói tự nhiên: *"Tôi sẽ tạo một mã mới — đây cũng là cơ hội show luồng staff tạo vé."*
3. Thao tác nhanh: admin → tickets → tạo vé → copy mã → paste vào trang kích hoạt

> **Chuẩn bị:** Chuẩn bị 3–4 mã vé chưa dùng, note vào giấy mang theo.

---

## Tóm tắt thời gian

| Act | Nội dung | Thời gian |
|-----|----------|:---------:|
| 1 | Staff tạo vé → Tourist kích hoạt → Audio mở khóa | 1p 30s |
| 2 | Bản đồ GPS → Chi tiết địa điểm → Nghe audio → Đổi ngôn ngữ → Spots | 2p 00s |
| 3 | Tour gợi ý → Xem trên bản đồ đánh số | 1p 00s |
| 4 | Admin: dashboard → địa điểm → upload audio → giá vé | 1p 00s |
| **Tổng** | | **~5p 30s** |

---

## Checklist ngày demo

**Trước 30 phút:**
- [ ] Mở sẵn 4 tab theo bảng đầu tài liệu, đăng nhập sẵn
- [ ] Chuẩn bị 3–4 mã vé chưa dùng, ghi ra giấy
- [ ] Test audio phát được trên trình duyệt demo
- [ ] Kiểm tra Railway không sleep (gọi 1 API bất kỳ)
- [ ] Quay video demo dự phòng lưu local
- [ ] Kết nối hotspot dự phòng trên điện thoại
- [ ] Zoom 90%, ẩn bookmark bar, tắt thông báo

**5 phút trước:**
- [ ] Bản đồ load markers đủ không
- [ ] AudioBar hiện sau khi đăng nhập tourist có vé không
- [ ] Đặt đồng hồ đếm ngược 7 phút
