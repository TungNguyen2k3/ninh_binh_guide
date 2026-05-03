<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <!-- Loading skeleton -->
    <div v-if="touristStore.isLoading" class="flex-1 bg-gray-200 animate-pulse" />

    <!-- Map -->
    <div v-else class="flex-1 relative">
      <ClientOnly>
        <ExploreMapView
          :locations="touristStore.locations"
          @select="handleSelectLocation"
        />
        <!-- Location panel (khi click marker) -->
        <Transition name="slide-up">
          <div
            v-if="selectedLocation"
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

const touristStore = useTouristStore()
const selectedLocation = ref<TouristLocation | null>(null)

function handleSelectLocation(loc: TouristLocation) {
  selectedLocation.value = loc
}

watch(locale, () => {
  selectedLocation.value = null
  touristStore.fetchLocations()
})
onMounted(() => touristStore.fetchLocations())
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
