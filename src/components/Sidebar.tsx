import { type Trip } from '../data/trips'

interface SidebarProps {
  trips: Trip[]
  selectedTrip: Trip | null
  onSelectTrip: (trip: Trip) => void
  isOpen: boolean
  onToggle: () => void
  hideMobileToggle?: boolean
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export default function Sidebar({
  trips,
  selectedTrip,
  onSelectTrip,
  isOpen,
  onToggle,
  hideMobileToggle,
}: SidebarProps) {
  const sorted = [...trips].sort((a, b) => {
    if (a.isCurrent) return -1
    if (b.isCurrent) return 1

    const aIsSameCityAsCurrent = trips.some((t) => t.isCurrent && t.city === a.city)
    const bIsSameCityAsCurrent = trips.some((t) => t.isCurrent && t.city === b.city)
    if (aIsSameCityAsCurrent && !bIsSameCityAsCurrent) return -1
    if (!aIsSameCityAsCurrent && bIsSameCityAsCurrent) return 1

    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className={`absolute top-4 left-4 z-1000 flex h-10 w-10 items-center justify-center rounded-xl bg-surface/90 text-mist backdrop-blur-lg transition-colors hover:bg-surface-light hover:text-fg sm:hidden ${hideMobileToggle || isOpen ? 'hidden' : ''}`}
        aria-label="Toggle sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={`
          absolute top-0 left-0 z-999 flex h-full w-72 flex-col
          border-r border-surface-light/30 bg-deep/95 backdrop-blur-xl
          transition-transform duration-300
          sm:relative sm:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="shrink-0 px-5 pt-6 pb-4">
          <h1 className="font-display text-3xl italic tracking-tight text-fg">
            khoi<span className="text-accent">.live</span>
          </h1>
          <p className="mt-2 text-xs text-ghost">
            {trips.length} stops &middot;{' '}
            {new Set(trips.map((t) => t.country)).size} countries
          </p>
        </div>

        <div className="mx-5 mb-3 h-px bg-surface-light/50" />

        <div className="scrollbar-hidden flex-1 overflow-y-auto px-3 pb-6">
          {sorted.map((trip, i) => {
            const isActive = selectedTrip?.id === trip.id
            return (
              <button
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className={`
                  group mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all
                  ${isActive ? 'bg-surface-light/60' : 'hover:bg-surface/60'}
                `}
              >
                <div className="relative mt-1 flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full border-2 transition-colors ${
                      trip.isCurrent
                        ? 'border-accent bg-accent shadow-[0_0_8px_var(--color-accent)]'
                        : isActive
                          ? 'border-gold bg-gold'
                          : 'border-ghost bg-transparent group-hover:border-mist'
                    }`}
                  />
                  {i < sorted.length - 1 && (
                    <div className="mt-1 h-8 w-px bg-surface-light/60" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`truncate text-sm font-medium ${
                        isActive ? 'text-fg' : 'text-mist group-hover:text-fg'
                      }`}
                    >
                      {trip.city}
                    </span>
                    {trip.isCurrent && (
                      <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                        NOW
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ghost">
                    {trip.country} &middot; {formatShortDate(trip.date)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="shrink-0 border-t border-surface-light/30 px-5 py-4">
          <a
            href="mailto:bookings@khoi.live?subject=Booking%20Inquiry&body=Hi%20Khoi%2C%0A%0AI'd%20like%20to%20inquire%20about%20booking%20you%20for%20an%20event.%0A%0ADetails%3A%0A"
            className="block text-center text-[10px] uppercase tracking-[0.2em] text-ghost transition-colors hover:text-accent"
          >
            Bookings
          </a>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-998 bg-black/50 sm:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
