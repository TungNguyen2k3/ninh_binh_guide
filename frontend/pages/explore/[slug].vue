<template>
  <div class="pb-24">
    <!-- Loading skeleton -->
    <div v-if="touristStore.isLoadingDetail" class="animate-pulse">
      <div class="w-full h-56 bg-gray-200" />
      <div class="p-4 space-y-3">
        <div class="h-6 bg-gray-200 rounded w-3/4" />
        <div class="h-4 bg-gray-100 rounded" />
        <div class="h-4 bg-gray-100 rounded w-5/6" />
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="touristStore.currentLocation">
      <!-- Image carousel -->
      <div class="relative overflow-hidden">
        <div
          v-if="touristStore.currentLocation.images?.length"
          class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style="-webkit-overflow-scrolling: touch; scrollbar-width: none;"
        >
          <div
            v-for="(img, idx) in touristStore.currentLocation.images"
            :key="idx"
            class="w-full flex-shrink-0 snap-center"
          >
            <img
              :src="img.url"
              :alt="img.caption ?? touristStore.currentLocation.name"
              class="w-full h-56 object-cover"
            />
          </div>
        </div>
        <!-- Fallback: single imageUrl or placeholder -->
        <template v-else>
          <img
            v-if="touristStore.currentLocation.imageUrl"
            :src="touristStore.currentLocation.imageUrl"
            :alt="touristStore.currentLocation.name"
            class="w-full h-56 object-cover"
          />
          <div
            v-else
            class="w-full h-56 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-6xl"
          >
            🏛️
          </div>
        </template>

        <!-- Back button -->
        <button
          class="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700 text-xl"
          @click="navigateTo('/explore/list')"
        >
          ‹
        </button>

        <!-- Dot indicators -->
        <div
          v-if="(touristStore.currentLocation.images?.length ?? 0) > 1"
          class="absolute bottom-2 left-0 right-0 flex justify-center gap-1"
        >
          <div
            v-for="(_, i) in touristStore.currentLocation.images"
            :key="i"
            class="w-1.5 h-1.5 rounded-full bg-white/70"
          />
        </div>
      </div>

      <!-- Info -->
      <div class="p-4">
        <h1 class="text-2xl font-bold text-gray-900">{{ touristStore.currentLocation.name }}</h1>

        <!-- Short description (legacy field) -->
        <p
          v-if="touristStore.currentLocation.description && !touristStore.currentLocation.overview"
          class="text-sm text-gray-600 mt-3 leading-relaxed"
        >
          {{ touristStore.currentLocation.description }}
        </p>

        <!-- Overview -->
        <section v-if="touristStore.currentLocation.overview" class="mt-4">
          <p class="text-sm text-gray-600 leading-relaxed">{{ touristStore.currentLocation.overview }}</p>
        </section>

        <!-- History -->
        <section v-if="touristStore.currentLocation.history" class="mt-6">
          <h2 class="text-base font-bold text-gray-900 mb-2">📜 {{ $t('explore.history') }}</h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ touristStore.currentLocation.history }}</p>
        </section>

        <!-- Highlights -->
        <section v-if="touristStore.currentLocation.highlights" class="mt-6">
          <h2 class="text-base font-bold text-gray-900 mb-2">⭐ {{ $t('explore.highlights') }}</h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ touristStore.currentLocation.highlights }}</p>
        </section>

        <!-- Main audio (full location) -->
        <section v-if="touristStore.currentLocation.audioUrl" class="mt-6">
          <h2 class="text-base font-bold text-gray-900 mb-3">🎧 {{ $t('location.listen') }}</h2>
          <ExploreAudioPlayer :src="touristStore.currentLocation.audioUrl" />
        </section>
        <div
          v-else-if="!touristStore.currentLocation.spots?.length"
          class="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 text-center"
        >
          {{ $t('explore.no_audio') }}
        </div>

        <!-- Spots -->
        <section v-if="touristStore.currentLocation.spots?.length" class="mt-6">
          <h2 class="text-base font-bold text-gray-900 mb-4">📍 {{ $t('explore.spots') }}</h2>
          <div class="space-y-4">
            <div
              v-for="spot in touristStore.currentLocation.spots"
              :key="spot.id"
              class="bg-gray-50 rounded-2xl overflow-hidden"
            >
              <!-- Spot images (horizontal scroll) -->
              <div
                v-if="spot.images?.length"
                class="flex gap-2 overflow-x-auto p-3 pb-0"
                style="-webkit-overflow-scrolling: touch; scrollbar-width: none;"
              >
                <img
                  v-for="img in spot.images"
                  :key="img.id"
                  :src="img.url"
                  class="w-28 h-20 object-cover rounded-xl flex-shrink-0"
                  loading="lazy"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 text-sm">{{ spot.name }}</h3>
                <p
                  v-if="spot.description"
                  class="text-xs text-gray-500 mt-1 leading-relaxed"
                >
                  {{ spot.description }}
                </p>
                <div v-if="spot.audioUrl" class="mt-3">
                  <ExploreAudioPlayer :src="spot.audioUrl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Visiting guide -->
        <section v-if="touristStore.currentLocation.visitingGuide" class="mt-6 bg-amber-50 rounded-2xl p-4">
          <h2 class="text-base font-bold text-gray-900 mb-2">🗺️ {{ $t('explore.visiting_guide') }}</h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ touristStore.currentLocation.visitingGuide }}</p>
        </section>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="text-5xl mb-3">❓</div>
      <p class="text-gray-500">{{ $t('explore.not_found') }}</p>
      <AppButton class="mt-4" @click="navigateTo('/explore/list')">{{ $t('common.back') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t, locale } = useI18n()
const route = useRoute()
const touristStore = useTouristStore()

useHead({ title: () => touristStore.currentLocation?.name ?? t('explore.title') })

function load() {
  touristStore.fetchLocationDetail(route.params.slug as string, locale.value)
}

// Refetch when language switches so content updates immediately
watch(locale, load)

onMounted(load)
</script>
