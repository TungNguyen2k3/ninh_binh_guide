<script setup lang="ts">
definePageMeta({ layout: 'staff' })

if (import.meta.client) {
  window.location.href = '/staff/tickets'
}
</script>
