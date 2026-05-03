"""
Tạo file MP3 audio từ nội dung thuyết minh cho 5 địa điểm Ninh Bình.
Yêu cầu: pip install gTTS
Chạy:   python generate_audio.py
Output: thư mục audio/ với cấu trúc location/spot_vi.mp3, spot_en.mp3
"""

from gtts import gTTS
from pathlib import Path

# ──────────────────────────────────────────────────────────────────────────────
# DỮ LIỆU AUDIO
# ──────────────────────────────────────────────────────────────────────────────
LOCATIONS = [
    {
        "folder": "01_trang_an",
        "main": {
            "vi": "Kính chào quý khách đến với Tràng An — quần thể danh thắng được UNESCO công nhận là Di sản Thế giới kép, là niềm tự hào của tỉnh Ninh Bình và của Việt Nam. Trải rộng hơn mười hai nghìn héc-ta, Tràng An là sự giao hòa tuyệt vời giữa thiên nhiên kỳ bí và lịch sử ngàn năm. Quý khách sẽ được ngồi trên những chiếc thuyền nan nhỏ, lướt qua những hồ nước trong xanh, xuyên qua các hang động hùng vĩ, và đặt chân đến những ngôi đền cổ kính ẩn mình trong rừng già. Đây là chuyến hành trình vừa thư giãn tâm hồn, vừa lắng nghe tiếng thì thầm của lịch sử hàng vạn năm.",
            "en": "Welcome to Trang An — a UNESCO Mixed World Heritage Site and the pride of Ninh Binh province. Spanning over twelve thousand hectares, Trang An is a breathtaking harmony of mystical nature and thousand-year history. Guests travel on small bamboo rowboats, gliding across crystal-clear lakes, passing through magnificent cave passages, and arriving at ancient temples nestled within primeval forests. This is a journey that relaxes the soul and lets you hear the whispers of history spanning tens of thousands of years.",
        },
        "spots": [
            {
                "name": "ben_thuyen",
                "vi": "Quý khách đang đứng tại bến thuyền Tràng An — nơi bắt đầu cuộc hành trình khám phá Di sản Thế giới. Trước mặt quý khách là mặt hồ phẳng lặng như gương, xung quanh là những dãy núi đá vôi dựng đứng phủ đầy cây xanh. Các thuyền nan truyền thống sẽ đưa quý khách theo ba tuyến chính: tuyến một qua đền Trần và hang Cả; tuyến hai qua đền Suối Tiên; và tuyến ba dài nhất, khám phá toàn bộ khu vực phía nam. Người chèo thuyền bằng tay và chân — một kỹ năng độc đáo mà chỉ Tràng An mới có.",
                "en": "You are now at the Trang An boat dock — the starting point of your World Heritage journey. Before you lies a mirror-flat lake surrounded by towering limestone cliffs draped in lush vegetation. Traditional bamboo rowboats will take you along three main routes: route one passes Tran Temple and Hang Ca cave; route two passes Suoi Tien Temple; and the longest route three explores the entire southern area. The boatmen row using both their hands and feet — a unique skill found only here at Trang An.",
            },
            {
                "name": "hang_ca",
                "vi": "Quý khách đang tiến vào Hang Cả — hang động lớn nhất Tràng An. Trần hang cao đến hai mươi lăm mét, rộng mênh mông, với hàng nghìn nhũ đá treo lơ lửng như những chiếc đèn lồng tự nhiên. Ánh sáng lọc qua khe núi tạo nên những tia sáng vàng óng huyền diệu. Khi thuyền đi qua, tiếng nước nhỏ giọt từ trần hang và tiếng mái chèo khua nước tạo nên bản nhạc thiên nhiên độc đáo. Trong hang còn có nhiều hình thù nhũ đá kỳ lạ — quý khách hãy thử tưởng tượng xem mỗi nhũ đá trông giống vật gì nhé.",
                "en": "You are now entering Hang Ca — the largest cave in Trang An. The ceiling soars twenty-five meters high, vast and wide, with thousands of stalactites hanging like natural lanterns. Light filtering through mountain crevices creates magical golden rays. As the boat passes through, the sound of water dripping from the ceiling and paddles striking the water create a unique natural symphony. The cave also features many strangely shaped rock formations — try imagining what each stalactite resembles.",
            },
            {
                "name": "den_tran",
                "vi": "Đây là Đền Trần — một trong những di tích tâm linh quan trọng nhất trong quần thể Tràng An. Ngôi đền được xây dựng để thờ phụng các vị vua triều Trần — vương triều đã ba lần đánh bại quân Nguyên Mông xâm lược. Khung cảnh nơi đây thật linh thiêng: đền nằm trong rừng già cổ thụ, xung quanh là núi non bao bọc, tiếng chim hót và mùi hương trầm quyện vào nhau. Quý khách có thể dâng hương bày tỏ lòng thành kính với các bậc tiền nhân đã có công dựng nước và giữ nước.",
                "en": "This is Tran Temple — one of the most important spiritual sites within the Trang An complex. The temple was built to honor the kings of the Tran dynasty — the royal line that defeated the Mongol invaders three times. The atmosphere here is profoundly sacred: the temple sits within ancient forest, surrounded by protective mountains, where birdsong and incense fragrance blend together. Visitors may offer incense to pay respect to the ancestors who built and defended the nation.",
            },
            {
                "name": "hang_toi",
                "vi": "Quý khách chuẩn bị bước vào Hang Tối — nơi mà ánh sáng hoàn toàn vắng mặt trong suốt quãng đường chín mươi mét. Đây là trải nghiệm độc đáo nhất trong hành trình Tràng An. Trong bóng tối hoàn toàn, quý khách sẽ cảm nhận được sự huyền bí của hang động theo một cách hoàn toàn khác — qua âm thanh, qua làn gió mát từ trong hang thoảng ra, và qua cảm giác kỳ diệu khi ngồi trên mặt nước trong lòng núi. Xin đừng lo lắng — người chèo thuyền đã quen với hành trình này và sẽ đưa quý khách qua an toàn.",
                "en": "You are about to enter Hang Toi — where light is completely absent for the entire ninety-meter passage. This is the most unique experience in the Trang An journey. In total darkness, you will perceive the cave's mystery in a completely different way — through sound, through the cool breeze drifting from inside the cave, and through the magical sensation of floating on water within a mountain. Please don't worry — your boatman knows this route well and will guide you through safely.",
            },
        ],
    },
    {
        "folder": "02_tam_coc_bich_dong",
        "main": {
            "vi": "Kính chào quý khách đến với Tam Cốc – Bích Động, danh thắng được mệnh danh là Hạ Long trên cạn của Ninh Bình. Hành trình hôm nay sẽ đưa quý khách trên những chiếc thuyền nan theo dòng sông Ngô Đồng uốn lượn, xuyên qua ba hang động núi đá vôi kỳ vĩ. Hai bên bờ sông, những cánh đồng lúa xanh tươi trải dài vô tận dưới nền trời xanh trong và những ngọn núi đá vôi dựng đứng — một bức tranh thiên nhiên sống động mà hiếm nơi nào trên thế giới có được. Sau hành trình thuyền, quý khách sẽ leo núi thăm quần thể chùa Bích Động nghìn tuổi, nơi ba tầng chùa được xây khéo léo trong lòng núi đá.",
            "en": "Welcome to Tam Coc – Bich Dong, the landscape known as Ninh Binh's Halong Bay on land. Today's journey takes you on bamboo rowboats along the winding Ngo Dong River, passing through three magnificent limestone cave passages. Along both riverbanks, endless green rice paddies stretch beneath clear blue skies and towering limestone peaks — a living painting rarely found anywhere else in the world. After the boat journey, you will climb to visit the thousand-year-old Bich Dong Pagoda complex, where three levels of pagodas are cleverly built into the limestone mountainside.",
        },
        "spots": [
            {
                "name": "ben_thuyen",
                "vi": "Quý khách đang ở bến thuyền Tam Cốc. Từ đây, hành trình thuyền nan dài khoảng hai tiếng sẽ đưa quý khách vào lòng sông Ngô Đồng thơ mộng. Người chèo thuyền nơi đây phần lớn là phụ nữ trong làng — họ vừa chèo bằng tay vừa chèo bằng chân, vừa chèo vừa giới thiệu cảnh đẹp hai bên. Xin quý khách không mua hàng rong trên thuyền để tránh làm phiền chuyến đi.",
                "en": "You are now at Tam Coc boat dock. From here, a two-hour rowboat journey will take you along the romantic Ngo Dong River. Most boatmen here are women from the village — they row using both hands and feet, pointing out scenic highlights along the way. Please kindly refrain from purchasing from boat vendors to avoid disturbing your journey.",
            },
            {
                "name": "hang_ca_tam_coc",
                "vi": "Đây là Hang Cả — hang đầu tiên trong hành trình Tam Cốc và cũng là hang dài nhất, kéo dài hơn 127 mét. Trên trần hang, hàng trăm nhũ đá rủ xuống như những ngón tay đá thần kỳ. Ánh sáng từ hai đầu hang hòa quyện tạo nên hiệu ứng ánh sáng lung linh, phản chiếu trên mặt nước. Quý khách hãy nhìn lên trần hang — nhiều nhũ đá có hình thù thú vị như rồng, phượng, hay gương mặt người.",
                "en": "This is Hang Ca — the first cave in the Tam Coc journey and also the longest, stretching over 127 meters. On the ceiling, hundreds of stalactites hang down like miraculous stone fingers. Light from both cave entrances blends to create shimmering light effects reflecting on the water surface. Look up at the ceiling — many stalactites have interesting shapes resembling dragons, phoenixes, or human faces.",
            },
            {
                "name": "hang_hai_ba",
                "vi": "Chúng ta vừa qua Hang Hai và sắp đến Hang Ba — điểm cuối cùng của hành trình. Đây là lúc quý khách có thể nhìn ngắm trọn vẹn nhất cảnh đồng lúa Ninh Bình từ trên thuyền. Những cánh đồng bằng phẳng trải rộng, những người nông dân làm việc, và những đàn chim bay lượn phía xa — tất cả tạo nên một bức tranh thôn quê Việt Nam trong sáng, bình yên đến lạ thường.",
                "en": "We have just passed Hang Hai and are approaching Hang Ba — the final destination of our journey. This is the perfect moment to take in the full panorama of Ninh Binh's rice paddies from the boat. Flat fields stretch wide, farmers work the land, and birds soar in the distance — all creating a wonderfully clear and peaceful portrait of Vietnamese countryside life.",
            },
            {
                "name": "chua_bich_dong",
                "vi": "Chào mừng quý khách đến với chùa Bích Động — một trong những ngôi chùa cổ đẹp nhất miền Bắc Việt Nam. Chùa được xây dựng vào năm 1428, gồm ba tầng ẩn mình khéo léo trong lòng núi đá vôi. Tầng dưới là không gian thờ tự chính. Từ tầng trung, quý khách bước vào hang động và chiêm ngưỡng nhũ đá tự nhiên kết hợp với tượng Phật uy nghiêm. Và từ đỉnh chùa Thượng, toàn cảnh thung lũng Tam Cốc và dòng sông uốn lượn hiện ra trước mắt — đây chính là phần thưởng xứng đáng cho quý khách sau hành trình leo lên.",
                "en": "Welcome to Bich Dong Pagoda — one of the most beautiful ancient pagodas in northern Vietnam. Built in 1428, the pagoda comprises three levels cleverly nestled within the limestone mountainside. The lower level houses the main worship hall. From the middle level, visitors enter a natural cave chamber where stalactites frame majestic Buddha statues. And from the upper pagoda summit, the full panorama of the Tam Coc valley and winding river unfolds before you — a worthy reward after your climb.",
            },
        ],
    },
    {
        "folder": "03_co_do_hoa_lu",
        "main": {
            "vi": "Kính chào quý khách đến với Cố đô Hoa Lư — cái nôi lịch sử của nhà nước phong kiến Việt Nam thống nhất. Hơn một nghìn năm trước, chính trên mảnh đất này, vua Đinh Tiên Hoàng đã lập nên nhà nước Đại Cồ Việt — nhà nước phong kiến độc lập đầu tiên sau một nghìn năm Bắc thuộc. Đây không chỉ là điểm du lịch — đây là điểm xuất phát của lịch sử dân tộc Việt Nam. Quý khách sẽ bước vào hai ngôi đền thờ hai vị vua khai quốc, cảm nhận không khí linh thiêng và tự hào dân tộc ngàn đời.",
            "en": "Welcome to Hoa Lu Ancient Capital — the historic cradle of unified feudal Vietnam. Over a thousand years ago, on this very land, King Dinh Tien Hoang established the Dai Co Viet state — the first independent feudal state after a thousand years of Chinese domination. This is not merely a tourist site — it is the very starting point of Vietnamese national history. You will enter two temples honoring the two founding kings, feeling the sacred atmosphere and millennia of national pride.",
        },
        "spots": [
            {
                "name": "den_dinh_tien_hoang",
                "vi": "Trước mặt quý khách là Đền vua Đinh Tiên Hoàng — người anh hùng dẹp loạn, thống nhất non sông. Sinh năm 924, Đinh Bộ Lĩnh xuất thân từ chính vùng đất Hoa Lư này. Ngay từ thuở ấu thơ, ông đã bộc lộ tài năng lãnh đạo khi dẫn đám trẻ chăn trâu chơi trận giả giữa đồng. Năm 968, ông hoàn thành sự nghiệp thống nhất, xưng Hoàng đế, lập nên nhà nước Đại Cồ Việt và đặt niên hiệu Thái Bình. Pho tượng đồng trong đền được đúc từ thế kỷ 17, thể hiện hình ảnh một vị vua oai nghiêm, ngồi trên ngai vàng trong tư thế thiết triều.",
                "en": "Before you stands the Temple of King Dinh Tien Hoang — the hero who unified Vietnam. Born in 924 AD, Dinh Bo Linh came from this very Hoa Lu land. Even as a child, he displayed leadership talent, leading the village boys in mock battles among the rice fields. In 968 AD, he completed his unification mission, proclaimed himself Emperor, established the Dai Co Viet state and adopted the reign name Thai Binh. The bronze statue within the temple, cast in the 17th century, depicts a dignified king seated upon his throne in the posture of holding court.",
            },
            {
                "name": "den_le_dai_hanh",
                "vi": "Đền vua Lê Đại Hành thờ vị hoàng đế thứ hai của nước Đại Cồ Việt. Lê Hoàn lên ngôi năm 980, lấy hiệu Lê Đại Hành. Năm 981, ông đã chỉ huy quân dân Đại Cồ Việt đánh tan quân Tống xâm lược tại sông Bạch Đằng và Chi Lăng — một trong những chiến thắng vĩ đại nhất lịch sử chống ngoại xâm của dân tộc. Kiến trúc ngôi đền mang phong cách cuối thế kỷ 17, với những bức chạm khắc tinh xảo tả cảnh rồng phượng và hoa văn truyền thống.",
                "en": "The Le Dai Hanh Temple honors the second emperor of Dai Co Viet. Le Hoan ascended the throne in 980 AD, taking the name King Le Dai Hanh. In 981 AD, he led the people to defeat the invading Song Chinese army at Bach Dang River and Chi Lang Pass — one of the greatest victories in Vietnamese history against foreign invasion. The temple architecture follows late 17th-century style, featuring exquisite carvings of dragons, phoenixes and traditional motifs.",
            },
            {
                "name": "nui_ma_yen",
                "vi": "Núi Mã Yên trước mặt quý khách có hình dáng như một yên ngựa — đó là lý do tên gọi Mã Yên — ngựa và yên. Trên đỉnh núi là lăng mộ của vua Đinh Tiên Hoàng. Hành trình leo 167 bậc đá tuy có chút vất vả, nhưng phần thưởng chờ quý khách ở trên đỉnh là cực kỳ xứng đáng: toàn cảnh kinh thành Hoa Lư xưa, những cánh đồng xanh bát ngát, và những dãy núi đá vôi bao bọc xung quanh tạo thành bức tường thành thiên nhiên vĩ đại. Đây cũng là nơi tốt nhất để cảm nhận tầm nhìn chiến lược của vị vua khai quốc khi chọn Hoa Lư làm kinh đô.",
                "en": "Mount Ma Yen before you is shaped like a horse saddle — which is the meaning behind its name: Ma for horse, Yen for saddle. At the mountain's summit lies the tomb of King Dinh Tien Hoang. The climb of 167 stone steps may require some effort, but the reward awaiting you at the top is absolutely worthwhile: a panoramic view of the ancient Hoa Lu capital, vast green rice paddies, and the limestone mountains encircling all sides forming a magnificent natural fortress wall. This is also the best place to appreciate the strategic vision of the founding king when he chose Hoa Lu as his capital.",
            },
        ],
    },
    {
        "folder": "04_chua_bai_dinh",
        "main": {
            "vi": "Kính chào quý khách đến với chùa Bái Đính — quần thể Phật giáo lớn nhất Đông Nam Á. Trải rộng trên hơn năm trăm héc-ta giữa núi rừng Ninh Bình, Bái Đính là biểu tượng của niềm tin tôn giáo và sự tài hoa kiến trúc của người Việt. Nơi đây không chỉ là chốn lễ bái tâm linh mà còn là công trình nghệ thuật phi thường: hàng trăm tượng La Hán đá xanh, quả chuông đồng khổng lồ, những mái vàng lấp lánh giữa xanh núi non. Dù quý khách đến với lòng thành kính tâm linh hay đơn thuần là khám phá kiến trúc, Bái Đính chắc chắn sẽ để lại ấn tượng sâu sắc.",
            "en": "Welcome to Bai Dinh Pagoda — the largest Buddhist complex in Southeast Asia. Spanning over five hundred hectares amid Ninh Binh's mountains and forests, Bai Dinh stands as a symbol of religious faith and Vietnamese architectural genius. This place is not merely a spiritual pilgrimage site but an extraordinary work of art: hundreds of blue-stone Arhat statues, a colossal bronze bell, golden rooftops glittering among mountain greenery. Whether you come with spiritual devotion or simply architectural curiosity, Bai Dinh will certainly leave a profound impression.",
        },
        "spots": [
            {
                "name": "tam_quan",
                "vi": "Cổng tam quan Bái Đính sừng sững trước mặt quý khách, cao mười sáu mét, được xây dựng theo kiến trúc Phật giáo truyền thống nhưng với quy mô khổng lồ. Ba tầng cổng tượng trưng cho Tam Bảo: Phật, Pháp và Tăng. Từ đây, quý khách có thể lựa chọn đi xe điện hoặc đi bộ lên khu chùa chính. Quãng đường đi bộ tuy dài nhưng sẽ giúp quý khách cảm nhận trọn vẹn sự hoành tráng của quần thể và chiêm ngưỡng cảnh quan núi non xung quanh.",
                "en": "The Bai Dinh triple gate stands majestically before you, sixteen meters tall, built in traditional Buddhist architectural style but at an enormous scale. The three gate levels symbolize the Three Jewels: Buddha, Dharma and Sangha. From here, you may choose to take an electric cart or walk up to the main pagoda area. The walking path, while long, allows you to fully appreciate the grandeur of the complex and enjoy the surrounding mountain scenery.",
            },
            {
                "name": "hanh_lang_la_han",
                "vi": "Quý khách đang đi qua hành lang La Hán — một trong những kỳ quan kiến trúc độc đáo nhất của Bái Đính. Năm trăm vị La Hán bằng đá xanh Ninh Bình xếp thành hai hàng dài ba ki-lô-mét. Điều đặc biệt là mỗi vị La Hán có khuôn mặt, dáng ngồi và biểu cảm hoàn toàn khác nhau — phản ánh năm trăm trạng thái tâm hồn của con người. Người ta nói rằng, khi đi dọc hành lang này, hãy chú ý tới vị La Hán nào mà quý khách cảm thấy quen thuộc hoặc giống mình — đó có thể là duyên nghiệp.",
                "en": "You are walking through the Arhat Corridor — one of Bai Dinh's most unique architectural wonders. Five hundred Arhat figures in Ninh Binh blue stone stand in two rows stretching three kilometers. What makes this extraordinary is that each Arhat has a completely different face, posture and expression — reflecting five hundred states of the human soul. It is said that as you walk this corridor, pay attention to which Arhat feels familiar or resembles yourself — that may be your karmic connection.",
            },
            {
                "name": "dien_tam_the_thap_chuong",
                "vi": "Điện Tam Thế trước mặt quý khách là tòa nhà lớn nhất quần thể Bái Đính. Bên trong thờ ba pho tượng Phật đồng khổng lồ tượng trưng cho ba thời: quá khứ, hiện tại và tương lai — nhắc nhở về sự vô thường và liên tục của vũ trụ. Cạnh bên là Tháp Chuông bốn tầng, trong đó treo quả chuông đồng nặng ba mươi sáu tấn — quả chuông đồng lớn nhất Việt Nam. Tiếng chuông ngân vang trong thung lũng Bái Đính có thể nghe từ xa hàng chục ki-lô-mét.",
                "en": "Tam The Hall before you is the largest building in the Bai Dinh complex. Inside, three massive bronze Buddha statues represent the three periods of time: past, present and future — a reminder of the impermanence and continuity of the universe. Adjacent stands the four-story Bell Tower, housing a bronze bell weighing thirty-six tons — the largest bronze bell in Vietnam. The bell's resonance echoing through Bai Dinh valley can be heard from dozens of kilometers away.",
            },
            {
                "name": "chua_bai_dinh_co",
                "vi": "Ít du khách biết rằng ngay phía sau khu chùa mới hoành tráng còn có một ngôi chùa cổ hơn một nghìn năm tuổi — đó là Chùa Bái Đính Cổ. Nằm trong hang đá tự nhiên trên đỉnh núi, ngôi chùa này được xây dựng từ thời vua Đinh và là nơi Thiền sư Nguyễn Minh Không từng tu hành và tìm được xá lợi Phật trong chiếc giếng ngọc linh thiêng. Để lên đây phải leo ba trăm bậc đá, nhưng không gian tâm linh nơi đây có chiều sâu và sự tĩnh lặng mà khu chùa mới không có. Đây mới thực sự là Bái Đính nguyên thủy.",
                "en": "Few visitors know that just behind the grand new complex stands a pagoda over a thousand years old — the Ancient Bai Dinh Pagoda. Located within a natural cave at the mountain summit, this pagoda was built during the Dinh dynasty era and is where the Zen master Nguyen Minh Khong once practiced and discovered Buddha relics in a sacred jade well. Reaching here requires climbing three hundred stone steps, but the spiritual depth and silence found here is what the new complex cannot replicate. This is the true original Bai Dinh.",
            },
        ],
    },
    {
        "folder": "05_dam_van_long",
        "main": {
            "vi": "Kính chào quý khách đến với Khu bảo tồn thiên nhiên Vân Long — vùng đất ngập nước lớn nhất và hoang sơ nhất Ninh Bình. Đây không phải điểm du lịch ồn ào — đây là thiên đường của sự tĩnh lặng và thiên nhiên nguyên sơ. Hành trình thuyền nan trên đầm Vân Long sẽ đưa quý khách vào thế giới của những ngọn núi đá vôi soi bóng mặt nước, của tiếng chim hót vang giữa đầm lầy, và nếu may mắn, của những chú voọc mông trắng nhảy nhót trên vách đá — loài linh trưởng quý hiếm nhất thế giới, chỉ còn vài trăm con trong tự nhiên. Xin quý khách giữ yên lặng để tôn trọng thiên nhiên nơi đây.",
            "en": "Welcome to Van Long Nature Reserve — Ninh Binh's largest and most pristine wetland. This is not a bustling tourist attraction — this is a paradise of silence and untouched nature. The rowboat journey across Van Long will take you into a world of limestone peaks reflected in still water, birdsong echoing across the marshland, and if you're fortunate, glimpses of white-bottomed langurs leaping across rock faces — the world's rarest primate, with only a few hundred individuals remaining in the wild. Please keep your voices low to respect the natural environment here.",
        },
        "spots": [
            {
                "name": "ben_thuyen",
                "vi": "Bến thuyền Vân Long nhỏ nhắn và yên tĩnh đến lạ — không có tiếng còi xe, không có âm nhạc ồn ào. Chỉ có tiếng nước vỗ nhẹ vào mạn thuyền và tiếng chim từ xa vọng lại. Đây là điều đầu tiên quý khách cần cảm nhận: Vân Long hoàn toàn khác với Tràng An hay Tam Cốc. Nơi đây là thiên nhiên thật sự, chưa được du lịch hóa hoàn toàn. Người chèo thuyền của quý khách là dân làng Gia Vân — họ sống cùng đầm này từ khi sinh ra, hiểu từng bụi sậy, từng hang đá nơi voọc hay ngủ nghỉ.",
                "en": "Van Long's boat dock is unusually small and quiet — no car horns, no loud music. Only the gentle sound of water against the boat hull and distant birdsong. This is the first thing to notice: Van Long is completely different from Trang An or Tam Coc. This is genuine, not yet fully touristically developed nature. Your boatman is a villager from Gia Van — they have lived alongside this wetland since birth, knowing every reed cluster, every rocky crevice where the langurs sleep.",
            },
            {
                "name": "khu_vooc_mong_trang",
                "vi": "Đây là khu vực quý khách có cơ hội cao nhất để quan sát voọc mông trắng. Loài voọc này chỉ còn khoảng 200 đến 300 cá thể trong tự nhiên trên toàn thế giới, và Vân Long là nơi có quần thể lớn nhất. Chúng có bộ lông đen tuyền đặc biệt với vùng mông và đùi màu trắng rất dễ nhận ra. Voọc mông trắng sống thành đàn từ 3 đến 10 con, ăn lá cây và di chuyển rất nhanh nhẹn trên vách đá. Xin quý khách không gõ vào thuyền hay tạo tiếng ồn lớn — điều đó sẽ làm chúng sợ hãi và bỏ chạy.",
                "en": "This is the area where you have the best chance of observing the white-bottomed langur. This species has only about 200 to 300 individuals remaining in the wild worldwide, and Van Long hosts the largest population. They have distinctive jet-black fur with a clearly recognizable white rump and thigh area. White-bottomed langurs live in groups of 3 to 10, feed on leaves, and move with remarkable agility on rock faces. Please do not tap on the boat or make loud noises — it will frighten them away.",
            },
            {
                "name": "hang_ca_nui_hang",
                "vi": "Hang Cá là điểm độc đáo và ít được biết đến trong hành trình Vân Long. Người dân địa phương từ xa xưa đã truyền nhau rằng cá trong hang này không được bắt — đây là nơi thủy thần trú ngụ. Nhờ tín ngưỡng dân gian này mà đàn cá nơi đây cực kỳ đông đúc và không hề sợ người. Quý khách có thể nhìn rõ hàng trăm con cá bơi lội dưới làn nước trong vắt ngay cạnh thuyền. Trên những vách đá xung quanh, nhiều loài chim làm tổ và ca hát không ngừng — tiếng chim Vân Long là một bản nhạc thiên nhiên tuyệt vời.",
                "en": "Fish Cave is a unique and little-known highlight in the Van Long journey. Local villagers have passed down the tradition that the fish here must not be caught — this is where the water spirit resides. Thanks to this folk belief, the fish population here is extraordinarily abundant and completely unafraid of humans. You can clearly see hundreds of fish swimming in the crystal-clear water right alongside the boat. On the surrounding rock faces, many bird species nest and sing continuously — the birdsong of Van Long is a magnificent natural symphony.",
            },
        ],
    },
]


# ──────────────────────────────────────────────────────────────────────────────
# SINH FILE MP3
# ──────────────────────────────────────────────────────────────────────────────
def generate(text: str, lang: str, path: Path) -> None:
    print(f"  → {path.name}", end=" ", flush=True)
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(str(path))
    size_kb = path.stat().st_size // 1024
    print(f"✓ ({size_kb} KB)")


def main() -> None:
    out_root = Path("audio")
    out_root.mkdir(exist_ok=True)

    total = 0
    for loc in LOCATIONS:
        loc_dir = out_root / loc["folder"]
        loc_dir.mkdir(exist_ok=True)

        print(f"\n📍 {loc['folder']}")

        # Main audio
        generate(loc["main"]["vi"], "vi", loc_dir / "main_vi.mp3")
        generate(loc["main"]["en"], "en", loc_dir / "main_en.mp3")
        total += 2

        # Spots
        for spot in loc["spots"]:
            generate(spot["vi"], "vi", loc_dir / f"{spot['name']}_vi.mp3")
            generate(spot["en"], "en", loc_dir / f"{spot['name']}_en.mp3")
            total += 2

    print(f"\n✅ Hoàn thành! Đã tạo {total} file MP3 trong thư mục: {out_root.resolve()}")
    print("\nCấu trúc thư mục:")
    for p in sorted(out_root.rglob("*.mp3")):
        print(f"  {p}")


if __name__ == "__main__":
    main()
