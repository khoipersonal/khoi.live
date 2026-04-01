import { useState, useCallback } from 'react'
import WorldMap from './components/WorldMap'
import TripPanel from './components/TripPanel'
import Sidebar from './components/Sidebar'
import trips, { type Trip, getCurrentTrip } from './data/trips'

export default function App() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(
    getCurrentTrip() ?? null
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSelectTrip = useCallback((trip: Trip) => {
    setSelectedTrip(trip)
    setSidebarOpen(false)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedTrip(null)
  }, [])

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-night">
      <Sidebar
        trips={trips}
        selectedTrip={selectedTrip}
        onSelectTrip={handleSelectTrip}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="relative flex-1">
        <WorldMap selectedTrip={selectedTrip} onSelectTrip={handleSelectTrip} />

        {selectedTrip && (
          <TripPanel trip={selectedTrip} onClose={handleClosePanel} />
        )}
      </div>
    </div>
  )
}
