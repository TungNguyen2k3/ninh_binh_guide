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
    </div>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TouristLocation } from '~/stores/tourist.store'
import type { TourStop } from '~/stores/tour.store'

const props = defineProps<{
  locations: TouristLocation[]
  tourStops?: Array<{
    order: number
    suggestedTime?: string | null
    suggestedDuration?: string | null
    location: {
      nameVi: string
      nameEn: string
      slug: string
      latitude: number
      longitude: number
      imageUrl?: string | null
    }
  }>
}>()

const emit = defineEmits<{
  select: [location: TouristLocation]
  selectTourStop: [stop: TourStop]
  locate: [lat: number, lng: number]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markers: L.Marker[] = []
let userMarker: L.CircleMarker | null = null
let routeLine: L.Polyline | null = null

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

function createNumberedIcon(n: number) {
  return L.divIcon({
    html: `<div style="width:28px;height:28px;border-radius:50%;background:#16a34a;color:white;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)">${n}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
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

  if (props.tourStops && props.tourStops.length > 0) {
    // TOUR MODE: numbered markers
    props.tourStops.forEach((stop, idx) => {
      const { latitude, longitude } = stop.location
      const icon = createNumberedIcon(idx + 1)
      const marker = L.marker([latitude, longitude], { icon })
        .addTo(map!)
        .on('click', () => emit('selectTourStop', stop as unknown as TourStop))
      markers.push(marker)
    })

    // Tour polyline
    if (routeLine) { routeLine.remove(); routeLine = null }
    const latlngs = props.tourStops.map(s => [s.location.latitude, s.location.longitude] as [number, number])
    routeLine = L.polyline(latlngs, { color: '#16a34a', weight: 3, opacity: 0.8, dashArray: '8, 6' }).addTo(map!)
  } else {
    // NORMAL MODE: standard markers
    props.locations.forEach((loc: TouristLocation) => {
      const marker = L.marker([loc.latitude, loc.longitude], { icon: createIcon() })
        .addTo(map!)
        .bindTooltip(loc.name, { permanent: false, direction: 'top' })
        .on('click', () => emit('select', loc))
      markers.push(marker)
    })
  }

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
    emit('locate', e.latlng.lat, e.latlng.lng)
  })
  map.once('locationerror', () => {
    // Silent fail — geolocation denied or unavailable
  })
}

watch([() => props.locations, () => props.tourStops], () => {
  addMarkers()
}, { deep: true })
</script>
