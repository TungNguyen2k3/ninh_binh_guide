<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <!-- Loading skeleton -->
    <div v-if="touristStore.isLoading" class="flex-1 bg-gray-200 animate-pulse" />

    <!-- Map -->
    <div v-else class="flex-1 relative">
      <ClientOnly>
        <ExploreMapView
          :locations="touristStore.locations"
          :tour-stops="tourStops"
          @select="handleSelectLocation"
          @select-tour-stop="handleSelectTourStop"
        />

        <!-- Normal location bottom sheet -->
        <Transition name="slide-up">
          <div
            v-if="selectedLocation && !selectedTourStop"
            class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1000]"
          >
            <!-- Thumbnail strip -->
            <div v-if="selectedLocation.imageUrl" class="relative h-32 overflow-hidden rounded-t-2xl">
              <img :src="selectedLocation.imageUrl" :alt="selectedLocation.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                class="absolute top-2 right-2 w-7 h-7 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white text-sm"
                @click="selectedLocation = null"
              >✕</button>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 text-base leading-tight">{{ selectedLocation.name }}</h3>
                  <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ selectedLocation.description }}</p>
                </div>
                <!-- if no image, put close button here -->
                <button
                  v-if="!selectedLocation.imageUrl"
                  class="text-gray-400 p-1 flex-shrink-0"
                  @click="selectedLocation = null"
                >✕</button>
              </div>

              <!-- Badges -->
              <div class="flex gap-2 mt-2">
                <span
                  v-if="selectedLocation.hasAudioVi || selectedLocation.hasAudioEn"
                  class="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full"
                >🎧 Audio</span>
                <span
                  v-if="(selectedLocation.spotsCount ?? 0) > 0"
                  class="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                >📍 {{ selectedLocation.spotsCount }} điểm</span>
              </div>

              <AppButton
                variant="primary"
                size="sm"
                class="w-full mt-3"
                @click="navigateTo(`/explore/${selectedLocation.slug}`)"
              >
                {{ $t('explore.view_detail') }} →
              </AppButton>
            </div>
          </div>
        </Transition>

        <!-- Tour stop bottom sheet -->
        <Transition name="slide-up">
          <div v-if="selectedTourStop"
            class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1000]">
            <div v-if="selectedTourStop.location.imageUrl" class="relative h-28 overflow-hidden rounded-t-2xl">
              <img :src="selectedTourStop.location.imageUrl" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div class="absolute top-2 left-3 bg-brand-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {{ (tourStops?.indexOf(selectedTourStop) ?? 0) + 1 }}
              </div>
              <button class="absolute top-2 right-2 w-7 h-7 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white text-sm"
                @click="selectedTourStop = null">✕</button>
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p class="text-xs text-brand-600 font-semibold mb-0.5">
                    Điểm số {{ (tourStops?.indexOf(selectedTourStop) ?? 0) + 1 }} trong lịch trình
                  </p>
                  <h3 class="font-bold text-gray-900">{{ selectedTourStop.location.nameVi }}</h3>
                </div>
                <button v-if="!selectedTourStop.location.imageUrl"
                  class="text-gray-400" @click="selectedTourStop = null">✕</button>
              </div>
              <div class="flex gap-2 mb-3">
                <span v-if="selectedTourStop.suggestedTime" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  🕐 {{ selectedTourStop.suggestedTime }}
                </span>
                <span v-if="selectedTourStop.suggestedDuration" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  ⏱ {{ selectedTourStop.suggestedDuration }}
                </span>
              </div>
              <AppButton variant="primary" size="sm" class="w-full"
                @click="navigateTo(`/explore/${selectedTourStop.location.slug}`)">
                Xem chi tiết địa điểm →
              </AppButton>
            </div>
          </div>
        </Transition>

        <template #fallback>
          <div class="flex-1 bg-gray-100 flex items-center justify-center">
            <p class="text-gray-500 text-sm">{{ $t('common.loading') }}</p>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TouristLocation } from '~/stores/tourist.store'

definePageMeta({ layout: 'default' })
const { t, locale } = useI18n()
useHead({ title: () => t('explore.title') })

const route = useRoute()
const touristStore = useTouristStore()
const tourStore = useTourStore()

const selectedLocation = ref<TouristLocation | null>(null)
const selectedTourStop = ref<any>(null)

const tourId = computed(() => route.query.tour as string | undefined)

const tourStops = computed(() => {
  if (!tourId.value || !tourStore.touristTour) return undefined
  return [...(tourStore.touristTour.stops ?? [])].sort((a, b) => a.order - b.order)
})

function handleSelectLocation(loc: TouristLocation) {
  selectedTourStop.value = null
  selectedLocation.value = loc
}

function handleSelectTourStop(stop: any) {
  selectedLocation.value = null
  selectedTourStop.value = stop
}

watch(tourId, async (id) => {
  if (id) {
    await tourStore.fetchTouristTour(id)
  }
}, { immediate: true })

watch(locale, (lang) => {
  selectedLocation.value = null
  selectedTourStop.value = null
  touristStore.fetchLocations(lang)
})

onMounted(() => touristStore.fetchLocations(locale.value))
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
