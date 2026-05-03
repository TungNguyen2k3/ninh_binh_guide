<template>
  <div class="max-w-3xl space-y-6">
    <!-- Page header -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        @click="navigateTo('/admin/locations')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.edit_location') }}</h1>
    </div>

    <!-- Loading skeleton -->
    <div v-if="locationStore.isLoading && !locationStore.current" class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div v-for="i in 6" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <template v-else-if="locationStore.current">
      <!-- Main form -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <AdminLocationForm
          v-model="formData"
          :is-loading="isSubmitting"
          @submit="handleSubmit"
        />
      </div>

      <!-- Audio upload -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Audio</h2>
        <AdminAudioUpload
          :location-id="locationStore.current.id"
          :audio-vi-url="locationStore.current.audioViUrl"
          :audio-en-url="locationStore.current.audioEnUrl"
          @uploaded="reloadCurrent"
        />
      </div>

      <!-- Image upload (single cover) -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.upload_image') }}</h2>
        <AdminImageUpload
          :location-id="locationStore.current.id"
          :image-url="locationStore.current.imageUrl"
          @uploaded="reloadCurrent"
        />
      </div>

      <!-- Detailed content sections -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.content_sections') }}</h2>
          <!-- Language tabs -->
          <div class="flex gap-2">
            <button
              v-for="lang in (['vi', 'en'] as const)"
              :key="lang"
              type="button"
              class="px-3 py-1 text-sm rounded-lg transition-colors"
              :class="contentLang === lang
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              @click="contentLang = lang"
            >
              {{ lang === 'vi' ? 'Tiếng Việt' : 'English' }}
            </button>
          </div>
        </div>

        <!-- Vietnamese content fields -->
        <template v-if="contentLang === 'vi'">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.overview') }} (VI)</label>
            <textarea
              v-model="formData.overviewVi"
              rows="4"
              :placeholder="$t('admin.overview')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.history') }} (VI)</label>
            <textarea
              v-model="formData.historyVi"
              rows="4"
              :placeholder="$t('admin.history')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.highlights') }} (VI)</label>
            <textarea
              v-model="formData.highlightsVi"
              rows="4"
              :placeholder="$t('admin.highlights')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.visiting_guide') }} (VI)</label>
            <textarea
              v-model="formData.visitingGuideVi"
              rows="4"
              :placeholder="$t('admin.visiting_guide')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
        </template>

        <!-- English content fields -->
        <template v-if="contentLang === 'en'">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.overview') }} (EN)</label>
            <textarea
              v-model="formData.overviewEn"
              rows="4"
              :placeholder="$t('admin.overview')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.history') }} (EN)</label>
            <textarea
              v-model="formData.historyEn"
              rows="4"
              :placeholder="$t('admin.history')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.highlights') }} (EN)</label>
            <textarea
              v-model="formData.highlightsEn"
              rows="4"
              :placeholder="$t('admin.highlights')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">{{ $t('admin.visiting_guide') }} (EN)</label>
            <textarea
              v-model="formData.visitingGuideEn"
              rows="4"
              :placeholder="$t('admin.visiting_guide')"
              class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
            />
          </div>
        </template>

        <!-- Save content button -->
        <div class="flex justify-end pt-2">
          <AppButton type="button" :loading="isSubmitting" class="min-w-32" @click="handleSubmit">
            {{ isSubmitting ? $t('common.saving') : $t('admin.save_changes') }}
          </AppButton>
        </div>
      </div>

      <!-- Multi-image upload -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.images_section') }}</h2>
        <AdminMultiImageUpload
          :location-id="locationStore.current.id"
          :images="locationStore.current.images ?? []"
          @uploaded="reloadCurrent"
          @deleted="reloadCurrent"
        />
      </div>

      <!-- Spot manager -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.spots_section') }}</h2>
        <AdminSpotManager
          :location-id="locationStore.current.id"
          :spots="locationStore.current.spots ?? []"
          @updated="reloadCurrent"
        />
      </div>
    </template>

    <!-- Not found -->
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
const contentLang = ref<'vi' | 'en'>('vi')

const formData = ref<LocationFormData>({
  nameVi: '',
  nameEn: '',
  slug: '',
  descriptionVi: '',
  descriptionEn: '',
  overviewVi: '',
  overviewEn: '',
  historyVi: '',
  historyEn: '',
  highlightsVi: '',
  highlightsEn: '',
  visitingGuideVi: '',
  visitingGuideEn: '',
  latitude: null,
  longitude: null,
  displayOrder: 0,
  isActive: true
})

async function loadLocation(): Promise<void> {
  const id = route.params.id as string
  await locationStore.fetchOne(id)
  if (locationStore.current) {
    const loc = locationStore.current
    formData.value = {
      nameVi: loc.nameVi,
      nameEn: loc.nameEn,
      slug: loc.slug,
      descriptionVi: loc.descriptionVi ?? '',
      descriptionEn: loc.descriptionEn ?? '',
      overviewVi: loc.overviewVi ?? '',
      overviewEn: loc.overviewEn ?? '',
      historyVi: loc.historyVi ?? '',
      historyEn: loc.historyEn ?? '',
      highlightsVi: loc.highlightsVi ?? '',
      highlightsEn: loc.highlightsEn ?? '',
      visitingGuideVi: loc.visitingGuideVi ?? '',
      visitingGuideEn: loc.visitingGuideEn ?? '',
      latitude: loc.latitude,
      longitude: loc.longitude,
      displayOrder: loc.displayOrder,
      isActive: loc.isActive
    }
  }
}

async function reloadCurrent(): Promise<void> {
  await locationStore.fetchOne(route.params.id as string)
}

async function handleSubmit(): Promise<void> {
  if (!formData.value.nameVi || !formData.value.nameEn || !formData.value.slug) {
    toast.error(t('error.required'))
    return
  }
  if (formData.value.latitude === null || formData.value.longitude === null) {
    toast.error(t('location.latitude') + ' / ' + t('location.longitude') + ': ' + t('error.required'))
    return
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
