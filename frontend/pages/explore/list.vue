<template>
  <div>
    <!-- Search bar -->
    <div class="px-4 pt-4 pb-2">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="$t('explore.search_placeholder')"
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors"
        />
        <button
          v-if="searchQuery"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="searchQuery = ''"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading skeletons -->
    <div v-if="touristStore.isLoading" class="p-4 grid grid-cols-2 gap-3">
      <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-2xl h-48 animate-pulse" />
    </div>

    <!-- Empty state — no locations at all -->
    <div
      v-else-if="touristStore.locations.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div class="text-5xl mb-3">🏛️</div>
      <p class="text-gray-500 text-sm">{{ $t('explore.no_locations') }}</p>
    </div>

    <!-- Empty state — search no result -->
    <div
      v-else-if="filteredLocations.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div class="text-5xl mb-3">🔍</div>
      <p class="text-gray-500 text-sm">{{ $t('explore.no_search_results') }}</p>
      <button class="mt-3 text-sm text-brand-600 font-medium" @click="searchQuery = ''">
        {{ $t('common.back') }}
      </button>
    </div>

    <!-- List -->
    <div v-else class="p-4 grid grid-cols-2 gap-3 pb-24">
      <ExploreLocationCard
        v-for="loc in filteredLocations"
        :key="loc.id"
        :location="loc"
        :distance="userPos && distanceTo(loc.latitude, loc.longitude) !== null
          ? formatDistance(distanceTo(loc.latitude, loc.longitude)!)
          : undefined"
        @click="navigateTo(`/explore/${loc.slug}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t, locale } = useI18n()
useHead({ title: () => t('nav.list') })

const touristStore = useTouristStore()
const { position: userPos, distanceTo, formatDistance } = useGeolocation()

const searchQuery = ref('')

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const sortedLocations = computed(() => {
  if (!userPos.value) return touristStore.locations
  return [...touristStore.locations].sort((a, b) => {
    const da = distanceTo(a.latitude, a.longitude) ?? Infinity
    const db = distanceTo(b.latitude, b.longitude) ?? Infinity
    return da - db
  })
})

const filteredLocations = computed(() => {
  const q = normalize(searchQuery.value.trim())
  if (!q) return sortedLocations.value
  return sortedLocations.value.filter(loc => normalize(loc.name).includes(q))
})

watch(locale, (lang) => touristStore.fetchLocations(lang))
onMounted(() => touristStore.fetchLocations(locale.value))
</script>
