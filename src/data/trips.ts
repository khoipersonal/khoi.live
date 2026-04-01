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
    lat: 3.139,
    lng: 101.6869,
    date: '2026-04-01',
    description:
      'The World Tour begins in KL. First stop, first set — let\'s go.',
    isCurrent: true,
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
