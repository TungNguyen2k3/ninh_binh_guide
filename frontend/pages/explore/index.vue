<template>
  <div class="px-4 py-8 text-center">
    <div class="max-w-md mx-auto">
      <!-- Illustration placeholder -->
      <div
        class="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6"
        aria-hidden="true"
      >
        <span class="text-4xl">🗺</span>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ $t('explore.title') }}
      </h1>
      <p class="text-gray-500 text-base">
        {{ $t('explore.coming_soon') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

useHead({ title: () => t('nav.explore') })
</script>
