<template>
  <div class="relative w-full h-full">
    <div ref="mapEl" class="w-full h-full" />
    <!-- Map controls overlay -->
    <div class="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
      <!-- GPS button -->
      <button
        type="button"
        class="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-lg hover:bg-blue-50 transition-colors border border-gray-200"
        title="Vị trí của tôi"
        @click="locateUser"
      >📍</button>
      <!-- Route toggle -->
      <button
        type="button"
        class="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center text-lg transition-colors border"
        :class="showRoute ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 hover:bg-green-50'"
        title="Tuyến đường gợi ý"
        @click="toggleRoute"
      >🗺️</button>
    </div>
  </div>
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
let userMarker: L.CircleMarker | null = null
let routeLine: L.Polyline | null = null

const showRoute = ref(false)

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

function locateUser() {
  if (!map) return
  map.locate({ setView: false, maxZoom: 14 })
  map.once('locationfound', (e) => {
    // Remove old user marker
    if (userMarker) { userMarker.remove(); userMarker = null }
    // Add pulsing blue circle
    userMarker = L.circleMarker(e.latlng, {
      radius: 10,
      fillColor: '#3B82F6',
      fillOpacity: 0.9,
      color: '#fff',
      weight: 3,
    }).addTo(map!).bindTooltip('Vị trí của bạn', { permanent: false, direction: 'top' })
    map!.setView(e.latlng, 14)
  })
  map.once('locationerror', () => {
    // Silent fail — geolocation denied or unavailable
  })
}

function toggleRoute() {
  if (!map) return
  showRoute.value = !showRoute.value
  if (!showRoute.value) {
    routeLine?.remove()
    routeLine = null
    return
  }
  drawRoute()
}

function drawRoute() {
  if (!map) return
  routeLine?.remove()
  routeLine = null
  const sorted = [...props.locations].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  const latlngs = sorted.map(l => [l.latitude, l.longitude] as [number, number])
  routeLine = L.polyline(latlngs, {
    color: '#16a34a',
    weight: 3,
    opacity: 0.7,
    dashArray: '8, 6',
  }).addTo(map!)
}

watch(() => props.locations, () => {
  addMarkers()
  if (showRoute.value) {
    drawRoute()
  }
}, { deep: true })
</script>
