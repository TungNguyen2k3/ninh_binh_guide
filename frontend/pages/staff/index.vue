<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'staff' })

if (import.meta.client) {
  await navigateTo('/staff/tickets', { replace: true })
}
</script>
