<template>
  <div class="pb-24">
    <div class="px-4 pt-4 pb-2">
      <h1 class="text-xl font-bold text-gray-900">{{ $t('explore.tours_title') }}</h1>
      <p class="text-sm text-gray-500 mt-1">{{ $t('explore.tours_subtitle') }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="px-4 space-y-4 mt-2">
      <div v-for="i in 2" :key="i" class="h-40 bg-gray-100 rounded-2xl animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="tours.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="text-5xl mb-3">🗺️</div>
      <p class="text-sm text-gray-500">Chưa có lịch trình nào</p>
    </div>

    <!-- Tour cards -->
    <div v-else class="px-4 space-y-4 mt-2">
      <div
        v-for="tour in tours"
        :key="tour.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-gray-900 text-sm">{{ locale === 'vi' ? tour.nameVi : tour.nameEn }}</h2>
            <p class="text-xs text-gray-500 mt-0.5">{{ tour.duration }} · {{ tour.stops.length }} địa điểm</p>
          </div>
          <span v-if="tour.badgeVi || tour.badgeEn"
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-100 text-brand-700">
            {{ locale === 'vi' ? tour.badgeVi : tour.badgeEn }}
          </span>
        </div>

        <!-- Stops -->
        <div class="divide-y divide-gray-50">
          <div
            v-for="(stop, idx) in sortedStops(tour.stops)"
            :key="stop.id"
            class="flex items-start gap-3 px-4 py-3"
          >
            <!-- Timeline dot -->
            <div class="flex flex-col items-center flex-shrink-0 pt-0.5">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-brand-600">
                {{ idx + 1 }}
              </div>
              <div v-if="idx < tour.stops.length - 1" class="w-px h-6 bg-gray-200 mt-1" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pb-1">
              <div class="flex items-center justify-between gap-2">
                <p class="font-medium text-gray-900 text-sm leading-tight">
                  {{ locale === 'vi' ? stop.location.nameVi : stop.location.nameEn }}
                </p>
                <span v-if="stop.suggestedTime" class="text-xs text-gray-400 flex-shrink-0">{{ stop.suggestedTime }}</span>
              </div>
              <p v-if="locale === 'vi' ? stop.noteVi : stop.noteEn"
                class="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {{ locale === 'vi' ? stop.noteVi : stop.noteEn }}
              </p>
              <div class="flex gap-1.5 mt-1.5">
                <span v-if="stop.suggestedDuration" class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  ⏱ {{ stop.suggestedDuration }}
                </span>
                <span v-if="stop.location.audioViUrl || stop.location.audioEnUrl"
                  class="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full">
                  🎧 Audio
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer note -->
        <div v-if="locale === 'vi' ? tour.noteVi : tour.noteEn"
          class="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
          <p class="text-xs text-amber-700">💡 {{ locale === 'vi' ? tour.noteVi : tour.noteEn }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour, TourStop } from '~/stores/tour.store'

definePageMeta({ layout: 'default' })
const { t, locale } = useI18n()
useHead({ title: () => t('explore.tours_title') })

const tours = ref<Tour[]>([])
const isLoading = ref(false)

function sortedStops(stops: TourStop[]): TourStop[] {
  return [...stops].sort((a, b) => a.order - b.order)
}

onMounted(async () => {
  isLoading.value = true
  try {
    const { apiFetch } = useApiFetch()
    const res = await apiFetch<{ success: true; data: Tour[] }>('/tours')
    tours.value = res.data
  } catch {
    // If no tours yet or API error, show empty state
    tours.value = []
  } finally {
    isLoading.value = false
  }
})
</script>
