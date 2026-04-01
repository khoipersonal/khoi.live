import { type Trip } from '../data/trips'

interface TripPanelProps {
  trip: Trip
  onClose: () => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function VideoEmbed({ trip }: { trip: Trip }) {
  if (!trip.videoUrl) return null

  if (trip.videoType === 'youtube' || trip.videoUrl.includes('youtube')) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={trip.videoUrl}
          title={`${trip.city} DJ Set`}
          className="absolute inset-0 h-full w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={trip.videoUrl}
        title={`${trip.city} DJ Set`}
        className="absolute inset-0 h-full w-full rounded-xl"
        allowFullScreen
      />
    </div>
  )
}

export default function TripPanel({ trip, onClose }: TripPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-1000 flex h-2/3 w-full flex-col overflow-hidden rounded-t-2xl bg-deep/95 backdrop-blur-xl animate-slide-up sm:left-auto sm:top-0 sm:h-full sm:w-[420px] sm:rounded-t-none sm:animate-float-in lg:w-[480px]">
      <div className="flex items-center justify-between border-b border-surface-light/50 px-6 py-4">
        <div className="flex items-center gap-3">
          {trip.isCurrent && (
            <span className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              NOW
            </span>
          )}
          <span className="text-sm text-ghost">{formatDate(trip.date)}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ghost transition-colors hover:bg-surface-light hover:text-fg"
          aria-label="Close panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="px-6 pt-6 pb-2">
          <h2 className="font-display text-4xl leading-tight tracking-tight text-fg">
            {trip.city}
          </h2>
          <p className="mt-1 text-lg text-mist">{trip.country}</p>
          {trip.venue && (
            <p className="mt-3 flex items-center gap-2 text-sm text-ghost">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.167A4.088 4.088 0 002.917 5.25C2.917 8.313 7 12.833 7 12.833s4.083-4.52 4.083-7.583A4.088 4.088 0 007 1.167zm0 5.541a1.458 1.458 0 110-2.916 1.458 1.458 0 010 2.916z" fill="currentColor" />
              </svg>
              {trip.venue}
            </p>
          )}
        </div>

        {trip.videoUrl && (
          <div className="px-6 pb-6">
            <VideoEmbed trip={trip} />
          </div>
        )}
      </div>
    </div>
  )
}
