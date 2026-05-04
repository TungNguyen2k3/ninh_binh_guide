/**
 * Seed script: 15 locations for Ninh Binh Audio Guide
 * Run: npx tsx prisma/seed-locations.ts
 * - Skips locations that already exist (by slug)
 * - Does NOT touch existing audio/images
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Location data ────────────────────────────────────────────────────────────
const LOCATIONS = [
  // ════════════════════════════════════════════════════════════════════════════
  // 1. TRÀNG AN
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'trang-an',
    nameVi: 'Tràng An',
    nameEn: 'Trang An Scenic Landscape Complex',
    descriptionVi: 'Quần thể danh thắng rộng lớn với hệ thống hang động, đền thờ và rừng nguyên sinh — Di sản Thế giới kép UNESCO 2014.',
    descriptionEn: 'A vast landscape complex of limestone caves, ancient temples and primeval forest — UNESCO World Heritage Site 2014.',
    overviewVi: 'Tràng An là quần thể danh thắng nằm trong lòng núi đá vôi hùng vĩ của tỉnh Ninh Bình, trải rộng trên 12.252 ha. Nơi đây được UNESCO công nhận là Di sản Thế giới kép vào tháng 6 năm 2014 — vừa là di sản thiên nhiên, vừa là di sản văn hóa. Du khách ngồi thuyền thưởng ngoạn qua các hang động xuyên núi, đền thờ cổ kính ẩn mình trong rừng nguyên sinh, và những thung lũng ngập nước thơ mộng.',
    overviewEn: 'Trang An is a magnificent landscape complex nestled among ancient limestone mountains in Ninh Binh province, spanning 12,252 hectares. Recognized by UNESCO as a Mixed World Heritage Site in June 2014, visitors travel by rowboat through cave passages, ancient temples hidden in primeval forest, and serene flooded valleys.',
    historyVi: 'Vùng đất Tràng An đã có con người sinh sống từ cách đây hơn 30.000 năm, được chứng minh qua các di chỉ khảo cổ phát hiện trong các hang động. Đây từng là vùng đất thiêng liêng của các triều đại phong kiến Việt Nam — từ thời Đinh, Lê đến Lý, Trần.',
    historyEn: 'The Trang An landscape has been inhabited for over 30,000 years, as evidenced by archaeological sites discovered in its caves. This was sacred ground for Vietnamese feudal dynasties — from the Dinh and Le to the Ly and Tran periods.',
    highlightsVi: 'Hệ thống 50 hang động với cảnh quan nhũ đá kỳ ảo. Hành trình thuyền xuyên núi qua ít nhất 3–9 hang. Đền Trần, Đền Suối Tiên ẩn trong rừng già. Trường quay phim Kong: Skull Island (2017).',
    highlightsEn: 'A system of 50 caves with spectacular stalactite formations. Boat journeys through 3–9 caves per route. Tran Temple and Suoi Tien Temple hidden in ancient forest. Filming location for Kong: Skull Island (2017).',
    openTime: '7:00 - 17:30',
    admissionFee: 250000,
    estimatedDuration: 180,
    address: 'Trường Yên, Hoa Lư, Ninh Bình',
    bestTime: 'Sáng sớm, tháng 3–5 và 9–11',
    latitude: 20.2549,
    longitude: 105.9056,
    displayOrder: 1,
    spots: [
      { nameVi: 'Bến thuyền Tràng An', nameEn: 'Trang An Boat Dock', descriptionVi: 'Điểm xuất phát hành trình, nơi các thuyền nan đưa du khách theo các tuyến khác nhau vào sâu trong quần thể.', descriptionEn: 'The starting point of the journey, where rowboats take visitors along different routes deep into the complex.', order: 0, latitude: 20.2540, longitude: 105.9045 },
      { nameVi: 'Hang Cả', nameEn: 'Hang Ca Cave', descriptionVi: 'Hang lớn nhất trong quần thể, dài hơn 120m với trần hang cao 25m và hệ thống nhũ đá đặc sắc.', descriptionEn: 'The largest cave in the complex, stretching 120m with a 25m ceiling and spectacular stalactite formations.', order: 1, latitude: 20.2535, longitude: 105.9068 },
      { nameVi: 'Đền Trần', nameEn: 'Tran Temple', descriptionVi: 'Ngôi đền cổ thờ các vua nhà Trần, ẩn mình trong rừng già giữa lòng quần thể với kiến trúc truyền thống Việt Nam.', descriptionEn: 'Ancient temple dedicated to the Tran dynasty kings, nestled deep within the primeval forest.', order: 2, latitude: 20.2558, longitude: 105.9071 },
      { nameVi: 'Hang Tối', nameEn: 'Dark Cave', descriptionVi: 'Hang tối hoàn toàn dài khoảng 90m — trải nghiệm độc đáo khi ngồi thuyền trong bóng tối hoàn toàn.', descriptionEn: 'A completely dark cave stretching 90m — a unique experience traveling by boat in total darkness.', order: 3, latitude: 20.2529, longitude: 105.9081 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 2. TAM CỐC – BÍCH ĐỘNG
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'tam-coc-bich-dong',
    nameVi: 'Tam Cốc – Bích Động',
    nameEn: 'Tam Coc – Bich Dong',
    descriptionVi: '"Hạ Long trên cạn" — hành trình thuyền nan xuyên qua ba hang núi giữa cánh đồng lúa bát ngát, cùng động Bích Động cổ kính nghìn tuổi.',
    descriptionEn: '"Halong Bay on land" — a rowboat journey through three mountain caves amid vast rice paddies, alongside the ancient Bich Dong Pagoda.',
    overviewVi: 'Tam Cốc – Bích Động là danh thắng nổi tiếng bậc nhất Ninh Bình, thường được mệnh danh là "Hạ Long trên cạn". Hành trình thuyền nan xuôi theo dòng sông Ngô Đồng dài khoảng 4km qua ba hang động xuyên lòng núi đá vôi, hai bên là những cánh đồng lúa xanh mướt hoặc vàng óng tùy mùa.',
    overviewEn: 'Tam Coc – Bich Dong is one of Ninh Binh\'s most famous landscapes, often called "Halong Bay on land." The rowboat journey follows the Ngo Dong River for about 4km, passing through three cave passages flanked by lush green or golden rice fields depending on the season.',
    historyVi: 'Tam Cốc được biết đến từ thời nhà Trần, khi vua Trần Nhân Tông ban tặng danh hiệu "Nam thiên đệ nhị động" cho Bích Động. Chùa Bích Động được xây dựng từ năm 1428 dưới thời Lê Sơ.',
    historyEn: 'Tam Coc has been known since the Tran dynasty, when King Tran Nhan Tong bestowed upon Bich Dong the title "the second most beautiful cave under heaven." Bich Dong Pagoda was built in 1428 during the Early Le dynasty.',
    highlightsVi: 'Hành trình thuyền dọc sông Ngô Đồng giữa cánh đồng lúa đẹp nhất vào mùa lúa vàng. Ba hang động tổng chiều dài hơn 1km. Chùa Bích Động ba tầng nhìn toàn cảnh thung lũng.',
    highlightsEn: 'The rowboat journey amid rice paddies, most beautiful during the golden rice season. Three caves totaling over 1km. Three-level Bich Dong Pagoda with panoramic valley views.',
    openTime: '7:00 - 18:00',
    admissionFee: 120000,
    estimatedDuration: 150,
    address: 'Ninh Hải, Hoa Lư, Ninh Bình',
    bestTime: 'Tháng 5–6 (lúa vàng) và tháng 10–11 (lúa chín)',
    latitude: 20.2274,
    longitude: 105.9478,
    displayOrder: 2,
    spots: [
      { nameVi: 'Bến thuyền Tam Cốc', nameEn: 'Tam Coc Boat Dock', descriptionVi: 'Điểm xuất phát, nơi các thuyền nan đưa du khách vào lòng sông Ngô Đồng thơ mộng.', descriptionEn: 'Departure point where rowboats take visitors along the romantic Ngo Dong River.', order: 0, latitude: 20.2272, longitude: 105.9481 },
      { nameVi: 'Hang Cả Tam Cốc', nameEn: 'First Cave', descriptionVi: 'Hang đầu tiên và dài nhất trong ba hang Tam Cốc, kéo dài hơn 127m với nhũ đá đẹp.', descriptionEn: 'The first and longest of the three caves, stretching 127m with beautiful stalactites.', order: 1, latitude: 20.2248, longitude: 105.9468 },
      { nameVi: 'Hang Hai & Hang Ba', nameEn: 'Second & Third Caves', descriptionVi: 'Hai hang tiếp theo trong hành trình, ngắn hơn nhưng cảnh sắc đồng lúa hai bên tuyệt đẹp.', descriptionEn: 'The next two caves with beautiful rice paddy scenery on both sides.', order: 2, latitude: 20.2221, longitude: 105.9455 },
      { nameVi: 'Chùa Bích Động', nameEn: 'Bich Dong Pagoda', descriptionVi: 'Quần thể chùa cổ hơn 1.000 năm gồm ba tầng: Chùa Hạ, Trung và Thượng, xây trong lòng núi đá.', descriptionEn: 'Ancient 1,000-year-old pagoda complex with three levels built into the limestone mountainside.', order: 3, latitude: 20.2312, longitude: 105.9429 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 3. CỐ ĐÔ HOA LƯ
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'co-do-hoa-lu',
    nameVi: 'Cố đô Hoa Lư',
    nameEn: 'Hoa Lu Ancient Capital',
    descriptionVi: 'Kinh đô đầu tiên của nhà nước phong kiến Việt Nam thống nhất, nơi thờ hai vị vua khai quốc Đinh Tiên Hoàng và Lê Đại Hành.',
    descriptionEn: 'The first capital of unified feudal Vietnam, honoring the founding kings Dinh Tien Hoang and Le Dai Hanh.',
    overviewVi: 'Cố đô Hoa Lư là kinh đô đầu tiên của nhà nước Đại Cồ Việt — nhà nước phong kiến độc lập thống nhất đầu tiên trong lịch sử Việt Nam. Khu di tích gồm đền thờ vua Đinh Tiên Hoàng và đền thờ vua Lê Đại Hành, được bao bọc bởi núi non hùng vĩ tạo thành tòa thành tự nhiên.',
    overviewEn: 'Hoa Lu Ancient Capital was the first capital of the Dai Co Viet state — the first unified and independent feudal state in Vietnamese history. The heritage site includes temples dedicated to King Dinh Tien Hoang and King Le Dai Hanh, surrounded by magnificent limestone mountains forming a natural fortress.',
    historyVi: 'Năm 968, Đinh Bộ Lĩnh dẹp tan 12 sứ quân, lên ngôi Hoàng đế Đinh Tiên Hoàng, đặt tên nước là Đại Cồ Việt và chọn Hoa Lư làm kinh đô. Năm 1010, kinh đô được dời về Thăng Long dưới triều Lý Công Uẩn.',
    historyEn: 'In 968 AD, Dinh Bo Linh defeated the 12 warlords, proclaimed himself Emperor Dinh Tien Hoang, named the country Dai Co Viet and chose Hoa Lu as the capital. In 1010, the capital was relocated to Thang Long under King Ly Cong Uan.',
    highlightsVi: 'Đền thờ vua Đinh với tượng đồng thế kỷ 17 và ngai vàng cổ. Đền vua Lê với kiến trúc chạm khắc tinh xảo. Núi Mã Yên — nơi an táng vua Đinh — với 167 bậc đá. Lễ hội Hoa Lư ngày 8-10/3 âm lịch.',
    highlightsEn: 'Dinh Temple with 17th-century bronze statues and ancient thrones. Le Temple with intricate carved architecture. Mount Ma Yen — King Dinh\'s burial site — with 167 stone steps. Hoa Lu Festival on lunar 8-10 March.',
    openTime: '7:00 - 17:30',
    admissionFee: 20000,
    estimatedDuration: 90,
    address: 'Trường Yên, Hoa Lư, Ninh Bình',
    bestTime: 'Tháng 3 (lễ hội) hoặc sáng mát mẻ',
    latitude: 20.3264,
    longitude: 105.8920,
    displayOrder: 3,
    spots: [
      { nameVi: 'Đền vua Đinh Tiên Hoàng', nameEn: 'King Dinh Tien Hoang Temple', descriptionVi: 'Đền thờ vị vua đầu tiên của Đại Cồ Việt với tượng đồng thế kỷ 17 và nhiều hiện vật quý.', descriptionEn: 'Temple honoring the first king of Dai Co Viet with 17th-century bronze statues and precious artifacts.', order: 0, latitude: 20.3268, longitude: 105.8924 },
      { nameVi: 'Đền vua Lê Đại Hành', nameEn: 'King Le Dai Hanh Temple', descriptionVi: 'Đền thờ hoàng đế thứ hai của Đại Cồ Việt, kiến trúc cuối thế kỷ 17 với chạm khắc rồng phượng tinh xảo.', descriptionEn: 'Temple honoring the second emperor of Dai Co Viet with late 17th-century dragon and phoenix carvings.', order: 1, latitude: 20.3272, longitude: 105.8908 },
      { nameVi: 'Núi Mã Yên', nameEn: 'Ma Yen Mountain', descriptionVi: 'Ngọn núi hình yên ngựa — nơi an táng vua Đinh. Leo 167 bậc đá để ngắm toàn cảnh vùng Hoa Lư.', descriptionEn: 'Saddle-shaped mountain — burial site of King Dinh. Climb 167 stone steps for panoramic views of Hoa Lu.', order: 2, latitude: 20.3258, longitude: 105.8932 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 4. CHÙA BÁI ĐÍNH
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'chua-bai-dinh',
    nameVi: 'Chùa Bái Đính',
    nameEn: 'Bai Dinh Pagoda',
    descriptionVi: 'Quần thể chùa lớn nhất Đông Nam Á với hàng loạt kỷ lục Phật giáo Việt Nam.',
    descriptionEn: 'The largest pagoda complex in Southeast Asia, holding numerous Vietnamese Buddhist records.',
    overviewVi: 'Chùa Bái Đính là quần thể chùa Phật giáo lớn nhất Đông Nam Á, tọa lạc trên núi Bái Đính thuộc huyện Gia Viễn, Ninh Bình. Quần thể gồm hai khu: Bái Đính Cổ (thế kỷ 10-11) và Bái Đính Mới (xây từ 2003). Đây là nơi nắm giữ nhiều kỷ lục Phật giáo Việt Nam.',
    overviewEn: 'Bai Dinh Pagoda is the largest Buddhist pagoda complex in Southeast Asia, situated on Bai Dinh Mountain in Gia Vien district. The complex comprises the Ancient Bai Dinh (10th-11th century) and the New Bai Dinh (constructed from 2003). It holds numerous Vietnamese Buddhist records.',
    historyVi: 'Chùa Bái Đính Cổ được xây dựng từ thời vua Đinh thế kỷ 10-11, là nơi Thiền sư Nguyễn Minh Không tu hành và tìm được xá lợi Phật. Năm 2003, khởi công xây dựng khu chùa mới trên quy mô hoành tráng 539 héc-ta.',
    historyEn: 'Ancient Bai Dinh Pagoda was built during the Dinh dynasty in the 10th-11th century, where the monk Nguyen Minh Khong practiced and discovered Buddha relics. In 2003, construction began on the grand new complex spanning 539 hectares.',
    highlightsVi: 'Hành lang La Hán dài 3km với 500 tượng đá mỗi tượng có khuôn mặt khác nhau. Tượng Phật đồng 100 tấn trong Điện Tam Thế. Tháp chuông với quả chuông đồng 36 tấn — lớn nhất Việt Nam. Chùa Bái Đính Cổ trong hang đá ngàn năm.',
    highlightsEn: '3km Arhat corridor with 500 uniquely-faced stone statues. 100-ton bronze Buddha in Tam The Hall. Bell tower with 36-ton bronze bell — largest in Vietnam. Ancient Bai Dinh Pagoda in a thousand-year-old mountain cave.',
    openTime: '6:00 - 18:00',
    admissionFee: 0,
    estimatedDuration: 150,
    address: 'Gia Sinh, Gia Viễn, Ninh Bình',
    bestTime: 'Sáng sớm, tránh tháng 1–2 đông người',
    latitude: 20.3055,
    longitude: 105.8568,
    displayOrder: 4,
    spots: [
      { nameVi: 'Tam Quan', nameEn: 'Triple Gate Entrance', descriptionVi: 'Cổng tam quan ba tầng cao 16m — cổng chùa lớn nhất Việt Nam. Điểm bắt đầu hành trình khám phá quần thể.', descriptionEn: 'Three-story triple gate, 16m tall — the largest temple gate in Vietnam. Starting point of the complex journey.', order: 0, latitude: 20.3060, longitude: 105.8572 },
      { nameVi: 'Hành lang La Hán', nameEn: 'Arhat Corridor', descriptionVi: 'Dãy hành lang dài 3km với 500 tượng La Hán đá xanh Ninh Bình, mỗi tượng cao 2m và có khuôn mặt riêng biệt.', descriptionEn: '3km corridor featuring 500 blue-stone Arhat statues, each 2m tall with a unique facial expression.', order: 1, latitude: 20.3048, longitude: 105.8559 },
      { nameVi: 'Điện Tam Thế & Tháp Chuông', nameEn: 'Tam The Hall & Bell Tower', descriptionVi: 'Công trình lớn nhất quần thể thờ ba pho Phật đồng. Tháp chuông 4 tầng với quả chuông đồng 36 tấn lớn nhất Việt Nam.', descriptionEn: 'Largest structure enshrining three bronze Buddhas. 4-story bell tower with Vietnam\'s largest 36-ton bronze bell.', order: 2, latitude: 20.3043, longitude: 105.8551 },
      { nameVi: 'Chùa Bái Đính Cổ', nameEn: 'Ancient Bai Dinh Pagoda', descriptionVi: 'Ngôi chùa cổ hơn 1.000 năm trong hang đá tự nhiên trên đỉnh núi. Leo 300 bậc để đến không gian tâm linh nguyên sơ.', descriptionEn: 'A 1,000-year-old pagoda in a natural mountain cave. Climb 300 steps to reach this pristine spiritual space.', order: 3, latitude: 20.3071, longitude: 105.8541 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 5. ĐẦM VÂN LONG
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'dam-van-long',
    nameVi: 'Khu bảo tồn thiên nhiên Vân Long',
    nameEn: 'Van Long Nature Reserve',
    descriptionVi: 'Khu đất ngập nước lớn nhất đồng bằng Bắc Bộ — thiên đường của voọc mông trắng quý hiếm và các loài chim nước.',
    descriptionEn: 'The largest wetland in the Red River Delta — a paradise for the rare white-bottomed langur and water birds.',
    overviewVi: 'Đầm Vân Long là khu đất ngập nước nội địa lớn nhất vùng đồng bằng Bắc Bộ với diện tích hơn 2.736 ha. Nơi đây là môi trường sống của hơn 457 loài thực vật, 39 loài thú và 74 loài chim. Đặc biệt là nơi cuối cùng trên thế giới còn quần thể voọc mông trắng — loài linh trưởng đặc hữu của Việt Nam — sinh sống trong tự nhiên.',
    overviewEn: 'Van Long Wetland is the largest inland wetland in the Red River Delta, spanning over 2,736 hectares. Home to over 457 plant species, 39 mammal species, and 74 bird species. Most significantly, this is one of the last places in the world where wild populations of the white-bottomed langur — a Vietnam-endemic primate — still thrive.',
    historyVi: 'Vân Long từng là vùng đất trũng hoang vu bao bọc bởi hàng trăm ngọn núi đá vôi. Năm 2001, khu vực được công nhận là Khu bảo tồn thiên nhiên đất ngập nước với các quy định bảo vệ nghiêm ngặt.',
    historyEn: 'Van Long was once wild, low-lying land surrounded by hundreds of limestone peaks. In 2001, the area was officially recognized as a Wetland Nature Reserve with strict protection regulations.',
    highlightsVi: 'Quan sát voọc mông trắng — linh trưởng quý hiếm nhất thế giới. Hàng chục loài chim nước, diệc và cò. Cảnh bình minh trên đầm với mặt nước phẳng lặng và núi non soi bóng. Không khí trong lành và tĩnh lặng hoàn toàn.',
    highlightsEn: 'Observe white-bottomed langurs — the world\'s rarest primate. Dozens of water bird species, herons and egrets. Sunrise over the wetland with mirror-flat water reflecting mountain silhouettes. Pure, completely tranquil air.',
    openTime: '6:30 - 17:00',
    admissionFee: 60000,
    estimatedDuration: 120,
    address: 'Gia Vân, Gia Viễn, Ninh Bình',
    bestTime: 'Sáng sớm 6:30–8:30 (chim hoạt động, ánh sáng đẹp)',
    latitude: 20.2903,
    longitude: 105.8242,
    displayOrder: 5,
    spots: [
      { nameVi: 'Bến thuyền Vân Long', nameEn: 'Van Long Boat Dock', descriptionVi: 'Bến thuyền nhỏ, yên tĩnh giữa làng chài — điểm xuất phát hành trình khám phá đầm thiên nhiên.', descriptionEn: 'Small, quiet dock amid a fishing village — departure point for exploring the natural wetland.', order: 0, latitude: 20.2908, longitude: 105.8248 },
      { nameVi: 'Khu vực voọc mông trắng', nameEn: 'White-bottomed Langur Zone', descriptionVi: 'Khu núi đá phía tây đầm, nơi tập trung quần thể voọc mông trắng cực kỳ nguy cấp. Quan sát tốt nhất vào sáng sớm.', descriptionEn: 'Rocky mountain area on the western wetland, home to the critically endangered white-bottomed langur. Best observed in early morning.', order: 1, latitude: 20.2885, longitude: 105.8228 },
      { nameVi: 'Hang Cá & vùng núi Hang', nameEn: 'Fish Cave & Cave Mountain Area', descriptionVi: 'Hang động nhỏ nơi cá tập trung sinh sống, được người dân bảo vệ theo tín ngưỡng dân gian. Khu vực nhiều loài chim làm tổ.', descriptionEn: 'Small cave where fish congregate, protected by local folk beliefs. Surrounding rocks serve as nesting ground for many bird species.', order: 2, latitude: 20.2872, longitude: 105.8215 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 6. HANG MÚA
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'hang-mua',
    nameVi: 'Hang Múa',
    nameEn: 'Hang Mua (Dance Cave)',
    descriptionVi: 'Đỉnh Hang Múa nhìn ra đồng lúa bậc thang và toàn cảnh Tràng An hùng vĩ — một trong những điểm ngắm cảnh đẹp nhất Ninh Bình.',
    descriptionEn: 'Hang Mua summit overlooks terraced rice fields and the magnificent Trang An panorama — one of the most beautiful viewpoints in Ninh Binh.',
    overviewVi: 'Hang Múa là điểm tham quan nổi tiếng ở Ninh Bình với đỉnh núi có thể leo lên bằng 500 bậc thang đá để ngắm toàn cảnh đồng bằng sông Hồng và quần thể Tràng An phía xa. Tên "Hang Múa" xuất phát từ các vũ nữ cung đình thời Đinh từng biểu diễn ở đây. Khu vực còn có ao nuôi cá koi và vườn hoa.',
    overviewEn: 'Hang Mua is a famous attraction in Ninh Binh where visitors climb 500 stone steps to the mountain summit for panoramic views of the Red River Delta and the distant Trang An complex. The name "Hang Mua" (Dance Cave) comes from royal court dancers of the Dinh dynasty who performed here. The area also features a koi fish pond and flower garden.',
    historyVi: 'Theo truyền thuyết, hang động này là nơi các vũ nữ cung đình của vua Đinh Tiên Hoàng biểu diễn múa — từ đó có tên Hang Múa. Khu vực tham quan hiện đại được quy hoạch và đầu tư từ những năm 2010.',
    historyEn: 'According to legend, this cave was where the royal court dancers of King Dinh Tien Hoang performed dances — hence the name Hang Mua (Dance Cave). The modern tourist attraction was developed and invested in during the 2010s.',
    highlightsVi: 'Leo 500 bậc đá lên đỉnh núi — phần thưởng là toàn cảnh tuyệt đẹp. Đồng lúa bậc thang nhìn từ trên cao. Ao cá Koi lớn ở chân núi. Tượng rồng dọc theo bậc thang leo núi.',
    highlightsEn: 'Climb 500 stone steps to the summit — rewarded with spectacular panoramic views. Terraced rice fields viewed from above. Large koi fish pond at the mountain base. Dragon statues along the climbing steps.',
    openTime: '7:00 - 18:00',
    admissionFee: 100000,
    estimatedDuration: 90,
    address: 'Ninh Xuân, Hoa Lư, Ninh Bình',
    bestTime: 'Sáng sớm hoặc chiều tà, tháng 9–11 (lúa chín vàng)',
    latitude: 20.2080,
    longitude: 105.9320,
    displayOrder: 6,
    spots: [
      { nameVi: 'Khu vực chân núi & Ao Koi', nameEn: 'Mountain Base & Koi Pond', descriptionVi: 'Khu vực đón tiếp với ao cá Koi lớn, vườn hoa và không gian nghỉ ngơi trước khi leo núi.', descriptionEn: 'Welcome area featuring a large koi pond, flower garden and relaxation space before the climb.', order: 0, latitude: 20.2082, longitude: 105.9322 },
      { nameVi: '500 Bậc thang leo núi', nameEn: '500 Stone Steps', descriptionVi: 'Hành trình leo 500 bậc đá với tượng rồng hai bên và tầm nhìn mở rộng dần theo độ cao.', descriptionEn: 'The 500-step climb flanked by dragon statues with views expanding progressively with altitude.', order: 1, latitude: 20.2078, longitude: 105.9318 },
      { nameVi: 'Đỉnh Hang Múa', nameEn: 'Hang Mua Summit', descriptionVi: 'Đỉnh cao nhất với tầm nhìn 360 độ: đồng lúa bậc thang, dòng sông uốn lượn và quần thể Tràng An phía xa.', descriptionEn: '360-degree summit views: terraced rice fields, winding rivers, and the distant Trang An complex.', order: 2, latitude: 20.2075, longitude: 105.9315 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 7. NHÀ THỜ PHÁT DIỆM
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'nha-tho-phat-diem',
    nameVi: 'Nhà thờ Đá Phát Diệm',
    nameEn: 'Phat Diem Stone Cathedral',
    descriptionVi: 'Công trình kiến trúc Công giáo độc đáo kết hợp phong cách phương Đông và phương Tây — kỳ quan đá vôi cuối thế kỷ 19 tại Kim Sơn, Ninh Bình.',
    descriptionEn: 'A unique Catholic architectural marvel blending Eastern and Western styles — a late 19th-century limestone wonder in Kim Son, Ninh Binh.',
    overviewVi: 'Nhà thờ Đá Phát Diệm là quần thể nhà thờ Công giáo đặc biệt nhất Việt Nam, nằm tại thị trấn Phát Diệm, huyện Kim Sơn. Được xây dựng trong 24 năm từ 1875 đến 1899 dưới sự chỉ đạo của Linh mục Trần Lục (Cụ Sáu), toàn bộ công trình làm từ đá xanh tự nhiên kết hợp với kiến trúc đình chùa Việt Nam truyền thống.',
    overviewEn: 'Phat Diem Stone Cathedral is the most unique Catholic cathedral complex in Vietnam, located in Phat Diem town, Kim Son district. Built over 24 years from 1875 to 1899 under the direction of Father Tran Luc, the entire complex is made from natural blue stone combined with traditional Vietnamese pagoda architecture.',
    historyVi: 'Linh mục Trần Lục (1825-1899) là người thiết kế và chỉ đạo xây dựng quần thể suốt 24 năm. Ông kết hợp tài tình kiến trúc Công giáo với mỹ thuật Á Đông, sử dụng hoàn toàn vật liệu địa phương. Nhà thờ được xây theo lối kiến trúc đình chùa Việt Nam với mái cong, cột gỗ lim và hệ thống trang trí phong phú.',
    historyEn: 'Father Tran Luc (1825-1899) designed and oversaw the construction over 24 years. He brilliantly combined Catholic architecture with Asian aesthetics, using entirely local materials. The cathedral was built in the Vietnamese pagoda style with curved roofs, ironwood columns, and rich decorative systems.',
    highlightsVi: 'Nhà thờ chính hoàn toàn bằng đá xanh dài 74m, rộng 21m. Tháp chuông 4 tầng cao 25m. Hồ sen trước nhà thờ phản chiếu toàn bộ công trình. Bốn nhà thờ nhỏ thờ các thánh với kiến trúc đặc sắc riêng. Hang đá Bethlehem và núi đá nhân tạo.',
    highlightsEn: 'Main cathedral entirely of blue stone, 74m long and 21m wide. Four-story 25m bell tower. Lotus pond reflecting the entire complex. Four small chapels dedicated to saints with unique architecture. Bethlehem grotto and artificial rock mountain.',
    openTime: '5:00 - 18:00',
    admissionFee: 0,
    estimatedDuration: 60,
    address: 'Thị trấn Phát Diệm, Kim Sơn, Ninh Bình',
    bestTime: 'Sáng sớm hoặc chiều, mát mẻ',
    latitude: 20.1034,
    longitude: 106.0892,
    displayOrder: 7,
    spots: [
      { nameVi: 'Ao Hồ & Phương Đình', nameEn: 'Lotus Pond & Phuong Dinh Pavilion', descriptionVi: 'Hồ sen rộng lớn trước cổng với phương đình hai tầng giữa hồ — công trình tiền sảnh uy nghi nhất của quần thể.', descriptionEn: 'Large lotus pond at the entrance with a two-story pavilion in the center — the most majestic forecourt of the complex.', order: 0, latitude: 20.1036, longitude: 106.0891 },
      { nameVi: 'Nhà thờ chính', nameEn: 'Main Cathedral', descriptionVi: 'Nhà thờ đá vĩ đại dài 74m hoàn toàn từ đá xanh tự nhiên, kết hợp kiến trúc Gothic và đình chùa Việt Nam.', descriptionEn: '74m main stone cathedral entirely of natural blue stone, combining Gothic and Vietnamese pagoda architecture.', order: 1, latitude: 20.1034, longitude: 106.0893 },
      { nameVi: 'Tháp Chuông & Các Nhà thờ nhỏ', nameEn: 'Bell Tower & Side Chapels', descriptionVi: 'Tháp chuông 4 tầng cao 25m và bốn nhà thờ nhỏ thờ các thánh với kiến trúc mỗi cái một phong cách riêng biệt.', descriptionEn: 'Four-story 25m bell tower and four side chapels each with its own distinctive architectural style.', order: 2, latitude: 20.1032, longitude: 106.0895 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 8. NHÀ THỜ BÙI CHU
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'nha-tho-bui-chu',
    nameVi: 'Nhà thờ Bùi Chu',
    nameEn: 'Bui Chu Cathedral',
    descriptionVi: 'Nhà thờ Công giáo hơn 130 năm tuổi theo phong cách kiến trúc Baroque châu Âu — một trong những nhà thờ cổ và đẹp nhất miền Bắc Việt Nam.',
    descriptionEn: 'A 130-year-old Catholic cathedral in European Baroque style — one of the oldest and most beautiful cathedrals in northern Vietnam.',
    overviewVi: 'Nhà thờ Bùi Chu nằm tại xã Xuân Ngọc, huyện Xuân Trường, tỉnh Nam Định — trung tâm của giáo phận Bùi Chu, một trong những giáo phận Công giáo lớn và lâu đời nhất Việt Nam. Nhà thờ được xây dựng từ năm 1885, mang kiến trúc Baroque châu Âu đặc sắc với hai tháp chuông uy nghi và nội thất được trang trí tinh xảo.',
    overviewEn: 'Bui Chu Cathedral is located in Xuan Ngoc commune, Xuan Truong district, Nam Dinh province — the center of the Bui Chu diocese, one of Vietnam\'s oldest and largest Catholic dioceses. Built in 1885, it features distinctive European Baroque architecture with two majestic bell towers and an intricately decorated interior.',
    historyVi: 'Giáo phận Bùi Chu được thành lập từ thế kỷ 17, là một trong những trung tâm Công giáo lâu đời nhất Đông Nam Á. Nhà thờ chính tòa hiện tại được xây dựng năm 1885 và đã qua nhiều lần trùng tu nhưng vẫn giữ nguyên kiến trúc Baroque đặc trưng.',
    historyEn: 'The Bui Chu diocese was established in the 17th century, one of Southeast Asia\'s oldest Catholic centers. The current cathedral was built in 1885 and has undergone several restorations while retaining its distinctive Baroque architecture.',
    highlightsVi: 'Hai tháp chuông cao 18m theo phong cách Baroque. Nội thất nhà thờ với trần vòm cong và bàn thờ chính mạ vàng. Quảng trường nhà thờ rộng lớn. Không khí tâm linh đặc biệt vào buổi lễ.',
    highlightsEn: 'Two 18m Baroque bell towers. Cathedral interior with arched ceiling and gilded main altar. Large cathedral square. Special spiritual atmosphere during mass.',
    openTime: '5:00 - 18:00',
    admissionFee: 0,
    estimatedDuration: 45,
    address: 'Xuân Ngọc, Xuân Trường, Nam Định',
    bestTime: 'Sáng sớm hoặc giờ lễ chiều',
    latitude: 20.2584,
    longitude: 106.4200,
    displayOrder: 8,
    spots: [
      { nameVi: 'Mặt tiền & Quảng trường', nameEn: 'Facade & Cathedral Square', descriptionVi: 'Mặt tiền Baroque uy nghi với hai tháp chuông và quảng trường rộng — điểm chụp ảnh đẹp nhất của nhà thờ.', descriptionEn: 'Majestic Baroque facade with twin bell towers and broad square — the best photography spot.', order: 0, latitude: 20.2585, longitude: 106.4201 },
      { nameVi: 'Nội thất nhà thờ chính', nameEn: 'Cathedral Interior', descriptionVi: 'Nội thất trang nghiêm với trần vòm, hàng cột đá và bàn thờ chính mạ vàng lộng lẫy.', descriptionEn: 'Solemn interior with vaulted ceiling, stone columns, and a magnificent gilded main altar.', order: 1, latitude: 20.2584, longitude: 106.4200 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 9. CHÙA TAM CHÚC
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'chua-tam-chuc',
    nameVi: 'Chùa Tam Chúc',
    nameEn: 'Tam Chuc Pagoda',
    descriptionVi: 'Quần thể chùa được mệnh danh là "chùa lớn nhất thế giới" nằm giữa hồ Tam Chúc thơ mộng tại Hà Nam.',
    descriptionEn: 'A pagoda complex dubbed "the world\'s largest pagoda" set amid the picturesque Tam Chuc Lake in Ha Nam.',
    overviewVi: 'Chùa Tam Chúc nằm tại xã Ba Sao, Kim Bảng, Hà Nam, trong lòng Khu du lịch quốc gia Tam Chúc rộng 4.000 ha. Quần thể được quy hoạch theo kiến trúc Phật giáo hoành tráng với ba điện chính nhìn ra hồ Tam Chúc bao la. Đây từng là nơi đức Phật Thích Ca đã hành đạo theo truyền thuyết địa phương.',
    overviewEn: 'Tam Chuc Pagoda is located in Ba Sao commune, Kim Bang district, Ha Nam, within the 4,000-hectare Tam Chuc National Tourism Area. The complex is planned with magnificent Buddhist architecture featuring three main halls overlooking the vast Tam Chuc Lake. According to local legend, this was a place where the Buddha practiced.',
    historyVi: 'Chùa Tam Chúc có lịch sử hơn 1.000 năm, được xây dựng từ thời Đinh và Lê. Năm 2012, dự án tôn tạo mở rộng quy mô lớn được khởi công, biến Tam Chúc thành một trong những quần thể Phật giáo lớn nhất thế giới.',
    historyEn: 'Tam Chuc Pagoda has over 1,000 years of history, built during the Dinh and Le dynasties. In 2012, a major restoration and expansion project began, transforming Tam Chuc into one of the world\'s largest Buddhist complexes.',
    highlightsVi: 'Hành trình thuyền trên hồ Tam Chúc nhìn lên núi đá và điện chùa. Ba điện lớn Tam Thế, Pháp Chủ và Quan Thế Âm. Núi Thất Tinh với 7 ngọn đặc trưng. Hành lang La Hán 1.000 tượng. Cánh rừng nguyên sinh ngàn năm.',
    highlightsEn: 'Boat journey on Tam Chuc Lake looking up at limestone mountains and temple halls. Three grand halls: Tam The, Phap Chu, and Quan The Am. Thất Tinh Mountain with 7 characteristic peaks. Arhat corridor with 1,000 statues. Ancient primeval forest.',
    openTime: '6:00 - 18:00',
    admissionFee: 0,
    estimatedDuration: 180,
    address: 'Ba Sao, Kim Bảng, Hà Nam',
    bestTime: 'Sáng sớm khi sương mù tan dần trên hồ',
    latitude: 20.5382,
    longitude: 105.9097,
    displayOrder: 9,
    spots: [
      { nameVi: 'Hồ Tam Chúc & bến thuyền', nameEn: 'Tam Chuc Lake & Boat Dock', descriptionVi: 'Hồ rộng lớn bao quanh bởi núi đá, nơi du khách đi thuyền ngắm toàn cảnh quần thể chùa từ mặt nước.', descriptionEn: 'Vast lake surrounded by limestone peaks where visitors boat to view the entire pagoda complex from the water.', order: 0, latitude: 20.5385, longitude: 105.9100 },
      { nameVi: 'Điện Tam Thế', nameEn: 'Tam The Hall', descriptionVi: 'Điện lớn nhất thờ ba vị Phật Tam Thế, kiến trúc hoành tráng nhìn thẳng ra hồ Tam Chúc.', descriptionEn: 'The largest hall enshrining the three Tam The Buddhas, with magnificent architecture facing Tam Chuc Lake.', order: 1, latitude: 20.5379, longitude: 105.9094 },
      { nameVi: 'Núi Thất Tinh & rừng nguyên sinh', nameEn: 'Thất Tinh Mountain & Ancient Forest', descriptionVi: 'Núi 7 đỉnh đặc trưng và khu rừng nguyên sinh ngàn năm xanh tươi quanh năm, nơi thiền định lý tưởng.', descriptionEn: 'Mountain with 7 characteristic peaks and ancient primeval forest lush year-round — an ideal meditation retreat.', order: 2, latitude: 20.5370, longitude: 105.9085 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 10. CHÙA BÀ ĐANH
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'chua-ba-danh',
    nameVi: 'Chùa Bà Đanh',
    nameEn: 'Ba Danh Pagoda',
    descriptionVi: 'Ngôi chùa cổ nổi tiếng với câu ca "vắng như chùa Bà Đanh" nằm trong rừng lim ngàn năm bên sông Đáy — không gian tâm linh tuyệt vời và hoang sơ.',
    descriptionEn: 'Ancient pagoda famous for the saying "as quiet as Ba Danh Pagoda," nestled in a thousand-year ironwood forest beside the Day River — a wonderfully pristine spiritual space.',
    overviewVi: 'Chùa Bà Đanh (còn gọi là Bảo Sơn Tự) nằm tại xã Ngọc Sơn, Kim Bảng, Hà Nam, trong khu rừng lim cổ thụ ngàn năm bên bờ sông Đáy. Ngôi chùa nổi tiếng với câu tục ngữ "vắng như chùa Bà Đanh" vì địa thế hiểm trở, người ít đến. Nay là điểm du lịch tâm linh và thiên nhiên hấp dẫn.',
    overviewEn: 'Ba Danh Pagoda (also known as Bao Son Tu) is located in Ngoc Son commune, Kim Bang, Ha Nam, within a thousand-year-old ironwood forest beside the Day River. The pagoda is famous for the proverb "as quiet as Ba Danh Pagoda" due to its remote location. Today it is an attractive spiritual and nature tourism destination.',
    historyVi: 'Chùa có lịch sử hơn 2.000 năm, tương truyền được xây dựng từ thời Hùng Vương. Đây là nơi thờ Phật và bốn vị thần nông nghiệp địa phương. Chùa từng là nơi linh thiêng mà ngay cả lính Pháp cũng không dám phá hoại trong thời kỳ kháng chiến.',
    historyEn: 'The pagoda has over 2,000 years of history, reportedly built during the Hung Vuong era. It is a place of worship for Buddha and four local agricultural deities. The pagoda was so sacred that even French soldiers dared not destroy it during the resistance war.',
    highlightsVi: 'Rừng lim cổ thụ ngàn năm bao quanh chùa, cây to nhất gốc chu vi hơn 10m. Không gian tĩnh lặng và mát mẻ đặc biệt. Sông Đáy thơ mộng ngay cạnh chùa. Kiến trúc cổ kính với nhiều pho tượng quý.',
    highlightsEn: 'Thousand-year-old ironwood forest surrounding the pagoda, the largest trees with trunks over 10m in circumference. Exceptionally quiet and cool atmosphere. Romantic Day River immediately beside the pagoda. Ancient architecture with many precious statues.',
    openTime: '7:00 - 17:30',
    admissionFee: 10000,
    estimatedDuration: 60,
    address: 'Ngọc Sơn, Kim Bảng, Hà Nam',
    bestTime: 'Sáng mát mẻ, không khí trong lành nhất',
    latitude: 20.4912,
    longitude: 105.9823,
    displayOrder: 10,
    spots: [
      { nameVi: 'Rừng lim & cổng chùa', nameEn: 'Ironwood Forest & Gate', descriptionVi: 'Con đường đi qua rừng lim cổ thụ ngàn năm dẫn vào cổng chùa — không gian xanh mát hiếm có.', descriptionEn: 'Path through the thousand-year-old ironwood forest leading to the pagoda gate — a rare cool green space.', order: 0, latitude: 20.4913, longitude: 105.9825 },
      { nameVi: 'Chính điện & Tượng thờ', nameEn: 'Main Hall & Statues', descriptionVi: 'Chính điện cổ kính thờ Phật và bốn vị thần nông nghiệp với nhiều pho tượng quý có niên đại hàng trăm năm.', descriptionEn: 'Ancient main hall worshipping Buddha and four agricultural deities with precious centuries-old statues.', order: 1, latitude: 20.4912, longitude: 105.9823 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 11. VƯỜN QUỐC GIA CÚC PHƯƠNG
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'vuon-quoc-gia-cuc-phuong',
    nameVi: 'Vườn quốc gia Cúc Phương',
    nameEn: 'Cuc Phuong National Park',
    descriptionVi: 'Vườn quốc gia đầu tiên của Việt Nam với rừng nhiệt đới nguyên sinh hàng triệu năm, trung tâm cứu hộ linh trưởng nổi tiếng và hang động thời tiền sử.',
    descriptionEn: 'Vietnam\'s first national park with millions-year-old primeval tropical forest, a renowned primate rescue center, and prehistoric caves.',
    overviewVi: 'Vườn quốc gia Cúc Phương nằm tại huyện Nho Quan, Ninh Bình — vườn quốc gia đầu tiên của Việt Nam được thành lập năm 1962. Rừng nguyên sinh tại đây có hệ sinh thái đa dạng bậc nhất Đông Nam Á với hơn 2.000 loài thực vật, 450 loài chim và 135 loài thú. Đặc biệt có trung tâm cứu hộ linh trưởng và rùa cạn quý hiếm.',
    overviewEn: 'Cuc Phuong National Park in Nho Quan district, Ninh Binh — Vietnam\'s first national park established in 1962. The primeval forest here has one of Southeast Asia\'s most diverse ecosystems with over 2,000 plant species, 450 bird species and 135 mammal species. Notably features a rescue center for rare primates and land turtles.',
    historyVi: 'Vườn quốc gia Cúc Phương được Chủ tịch Hồ Chí Minh ký quyết định thành lập năm 1962. Hang Con Moong trong vườn chứa di chỉ khảo cổ của người tiền sử sống cách đây 12.000 năm. Cây Chò Ngàn Năm trong vườn là cây cổ thụ lớn nhất Việt Nam.',
    historyEn: 'Cuc Phuong National Park was established in 1962 by President Ho Chi Minh\'s decree. Con Moong Cave within the park contains archaeological remains of prehistoric people who lived 12,000 years ago. The Thousand-Year Cho Tree in the park is Vietnam\'s largest ancient tree.',
    highlightsVi: 'Trung tâm cứu hộ linh trưởng — nơi cứu hộ và sinh sản nhân tạo các loài voọc, khỉ và culi. Hang Con Moong — di chỉ người tiền sử 12.000 năm. Cây Chò Ngàn Năm cao 45m, gốc cây 4 người ôm không xuể. Tuyến đường mòn xuyên rừng nguyên sinh.',
    highlightsEn: 'Primate Rescue Center — rescuing and breeding vooc, monkeys and slow lorises. Con Moong Cave — 12,000-year prehistoric site. Thousand-Year Cho Tree 45m tall requiring 4 people to embrace. Forest trekking trails through primeval jungle.',
    openTime: '7:00 - 17:00',
    admissionFee: 60000,
    estimatedDuration: 240,
    address: 'Nho Quan, Ninh Bình',
    bestTime: 'Tháng 4–5 (bướm bay, khí hậu đẹp) hoặc tháng 10–11',
    latitude: 20.3219,
    longitude: 105.5808,
    displayOrder: 11,
    spots: [
      { nameVi: 'Trung tâm cứu hộ linh trưởng', nameEn: 'Primate Rescue Center', descriptionVi: 'Nơi cứu hộ và nhân giống các loài linh trưởng quý hiếm: voọc, khỉ mặt đỏ, culi và nhiều loài khác.', descriptionEn: 'Center rescuing and breeding rare primates: langurs, red-faced macaques, slow lorises and many others.', order: 0, latitude: 20.3215, longitude: 105.5800 },
      { nameVi: 'Hang Con Moong', nameEn: 'Con Moong Cave', descriptionVi: 'Hang động tiền sử nơi phát hiện di cốt và công cụ của người Việt cổ sống cách đây 12.000 năm.', descriptionEn: 'Prehistoric cave where remains and tools of ancient Vietnamese people living 12,000 years ago were discovered.', order: 1, latitude: 20.3250, longitude: 105.5820 },
      { nameVi: 'Cây Chò Ngàn Năm', nameEn: 'Thousand-Year Cho Tree', descriptionVi: 'Cây cổ thụ lớn nhất Việt Nam, cao 45m, đường kính gốc hơn 5m, tuổi ước tính hơn 1.000 năm.', descriptionEn: 'Vietnam\'s largest ancient tree, 45m tall, trunk diameter over 5m, estimated age over 1,000 years.', order: 2, latitude: 20.3180, longitude: 105.5780 },
      { nameVi: 'Bản Mường & đường mòn rừng', nameEn: 'Muong Village & Forest Trail', descriptionVi: 'Bản làng người Mường truyền thống trong vùng lõi vườn và các tuyến đường mòn xuyên rừng nguyên sinh.', descriptionEn: 'Traditional Muong ethnic village in the park core and trekking trails through primeval jungle.', order: 3, latitude: 20.3240, longitude: 105.5790 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 12. VƯỜN CHIM THUNG NHAM
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'vuon-chim-thung-nham',
    nameVi: 'Khu sinh thái Thung Nham',
    nameEn: 'Thung Nham Bird Garden',
    descriptionVi: 'Khu sinh thái độc đáo với vườn chim hoang dã tự nhiên, hành trình thuyền qua các hang động đẹp và bình yên.',
    descriptionEn: 'Unique eco-tourism area with natural wild bird sanctuary, boat journey through beautiful caves in tranquil surroundings.',
    overviewVi: 'Khu sinh thái Thung Nham nằm tại xã Ninh Hải, Hoa Lư, Ninh Bình — cách Tam Cốc khoảng 3km. Đây là điểm du lịch sinh thái kết hợp: vườn chim với hàng nghìn cá thể từ hàng chục loài, hành trình thuyền qua các hang động và thung lũng, đồng thời là khu bảo tồn thiên nhiên tự nhiên hiếm có.',
    overviewEn: 'Thung Nham Ecological Area is located in Ninh Hai commune, Hoa Lu, Ninh Binh — about 3km from Tam Coc. This eco-tourism destination combines: a bird garden with thousands of individuals from dozens of species, boat journey through caves and valleys, and a rare natural conservation area.',
    historyVi: 'Thung Nham vốn là vùng đất trũng hoang sơ giữa các núi đá vôi. Từ những năm 2010, khu vực được quy hoạch thành điểm du lịch sinh thái kết hợp bảo tồn chim hoang dã tự nhiên, thu hút hàng nghìn con chim về làm tổ mỗi năm.',
    historyEn: 'Thung Nham was originally wild lowland amid limestone mountains. From the 2010s, the area was developed into an eco-tourism destination combining natural wild bird conservation, attracting thousands of birds to nest each year.',
    highlightsVi: 'Vườn chim với hàng nghìn cá thể cò, vạc, diệc xanh và nhiều loài chim khác. Hành trình thuyền qua các thung lũng và hang động núi đá. Không gian yên tĩnh, trong lành xa náo nhiệt. Bình minh và hoàng hôn trên vườn chim.',
    highlightsEn: 'Bird garden with thousands of egrets, night herons, purple herons and many other bird species. Boat journey through valleys and limestone caves. Quiet, clean atmosphere far from noise. Sunrise and sunset views over the bird sanctuary.',
    openTime: '6:30 - 17:00',
    admissionFee: 80000,
    estimatedDuration: 120,
    address: 'Ninh Hải, Hoa Lư, Ninh Bình',
    bestTime: 'Sáng sớm 6:30–8:00 (chim bay về tổ, cảnh đẹp nhất)',
    latitude: 20.2472,
    longitude: 105.8358,
    displayOrder: 12,
    spots: [
      { nameVi: 'Bến thuyền & khu đón tiếp', nameEn: 'Boat Dock & Welcome Area', descriptionVi: 'Khu đón tiếp với bến thuyền xuất phát hành trình khám phá thung lũng và hang động.', descriptionEn: 'Welcome area with boat dock to start the valley and cave exploration journey.', order: 0, latitude: 20.2475, longitude: 105.8360 },
      { nameVi: 'Vườn chim', nameEn: 'Bird Garden', descriptionVi: 'Khu rừng và ao hồ tự nhiên nơi hàng nghìn con chim về làm tổ, đặc biệt đẹp vào sáng sớm và hoàng hôn.', descriptionEn: 'Natural forest and ponds where thousands of birds come to nest, especially beautiful at dawn and dusk.', order: 1, latitude: 20.2468, longitude: 105.8352 },
      { nameVi: 'Hang Bói & thung lũng', nameEn: 'Hang Boi Cave & Valley', descriptionVi: 'Hang động đẹp và thung lũng thơ mộng trong hành trình thuyền, với cảnh quan núi đá vôi xung quanh.', descriptionEn: 'Beautiful cave and romantic valley on the boat journey, surrounded by limestone mountain scenery.', order: 2, latitude: 20.2460, longitude: 105.8345 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 13. CHÙA ĐỊA TẠNG PHI LAI
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'chua-dia-tang-phi-lai',
    nameVi: 'Chùa Địa Tạng Phi Lai',
    nameEn: 'Dia Tang Phi Lai Pagoda',
    descriptionVi: 'Ngôi chùa thiền tịnh độc đáo ẩn mình trong núi đá Hà Nam — không gian thiền định trong lành, kiến trúc cổ điển và vườn hoa sen bốn mùa.',
    descriptionEn: 'Unique meditation pagoda hidden among Ha Nam limestone mountains — pure meditation space, classical architecture and year-round lotus gardens.',
    overviewVi: 'Chùa Địa Tạng Phi Lai tọa lạc tại thôn Đồng Du, xã Bồ Đề, huyện Bình Lục, Hà Nam — một ngôi chùa thiền tịnh được phục dựng và xây dựng từ năm 2015 với không gian thiền định thanh tịnh, kiến trúc truyền thống Việt Nam và cảnh quan thiên nhiên đẹp. Chùa nổi tiếng với không khí tu thiền nghiêm trang và vườn sen bốn mùa.',
    overviewEn: 'Dia Tang Phi Lai Pagoda is located in Dong Du hamlet, Bo De commune, Binh Luc district, Ha Nam — a meditation pagoda restored and built from 2015 with a pure meditation atmosphere, traditional Vietnamese architecture, and beautiful natural scenery. The pagoda is known for its solemn meditation atmosphere and four-season lotus gardens.',
    historyVi: 'Chùa có lịch sử lâu đời nhưng đã bị hoang phế. Từ năm 2015, Thượng tọa Thích Minh Quang đã phục dựng và xây dựng lại chùa theo kiến trúc truyền thống thuần Việt, tạo nên một không gian thiền tịnh hiếm có giữa núi đá.',
    historyEn: 'The pagoda has a long history but fell into ruin. From 2015, Venerable Thich Minh Quang restored and rebuilt the pagoda in traditional Vietnamese architecture, creating a rare meditation space among limestone mountains.',
    highlightsVi: 'Không gian thiền tịnh hoàn toàn yên lặng, xa cách náo nhiệt. Vườn sen và ao hoa năm nào cũng đẹp. Kiến trúc truyền thống thuần Việt không pha tạp. Cổng Tam Quan và đường vào chùa qua núi đá.',
    highlightsEn: 'Completely silent meditation space, far from noise and crowds. Lotus garden and flower pond beautiful year-round. Pure traditional Vietnamese architecture. Triple gate and path into the pagoda through limestone mountains.',
    openTime: '5:00 - 17:30',
    admissionFee: 0,
    estimatedDuration: 90,
    address: 'Bồ Đề, Bình Lục, Hà Nam',
    bestTime: 'Sáng sớm khi sương mờ — không khí thiền định nhất',
    latitude: 20.5123,
    longitude: 106.0456,
    displayOrder: 13,
    spots: [
      { nameVi: 'Cổng Tam Quan & đường vào chùa', nameEn: 'Triple Gate & Entrance Path', descriptionVi: 'Cổng Tam Quan uy nghi dẫn vào đường đi qua núi đá và vườn cây xanh mướt đến chính điện.', descriptionEn: 'Majestic triple gate leading along a path through limestone mountains and lush gardens to the main hall.', order: 0, latitude: 20.5125, longitude: 106.0458 },
      { nameVi: 'Chính điện & Nhà tổ', nameEn: 'Main Hall & Patriarch House', descriptionVi: 'Chính điện thờ Địa Tạng Bồ Tát và nhà tổ với kiến trúc gỗ truyền thống tinh xảo, không gian thiền định sâu lắng.', descriptionEn: 'Main hall enshrining Ksitigarbha Bodhisattva and patriarch house with exquisite traditional wooden architecture and deep meditation atmosphere.', order: 1, latitude: 20.5123, longitude: 106.0456 },
      { nameVi: 'Vườn Sen & không gian thiền', nameEn: 'Lotus Garden & Meditation Space', descriptionVi: 'Vườn sen và ao hoa quanh chùa, không gian mở để thiền định và tĩnh tâm giữa thiên nhiên núi đá.', descriptionEn: 'Lotus garden and flower pond around the pagoda, open space for meditation and contemplation amid limestone nature.', order: 2, latitude: 20.5121, longitude: 106.0454 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 14. CHÙA CÂY THỊ (CHÙA BÀ CÔ)
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'chua-cay-thi',
    nameVi: 'Chùa Cây Thị (Linh Cốc Hải Nham)',
    nameEn: 'Cay Thi Pagoda (Linh Coc Hai Nham)',
    descriptionVi: 'Ngôi chùa cổ nghìn năm ẩn mình trong hang đá núi vôi Ninh Bình — một trong những ngôi chùa hang đá cổ nhất và linh thiêng nhất vùng đất Ninh Bình xưa.',
    descriptionEn: 'A thousand-year-old ancient pagoda hidden within a limestone cave in Ninh Binh — one of the oldest and most sacred cave pagodas in the ancient Ninh Binh region.',
    overviewVi: 'Chùa Cây Thị hay còn gọi là Linh Cốc Hải Nham, nằm tại xã Gia Sinh, huyện Gia Viễn, Ninh Bình. Ngôi chùa cổ kính nằm trong hang đá tự nhiên, xung quanh là cây thị cổ thụ hàng trăm năm. Đây là điểm tâm linh ít được biết đến nhưng cực kỳ linh thiêng và có giá trị lịch sử cao.',
    overviewEn: 'Cay Thi Pagoda, also known as Linh Coc Hai Nham, is located in Gia Sinh commune, Gia Vien district, Ninh Binh. The ancient pagoda sits within a natural cave, surrounded by centuries-old persimmon trees. This is a little-known but extremely sacred spiritual site with high historical value.',
    historyVi: 'Chùa được xây dựng từ thế kỷ 10-11, gắn liền với lịch sử của vùng đất Hoa Lư — kinh đô đầu tiên của Việt Nam. Cây thị cổ thụ trồng trước chùa được cho là đã hơn 500 tuổi, là linh vật và biểu tượng của ngôi chùa.',
    historyEn: 'The pagoda was built in the 10th-11th century, closely tied to the history of Hoa Lu — Vietnam\'s first capital. The ancient persimmon tree planted before the pagoda is said to be over 500 years old, serving as the pagoda\'s sacred symbol.',
    highlightsVi: 'Không gian hang đá tự nhiên cổ kính hàng nghìn năm. Cây thị cổ thụ hơn 500 năm tuổi. Vị trí hẻo lánh, thanh tịnh hiếm có. Gần kề Khu bảo tồn Vân Long.',
    highlightsEn: 'Thousands-year-old natural cave space. Ancient 500-year-old persimmon tree. Rarely visited, exceptionally tranquil location. Adjacent to Van Long Nature Reserve.',
    openTime: '7:00 - 17:30',
    admissionFee: 0,
    estimatedDuration: 45,
    address: 'Gia Sinh, Gia Viễn, Ninh Bình',
    bestTime: 'Sáng sớm, không khí trong lành và ít người nhất',
    latitude: 20.2950,
    longitude: 105.8380,
    displayOrder: 14,
    spots: [
      { nameVi: 'Cây Thị Cổ Thụ', nameEn: 'Ancient Persimmon Tree', descriptionVi: 'Cây thị hơn 500 năm tuổi đứng sừng sững trước cổng chùa, là biểu tượng và linh vật của ngôi chùa cổ.', descriptionEn: 'Over 500-year-old persimmon tree standing majestically before the pagoda gate, symbol and sacred object of the ancient pagoda.', order: 0, latitude: 20.2952, longitude: 105.8382 },
      { nameVi: 'Chùa hang đá', nameEn: 'Cave Pagoda', descriptionVi: 'Chính điện chùa nằm trong hang đá tự nhiên với không gian thờ tự cổ kính, ẩm mát và linh thiêng.', descriptionEn: 'Main pagoda hall within a natural cave — an ancient, cool and sacred worship space.', order: 1, latitude: 20.2950, longitude: 105.8380 },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // 15. VƯỜN QUỐC GIA XUÂN THỦY
  // ════════════════════════════════════════════════════════════════════════════
  {
    slug: 'vuon-quoc-gia-xuan-thuy',
    nameVi: 'Vườn quốc gia Xuân Thủy',
    nameEn: 'Xuan Thuy National Park',
    descriptionVi: 'Khu Ramsar đầu tiên của Việt Nam và Đông Nam Á — thiên đường của hơn 220 loài chim di cư quý hiếm trong rừng ngập mặn bên cửa sông Hồng.',
    descriptionEn: 'Vietnam\'s and Southeast Asia\'s first Ramsar site — a paradise for over 220 rare migratory bird species in mangrove forests beside the Red River estuary.',
    overviewVi: 'Vườn quốc gia Xuân Thủy nằm tại huyện Giao Thủy, Nam Định — khu Ramsar (đất ngập nước quan trọng quốc tế) đầu tiên được công nhận ở Việt Nam và Đông Nam Á năm 1989. Đây là điểm dừng chân quan trọng của các loài chim di cư trên đường bay từ Siberia về phương Nam. Rừng ngập mặn tự nhiên phong phú, hệ sinh thái cửa sông Hồng đặc biệt.',
    overviewEn: 'Xuan Thuy National Park in Giao Thuy district, Nam Dinh — the first Ramsar site (internationally important wetland) recognized in Vietnam and Southeast Asia in 1989. This is an important stopover for migratory birds flying from Siberia to the South. Rich natural mangrove forests and special Red River estuary ecosystem.',
    historyVi: 'Khu Xuân Thủy được công nhận là khu Ramsar đầu tiên ở Đông Nam Á năm 1989. Năm 2003, được nâng cấp thành Vườn quốc gia. Đây là nơi giao thoa giữa đất liền và biển, là hệ sinh thái cửa sông Hồng độc đáo.',
    historyEn: 'Xuan Thuy was recognized as Southeast Asia\'s first Ramsar site in 1989. In 2003, it was upgraded to a National Park. This is where land and sea meet, featuring the unique Red River estuary ecosystem.',
    highlightsVi: 'Hơn 220 loài chim, trong đó có nhiều loài quý hiếm chỉ còn vài trăm cá thể như cò thìa, choắt mỏ thìa. Rừng ngập mặn tự nhiên bạt ngàn. Cồn Lu và Cồn Ngạn — bãi cát bồi giữa biển. Hoạt động quan sát chim bằng thuyền và đi bộ.',
    highlightsEn: 'Over 220 bird species including many rare ones with only a few hundred individuals worldwide such as spoonbills. Natural mangrove forests stretching vast distances. Con Lu and Con Ngan — alluvial sandbanks amid the sea. Birdwatching by boat and on foot.',
    openTime: '7:00 - 17:00',
    admissionFee: 50000,
    estimatedDuration: 180,
    address: 'Giao Thủy, Nam Định',
    bestTime: 'Tháng 11–4 (mùa chim di cư) — đặc biệt tháng 12–2',
    latitude: 20.2500,
    longitude: 106.5500,
    displayOrder: 15,
    spots: [
      { nameVi: 'Bến thuyền Cồn Lu', nameEn: 'Con Lu Boat Dock', descriptionVi: 'Điểm xuất phát hành trình thuyền ra các cồn giữa biển để quan sát chim di cư và rừng ngập mặn.', descriptionEn: 'Departure point for boat journey to midshore sandbanks to observe migratory birds and mangrove forests.', order: 0, latitude: 20.2505, longitude: 106.5505 },
      { nameVi: 'Rừng ngập mặn', nameEn: 'Mangrove Forest', descriptionVi: 'Rừng ngập mặn tự nhiên rộng lớn — môi trường sống lý tưởng của hàng trăm loài sinh vật biển và chim nước.', descriptionEn: 'Vast natural mangrove forest — ideal habitat for hundreds of marine species and water birds.', order: 1, latitude: 20.2495, longitude: 106.5495 },
      { nameVi: 'Cồn Ngạn & điểm quan sát chim', nameEn: 'Con Ngan & Bird Watching Point', descriptionVi: 'Bãi cồn bồi và đài quan sát chim — nơi tốt nhất để chiêm ngưỡng các đàn chim hàng nghìn con bay lượn.', descriptionEn: 'Alluvial sandbank and bird observation tower — the best place to watch flocks of thousands of birds in flight.', order: 2, latitude: 20.2488, longitude: 106.5488 },
    ],
  },
]

// ─── Seed function ─────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Bắt đầu seed 15 địa điểm Ninh Bình...\n')
  let created = 0
  let skipped = 0

  for (const loc of LOCATIONS) {
    const exists = await prisma.location.findUnique({ where: { slug: loc.slug } })

    if (exists) {
      console.log(`⏭  Bỏ qua (đã có): ${loc.nameVi}`)
      skipped++
      continue
    }

    const { spots, ...locationData } = loc

    const location = await prisma.location.create({ data: locationData })

    for (const spot of spots) {
      await prisma.locationSpot.create({
        data: { locationId: location.id, ...spot },
      })
    }

    console.log(`✅ Đã tạo: ${loc.nameVi} (${spots.length} điểm con)`)
    created++
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`✅ Tạo mới: ${created} địa điểm`)
  console.log(`⏭  Bỏ qua:  ${skipped} địa điểm (đã tồn tại)`)
  console.log(`═══════════════════════════════════════`)
  console.log(`\nBước tiếp theo:`)
  console.log(`  → Vào admin để upload ảnh và audio cho từng địa điểm`)
  console.log(`  → Gán các địa điểm mới vào package phù hợp`)
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
