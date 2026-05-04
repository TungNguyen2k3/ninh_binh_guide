<template>
  <div class="pb-24">
    <div class="px-4 pt-4 pb-2">
      <h1 class="text-xl font-bold text-gray-900">{{ $t('explore.tours_title') }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ $t('explore.tours_subtitle') }}</p>
    </div>

    <!-- Tour cards -->
    <div class="px-4 space-y-4 mt-2">
      <div
        v-for="tour in tours"
        :key="tour.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-gray-900 text-sm">{{ tour.name }}</h2>
            <p class="text-xs text-gray-500 mt-0.5">{{ tour.duration }} · {{ tour.stops.length }} địa điểm</p>
          </div>
          <span class="text-xs font-medium px-2.5 py-1 rounded-full" :class="tour.badgeClass">
            {{ tour.badge }}
          </span>
        </div>

        <!-- Stops -->
        <div class="divide-y divide-gray-50">
          <div
            v-for="(stop, idx) in tour.stops"
            :key="idx"
            class="flex items-start gap-3 px-4 py-3"
          >
            <!-- Timeline dot -->
            <div class="flex flex-col items-center flex-shrink-0 pt-0.5">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                :class="stop.type === 'main' ? 'bg-brand-600' : 'bg-gray-400'">
                {{ idx + 1 }}
              </div>
              <div v-if="idx < tour.stops.length - 1" class="w-px h-6 bg-gray-200 mt-1" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pb-1">
              <div class="flex items-center justify-between gap-2">
                <p class="font-medium text-gray-900 text-sm leading-tight">{{ stop.name }}</p>
                <span class="text-xs text-gray-400 flex-shrink-0">{{ stop.time }}</span>
              </div>
              <p v-if="stop.note" class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ stop.note }}</p>
              <div class="flex gap-1.5 mt-1.5">
                <span v-if="stop.duration" class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  ⏱ {{ stop.duration }}
                </span>
                <span v-if="stop.hasAudio" class="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full">
                  🎧 Audio
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer note -->
        <div v-if="tour.note" class="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
          <p class="text-xs text-amber-700">💡 {{ tour.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
useHead({ title: () => t('explore.tours_title') })

interface TourStop {
  name: string
  time: string
  duration?: string
  note?: string
  hasAudio?: boolean
  type: 'main' | 'transit'
}

interface Tour {
  id: string
  name: string
  duration: string
  badge: string
  badgeClass: string
  note?: string
  stops: TourStop[]
}

const tours: Tour[] = [
  {
    id: 'one-day',
    name: 'Ninh Bình trong 1 ngày',
    duration: '1 ngày',
    badge: 'Phổ biến',
    badgeClass: 'bg-brand-100 text-brand-700',
    note: 'Nên thuê xe máy hoặc xe đạp điện để di chuyển linh hoạt giữa các điểm.',
    stops: [
      { name: 'Cố đô Hoa Lư', time: '7:30', duration: '1.5h', hasAudio: true, type: 'main', note: 'Tham quan đền vua Đinh, vua Lê và leo núi Mã Yên ngắm toàn cảnh.' },
      { name: 'Tam Cốc – Bích Động', time: '9:30', duration: '2.5h', hasAudio: true, type: 'main', note: 'Đi thuyền nan qua 3 hang động và leo lên chùa Bích Động 3 tầng.' },
      { name: 'Nghỉ trưa tại Ninh Bình', time: '12:30', duration: '1h', type: 'transit', note: 'Thưởng thức cơm cháy đặc sản — món ngon nổi tiếng nhất Ninh Bình.' },
      { name: 'Hang Múa', time: '14:00', duration: '1.5h', hasAudio: true, type: 'main', note: 'Leo 500 bậc đá lên đỉnh ngắm toàn cảnh đồng lúa và Tràng An.' },
      { name: 'Tràng An', time: '16:00', duration: '2.5h', hasAudio: true, type: 'main', note: 'Hành trình thuyền xuyên hang động hoàng hôn — đẹp nhất trong ngày.' },
    ],
  },
  {
    id: 'two-day',
    name: 'Ninh Bình & vùng lân cận 2 ngày',
    duration: '2 ngày 1 đêm',
    badge: 'Đầy đủ nhất',
    badgeClass: 'bg-green-100 text-green-700',
    note: 'Lưu trú tại thị xã Ninh Bình hoặc gần Tam Cốc để thuận tiện di chuyển.',
    stops: [
      { name: '📅 NGÀY 1', time: '', type: 'transit' },
      { name: 'Tràng An', time: '7:30', duration: '3h', hasAudio: true, type: 'main', note: 'Tuyến thuyền dài nhất qua 9 hang và các đền thờ trong rừng già.' },
      { name: 'Chùa Bái Đính', time: '11:30', duration: '2.5h', hasAudio: true, type: 'main', note: 'Quần thể chùa lớn nhất Đông Nam Á — hành lang 500 La Hán, tháp chuông 36 tấn.' },
      { name: 'Cố đô Hoa Lư', time: '14:30', duration: '1.5h', hasAudio: true, type: 'main', note: 'Kinh đô đầu tiên của Việt Nam — 2 ngôi đền và leo núi Mã Yên.' },
      { name: '📅 NGÀY 2', time: '', type: 'transit' },
      { name: 'Đầm Vân Long', time: '7:00', duration: '2h', hasAudio: true, type: 'main', note: 'Đi thuyền sáng sớm — thời điểm tốt nhất để gặp voọc mông trắng.' },
      { name: 'Tam Cốc – Bích Động', time: '10:00', duration: '2.5h', hasAudio: true, type: 'main', note: 'Thuyền nan qua đồng lúa và hang Cả, leo chùa Bích Động 3 tầng.' },
      { name: 'Hang Múa', time: '13:30', duration: '1.5h', hasAudio: true, type: 'main', note: 'Leo 500 bậc — panorama toàn cảnh Ninh Bình từ đỉnh núi.' },
    ],
  },
  {
    id: 'spiritual',
    name: 'Hành trình tâm linh Ninh Bình',
    duration: '1–2 ngày',
    badge: 'Tâm linh',
    badgeClass: 'bg-purple-100 text-purple-700',
    note: 'Mang trang phục lịch sự khi vào chùa và nhà thờ. Giữ yên lặng và tôn trọng không gian thờ tự.',
    stops: [
      { name: 'Chùa Bái Đính', time: '6:30', duration: '3h', hasAudio: true, type: 'main', note: 'Sáng sớm ít người — không khí thiền tịnh nhất trong ngày.' },
      { name: 'Cố đô Hoa Lư', time: '10:00', duration: '1.5h', hasAudio: true, type: 'main', note: 'Dâng hương tại đền vua Đinh và vua Lê — cội nguồn lịch sử dân tộc.' },
      { name: 'Chùa Địa Tạng Phi Lai', time: '12:30', duration: '1.5h', type: 'main', note: 'Ngôi chùa thiền tịnh yên lặng nhất vùng — không gian tu tâm lý tưởng.' },
      { name: 'Nhà thờ Đá Phát Diệm', time: '14:30', duration: '1h', hasAudio: true, type: 'main', note: 'Kiến trúc Công giáo – Á Đông độc nhất vô nhị xây bằng đá từ năm 1875.' },
      { name: 'Chùa Bà Đanh', time: '16:00', duration: '1h', type: 'main', note: 'Ngôi chùa "vắng nhất Việt Nam" trong rừng lim ngàn năm — không gian hoàn toàn tĩnh lặng.' },
    ],
  },
  {
    id: 'nature',
    name: 'Thiên nhiên hoang sơ Ninh Bình',
    duration: '2 ngày',
    badge: 'Thiên nhiên',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    note: 'Mang giày trekking, kem chống nắng và bình nước. Khởi hành sáng sớm để tránh nóng.',
    stops: [
      { name: '📅 NGÀY 1', time: '', type: 'transit' },
      { name: 'Đầm Vân Long', time: '6:30', duration: '2h', hasAudio: true, type: 'main', note: 'Quan sát voọc mông trắng và chim nước khi bình minh lên — khoảnh khắc hiếm có.' },
      { name: 'Vườn chim Thung Nham', time: '9:30', duration: '2h', type: 'main', note: 'Hành trình thuyền qua vườn chim hàng nghìn cá thể và hang động bí ẩn.' },
      { name: 'Tràng An', time: '14:00', duration: '3h', hasAudio: true, type: 'main', note: 'Di sản UNESCO — thuyền xuyên hang trong rừng nguyên sinh chiều tà.' },
      { name: '📅 NGÀY 2', time: '', type: 'transit' },
      { name: 'Vườn quốc gia Cúc Phương', time: '7:00', duration: '4h', type: 'main', note: 'Trung tâm cứu hộ linh trưởng, hang Con Moong tiền sử và tuyến trekking rừng.' },
      { name: 'Vườn quốc gia Xuân Thủy', time: '13:00', duration: '3h', type: 'main', note: 'Khu Ramsar đầu tiên Đông Nam Á — mùa đông có hàng trăm loài chim di cư Siberia.' },
    ],
  },
]
</script>
