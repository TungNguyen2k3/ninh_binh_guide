<template>
  <div class="pb-24">
    <!-- Loading -->
    <div v-if="tourStore.isLoading" class="p-4 space-y-4">
      <div class="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
      <div class="h-44 bg-gray-200 rounded-2xl animate-pulse" />
      <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="tour">
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 pt-4 pb-2">
        <button type="button"
          class="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-600 flex-shrink-0"
          @click="navigateTo('/explore/tours')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ locale === 'vi' ? tour.nameVi : tour.nameEn }}</h1>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-gray-500">🕐 {{ tour.duration }}</span>
            <span class="text-xs text-gray-500">· 📍 {{ tour.stops.length }} điểm</span>
            <span v-if="badge" class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
              {{ badge }}
            </span>
          </div>
        </div>
      </div>

      <!-- Mini map -->
      <div class="mx-4 mb-3">
        <ClientOnly>
          <ExploreToursMap :stops="sortedStops" class="h-44 rounded-2xl overflow-hidden border border-gray-200 shadow-sm" />
          <template #fallback>
            <div class="h-44 rounded-2xl bg-gray-100 flex items-center justify-center text-sm text-gray-400 border border-gray-200">
              {{ $t('common.loading') }}
            </div>
          </template>
        </ClientOnly>
        <!-- Open full map button -->
        <button type="button"
          class="mt-2 w-full py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors flex items-center justify-center gap-2"
          @click="navigateTo(`/explore?tour=${tour.id}`)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Mở bản đồ đầy đủ
        </button>
      </div>

      <!-- Timeline -->
      <div class="px-4 space-y-0">
        <div
          v-for="(stop, idx) in sortedStops"
          :key="stop.id"
          class="flex items-start gap-3"
        >
          <!-- Timeline column -->
          <div class="flex flex-col items-center flex-shrink-0 pt-0.5">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-brand-600 shadow-sm">
              {{ idx + 1 }}
            </div>
            <div v-if="idx < sortedStops.length - 1" class="w-px flex-1 bg-gray-200 my-1 min-h-[20px]" />
          </div>

          <!-- Stop content -->
          <div class="flex-1 pb-4 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-gray-900 text-sm leading-tight">
                  {{ locale === 'vi' ? stop.location.nameVi : stop.location.nameEn }}
                </p>
                <p v-if="stopNote(stop)" class="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {{ stopNote(stop) }}
                </p>
              </div>
              <span v-if="stop.suggestedTime" class="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                {{ stop.suggestedTime }}
              </span>
            </div>
            <!-- Chips -->
            <div class="flex gap-1.5 mt-1.5 flex-wrap">
              <span v-if="stop.suggestedDuration"
                class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                ⏱ {{ stop.suggestedDuration }}
              </span>
              <span v-if="stop.location.audioViUrl || stop.location.audioEnUrl"
                class="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full">
                🎧 Audio
              </span>
            </div>
            <!-- Navigate to location detail -->
            <button type="button"
              class="mt-1.5 text-[11px] text-brand-600 hover:underline"
              @click="navigateTo(`/explore/${stop.location.slug}`)">
              Xem chi tiết →
            </button>
          </div>
        </div>
      </div>

      <!-- Tour note -->
      <div v-if="note" class="mx-4 mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
        <p class="text-xs text-amber-700">💡 {{ note }}</p>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="text-5xl mb-3">🗺️</div>
      <p class="text-sm text-gray-500">Không tìm thấy lịch trình</p>
      <button type="button" class="mt-4 text-brand-600 text-sm" @click="navigateTo('/explore/tours')">
        ← Quay lại
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TourStop } from '~/stores/tour.store'

definePageMeta({ layout: 'default' })
const route = useRoute()
const { locale } = useI18n()
const tourStore = useTourStore()

const tour = computed(() => tourStore.touristTour)
const sortedStops = computed(() => [...(tour.value?.stops ?? [])].sort((a, b) => a.order - b.order))
const badge = computed(() => locale.value === 'vi' ? tour.value?.badgeVi : tour.value?.badgeEn)
const note = computed(() => locale.value === 'vi' ? tour.value?.noteVi : tour.value?.noteEn)

function stopNote(stop: TourStop) {
  return locale.value === 'vi' ? stop.noteVi : stop.noteEn
}

useHead({ title: () => tour.value ? (locale.value === 'vi' ? tour.value.nameVi : tour.value.nameEn) : 'Tour' })

onMounted(async () => {
  await tourStore.fetchTouristTour(route.params.id as string)
})
</script>
