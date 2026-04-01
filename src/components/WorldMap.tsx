import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import trips, { type Trip } from '../data/trips'

const TILE_URLS = {
  day: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  night: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
} as const

function isDaytime(): boolean {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18
}

const COUNTRY_FLAGS: Record<string, string> = {
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Thailand': '🇹🇭',
  'Japan': '🇯🇵',
  'Indonesia': '🇮🇩',
  'Vietnam': '🇻🇳',
  'South Korea': '🇰🇷',
  'Australia': '🇦🇺',
  'Germany': '🇩🇪',
  'UK': '🇬🇧',
  'USA': '🇺🇸',
  'France': '🇫🇷',
  'Spain': '🇪🇸',
  'Netherlands': '🇳🇱',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽',
  'India': '🇮🇳',
  'China': '🇨🇳',
  'Philippines': '🇵🇭',
  'Cambodia': '🇰🇭',
}

function createMarkerIcon(trip: Trip, isSelected: boolean): L.DivIcon {
  const isCurrent = trip.isCurrent
  const isActive = isCurrent || isSelected
  const flag = COUNTRY_FLAGS[trip.country] ?? '📍'

  if (!isActive) {
    const dotSize = 22
    return L.divIcon({
      className: '',
      iconSize: [dotSize, dotSize],
      iconAnchor: [dotSize / 2, dotSize / 2],
      html: `
        <div style="
          width:${dotSize}px;height:${dotSize}px;cursor:pointer;
          border-radius:50%;
          background:rgba(30,30,40,0.7);
          border:1.5px solid rgba(255,255,255,0.15);
          display:flex;align-items:center;justify-content:center;
          font-size:12px;line-height:1;
          filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          transition:transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"
        >${flag}</div>
      `,
    })
  }

  const pinW = 38
  const pinH = 48
  const imgSize = 26
  const pinColor = isCurrent ? '#ff3d00' : '#f5c542'
  const scale = isSelected ? 1.1 : 1

  return L.divIcon({
    className: '',
    iconSize: [pinW, pinH],
    iconAnchor: [pinW / 2, pinH],
    popupAnchor: [0, -pinH],
    html: `
      <div style="position:relative;width:${pinW}px;height:${pinH}px;cursor:pointer;
        transform:scale(${scale});transform-origin:bottom center;transition:transform 0.2s ease;">
        <svg width="${pinW}" height="${pinH}" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg"
          style="filter:drop-shadow(0 2px 6px ${pinColor}55);">
          <path d="M19 48C19 48 36 29.5 36 17.7C36 8.5 28.39 1 19 1S2 8.5 2 17.7C2 29.5 19 48 19 48Z"
            fill="${pinColor}"/>
          <circle cx="19" cy="17.7" r="${imgSize / 2}" fill="white"/>
        </svg>
        <div style="
          position:absolute;
          top:${17.7 - imgSize / 2}px;left:${(pinW - imgSize) / 2}px;
          width:${imgSize}px;height:${imgSize}px;
          border-radius:50%;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
          font-size:15px;line-height:1;
        ">${flag}</div>
      </div>
    `,
  })
}

function getZoomForTrip(trip: Trip): number {
  const hasNearby = trips.some(
    (t) =>
      t.id !== trip.id &&
      Math.abs(t.lat - trip.lat) < 0.05 &&
      Math.abs(t.lng - trip.lng) < 0.05
  )
  return hasNearby ? 14 : 6
}

function MapUpdater({ selectedTrip }: { selectedTrip: Trip | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedTrip) {
      const zoom = getZoomForTrip(selectedTrip)
      const isMobile = window.innerWidth < 640
      const targetPoint = map.project([selectedTrip.lat, selectedTrip.lng], zoom)

      let offsetX = 0
      let offsetY = 0

      if (isMobile) {
        const panelHeight = window.innerHeight * (2 / 3)
        offsetY = panelHeight / 3
      } else {
        const panelWidth = window.innerWidth >= 1024 ? 480 : 420
        offsetX = panelWidth / 2
      }

      const offsetPoint = L.point(targetPoint.x + offsetX, targetPoint.y + offsetY)
      const offsetLatLng = map.unproject(offsetPoint, zoom)

      map.flyTo(offsetLatLng, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      })
    }
  }, [selectedTrip, map])

  return null
}

interface WorldMapProps {
  selectedTrip: Trip | null
  onSelectTrip: (trip: Trip) => void
}

export default function WorldMap({ selectedTrip, onSelectTrip }: WorldMapProps) {
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const [day, setDay] = useState(isDaytime)

  useEffect(() => {
    const interval = setInterval(() => {
      setDay(isDaytime())
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const sortedTrips = useMemo(
    () =>
      [...trips].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    []
  )

  const routePositions: [number, number][] = useMemo(
    () => sortedTrips.map((t) => [t.lat, t.lng]),
    [sortedTrips]
  )

  const center: [number, number] = useMemo(() => {
    const current = trips.find((t) => t.isCurrent)
    return current ? [current.lat, current.lng] : [20, 100]
  }, [])

  const routeColor = day ? '#ff3d0033' : '#ff3d0044'

  return (
    <MapContainer
      center={center}
      zoom={3}
      minZoom={2}
      maxZoom={18}
      zoomControl={false}
      className={`h-full w-full ${day ? 'map-day' : 'map-night'}`}
      worldCopyJump={true}
    >
      <ZoomControl position="bottomright" />

      <TileLayer
        key={day ? 'day' : 'night'}
        url={day ? TILE_URLS.day : TILE_URLS.night}
        subdomains="abcd"
      />

      <Polyline
        positions={routePositions}
        pathOptions={{
          color: routeColor,
          weight: 2,
          dashArray: '8 6',
          className: 'trip-line',
        }}
      />

      {trips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.lat, trip.lng]}
          icon={createMarkerIcon(trip, selectedTrip?.id === trip.id)}
          eventHandlers={{
            click: () => onSelectTrip(trip),
          }}
          ref={(ref) => {
            if (ref) markersRef.current.set(trip.id, ref)
          }}
        />
      ))}

      <MapUpdater selectedTrip={selectedTrip} />
    </MapContainer>
  )
}
