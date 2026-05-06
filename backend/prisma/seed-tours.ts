/**
 * Seed script: 15 tour itineraries for Ninh Binh Audio Guide
 * Run: npx tsx prisma/seed-tours.ts
 * Idempotent: skips tours that already exist (by nameVi)
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Tour data ─────────────────────────────────────────────────────────────
const TOURS = [
  // ══════════════════════════════════════════════════════════════════════════
  // 1. NINH BÌNH TRONG 1 NGÀY
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Ninh Bình trong 1 ngày',
    nameEn: 'Ninh Binh in One Day',
    duration: '1 ngày',
    badgeVi: 'Phổ biến nhất',
    badgeEn: 'Most Popular',
    noteVi: 'Nên thuê xe máy hoặc xe đạp điện để di chuyển linh hoạt giữa các điểm. Bắt đầu sớm để tránh đông người.',
    noteEn: 'Rent a motorbike or e-bike for flexible transport between sites. Start early to avoid crowds.',
    displayOrder: 1,
    stops: [
      { slug: 'co-do-hoa-lu', time: '7:30', duration: '1.5h', noteVi: 'Tham quan đền vua Đinh, vua Lê và leo núi Mã Yên ngắm toàn cảnh.', noteEn: 'Visit Dinh and Le king temples, then climb Ma Yen Mountain for panoramic views.' },
      { slug: 'tam-coc-bich-dong', time: '9:30', duration: '2.5h', noteVi: 'Đi thuyền nan qua 3 hang động và leo lên chùa Bích Động 3 tầng.', noteEn: 'Take rowboat through 3 caves then climb the 3-tiered Bich Dong Pagoda.' },
      { slug: 'hang-mua', time: '13:30', duration: '1.5h', noteVi: 'Leo 500 bậc đá lên đỉnh ngắm toàn cảnh đồng lúa và Tràng An.', noteEn: 'Climb 500 stone steps for a panoramic view of rice fields and Trang An.' },
      { slug: 'trang-an', time: '15:30', duration: '2.5h', noteVi: 'Hành trình thuyền buổi chiều tà qua các hang động — ánh sáng đẹp nhất trong ngày.', noteEn: 'Afternoon boat journey through caves — the most beautiful light of the day.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2. NINH BÌNH 2 NGÀY ĐẦY ĐỦ
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Ninh Bình 2 ngày đầy đủ',
    nameEn: 'Ninh Binh 2-Day Complete',
    duration: '2 ngày 1 đêm',
    badgeVi: 'Đầy đủ nhất',
    badgeEn: 'Most Complete',
    noteVi: 'Lưu trú tại thị xã Ninh Bình hoặc gần Tam Cốc để thuận tiện di chuyển. Chuẩn bị giày đi bộ tốt.',
    noteEn: 'Stay in Ninh Binh town or near Tam Coc for easy transport. Bring good walking shoes.',
    displayOrder: 2,
    stops: [
      { slug: 'trang-an', time: '7:30', duration: '3h', noteVi: 'Tuyến thuyền dài nhất qua 9 hang và các đền thờ trong rừng già.', noteEn: 'Longest boat route through 9 caves and temples in ancient forest.' },
      { slug: 'chua-bai-dinh', time: '11:30', duration: '2.5h', noteVi: 'Quần thể chùa lớn nhất ĐNA — hành lang 500 La Hán, tháp chuông 36 tấn.', noteEn: 'Largest pagoda complex in SEA — 500 Arhat corridor, 36-ton bell tower.' },
      { slug: 'co-do-hoa-lu', time: '14:30', duration: '1.5h', noteVi: 'Kinh đô đầu tiên của Việt Nam — 2 ngôi đền và leo núi Mã Yên.', noteEn: "Vietnam's first capital — 2 ancient temples and climb Ma Yen Mountain." },
      { slug: 'dam-van-long', time: '7:00', duration: '2h', noteVi: 'Đi thuyền sáng sớm — thời điểm tốt nhất để gặp voọc mông trắng.', noteEn: 'Early morning boat — best time to spot white-bottomed langurs.' },
      { slug: 'tam-coc-bich-dong', time: '10:00', duration: '2.5h', noteVi: 'Thuyền nan qua đồng lúa và hang Cả, leo chùa Bích Động 3 tầng.', noteEn: 'Rowboat through rice paddies and caves, climb 3-level Bich Dong Pagoda.' },
      { slug: 'hang-mua', time: '13:30', duration: '1.5h', noteVi: 'Leo 500 bậc — panorama toàn cảnh Ninh Bình từ đỉnh núi.', noteEn: 'Climb 500 steps — full Ninh Binh panorama from the summit.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3. HÀNH TRÌNH TÂM LINH NINH BÌNH
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Hành trình tâm linh Ninh Bình',
    nameEn: 'Ninh Binh Spiritual Journey',
    duration: '1–2 ngày',
    badgeVi: 'Tâm linh',
    badgeEn: 'Spiritual',
    noteVi: 'Mang trang phục lịch sự khi vào chùa. Giữ yên lặng và tôn trọng không gian thờ tự. Sáng sớm ít người nhất.',
    noteEn: 'Dress modestly when entering pagodas. Keep quiet and respect the sacred spaces. Earlymorning is least crowded.',
    displayOrder: 3,
    stops: [
      { slug: 'chua-bai-dinh', time: '6:30', duration: '3h', noteVi: 'Sáng sớm ít người — không khí thiền tịnh nhất trong ngày.', noteEn: 'Earlymorning with fewest visitors — most peaceful meditation atmosphere.' },
      { slug: 'co-do-hoa-lu', time: '10:00', duration: '1.5h', noteVi: 'Dâng hương tại đền vua Đinh và vua Lê — cội nguồn lịch sử dân tộc.', noteEn: 'Offer incense at Dinh and Le king temples — roots of Vietnamese history.' },
      { slug: 'chua-dia-tang-phi-lai', time: '12:30', duration: '1.5h', noteVi: 'Ngôi chùa thiền tịnh yên lặng nhất vùng — không gian tu tâm lý tưởng.', noteEn: 'Quietest meditation pagoda in the region — ideal spiritual retreat space.' },
      { slug: 'nha-tho-phat-diem', time: '14:30', duration: '1h', noteVi: 'Kiến trúc Công giáo – Á Đông độc nhất vô nhị xây bằng đá từ năm 1875.', noteEn: 'Unique Catholic-Asian architecture built entirely of stone since 1875.' },
      { slug: 'chua-ba-danh', time: '16:00', duration: '1h', noteVi: 'Ngôi chùa "vắng nhất Việt Nam" trong rừng lim ngàn năm — tĩnh lặng hoàn toàn.', noteEn: 'The "quietest pagoda in Vietnam" in a thousand-year ironwood forest — total silence.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4. THIÊN NHIÊN HOANG SƠ
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Thiên nhiên hoang sơ Ninh Bình',
    nameEn: 'Ninh Binh Wild Nature',
    duration: '2 ngày',
    badgeVi: 'Thiên nhiên',
    badgeEn: 'Nature',
    noteVi: 'Mang giày trekking, kem chống nắng và bình nước. Khởi hành sáng sớm để tránh nóng và gặp động vật hoang dã.',
    noteEn: 'Bring trekking shoes, sunscreen and water bottle. Start early to avoid heat and spot wildlife.',
    displayOrder: 4,
    stops: [
      { slug: 'dam-van-long', time: '6:30', duration: '2h', noteVi: 'Quan sát voọc mông trắng và chim nước khi bình minh lên — khoảnh khắc hiếm có.', noteEn: 'Watch white-bottomed langurs and water birds at sunrise — a rare moment.' },
      { slug: 'vuon-chim-thung-nham', time: '9:30', duration: '2h', noteVi: 'Hành trình thuyền qua vườn chim hàng nghìn cá thể và hang động bí ẩn.', noteEn: 'Boat journey through thousands of birds and mysterious caves.' },
      { slug: 'trang-an', time: '14:00', duration: '3h', noteVi: 'Di sản UNESCO — thuyền xuyên hang trong rừng nguyên sinh chiều tà.', noteEn: 'UNESCO Heritage — boat through caves in primeval forest at dusk.' },
      { slug: 'vuon-quoc-gia-cuc-phuong', time: '7:00', duration: '4h', noteVi: 'Trung tâm cứu hộ linh trưởng, hang Con Moong tiền sử và tuyến trekking rừng.', noteEn: 'Primate rescue center, prehistoric Con Moong cave and jungle trekking trails.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5. TOUR UNESCO DI SẢN THẾ GIỚI
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Hành trình Di sản UNESCO',
    nameEn: 'UNESCO World Heritage Trail',
    duration: '1 ngày',
    badgeVi: 'Di sản',
    badgeEn: 'Heritage',
    noteVi: 'Tập trung 3 địa điểm thuộc quần thể Di sản Thế giới kép Tràng An — UNESCO công nhận 2014.',
    noteEn: 'Focus on 3 sites within the Trang An Landscape Complex — UNESCO Mixed World Heritage 2014.',
    displayOrder: 5,
    stops: [
      { slug: 'co-do-hoa-lu', time: '7:30', duration: '2h', noteVi: 'Khởi đầu từ kinh đô cổ — nơi khai sinh nhà nước Đại Cồ Việt năm 968.', noteEn: 'Start at the ancient capital — birthplace of the Dai Co Viet state in 968 AD.' },
      { slug: 'trang-an', time: '10:00', duration: '3.5h', noteVi: 'Trọng tâm: hành trình thuyền đầy đủ qua hệ thống hang động và đền thờ cổ kính.', noteEn: 'Main event: full boat journey through the cave system and ancient temples.' },
      { slug: 'chua-bai-dinh', time: '14:30', duration: '2.5h', noteVi: 'Kết thúc tại quần thể Phật giáo nằm trong vùng lõi của Di sản.', noteEn: 'End at the Buddhist complex located within the Heritage core zone.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 6. TOUR THUYỀN & HANG ĐỘNG
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Hành trình Thuyền & Hang động',
    nameEn: 'Boat & Cave Adventure',
    duration: '1 ngày',
    badgeVi: 'Khám phá',
    badgeEn: 'Adventure',
    noteVi: 'Mang áo mưa mỏng (trong hang có thể ẩm). Không nên mang đồ quý giá lên thuyền.',
    noteEn: 'Bring a light raincoat (caves can be damp). Avoid bringing valuables on the boat.',
    displayOrder: 6,
    stops: [
      { slug: 'trang-an', time: '7:30', duration: '3h', noteVi: 'Hang Cả dài 120m với nhũ đá lung linh. Hang Tối — trải nghiệm bóng tối hoàn toàn.', noteEn: 'Hang Ca cave 120m long with shimmering stalactites. Hang Toi — experience complete darkness.' },
      { slug: 'tam-coc-bich-dong', time: '11:30', duration: '3h', noteVi: 'Ba hang Tam Cốc nhìn từ thuyền — đẹp nhất lúc lúa vàng tháng 5–6.', noteEn: 'Three Tam Coc caves viewed from the boat — most beautiful during golden rice season May–June.' },
      { slug: 'dam-van-long', time: '15:30', duration: '1.5h', noteVi: 'Kết thúc ngày với hang Cá linh thiêng và không gian đầm lầy yên bình.', noteEn: "End the day with the sacred Fish Cave and the peaceful wetland atmosphere." },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 7. TOUR NHIẾP ẢNH
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Tour Nhiếp ảnh Ninh Bình',
    nameEn: 'Ninh Binh Photography Tour',
    duration: '1 ngày',
    badgeVi: 'Nhiếp ảnh',
    badgeEn: 'Photography',
    noteVi: 'Sáng sớm và chiều tà là thời điểm ánh sáng đẹp nhất. Mang chân máy ảnh nếu có. Mùa lúa chín (tháng 9–11) đẹp nhất.',
    noteEn: 'Early morning and late afternoon have the best light. Bring a tripod if possible. Rice harvest season (Sep–Nov) is most photogenic.',
    displayOrder: 7,
    stops: [
      { slug: 'dam-van-long', time: '6:00', duration: '2h', noteVi: 'Bình minh trên đầm: sương mờ, núi soi bóng nước — khung cảnh huyền ảo nhất Ninh Bình.', noteEn: 'Sunrise on the wetland: morning mist, mountains reflected — the most magical scene in Ninh Binh.' },
      { slug: 'hang-mua', time: '9:00', duration: '2h', noteVi: 'Từ đỉnh: bức tranh đồng lúa bậc thang và sông uốn lượn — shot cảnh quan tuyệt vời.', noteEn: 'From the summit: terraced rice fields and winding rivers — perfect landscape shots.' },
      { slug: 'tam-coc-bich-dong', time: '12:00', duration: '2h', noteVi: 'Thuyền trên sông Ngô Đồng: phản chiếu núi đá vôi trên mặt nước phẳng lặng.', noteEn: 'Boat on Ngo Dong River: limestone reflections on mirror-flat water.' },
      { slug: 'trang-an', time: '15:30', duration: '2h', noteVi: 'Hoàng hôn tại Tràng An: ánh vàng chiếu qua khe núi — khoảnh khắc vàng của ngày.', noteEn: 'Golden hour at Trang An: light filtering through mountain gaps — the golden moment of the day.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 8. NINH BÌNH CUỐI TUẦN
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Ninh Bình cuối tuần thư giãn',
    nameEn: 'Relaxed Ninh Binh Weekend',
    duration: '2 ngày 1 đêm',
    badgeVi: 'Cuối tuần',
    badgeEn: 'Weekend',
    noteVi: 'Lịch trình nhẹ nhàng, không vội vàng. Phù hợp cho gia đình hoặc nhóm bạn muốn thư giãn hoàn toàn.',
    noteEn: 'Light itinerary, no rushing. Ideal for families or friend groups wanting complete relaxation.',
    displayOrder: 8,
    stops: [
      { slug: 'trang-an', time: '8:00', duration: '3h', noteVi: 'Buổi sáng thư thả trên thuyền — không cần vội, ngắm cảnh thỏa thích.', noteEn: 'Relaxed morning boat ride — no rush, enjoy the scenery at leisure.' },
      { slug: 'co-do-hoa-lu', time: '12:30', duration: '1.5h', noteVi: 'Ghé thăm cố đô sau bữa trưa đặc sản cơm cháy Ninh Bình.', noteEn: 'Visit the ancient capital after lunch with Ninh Binh specialty crispy rice.' },
      { slug: 'dam-van-long', time: '7:00', duration: '2h', noteVi: 'Sáng thứ 2: thuyền đầm hoang sơ — không gian tĩnh lặng hoàn hảo.', noteEn: 'Day 2 morning: wild wetland boat — perfect quiet space.' },
      { slug: 'chua-bai-dinh', time: '10:00', duration: '2h', noteVi: 'Kết thúc cuối tuần tại quần thể chùa lớn nhất ĐNA — uy nghi và bình yên.', noteEn: 'End the weekend at the largest pagoda complex in SEA — majestic and peaceful.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 9. CỐ ĐÔ & NHÀ THỜ — HÀNH TRÌNH LỊCH SỬ
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Cố đô & Nhà thờ — Lịch sử & Tín ngưỡng',
    nameEn: 'Ancient Capital & Cathedrals — History & Faith',
    duration: '1 ngày',
    badgeVi: 'Lịch sử',
    badgeEn: 'History',
    noteVi: 'Kết hợp 2 luồng văn hóa: Phật giáo – Nho giáo (Hoa Lư) và Công giáo (Phát Diệm, Bùi Chu). Ít người biết đến — trải nghiệm độc đáo.',
    noteEn: 'Combines 2 cultural streams: Buddhism–Confucianism (Hoa Lu) and Catholicism (Phat Diem, Bui Chu). Little-known — unique experience.',
    displayOrder: 9,
    stops: [
      { slug: 'co-do-hoa-lu', time: '7:30', duration: '2h', noteVi: 'Khởi đầu với kinh đô phong kiến đầu tiên của Việt Nam — lịch sử ngàn năm dựng nước.', noteEn: "Start at Vietnam's first feudal capital — a thousand-year history of nation-building." },
      { slug: 'nha-tho-phat-diem', time: '10:30', duration: '1.5h', noteVi: 'Kiến trúc đá độc đáo kết hợp Công giáo và đình chùa Việt Nam — xây suốt 24 năm.', noteEn: 'Unique stone architecture blending Catholic and Vietnamese pagoda styles — built over 24 years.' },
      { slug: 'nha-tho-bui-chu', time: '13:00', duration: '1.5h', noteVi: 'Nhà thờ chính tòa Baroque 130 tuổi — một trong những nhà thờ đẹp nhất miền Bắc.', noteEn: '130-year-old Baroque cathedral — one of the most beautiful churches in northern Vietnam.' },
      { slug: 'chua-ba-danh', time: '15:30', duration: '1h', noteVi: 'Kết thúc tại ngôi chùa 2.000 năm tuổi trong rừng lim — "vắng như chùa Bà Đanh".', noteEn: 'End at the 2,000-year-old pagoda in ironwood forest — "as quiet as Ba Danh Pagoda".' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 10. TOUR GIA ĐÌNH VỚI TRẺ EM
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Ninh Bình cùng gia đình',
    nameEn: 'Ninh Binh Family Trip',
    duration: '1 ngày',
    badgeVi: 'Gia đình',
    badgeEn: 'Family',
    noteVi: 'Lịch trình phù hợp trẻ em 5–12 tuổi. Mang mũ, kem chống nắng. Mỗi điểm có khu vực nghỉ ngơi và ăn uống.',
    noteEn: 'Suitable for children aged 5–12. Bring hats and sunscreen. Each site has rest areas and food stalls.',
    displayOrder: 10,
    stops: [
      { slug: 'trang-an', time: '7:30', duration: '2.5h', noteVi: 'Trẻ em thích thú với thuyền xuyên hang tối và hang sáng. An toàn tuyệt đối với áo phao.', noteEn: 'Children love the boat through dark and lit caves. Perfectly safe with life jackets.' },
      { slug: 'hang-mua', time: '11:00', duration: '1.5h', noteVi: 'Leo núi nhẹ nhàng cùng con — tầm nhìn từ đỉnh rộng mở thật ấn tượng.', noteEn: 'Gentle mountain climb with kids — the open summit view is truly impressive.' },
      { slug: 'vuon-chim-thung-nham', time: '14:30', duration: '2h', noteVi: 'Trẻ em say mê ngắm hàng ngàn con chim và hành trình thuyền qua hang bí ẩn.', noteEn: 'Children are fascinated by thousands of birds and the mysterious cave boat journey.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 11. TOUR LEO NÚI & MẠO HIỂM
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Leo núi & Mạo hiểm Ninh Bình',
    nameEn: 'Ninh Binh Hiking & Adventure',
    duration: '1 ngày',
    badgeVi: 'Mạo hiểm',
    badgeEn: 'Adventure',
    noteVi: 'Mang giày leo núi có đế chống trơn. Mang đủ nước uống (ít nhất 1.5 lít/người). Không phù hợp người sợ độ cao.',
    noteEn: 'Wear non-slip hiking shoes. Bring enough water (at least 1.5L/person). Not suitable for those afraid of heights.',
    displayOrder: 11,
    stops: [
      { slug: 'hang-mua', time: '6:30', duration: '2h', noteVi: 'Leo 500 bậc trước khi nắng to — ánh sáng bình minh từ đỉnh cực đẹp.', noteEn: 'Climb 500 steps before the sun gets hot — sunrise light from the summit is spectacular.' },
      { slug: 'trang-an', time: '9:30', duration: '3h', noteVi: 'Tuyến 3 dài nhất: leo thuyền qua 9 hang, khám phá rừng nguyên sinh.', noteEn: 'Longest route 3: boat through 9 caves, explore primeval forest.' },
      { slug: 'vuon-quoc-gia-cuc-phuong', time: '14:00', duration: '3h', noteVi: 'Trekking rừng nguyên sinh — leo bộ từ 2–8km tùy tuyến chọn.', noteEn: 'Primeval forest trekking — 2–8km walking trail depending on route chosen.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 12. TOUR HÀ NAM LÂN CẬN
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Khám phá Hà Nam lân cận',
    nameEn: 'Discover Nearby Ha Nam',
    duration: '1 ngày',
    badgeVi: 'Vùng lân cận',
    badgeEn: 'Nearby',
    noteVi: 'Cách Ninh Bình ~30km về phía Bắc. Phù hợp kết hợp 2 ngày — ngày 1 Ninh Bình, ngày 2 Hà Nam.',
    noteEn: 'About 30km north of Ninh Binh. Best combined as a 2-day trip — Day 1 Ninh Binh, Day 2 Ha Nam.',
    displayOrder: 12,
    stops: [
      { slug: 'chua-tam-chuc', time: '7:30', duration: '3h', noteVi: 'Quần thể "chùa lớn nhất thế giới" — thuyền trên hồ Tam Chúc nhìn lên núi và điện chùa.', noteEn: 'The "world\'s largest pagoda" complex — boat on Tam Chuc Lake looking up at mountains and halls.' },
      { slug: 'chua-ba-danh', time: '11:30', duration: '1.5h', noteVi: 'Ngôi chùa 2.000 năm trong rừng lim cổ thụ bên sông Đáy — không gian hoàn toàn tĩnh lặng.', noteEn: '2,000-year-old pagoda in ancient ironwood forest by the Day River — completely silent atmosphere.' },
      { slug: 'chua-dia-tang-phi-lai', time: '13:30', duration: '2h', noteVi: 'Chùa thiền tịnh mới phục dựng — kiến trúc truyền thống thuần Việt giữa núi đá vôi.', noteEn: 'Newly restored meditation pagoda — pure Vietnamese traditional architecture among limestone mountains.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 13. TOUR SÁNG SỚM CHO NGƯỜI YÊU THIÊN NHIÊN
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Bình minh trên đầm — Tour sáng sớm',
    nameEn: 'Wetland Sunrise — Early Bird Tour',
    duration: 'Nửa ngày',
    badgeVi: 'Sáng sớm',
    badgeEn: 'Early Bird',
    noteVi: 'Xuất phát 6:00–6:30. Hoàn thành trước 12:00. Phù hợp kết hợp với tour khác buổi chiều.',
    noteEn: 'Depart 6:00–6:30. Finish before noon. Can be combined with an afternoon tour.',
    displayOrder: 13,
    stops: [
      { slug: 'dam-van-long', time: '6:00', duration: '2h', noteVi: 'Thuyền đầm lúc bình minh: sương mờ trên mặt nước, voọc mông trắng hoạt động nhiều nhất.', noteEn: 'Wetland boat at sunrise: morning mist on the water, white-bottomed langurs most active.' },
      { slug: 'vuon-chim-thung-nham', time: '8:30', duration: '2h', noteVi: 'Chim về tổ buổi sáng — hàng nghìn con bay lượn thành đàn, tiếng hót vang khắp đầm.', noteEn: 'Birds returning to nests in the morning — thousands flying in flocks, birdsong fills the wetland.' },
      { slug: 'chua-cay-thi', time: '11:00', duration: '1h', noteVi: 'Kết thúc với ngôi chùa cổ ít người biết gần Vân Long — cây thị 500 tuổi linh thiêng.', noteEn: 'End at the little-known ancient pagoda near Van Long — the sacred 500-year-old persimmon tree.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 14. TOUR CHIM DI CƯ (MÙA ĐÔNG)
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Chim di cư mùa đông — Tour đặc biệt',
    nameEn: 'Winter Migratory Birds — Special Tour',
    duration: '1 ngày',
    badgeVi: 'Mùa đông',
    badgeEn: 'Winter Special',
    noteVi: 'Chỉ phù hợp tháng 11–4 (mùa chim di cư). Mang ống nhòm nếu có. Mặc áo ấm buổi sáng.',
    noteEn: 'Best in November–April (migratory bird season). Bring binoculars if possible. Dress warmly in the morning.',
    displayOrder: 14,
    stops: [
      { slug: 'vuon-quoc-gia-xuan-thuy', time: '7:00', duration: '4h', noteVi: 'Khu Ramsar đầu tiên ĐNA — hàng trăm loài chim Siberia dừng chân mùa đông, kể cả cò thìa cực hiếm.', noteEn: "SEA's first Ramsar site — hundreds of Siberian bird species overwinter, including the extremely rare spoonbill." },
      { slug: 'dam-van-long', time: '13:00', duration: '2h', noteVi: 'Voọc mông trắng và chim nước địa phương — so sánh đa dạng loài giữa 2 khu bảo tồn.', noteEn: 'White-bottomed langurs and local water birds — compare species diversity between 2 reserves.' },
      { slug: 'vuon-chim-thung-nham', time: '15:30', duration: '1.5h', noteVi: 'Hoàng hôn tại vườn chim — hàng ngàn con bay về tổ tạo thành đám mây sống động.', noteEn: 'Sunset at the bird garden — thousands returning to roost forming a living cloud.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 15. TRỌN VẸN NINH BÌNH & VÙNG LÂN CẬN
  // ══════════════════════════════════════════════════════════════════════════
  {
    nameVi: 'Trọn vẹn Ninh Bình & Vùng lân cận',
    nameEn: 'Complete Ninh Binh & Surroundings',
    duration: '3 ngày 2 đêm',
    badgeVi: 'Toàn diện',
    badgeEn: 'Complete',
    noteVi: 'Lịch trình tổng hợp cho 3 ngày đầy đủ nhất. Phù hợp du khách nước ngoài hoặc người lần đầu đến Ninh Bình muốn khám phá toàn bộ.',
    noteEn: 'Comprehensive 3-day itinerary. Best for international visitors or first-timers wanting to see everything.',
    displayOrder: 15,
    stops: [
      { slug: 'trang-an', time: '8:00', duration: '3h', noteVi: 'Ngày 1 sáng: Di sản UNESCO — tuyến thuyền dài qua hang động và đền thờ cổ kính.', noteEn: 'Day 1 morning: UNESCO Heritage — long boat route through caves and ancient temples.' },
      { slug: 'chua-bai-dinh', time: '12:00', duration: '2.5h', noteVi: 'Ngày 1 chiều: Quần thể Phật giáo lớn nhất ĐNA với hành lang 500 La Hán.', noteEn: 'Day 1 afternoon: Largest Buddhist complex in SEA with 500-Arhat corridor.' },
      { slug: 'co-do-hoa-lu', time: '15:30', duration: '1.5h', noteVi: 'Ngày 1 chiều muộn: Kinh đô đầu tiên của Việt Nam — leo núi Mã Yên ngắm hoàng hôn.', noteEn: "Day 1 late afternoon: Vietnam's first capital — climb Ma Yen for sunset views." },
      { slug: 'dam-van-long', time: '6:30', duration: '2h', noteVi: 'Ngày 2 sáng sớm: Bình minh trên đầm hoang sơ — gặp voọc mông trắng quý hiếm.', noteEn: 'Day 2 early morning: Sunrise on wild wetland — spot the rare white-bottomed langur.' },
      { slug: 'tam-coc-bich-dong', time: '9:30', duration: '2.5h', noteVi: 'Ngày 2 sáng: Thuyền nan qua đồng lúa và 3 hang Tam Cốc.', noteEn: 'Day 2 morning: Rowboat through rice paddies and 3 Tam Coc caves.' },
      { slug: 'hang-mua', time: '13:30', duration: '1.5h', noteVi: 'Ngày 2 chiều: Leo 500 bậc Hang Múa — tầm nhìn 360° đỉnh cao nhất.', noteEn: 'Day 2 afternoon: Climb 500 Hang Mua steps — 360° panorama from the highest point.' },
      { slug: 'nha-tho-phat-diem', time: '15:30', duration: '1.5h', noteVi: 'Ngày 2 chiều muộn: Kiến trúc đá Công giáo – Á Đông độc nhất Đông Nam Á.', noteEn: 'Day 2 late afternoon: Unique Catholic-Asian stone architecture in Southeast Asia.' },
      { slug: 'chua-tam-chuc', time: '8:00', duration: '3h', noteVi: 'Ngày 3 sáng: Quần thể chùa lớn nhất thế giới — thuyền hồ Tam Chúc hùng vĩ.', noteEn: "Day 3 morning: World's largest pagoda complex — magnificent Tam Chuc Lake boat ride." },
      { slug: 'vuon-quoc-gia-cuc-phuong', time: '12:00', duration: '3h', noteVi: 'Ngày 3 chiều: Vườn QG đầu tiên VN — trung tâm cứu hộ linh trưởng và rừng nguyên sinh.', noteEn: "Day 3 afternoon: Vietnam's first national park — primate rescue center and primeval forest." },
    ],
  },
]

// ─── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  console.log('🗺️  Bắt đầu seed 15 lịch trình tour...\n')
  let created = 0
  let skipped = 0

  for (const tour of TOURS) {
    // Check if already exists
    const existing = await prisma.tour.findFirst({ where: { nameVi: tour.nameVi } })
    if (existing) {
      console.log(`⏭  Bỏ qua (đã có): ${tour.nameVi}`)
      skipped++
      continue
    }

    // Resolve location IDs from slugs
    const stops: { locationId: string; order: number; suggestedTime: string | null; suggestedDuration: string | null; noteVi: string | null; noteEn: string | null }[] = []

    for (let i = 0; i < tour.stops.length; i++) {
      const stop = tour.stops[i]
      const location = await prisma.location.findUnique({ where: { slug: stop.slug } })
      if (!location) {
        console.warn(`  ⚠️  Không tìm thấy location slug: "${stop.slug}" — bỏ qua stop này`)
        continue
      }
      stops.push({
        locationId: location.id,
        order: i,
        suggestedTime: stop.time ?? null,
        suggestedDuration: stop.duration ?? null,
        noteVi: stop.noteVi ?? null,
        noteEn: stop.noteEn ?? null,
      })
    }

    // Create tour with stops
    await prisma.tour.create({
      data: {
        nameVi: tour.nameVi,
        nameEn: tour.nameEn,
        duration: tour.duration,
        badgeVi: tour.badgeVi ?? null,
        badgeEn: tour.badgeEn ?? null,
        noteVi: tour.noteVi ?? null,
        noteEn: tour.noteEn ?? null,
        displayOrder: tour.displayOrder,
        isActive: true,
        stops: { create: stops },
      },
    })

    console.log(`✅ Đã tạo: ${tour.nameVi} (${stops.length} điểm dừng)`)
    created++
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`✅ Tạo mới: ${created} tour`)
  console.log(`⏭  Bỏ qua:  ${skipped} tour (đã tồn tại)`)
  console.log(`═══════════════════════════════════════`)
  console.log(`\n→ Vào Admin → Lịch trình để xem và chỉnh sửa`)
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
