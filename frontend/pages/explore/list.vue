<template>
  <div>
    <!-- Tab switcher -->
    <div class="flex border-b border-gray-200 bg-white sticky top-14 z-10">
      <NuxtLink
        to="/explore"
        class="flex-1 py-3 text-sm font-medium text-center text-gray-500"
      >
        🗺️ {{ $t('nav.map') }}
      </NuxtLink>
      <NuxtLink
        to="/explore/list"
        class="flex-1 py-3 text-sm font-medium text-center text-brand-600 border-b-2 border-brand-600"
      >
        📋 {{ $t('nav.list') }}
      </NuxtLink>
    </div>

    <!-- Loading skeletons -->
    <div v-if="touristStore.isLoading" class="p-4 space-y-3">
      <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-2xl h-24 animate-pulse" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="touristStore.locations.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div class="text-5xl mb-3">🏛️</div>
      <p class="text-gray-500 text-sm">{{ $t('explore.no_locations') }}</p>
    </div>

    <!-- List -->
    <div v-else class="p-4 space-y-3 pb-24">
      <ExploreLocationCard
        v-for="loc in touristStore.locations"
        :key="loc.id"
        :location="loc"
        @click="navigateTo(`/explore/${loc.slug}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
useHead({ title: () => t('nav.list') })

const touristStore = useTouristStore()
const { locale } = useI18n()

watch(locale, () => touristStore.fetchLocations())
onMounted(() => touristStore.fetchLocations())
</script>
