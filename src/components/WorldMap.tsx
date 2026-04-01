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

const PIN_W = 36
const PIN_H = 46
const IMG_SIZE = 24

function createMarkerIcon(trip: Trip, isSelected: boolean): L.DivIcon {
  const isCurrent = trip.isCurrent
  const scale = isSelected ? 1.15 : 1
  const pinColor = isCurrent ? '#ff3d00' : isSelected ? '#f5c542' : '#a8d8ea'
  const shadow = isCurrent || isSelected
    ? `filter:drop-shadow(0 2px 6px ${pinColor}66);`
    : 'filter:drop-shadow(0 1px 3px rgba(0,0,0,0.4));'

  const initial = trip.city.charAt(0).toUpperCase()

  return L.divIcon({
    className: '',
    iconSize: [PIN_W, PIN_H],
    iconAnchor: [PIN_W / 2, PIN_H],
    popupAnchor: [0, -PIN_H],
    html: `
      <div style="position:relative;width:${PIN_W}px;height:${PIN_H}px;cursor:pointer;
        transform:scale(${scale});transform-origin:bottom center;transition:transform 0.2s ease;">
        <svg width="${PIN_W}" height="${PIN_H}" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg"
          style="${shadow}">
          <path d="M18 46C18 46 34 28.35 34 17C34 8.16 26.84 1 18 1S2 8.16 2 17C2 28.35 18 46 18 46Z"
            fill="${pinColor}"/>
          <circle cx="18" cy="17" r="${IMG_SIZE / 2}" fill="white"/>
        </svg>
        <div style="
          position:absolute;
          top:${17 - IMG_SIZE / 2}px;left:${(PIN_W - IMG_SIZE) / 2}px;
          width:${IMG_SIZE}px;height:${IMG_SIZE}px;
          border-radius:50%;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
          font-family:var(--font-display);font-size:13px;font-weight:500;
          color:${pinColor};
        ">${initial}</div>
      </div>
    `,
  })
}

function MapUpdater({ selectedTrip }: { selectedTrip: Trip | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedTrip) {
      const isMobile = window.innerWidth < 640
      const targetPoint = map.project([selectedTrip.lat, selectedTrip.lng], 6)

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
      const offsetLatLng = map.unproject(offsetPoint, 6)

      map.flyTo(offsetLatLng, 6, {
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
