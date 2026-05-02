<template>
  <div />
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Only run client-side — auth store is empty during SSR
if (import.meta.client) {
  if (authStore.isAdmin) {
    await navigateTo('/admin', { replace: true })
  } else if (authStore.isStaff) {
    await navigateTo('/staff/tickets', { replace: true })
  } else {
    await navigateTo('/explore', { replace: true })
  }
}
</script>
