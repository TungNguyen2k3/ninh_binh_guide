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
const { locale, t } = useI18n()

useHead({
  htmlAttrs: { lang: locale },
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} — ${t('app.name')}` : t('app.name')
})
</script>
