<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <!-- Tab switcher -->
    <div class="flex border-b border-gray-200 bg-white">
      <NuxtLink
        to="/explore"
        class="flex-1 py-3 text-sm font-medium text-center transition-colors"
        :class="$route.path === '/explore' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500'"
      >
        🗺️ {{ $t('nav.map') }}
      </NuxtLink>
      <NuxtLink
        to="/explore/list"
        class="flex-1 py-3 text-sm font-medium text-center transition-colors"
        :class="$route.path === '/explore/list' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500'"
      >
        📋 {{ $t('nav.list') }}
      </NuxtLink>
    </div>

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
            class="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-4 z-[1000]"
          >
            <div class="flex items-start gap-3">
              <img
                v-if="selectedLocation.imageUrl"
                :src="selectedLocation.imageUrl"
                class="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                loading="lazy"
              />
              <div
                v-else
                class="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-3xl"
              >🏛️</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 text-base leading-tight">{{ selectedLocation.name }}</h3>
                <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">{{ selectedLocation.description }}</p>
              </div>
              <button @click="selectedLocation = null" class="text-gray-400 p-1 flex-shrink-0">✕</button>
            </div>
            <AppButton
              variant="primary"
              size="sm"
              class="w-full mt-3"
              @click="navigateTo(`/explore/${selectedLocation.slug}`)"
            >
              {{ $t('explore.view_detail') }}
            </AppButton>
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
const { t } = useI18n()
useHead({ title: () => t('explore.title') })

const touristStore = useTouristStore()
const selectedLocation = ref<TouristLocation | null>(null)

function handleSelectLocation(loc: TouristLocation) {
  selectedLocation.value = loc
}

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
