<template>
  <div class="pb-52">
    <!-- Loading skeleton -->
    <div v-if="touristStore.isLoadingDetail" class="animate-pulse">
      <div class="w-full h-60 bg-gray-200" />
      <div class="p-4 space-y-3">
        <div class="h-6 bg-gray-200 rounded w-3/4" />
        <div class="h-4 bg-gray-100 rounded" />
        <div class="h-4 bg-gray-100 rounded w-5/6" />
      </div>
    </div>

    <template v-else-if="loc">
      <!-- Image carousel -->
      <div class="relative overflow-hidden">
        <div
          v-if="loc.images?.length"
          class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style="-webkit-overflow-scrolling: touch; scrollbar-width: none;"
        >
          <div
            v-for="(img, idx) in loc.images"
            :key="idx"
            class="w-full flex-shrink-0 snap-center"
          >
            <img :src="img.url" :alt="img.caption ?? loc.name" class="w-full h-60 object-cover" />
          </div>
        </div>
        <template v-else>
          <img
            v-if="loc.imageUrl"
            :src="loc.imageUrl"
            :alt="loc.name"
            class="w-full h-60 object-cover"
          />
          <div
            v-else
            class="w-full h-60 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-7xl"
          >🏛️</div>
        </template>

        <!-- Back button -->
        <button
          class="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700"
          @click="navigateTo('/explore/list')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Dot indicators -->
        <div
          v-if="(loc.images?.length ?? 0) > 1"
          class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5"
        >
          <div v-for="(_, i) in loc.images" :key="i" class="w-1.5 h-1.5 rounded-full bg-white/80" />
        </div>
      </div>

      <!-- Title + short description -->
      <div class="px-4 pt-4 pb-2">
        <h1 class="text-2xl font-bold text-gray-900">{{ loc.name }}</h1>
        <p v-if="loc.description" class="text-sm text-gray-500 mt-1 leading-relaxed">{{ loc.description }}</p>
      </div>

      <!-- Visiting info chips (compact row) -->
      <div v-if="hasVisitingInfo" class="px-4 py-2 flex items-center gap-2 overflow-x-auto" style="scrollbar-width: none;">
        <span v-if="loc.openTime" class="flex-shrink-0 flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-700">
          🕐 {{ loc.openTime }}{{ loc.closeTime ? ' – ' + loc.closeTime : '' }}
        </span>
        <template v-if="loc.admissionFees?.length">
          <span
            v-for="fee in loc.admissionFees"
            :key="fee.labelEn"
            class="flex-shrink-0 flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-700"
          >
            🎫 {{ locale === 'vi' ? fee.labelVi : fee.labelEn }}: {{ fee.price === 0 ? $t('location.free_entry') : formatVnd(fee.price) }}
          </span>
        </template>
        <span v-if="loc.estimatedDuration" class="flex-shrink-0 flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-700">
          ⏱ {{ loc.estimatedDuration }}{{ $t('location.minutes') }}
        </span>
        <span v-if="loc.bestTime" class="flex-shrink-0 flex items-center gap-1 text-xs bg-amber-50 rounded-full px-2.5 py-1 text-amber-700">
          🌤 {{ loc.bestTime }}
        </span>
        <span v-if="loc.address" class="flex-shrink-0 flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2.5 py-1 text-gray-700">
          📍 {{ loc.address }}
        </span>
        <a
          v-if="loc"
          :href="`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`"
          target="_blank"
          rel="noopener"
          class="flex-shrink-0 flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-medium rounded-full px-2.5 py-1"
          @click.stop
        >
          🧭 Chỉ đường
        </a>
      </div>

      <div class="px-4 space-y-6 pt-2">
        <!-- Overview -->
        <section v-if="loc.overview">
          <p class="text-sm text-gray-600 leading-relaxed">{{ loc.overview }}</p>
        </section>

        <!-- History -->
        <section v-if="loc.history">
          <h2 class="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span class="text-lg">📜</span> {{ $t('explore.history') }}
          </h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ loc.history }}</p>
        </section>

        <!-- Highlights -->
        <section v-if="loc.highlights">
          <h2 class="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span class="text-lg">⭐</span> {{ $t('explore.highlights') }}
          </h2>
          <p class="text-sm text-gray-600 leading-relaxed">{{ loc.highlights }}</p>
        </section>

        <!-- Spots content (images + desc only, audio is in bar) -->
        <section v-if="loc.spots?.length">
          <h2 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span class="text-lg">📍</span> {{ $t('explore.spots') }}
          </h2>
          <div class="space-y-3">
            <div
              v-for="spot in loc.spots"
              :key="spot.id"
              class="bg-gray-50 rounded-2xl overflow-hidden"
            >
              <!-- Spot images -->
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
              <div class="p-3">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 text-sm">{{ spot.name }}</h3>
                  <span
                    v-if="spot.audioUrl"
                    class="text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full font-medium"
                  >🎧</span>
                </div>
                <p v-if="spot.description" class="text-xs text-gray-500 mt-1 leading-relaxed">{{ spot.description }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="text-5xl mb-3">❓</div>
      <p class="text-gray-500">{{ $t('explore.not_found') }}</p>
      <AppButton class="mt-4" @click="navigateTo('/explore/list')">{{ $t('common.back') }}</AppButton>
    </div>

    <!-- Audio gate: no ticket → activation banner -->
    <div
      v-if="loc && loc.audioGated"
      class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-4 py-3"
    >
      <div class="max-w-lg mx-auto flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
          <span class="text-xl">🎧</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ $t('explore.audio_locked') }}</p>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ authStore.isAuthenticated ? $t('explore.activate_to_listen') : $t('explore.register_to_listen') }}
          </p>
        </div>
        <button
          v-if="authStore.isAuthenticated"
          class="flex-shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          @click="navigateTo('/auth/activate')"
        >
          {{ $t('explore.activate_ticket') }}
        </button>
        <button
          v-else
          class="flex-shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          @click="navigateTo('/auth/register')"
        >
          {{ $t('explore.register_now') }}
        </button>
      </div>
    </div>

    <!-- Sticky audio bar (only when content is loaded and ticket is active) -->
    <ExploreAudioBar v-else-if="loc && hasAnyAudio" :tracks="audioTracks" />
  </div>
</template>

<script setup lang="ts">
import type { AudioTrack } from '~/components/explore/AudioBar.vue'

definePageMeta({ layout: 'default' })
const { t, locale } = useI18n()
const route = useRoute()
const touristStore = useTouristStore()
const authStore = useAuthStore()

const loc = computed(() => touristStore.currentLocation)

useHead({ title: () => loc.value?.name ?? t('explore.title') })

const hasVisitingInfo = computed(() => {
  const l = loc.value
  return l && (l.openTime || l.admissionFees?.length || l.estimatedDuration || l.address || l.bestTime)
})

const hasAnyAudio = computed(() => audioTracks.value.some(t => t.audioUrl !== null))

// Build tracks: main audio first, then spots with audio
const audioTracks = computed<AudioTrack[]>(() => {
  const l = loc.value
  if (!l) return []
  const tracks: AudioTrack[] = [
    { id: 'main', name: t('explore.overview_audio'), audioUrl: l.audioUrl ?? null }
  ]
  for (const spot of l.spots ?? []) {
    tracks.push({ id: spot.id, name: spot.name, audioUrl: spot.audioUrl ?? null })
  }
  return tracks
})

function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function load() {
  touristStore.fetchLocationDetail(route.params.slug as string, locale.value)
}

watch(locale, load)
onMounted(load)
</script>
