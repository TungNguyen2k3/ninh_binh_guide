<template>
  <div class="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
    <!-- Spot selector chips -->
    <div
      v-if="tracks.length > 1"
      class="flex gap-2 overflow-x-auto px-4 py-2 border-b border-gray-100"
      style="scrollbar-width: none; -webkit-overflow-scrolling: touch;"
    >
      <button
        v-for="track in tracks"
        :key="track.id"
        type="button"
        :disabled="!track.audioUrl"
        class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        :class="[
          activeId === track.id
            ? 'bg-brand-600 text-white'
            : track.audioUrl
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
        ]"
        @click="selectTrack(track.id)"
      >
        {{ track.name }}
      </button>
    </div>

    <!-- Player -->
    <div class="px-4 py-3">
      <!-- No audio available -->
      <div v-if="!activeTrack?.audioUrl" class="flex items-center gap-3 text-sm text-gray-400">
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <span class="text-xs">{{ $t('explore.no_audio') }}</span>
      </div>

      <!-- Audio player row -->
      <div v-else class="flex items-center gap-3">
        <!-- Play/Pause -->
        <button
          type="button"
          class="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 shadow active:scale-95 transition-transform"
          @click="toggle"
        >
          <svg v-if="!isPlaying" class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <!-- Progress area -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800 truncate mb-1">{{ activeTrack.name }}</p>
          <div
            class="relative h-1.5 bg-gray-200 rounded-full cursor-pointer"
            @click="handleSeek"
          >
            <div
              class="absolute inset-y-0 left-0 bg-brand-500 rounded-full"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>

        <!-- Time + Speed -->
        <div class="flex flex-col items-end gap-1 flex-shrink-0">
          <span class="text-[10px] text-gray-400">{{ formatTime(currentTime) }}/{{ formatTime(duration) }}</span>
          <button
            type="button"
            class="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
            @click="cycleSpeed"
          >
            {{ speed }}×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AudioTrack {
  id: string
  name: string
  audioUrl: string | null
}

const props = defineProps<{ tracks: AudioTrack[] }>()

const activeId = ref(props.tracks[0]?.id ?? '')
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const speed = ref<0.75 | 1 | 1.5 | 2>(1)
const speeds = [0.75, 1, 1.5, 2] as const

let audio: HTMLAudioElement | null = null

const activeTrack = computed(() => props.tracks.find(t => t.id === activeId.value) ?? null)
const progress = computed(() => duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0)

function loadAudio(url: string) {
  if (audio) { audio.pause(); audio.src = ''; audio = null }
  audio = new Audio(url)
  audio.playbackRate = speed.value
  audio.addEventListener('timeupdate', () => { currentTime.value = audio?.currentTime ?? 0 })
  audio.addEventListener('durationchange', () => { duration.value = audio?.duration ?? 0 })
  audio.addEventListener('ended', () => { isPlaying.value = false })
  currentTime.value = 0
  duration.value = 0
}

watch(() => activeTrack.value?.audioUrl, (url) => {
  isPlaying.value = false
  if (url) loadAudio(url)
}, { immediate: true })

onUnmounted(() => {
  audio?.pause()
  if (audio) audio.src = ''
  audio = null
})

function selectTrack(id: string) {
  if (id === activeId.value) return
  isPlaying.value = false
  activeId.value = id
}

function toggle() {
  if (!audio) return
  if (isPlaying.value) { audio.pause(); isPlaying.value = false }
  else { audio.play(); isPlaying.value = true }
}

function handleSeek(event: MouseEvent) {
  if (!audio || !duration.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  audio.currentTime = ((event.clientX - rect.left) / rect.width) * duration.value
}

function cycleSpeed() {
  const idx = speeds.indexOf(speed.value)
  speed.value = speeds[(idx + 1) % speeds.length]
  if (audio) audio.playbackRate = speed.value
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}
</script>
