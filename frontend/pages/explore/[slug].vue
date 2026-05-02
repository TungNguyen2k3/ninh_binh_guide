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
      <!-- Hero image -->
      <div class="relative">
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
        <!-- Back button -->
        <button
          @click="navigateTo('/explore/list')"
          class="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700"
        >
          ‹
        </button>
      </div>

      <!-- Info -->
      <div class="p-4">
        <h1 class="text-2xl font-bold text-gray-900">{{ touristStore.currentLocation.name }}</h1>
        <p class="text-sm text-gray-600 mt-3 leading-relaxed">{{ touristStore.currentLocation.description }}</p>

        <!-- Audio player -->
        <div v-if="touristStore.currentLocation.audioUrl" class="mt-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">🎧 {{ $t('location.listen') }}</h2>
          <ExploreAudioPlayer :src="touristStore.currentLocation.audioUrl" />
        </div>
        <div v-else class="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 text-center">
          {{ $t('explore.no_audio') }}
        </div>
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
const { t } = useI18n()
const route = useRoute()
const touristStore = useTouristStore()

useHead({ title: () => touristStore.currentLocation?.name ?? t('explore.title') })

onMounted(() => touristStore.fetchLocationDetail(route.params.slug as string))
</script>
