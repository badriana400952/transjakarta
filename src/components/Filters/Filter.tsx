import React from 'react'
import { Filter, RotateCcw, X } from 'lucide-react'
import { MultiSelectRoute } from './MultiSelectRoute'
import { MultiSelectTrip } from './MultiSelectTrip'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

interface FilterBarProps {
  selectedRoutes: string[]
  selectedTrips: string[]
  onRoutesChange: (routes: string[]) => void
  onTripsChange: (trips: string[]) => void
  onResetFilters: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedRoutes,
  selectedTrips,
  onRoutesChange,
  onTripsChange,
  onResetFilters,
}) => {
  const hasActiveFilters = selectedRoutes.length > 0 || selectedTrips.length > 0

  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#005DA6] flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Filter Pencarian Armada
              </h2>
              <p className="text-xs text-slate-500">
                Saring bus secara spesifik berdasarkan koridor rute dan perjalanan (trip).
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border-rose-200 self-start sm:self-auto h-8"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Semua Filter</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelectRoute
            selectedRoutes={selectedRoutes}
            onChange={onRoutesChange}
          />
          <MultiSelectTrip
            selectedTrips={selectedTrips}
            onChange={onTripsChange}
            selectedRoutes={selectedRoutes}
          />
        </div>

        {hasActiveFilters && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Filter Aktif:</span>
            {selectedRoutes.map((r) => (
              <Badge
                key={`route-${r}`}
                variant="info"
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
              >
                <span>Rute: {r}</span>
                <button
                  type="button"
                  onClick={() => onRoutesChange(selectedRoutes.filter((id) => id !== r))}
                  className="hover:text-blue-900 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}

            {selectedTrips.map((t) => (
              <Badge
                key={`trip-${t}`}
                variant="warning"
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
              >
                <span>Trip: #{t.slice(-6)}</span>
                <button
                  type="button"
                  onClick={() => onTripsChange(selectedTrips.filter((id) => id !== t))}
                  className="hover:text-amber-950 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
