export function useGeolocation() {
  const position = useState<{ lat: number; lng: number } | null>('geo_position', () => null)

  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const r = (x: number) => (x * Math.PI) / 180
    const dLat = r(lat2 - lat1)
    const dLon = r(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  function distanceTo(lat: number, lng: number): number | null {
    if (!position.value) return null
    return haversineKm(position.value.lat, position.value.lng, lat, lng)
  }

  function formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
  }

  function setPosition(lat: number, lng: number) {
    position.value = { lat, lng }
  }

  return { position, distanceTo, formatDistance, setPosition }
}
