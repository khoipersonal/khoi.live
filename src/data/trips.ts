export interface Trip {
  id: string
  city: string
  country: string
  lat: number
  lng: number
  date: string
  venue?: string
  description: string
  videoUrl?: string
  videoType?: 'youtube' | 'soundcloud' | 'direct'
  coverImage?: string
  isCurrent?: boolean
}

const trips: Trip[] = [
  {
    id: 'kuala-lumpur-2026-04',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    lat: 3.1412,
    lng: 101.6953,
    date: '2026-04-01',
    venue: 'REXKL',
    description:
      'The World Tour begins in KL. First stop, first set — let\'s go.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
    isCurrent: true,
  },
  {
    id: 'kuala-lumpur-2026-04-b',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    lat: 3.1579,
    lng: 101.7115,
    date: '2026-04-05',
    venue: 'Zouk KL',
    description:
      'Second set in KL at Zouk. Different crowd, different energy.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
  },
  {
    id: 'singapore-2026-04',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.2840,
    lng: 103.8596,
    date: '2026-04-12',
    venue: 'Marquee Singapore',
    description:
      'Crossed into Singapore. Marquee is insane — three stories of sound.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
  },
  {
    id: 'bangkok-2026-04',
    city: 'Bangkok',
    country: 'Thailand',
    lat: 13.7237,
    lng: 100.5790,
    date: '2026-04-20',
    venue: 'Beam Club',
    description:
      'Bangkok heat. Rooftop set as the sun dropped over the skyline.',
  },
  {
    id: 'tokyo-2026-05',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6614,
    lng: 139.6980,
    date: '2026-05-03',
    venue: 'WOMB Shibuya',
    description:
      'Tokyo. The crowd at WOMB was something else — 4 hour extended set.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoType: 'youtube',
  },
  {
    id: 'bali-2026-05',
    city: 'Bali',
    country: 'Indonesia',
    lat: -8.8185,
    lng: 115.1550,
    date: '2026-05-15',
    venue: 'Savaya',
    description:
      'Cliff-side set in Bali overlooking the Indian Ocean. Unreal.',
  },
]

export default trips

export function getTripById(id: string): Trip | undefined {
  return trips.find((t) => t.id === id)
}

export function getCurrentTrip(): Trip | undefined {
  return trips.find((t) => t.isCurrent)
}

export function getSortedTrips(): Trip[] {
  return [...trips].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
