# Khoi's World Tour

An interactive map documenting DJ sets around the world.

## Getting Started

```bash
npm install
npm run dev
```

## Adding a New Stop

Edit `src/data/trips.ts` and add a new entry to the `trips` array:

```ts
{
  id: 'city-year-month',        // unique slug
  city: 'City Name',
  country: 'Country',
  lat: 0.0,                     // latitude
  lng: 0.0,                     // longitude
  date: 'YYYY-MM-DD',
  venue: 'Venue Name',          // optional
  description: 'What happened at this stop.',
  videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',  // optional
  videoType: 'youtube',         // 'youtube' | 'soundcloud' | 'direct'
  tags: ['genre', 'vibe'],      // optional
  isCurrent: false,             // set true for your current location
}
```

Move `isCurrent: true` to your latest stop to update the "NOW" indicator on the map.

## Tech Stack

- React + TypeScript
- Vite
- Leaflet / react-leaflet
- Tailwind CSS
