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
          @locate="handleLocate"
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
              >âœ•</button>
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
                >âœ•</button>
              </div>

              <!-- Badges -->
              <div class="flex gap-2 mt-2">
                <span
                  v-if="selectedLocation.hasAudioVi || selectedLocation.hasAudioEn"
                  class="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full"
                >ðŸŽ§ Audio</span>
                <span
                  v-if="(selectedLocation.spotsCount ?? 0) > 0"
                  class="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                >ðŸ“ {{ selectedLocation.spotsCount }} Ä‘iá»ƒm</span>
                <span v-if="userPos && selectedLocation && distanceTo(selectedLocation.latitude, selectedLocation.longitude) !== null"
                  class="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  ðŸ“ {{ formatDistance(distanceTo(selectedLocation.latitude, selectedLocation.longitude)!) }}
                </span>
              </div>

              <AppButton
                variant="primary"
                size="sm"
                class="w-full mt-3"
                @click="navigateTo(`/explore/${selectedLocation.slug}`)"
              >
                {{ $t('explore.view_detail') }} â†’
              </AppButton>
              <a
                v-if="selectedLocation"
                :href="`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`"
                target="_blank"
                rel="noopener"
                class="mt-2 w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Chá»‰ Ä‘Æ°á»ng
              </a>
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
                @click="selectedTourStop = null">âœ•</button>
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p class="text-xs text-brand-600 font-semibold mb-0.5">
                    Äiá»ƒm sá»‘ {{ (tourStops?.indexOf(selectedTourStop) ?? 0) + 1 }} trong lá»‹ch trÃ¬nh
                  </p>
                  <h3 class="font-bold text-gray-900">{{ selectedTourStop.location.nameVi }}</h3>
                </div>
                <button v-if="!selectedTourStop.location.imageUrl"
                  class="text-gray-400" @click="selectedTourStop = null">âœ•</button>
              </div>
              <div class="flex gap-2 mb-3">
                <span v-if="selectedTourStop.suggestedTime" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  ðŸ• {{ selectedTourStop.suggestedTime }}
                </span>
                <span v-if="selectedTourStop.suggestedDuration" class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  â± {{ selectedTourStop.suggestedDuration }}
                </span>
              </div>
              <AppButton variant="primary" size="sm" class="w-full"
                @click="navigateTo(`/explore/${selectedTourStop.location.slug}`)">
                Xem chi tiáº¿t Ä‘á»‹a Ä‘iá»ƒm â†’
              </AppButton>
              <a
                v-if="selectedTourStop"
                :href="`https://www.google.com/maps/dir/?api=1&destination=${selectedTourStop.location.latitude},${selectedTourStop.location.longitude}`"
                target="_blank"
                rel="noopener"
                class="mt-2 w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Chá»‰ Ä‘Æ°á»ng
              </a>
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

const { position: userPos, distanceTo, formatDistance, setPosition } = useGeolocation()

function handleLocate(lat: number, lng: number) {
  setPosition(lat, lng)
}

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

