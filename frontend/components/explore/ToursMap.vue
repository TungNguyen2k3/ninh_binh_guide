<template>
  <div ref="mapEl" class="w-full h-full" />
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface StopLocation {
  latitude: number
  longitude: number
  nameVi: string
  nameEn: string
}

interface Stop {
  id: string
  order: number
  location: StopLocation
}

const props = defineProps<{ stops: Stop[] }>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null

function createNumberedIcon(n: number) {
  return L.divIcon({
    html: `<div style="width:26px;height:26px;border-radius:50%;background:#16a34a;color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)">${n}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

onMounted(() => {
  if (!mapEl.value || props.stops.length === 0) return

  map = L.map(mapEl.value, {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    keyboard: false,
    attributionControl: false,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
  }).addTo(map)

  const markers: L.Marker[] = []
  const latlngs: [number, number][] = []

  props.stops.forEach((stop, idx) => {
    const ll: [number, number] = [stop.location.latitude, stop.location.longitude]
    latlngs.push(ll)
    const m = L.marker(ll, { icon: createNumberedIcon(idx + 1) })
      .addTo(map!)
      .bindTooltip(stop.location.nameVi, { direction: 'top', offset: [0, -14] })
    markers.push(m)
  })

  // Polyline connecting stops
  if (latlngs.length > 1) {
    L.polyline(latlngs, {
      color: '#16a34a',
      weight: 2.5,
      opacity: 0.8,
      dashArray: '6, 5',
    }).addTo(map!)
  }

  // Fit bounds
  const group = L.featureGroup(markers)
  map.fitBounds(group.getBounds().pad(0.2))
})

onUnmounted(() => {
  map?.remove()
  map = null
})
</script>
