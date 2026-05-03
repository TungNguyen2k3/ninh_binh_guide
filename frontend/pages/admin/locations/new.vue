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
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.add_location') }}</h1>
    </div>

    <!-- Form card -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <AdminLocationForm
        v-model="formData"
        :is-loading="isSubmitting"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocationFormData } from '~/stores/location.store'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.add_location') })

const locationStore = useLocationStore()
const { toast } = useToast()
const isSubmitting = ref(false)

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
  openTime: '',
  closeTime: '',
  admissionFee: null,
  estimatedDuration: null,
  address: '',
  bestTime: '',
  latitude: null,
  longitude: null,
  displayOrder: 0,
  isActive: true
})

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
    await locationStore.create(formData.value)
    toast.success(t('admin.create_success'))
    await navigateTo('/admin/locations')
  } catch (err: unknown) {
    const apiErr = err as { data?: { error?: { message?: string; details?: { fieldErrors?: Record<string, string[]> } } } }
    const fieldErrors = apiErr?.data?.error?.details?.fieldErrors
    if (fieldErrors) {
      const msgs = Object.entries(fieldErrors).map(([f, errs]) => `${f}: ${errs[0]}`).join(', ')
      toast.error(msgs)
    } else {
      toast.error(apiErr?.data?.error?.message ?? t('error.server_error'))
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
