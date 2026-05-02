<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('nav.tickets') }}</h1>
    <p class="text-gray-500 text-sm">{{ $t('staff.coming_soon') }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'staff' })
const { t } = useI18n()
useHead({ title: () => t('nav.tickets') })
</script>
