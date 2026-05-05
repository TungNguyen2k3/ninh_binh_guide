<template>
  <div
    class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Cover image -->
    <div class="relative w-full h-40 bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
      <img
        v-if="location.imageUrl"
        :src="location.imageUrl"
        :alt="location.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-5xl opacity-60">🏛️</div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <h3 class="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{{ location.name }}</h3>
      <p class="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{{ location.description }}</p>

      <!-- Badges -->
      <div class="flex items-center gap-1.5 mt-2 flex-wrap">
        <span
          v-if="location.hasAudioVi || location.hasAudioEn"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full"
        >
          🎧 Audio
        </span>
        <span
          v-if="(location.spotsCount ?? 0) > 0"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
        >
          📍 {{ location.spotsCount }} điểm
        </span>
        <span v-if="distance"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          📍 {{ distance }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  location: {
    id: string
    slug: string
    name: string
    description: string
    imageUrl: string | null
    hasAudioVi: boolean
    hasAudioEn: boolean
    latitude: number
    longitude: number
    spotsCount?: number
  }
  distance?: string
}>()

defineEmits<{ click: [] }>()
</script>
