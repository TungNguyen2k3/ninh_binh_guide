<template>
  <div>
    <!-- Loading skeletons -->
    <div v-if="touristStore.isLoading" class="p-4 grid grid-cols-2 gap-3">
      <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-2xl h-48 animate-pulse" />
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
    <div v-else class="p-4 grid grid-cols-2 gap-3 pb-24">
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
