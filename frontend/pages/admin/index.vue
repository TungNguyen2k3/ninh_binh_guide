<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('nav.dashboard') }}</h1>
    <p class="text-gray-500 text-sm">{{ $t('admin.coming_soon') }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: () => t('nav.dashboard') })
const { t } = useI18n()
</script>
