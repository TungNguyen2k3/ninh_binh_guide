<template>
  <div class="bg-gray-50 rounded-2xl p-4">
    <!-- Progress bar -->
    <div
      class="relative h-1.5 bg-gray-200 rounded-full cursor-pointer mb-3"
      @click="handleSeek"
    >
      <div
        class="absolute inset-y-0 left-0 bg-brand-500 rounded-full transition-all"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <!-- Time -->
    <div class="flex justify-between text-xs text-gray-400 mb-4">
      <span>{{ formatTime(currentTime) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between">
      <!-- Speed selector -->
      <button
        v-for="s in speeds"
        :key="s"
        @click="setSpeed(s)"
        class="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
        :class="speed === s ? 'bg-brand-100 text-brand-700' : 'text-gray-500 hover:bg-gray-100'"
      >{{ s }}×</button>

      <!-- Play/Pause button -->
      <button
        @click="toggle"
        class="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center shadow-md active:scale-95 transition-transform"
        :aria-label="isPlaying ? $t('explore.pause') : $t('explore.play')"
      >
        <!-- Play icon -->
        <svg v-if="!isPlaying" class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <!-- Pause icon -->
        <svg v-else class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>

      <!-- Placeholder to balance layout -->
      <div class="w-16" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string }>()

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
)
const speed = ref<0.75 | 1 | 1.5 | 2>(1)
const speeds = [0.75, 1, 1.5, 2] as const

onMounted(() => {
  audio.value = new Audio(props.src)
  audio.value.addEventListener('timeupdate', () => {
    currentTime.value = audio.value?.currentTime ?? 0
  })
  audio.value.addEventListener('durationchange', () => {
    duration.value = audio.value?.duration ?? 0
  })
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
  })
})

onUnmounted(() => {
  audio.value?.pause()
  audio.value = null
})

function toggle() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play()
    isPlaying.value = true
  }
}

function handleSeek(event: MouseEvent) {
  if (!audio.value || !duration.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const pct = (event.clientX - rect.left) / rect.width
  audio.value.currentTime = pct * duration.value
}

function setSpeed(s: typeof speeds[number]) {
  speed.value = s
  if (audio.value) audio.value.playbackRate = s
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>
