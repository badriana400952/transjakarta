import React from 'react'
import {
  Bus,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Gauge,
  Navigation,
} from 'lucide-react'
import type { VehicleEnriched } from '../../types/api'
import {
  formatVehicleStatus,
  formatDateTime,
  formatCoordinate,
  formatTimeAgo,
} from '../../utils/formatters'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface VehicleCardProps {
  vehicle: VehicleEnriched
  onSelect: (vehicle: VehicleEnriched) => void
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const { attributes, routeData, tripData } = vehicle
  const statusInfo = formatVehicleStatus(attributes?.current_status || '')
  const routeColor = routeData?.attributes?.color
    ? `#${routeData.attributes.color}`
    : '#005DA6'

  const nomorBus = attributes?.label || vehicle.id
  const lat = attributes?.latitude ?? 0
  const lon = attributes?.longitude ?? 0
  const updatedAt = attributes?.updated_at || ''

  return (
    <Card className="hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#005DA6] group-hover:bg-blue-50 transition flex-shrink-0">
              <Bus className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Bus #{nomorBus}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 block">
                ID: {vehicle.id}
              </span>
            </div>
          </div>

          {routeData && (
            <Badge
              className="px-2 py-0.5 rounded-md text-xs font-bold text-white shadow-2xs flex-shrink-0 border-0"
              style={{ backgroundColor: routeColor }}
              title={routeData.attributes.long_name || routeData.attributes.description}
            >
              {routeData.attributes.short_name || routeData.id}
            </Badge>
          )}
        </div>

        <div className="mt-1">
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.bgClass} ${statusInfo.textClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
            <span>{statusInfo.label}</span>
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 text-xs text-slate-600 flex-1 pt-4">
        {tripData?.attributes?.headsign && (
          <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <Navigation className="w-4 h-4 text-[#005DA6] flex-shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block leading-tight">Tujuan / Headsign:</span>
              <span className="font-semibold text-slate-800 truncate block">
                {tripData.attributes.headsign}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-slate-400 block text-[11px]">Koordinat (Lat, Long):</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCoordinate(lat, lon)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {attributes?.speed !== null && attributes?.speed !== undefined
                ? `${Math.round(attributes.speed)} km/j`
                : 'Kecepatan: N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {attributes?.bearing !== undefined
                ? `Arah: ${attributes.bearing}°`
                : 'Arah: N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-2 pt-1.5 border-t border-slate-100">
          <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-slate-400 block text-[11px]">Terakhir Diperbarui:</span>
            <span className="text-slate-700 font-medium block">
              {formatDateTime(updatedAt)}
            </span>
            <span className="text-[10px] text-slate-400">
              ({formatTimeAgo(updatedAt)})
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/80 border-t border-slate-100 pt-3">
        <Button
          type="button"
          variant="tjOutline"
          size="sm"
          onClick={() => onSelect(vehicle)}
          className="w-full justify-center group-hover:bg-[#005DA6] group-hover:text-white"
        >
          <span>Detail Armada & Peta</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
