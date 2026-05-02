<template>
  <div class="p-4">
    <h1 class="text-xl font-bold text-gray-900 mb-1">{{ $t('nav.list') }}</h1>
    <p class="text-gray-500 text-sm">{{ $t('explore.coming_soon') }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
useHead({ title: () => t('nav.list') })
</script>
