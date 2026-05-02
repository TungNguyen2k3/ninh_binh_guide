<template>
  <div ref="mapEl" class="w-full h-full" />
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TouristLocation } from '~/stores/tourist.store'

const props = defineProps<{ locations: TouristLocation[] }>()
const emit = defineEmits<{ select: [location: TouristLocation] }>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markers: L.Marker[] = []

// Fix Leaflet default icon path issue with Vite
function createIcon() {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

onMounted(() => {
  if (!mapEl.value) return

  // Ninh Binh center
  map = L.map(mapEl.value).setView([20.2539, 105.9745], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  addMarkers()
})

onUnmounted(() => {
  map?.remove()
  map = null
})

function addMarkers() {
  if (!map) return
  markers.forEach(m => m.remove())
  markers = []

  props.locations.forEach((loc: TouristLocation) => {
    const marker = L.marker([loc.latitude, loc.longitude], { icon: createIcon() })
      .addTo(map!)
      .bindTooltip(loc.name, { permanent: false, direction: 'top' })
      .on('click', () => emit('select', loc))
    markers.push(marker)
  })

  // Fit map to markers if any
  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

watch(() => props.locations, addMarkers, { deep: true })
</script>
