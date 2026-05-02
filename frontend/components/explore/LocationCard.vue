<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 overflow-hidden flex gap-3 p-3 active:bg-gray-50 transition-colors cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Thumbnail -->
    <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
      <img
        v-if="location.imageUrl"
        :src="location.imageUrl"
        :alt="location.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-2xl">🏛️</div>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-gray-900 text-sm leading-tight">{{ location.name }}</h3>
      <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ location.description }}</p>
      <div class="flex items-center gap-2 mt-2">
        <span
          v-if="location.hasAudioVi || location.hasAudioEn"
          class="inline-flex items-center gap-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full"
        >
          🎧 Audio
        </span>
      </div>
    </div>

    <div class="flex items-center text-gray-300 flex-shrink-0">›</div>
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
  }
}>()

defineEmits<{ click: [] }>()
</script>
