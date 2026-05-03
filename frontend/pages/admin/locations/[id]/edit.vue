<template>
  <div class="max-w-3xl space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="navigateTo('/admin/locations')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.edit_location') }}</h1>
        <p v-if="locationStore.current" class="text-sm text-gray-500 mt-0.5">
          {{ locationStore.current.nameVi }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="locationStore.isLoading && !locationStore.current"
      class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div v-for="i in 5" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="locationStore.current">
      <!-- 3-Tab navigation -->
      <div class="flex gap-1 bg-gray-100 rounded-2xl p-1">
        <button v-for="tab in tabs" :key="tab.id" type="button"
          class="flex-1 py-2.5 text-sm font-medium rounded-xl transition-all"
          :class="activeTab === tab.id
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab.id">
          <span class="block text-base leading-none mb-0.5">{{ tab.icon }}</span>
          <span class="text-xs">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab 1: Cơ bản — form + ảnh + audio cùng 1 chỗ -->
      <div v-show="activeTab === 'basic'" class="space-y-5">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <!-- hide-button: save button shown once at bottom of tab -->
          <AdminLocationForm v-model="formData" :is-loading="isSubmitting" hide-button @submit="handleSubmit" />
        </div>

        <!-- Hình ảnh ngay dưới form -->
        <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div>
            <h3 class="text-sm font-semibold text-gray-900">🖼 {{ $t('admin.images_section') }}</h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ $t('admin.images_hint') }}</p>
          </div>
          <AdminMultiImageUpload
            :location-id="locationStore.current.id"
            :images="locationStore.current.images ?? []"
            @uploaded="reloadCurrent"
            @deleted="reloadCurrent"
          />
        </div>

        <!-- Audio chính ngay dưới ảnh -->
        <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 class="text-sm font-semibold text-gray-900">🎧 {{ $t('admin.audio_main') }}</h3>
          <AdminAudioUpload
            :location-id="locationStore.current.id"
            :audio-vi-url="locationStore.current.audioViUrl"
            :audio-en-url="locationStore.current.audioEnUrl"
            @uploaded="reloadCurrent"
          />
        </div>

        <!-- Single save button at the very bottom of tab -->
        <div class="flex justify-end">
          <AppButton :loading="isSubmitting" size="lg" @click="handleSubmit">
            {{ isSubmitting ? $t('common.saving') : $t('admin.save_basic') }}
          </AppButton>
        </div>
      </div>

      <!-- Tab 2: Nội dung chi tiết -->
      <div v-show="activeTab === 'content'" class="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
        <!-- VI/EN toggle -->
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">{{ $t('admin.content_hint') }}</p>
          <div class="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button v-for="lang in (['vi', 'en'] as const)" :key="lang" type="button"
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="contentLang === lang ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'"
              @click="contentLang = lang">
              {{ lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English' }}
            </button>
          </div>
        </div>

        <!-- 3 bilingual content sections (overview, history, highlights) -->
        <div v-for="section in contentSections" :key="section.keyBase" class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            {{ section.icon }} {{ section.label }}
          </label>
          <p class="text-xs text-gray-400">{{ section.hint }}</p>
          <textarea
            v-model="(formData as any)[section.keyBase + (contentLang === 'vi' ? 'Vi' : 'En')]"
            :rows="section.rows"
            :placeholder="section.placeholder"
            class="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none transition-colors"
          />
        </div>

        <!-- Visiting info: structured factual fields (not bilingual) -->
        <div class="pt-2">
          <div class="border-t border-gray-100 mb-4" />
          <h3 class="text-sm font-semibold text-gray-700 mb-4">🗺️ {{ $t('admin.visiting_info') }}</h3>
          <div class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AppInput
                v-model="formData.openTime"
                :label="$t('location.open_time')"
                :placeholder="$t('admin.open_time_placeholder')"
              />
              <AppInput
                v-model="formData.closeTime"
                :label="$t('location.open_time') + ' (close)'"
                :placeholder="$t('admin.open_time_placeholder')"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">{{ $t('location.admission_fee') }}</label>
                <input
                  v-model.number="formData.admissionFee"
                  type="number"
                  min="0"
                  step="1000"
                  :placeholder="$t('admin.admission_fee_placeholder')"
                  class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-gray-700">{{ $t('location.estimated_duration') }}</label>
                <input
                  v-model.number="formData.estimatedDuration"
                  type="number"
                  min="0"
                  step="15"
                  :placeholder="$t('admin.duration_placeholder')"
                  class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-colors"
                />
              </div>
            </div>
            <AppInput
              v-model="formData.address"
              :label="$t('location.address')"
              :placeholder="$t('admin.address_placeholder')"
            />
            <AppInput
              v-model="formData.bestTime"
              :label="$t('location.best_time')"
              :placeholder="$t('admin.best_time_placeholder')"
            />
          </div>
        </div>

        <div class="flex justify-end pt-1">
          <AppButton :loading="isSubmitting" @click="handleSubmit">
            {{ $t('admin.save_changes') }}
          </AppButton>
        </div>
      </div>

      <!-- Tab 3: Khu vực -->
      <div v-show="activeTab === 'spots'" class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-900">📍 {{ $t('admin.spots_section') }}</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ $t('admin.spots_hint') }}</p>
        </div>
        <AdminSpotManager
          :location-id="locationStore.current.id"
          :spots="locationStore.current.spots ?? []"
          @updated="reloadCurrent"
        />
      </div>
    </template>

    <div v-else class="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500">
      {{ $t('error.not_found') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationFormData } from '~/stores/location.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.edit_location') })

const route = useRoute()
const locationStore = useLocationStore()
const { toast } = useToast()
const isSubmitting = ref(false)
const activeTab = ref<'basic' | 'content' | 'spots'>('basic')
const contentLang = ref<'vi' | 'en'>('vi')

const tabs = computed(() => [
  { id: 'basic' as const, icon: '📋', label: t('admin.tab_basic') },
  { id: 'content' as const, icon: '📝', label: t('admin.tab_content') },
  { id: 'spots' as const, icon: '📍', label: t('admin.tab_spots') },
])

const contentSections = computed(() => [
  {
    keyBase: 'overview', icon: '📄',
    label: t('admin.overview'), hint: t('admin.overview_hint'),
    placeholder: t('admin.overview_placeholder'), rows: 4,
  },
  {
    keyBase: 'history', icon: '📜',
    label: t('admin.history'), hint: t('admin.history_hint'),
    placeholder: t('admin.history_placeholder'), rows: 5,
  },
  {
    keyBase: 'highlights', icon: '⭐',
    label: t('admin.highlights'), hint: t('admin.highlights_hint'),
    placeholder: t('admin.highlights_placeholder'), rows: 4,
  },
])

const formData = ref<LocationFormData>({
  nameVi: '', nameEn: '', slug: '',
  descriptionVi: '', descriptionEn: '',
  overviewVi: '', overviewEn: '',
  historyVi: '', historyEn: '',
  highlightsVi: '', highlightsEn: '',
  openTime: '', closeTime: '',
  admissionFee: null, estimatedDuration: null,
  address: '', bestTime: '',
  latitude: null, longitude: null,
  displayOrder: 0, isActive: true,
})

async function loadLocation(): Promise<void> {
  await locationStore.fetchOne(route.params.id as string)
  if (locationStore.current) {
    const loc = locationStore.current
    formData.value = {
      nameVi: loc.nameVi, nameEn: loc.nameEn, slug: loc.slug,
      descriptionVi: loc.descriptionVi ?? '', descriptionEn: loc.descriptionEn ?? '',
      overviewVi: loc.overviewVi ?? '', overviewEn: loc.overviewEn ?? '',
      historyVi: loc.historyVi ?? '', historyEn: loc.historyEn ?? '',
      highlightsVi: loc.highlightsVi ?? '', highlightsEn: loc.highlightsEn ?? '',
      openTime: loc.openTime ?? '', closeTime: loc.closeTime ?? '',
      admissionFee: loc.admissionFee ?? null, estimatedDuration: loc.estimatedDuration ?? null,
      address: loc.address ?? '', bestTime: loc.bestTime ?? '',
      latitude: loc.latitude, longitude: loc.longitude,
      displayOrder: loc.displayOrder, isActive: loc.isActive,
    }
  }
}

async function reloadCurrent(): Promise<void> {
  await locationStore.fetchOne(route.params.id as string)
}

async function handleSubmit(): Promise<void> {
  if (!formData.value.nameVi || !formData.value.nameEn || !formData.value.slug) {
    toast.error(t('error.required')); return
  }
  isSubmitting.value = true
  try {
    await locationStore.update(route.params.id as string, formData.value)
    toast.success(t('admin.update_success'))
  } catch {
    toast.error(t('error.server_error'))
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadLocation)
</script>
