<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- Global toast container — rendered outside layout hierarchy -->
    <AppToast />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

// Set <html lang> attribute reactively
useHead({
  htmlAttrs: {
    lang: locale
  },
  titleTemplate: (titleChunk) => {
    const { t } = useI18n()
    return titleChunk
      ? `${titleChunk} — ${t('app.name')}`
      : t('app.name')
  }
})
</script>
