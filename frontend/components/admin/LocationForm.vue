<template>
  <form class="space-y-5" @submit.prevent="$emit('submit')">
    <!-- Name fields — side by side on md+ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <AppInput
        :label="$t('location.name_vi')"
        :placeholder="$t('location.name_vi')"
        :model-value="modelValue.nameVi"
        :error="errors.nameVi"
        required
        @update:model-value="handleChange('nameVi', $event)"
      />
      <AppInput
        :label="$t('location.name_en')"
        :placeholder="$t('location.name_en')"
        :model-value="modelValue.nameEn"
        :error="errors.nameEn"
        required
        @update:model-value="handleChange('nameEn', $event)"
      />
    </div>

    <!-- Slug -->
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">
          {{ $t('location.slug') }}
          <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
        </label>
        <button
          type="button"
          class="text-xs text-brand-600 hover:text-brand-700 font-medium"
          @click="autoGenerateSlug"
        >
          {{ $t('location.generate_slug') }}
        </button>
      </div>
      <input
        :value="modelValue.slug"
        type="text"
        :placeholder="$t('location.slug')"
        class="block w-full rounded-xl border px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none"
        :class="errors.slug
          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'"
        @input="handleChange('slug', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errors.slug" class="text-sm text-red-600" role="alert">{{ errors.slug }}</p>
      <p v-else class="text-xs text-gray-400">{{ $t('location.slug') }}: /explore/{{ modelValue.slug || '...' }}</p>
    </div>

    <!-- Description fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">{{ $t('location.description_vi') }}</label>
        <textarea
          :value="modelValue.descriptionVi"
          rows="4"
          :placeholder="$t('location.description_vi')"
          class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
          @input="handleChange('descriptionVi', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">{{ $t('location.description_en') }}</label>
        <textarea
          :value="modelValue.descriptionEn"
          rows="4"
          :placeholder="$t('location.description_en')"
          class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
          @input="handleChange('descriptionEn', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </div>

    <!-- Coordinates -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          {{ $t('location.latitude') }}
          <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
        </label>
        <input
          :value="modelValue.latitude ?? ''"
          type="number"
          step="any"
          min="-90"
          max="90"
          placeholder="20.2547"
          class="block w-full rounded-xl border px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none"
          :class="errors.latitude
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'"
          @input="handleNumberChange('latitude', ($event.target as HTMLInputElement).value)"
        />
        <p v-if="errors.latitude" class="text-sm text-red-600" role="alert">{{ errors.latitude }}</p>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          {{ $t('location.longitude') }}
          <span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
        </label>
        <input
          :value="modelValue.longitude ?? ''"
          type="number"
          step="any"
          placeholder="105.9775"
          class="block w-full rounded-xl border px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none"
          :class="errors.longitude
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200'"
          @input="handleNumberChange('longitude', ($event.target as HTMLInputElement).value)"
        />
        <p v-if="errors.longitude" class="text-sm text-red-600" role="alert">{{ errors.longitude }}</p>
      </div>
    </div>

    <!-- Display order + isActive -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">{{ $t('location.display_order') }}</label>
        <input
          :value="modelValue.displayOrder"
          type="number"
          min="0"
          placeholder="0"
          class="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          @input="handleNumberChange('displayOrder', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex items-center gap-3 pt-6">
        <button
          type="button"
          role="switch"
          :aria-checked="modelValue.isActive"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          :class="modelValue.isActive ? 'bg-brand-600' : 'bg-gray-200'"
          @click="handleChange('isActive', !modelValue.isActive)"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="modelValue.isActive ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
        <span class="text-sm font-medium text-gray-700">
          {{ modelValue.isActive ? $t('common.active') : $t('common.inactive') }}
        </span>
      </div>
    </div>

    <!-- Submit button -->
    <div class="flex justify-end pt-2">
      <AppButton type="submit" :loading="isLoading" class="min-w-32">
        {{ isLoading ? $t('common.saving') : $t('common.save') }}
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { LocationFormData } from '~/stores/location.store'

interface Props {
  modelValue: LocationFormData
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: LocationFormData]
  submit: []
}>()

// Per-field validation errors
const errors = reactive<Partial<Record<keyof LocationFormData, string>>>({})

function validateSlug(slug: string): string | undefined {
  if (!slug) return 'Slug là bắt buộc'
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'
  return undefined
}

function handleChange<K extends keyof LocationFormData>(key: K, value: LocationFormData[K]): void {
  emit('update:modelValue', { ...props.modelValue, [key]: value })

  // Clear error on change, re-validate slug immediately
  if (key === 'slug') {
    errors.slug = validateSlug(value as string)
  } else if (key in errors) {
    delete errors[key as keyof typeof errors]
  }
}

function handleNumberChange(key: 'latitude' | 'longitude' | 'displayOrder', raw: string): void {
  const num = raw === '' ? null : parseFloat(raw)
  emit('update:modelValue', { ...props.modelValue, [key]: num })

  if (key === 'latitude' || key === 'longitude') {
    delete errors[key]
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd') // đ → d
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function autoGenerateSlug(): void {
  const slug = generateSlug(props.modelValue.nameVi)
  handleChange('slug', slug)
}
</script>
