import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check, X, Search, Loader2, Navigation } from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { usePerjalanan } from '../../hooks/usePerjalanan'

interface MultiSelectTripProps {
  selectedTrips: string[]
  onChange: (tripIds: string[]) => void
  selectedRoutes: string[]
}

const PAGE_SIZE = 25

export const MultiSelectTrip: React.FC<MultiSelectTripProps> = ({
  selectedTrips,
  onChange,
  selectedRoutes,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    perjalanan,
    hasMore,
    isLoading,
    isLoadingMore,
    error: loadError,
    fetchMore: fetchMoreTrips,
    retry: retryInitialTrips,
  } = usePerjalanan(selectedRoutes, PAGE_SIZE)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<number | null>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 40) {
      if (scrollTimeoutRef.current === null) {
        fetchMoreTrips()
        scrollTimeoutRef.current = window.setTimeout(() => {
          scrollTimeoutRef.current = null
        }, 400)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleSelect = (id: string) => {
    if (selectedTrips.includes(id)) {
      onChange(selectedTrips.filter((item) => item !== id))
    } else {
      onChange([...selectedTrips, id])
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  const filteredTrips = perjalanan.filter((t) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const headsign = t.attributes.headsign?.toLowerCase() || ''
    const name = t.attributes.name?.toLowerCase() || ''
    const id = t.id.toLowerCase()
    return headsign.includes(q) || name.includes(q) || id.includes(q)
  })

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        Filter Trip / Arah Perjalanan ({selectedTrips.length} dipilih)
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3 py-2 bg-white border border-slate-300 rounded-lg text-left text-sm flex items-center justify-between shadow-xs hover:border-[#005DA6] transition focus:outline-none focus:ring-2 focus:ring-[#005DA6]/20 cursor-pointer"
      >
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden pr-2">
          {selectedTrips.length === 0 ? (
            <span className="text-slate-400 text-xs sm:text-sm">Semua Trip (Pilih satu atau lebih)</span>
          ) : (
            <>
              <Badge variant="warning" className="text-xs font-semibold px-2 py-0.5 rounded-md">
                {selectedTrips.length} Trip Terpilih
              </Badge>
              <span className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                {selectedTrips.join(', ')}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          {selectedTrips.length > 0 && (
            <span
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="Bersihkan pilihan trip"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full sm:min-w-[340px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-slate-800">
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400 z-10" />
            <Input
              type="text"
              placeholder="Cari arah / nama trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between px-1 pb-1.5 mb-1 border-b border-slate-100 text-[11px] text-slate-500">
            <span>
              Dimuat: {perjalanan.length} trip {hasMore ? '(Gulir ke bawah)' : '(Semua terambil)'}
            </span>
            {selectedTrips.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-rose-600 hover:underline font-medium cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1"
          >
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs">
                <Loader2 className="w-5 h-5 animate-spin text-[#005DA6] mb-1.5" />
                Memuat daftar trip...
              </div>
            ) : loadError ? (
              <div className="py-4 px-2 text-center text-rose-600 text-xs">
                <p>{loadError}</p>
                <button
                  type="button"
                  onClick={retryInitialTrips}
                  className="mt-2 text-xs font-semibold text-[#005DA6] hover:underline cursor-pointer"
                >
                  Coba lagi
                </button>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                Tidak ada data trip yang cocok
              </div>
            ) : (
              filteredTrips.map((trip) => {
                const isSelected = selectedTrips.includes(trip.id)
                const routeId = trip.relationships?.route?.data?.id

                return (
                  <div
                    key={trip.id}
                    onClick={() => toggleSelect(trip.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                      isSelected ? 'bg-amber-50/80 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition"
                        style={{
                          borderColor: isSelected ? '#d98200' : '#cbd5e1',
                          backgroundColor: isSelected ? '#f39200' : 'transparent',
                        }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>

                      <Navigation className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

                      <div className="truncate">
                        <span className="text-slate-800 font-medium truncate block">
                          {trip.attributes.headsign || trip.attributes.name || `Trip #${trip.id}`}
                        </span>
                        {routeId && (
                          <span className="text-[10px] text-slate-400 block">
                            Rute: {routeId}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono ml-2 flex-shrink-0">
                      #{trip.id.slice(-6)}
                    </span>
                  </div>
                )
              })
            )}

            {isLoadingMore && (
              <div className="py-2.5 flex items-center justify-center text-xs text-slate-500 space-x-2 bg-slate-50 rounded">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#005DA6]" />
                <span>Memuat trip berikutnya...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
