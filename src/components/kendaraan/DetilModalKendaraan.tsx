import React from 'react'
import {
  Bus,
  MapPin,
  Compass,
  Gauge,
  Navigation,
  Route,
  Users,
  Layers,
  Calendar,
} from 'lucide-react'
import type { VehicleEnriched } from '../../types/api'
import { LeafletMap } from '../Common/LeafletMap'
import {
  formatVehicleStatus,
  formatDateTime,
  formatCoordinate,
  formatOccupancy,
  formatTimeAgo,
} from '../../utils/formatters'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '../ui/modal'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface VehicleDetailModalProps {
  vehicle: VehicleEnriched | null
  onClose: () => void
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
}) => {
  const statusInfo = vehicle ? formatVehicleStatus(vehicle.attributes.current_status) : null
  const routeColor = vehicle?.routeData?.attributes.color
    ? `#${vehicle.routeData.attributes.color}`
    : '#005DA6'

  return (
    <Modal open={Boolean(vehicle)} onOpenChange={(open) => !open && onClose()}>
      {vehicle && statusInfo && (
        <ModalContent className="max-w-3xl p-0 gap-0 overflow-hidden">
          <ModalHeader className="bg-[#005DA6] text-white px-5 sm:px-6 py-4 flex flex-row items-center justify-between border-b-4 border-[#F39200]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#005DA6] flex items-center justify-center shadow-xs">
                <Bus className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <ModalTitle className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    Armada Bus #{vehicle.attributes.label || vehicle.id}
                  </ModalTitle>
                  {vehicle.routeData && (
                    <Badge
                      className="px-2 py-0.5 rounded text-xs font-bold text-white shadow-xs border-0"
                      style={{ backgroundColor: routeColor }}
                    >
                      Rute {vehicle.routeData.attributes.short_name || vehicle.routeData.id}
                    </Badge>
                  )}
                </div>
                <ModalDescription className="text-xs text-blue-100 font-mono text-left">
                  Identitas Unit (ID): {vehicle.id}
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>

          <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium">Status Operasional:</span>
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bgClass} ${statusInfo.textClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                  <span>{statusInfo.label}</span>
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Update: {formatDateTime(vehicle.attributes.updated_at)}</span>
                <span className="text-slate-400">({formatTimeAgo(vehicle.attributes.updated_at)})</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Posisi Geografis Terkini (Peta Interaktif)</span>
                </h4>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {formatCoordinate(vehicle.attributes.latitude, vehicle.attributes.longitude)}
                </span>
              </div>
              <LeafletMap
                latitude={vehicle.attributes.latitude}
                longitude={vehicle.attributes.longitude}
                label={vehicle.attributes.label || vehicle.id}
                routeColor={routeColor}
                statusLabel={statusInfo.label}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold text-[#005DA6] uppercase tracking-wider">
                  <Route className="w-4 h-4" />
                  <span>Informasi Rute & Koridor</span>
                </div>

                {vehicle.routeData ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nama Koridor / Rute:</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {vehicle.routeData.attributes.long_name || vehicle.routeData.attributes.description || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Kode Rute:</span>
                        <span className="font-mono font-medium text-slate-700">
                          {vehicle.routeData.attributes.short_name || vehicle.routeData.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Kategori Tarif:</span>
                        <span className="text-slate-700 font-medium">
                          {vehicle.routeData.attributes.fare_class || 'Reguler'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    ID Rute: {vehicle.relationships?.route?.data?.id || 'Tidak terhubung ke rute'}
                  </div>
                )}
              </div>

              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                  <Navigation className="w-4 h-4" />
                  <span>Informasi Perjalanan (Trip)</span>
                </div>

                {vehicle.tripData ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Arah / Headsign:</span>
                      <span className="font-semibold text-slate-800 text-sm">
                        {vehicle.tripData.attributes.headsign || vehicle.tripData.attributes.name || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Nomor Blok:</span>
                        <span className="font-mono font-medium text-slate-700">
                          {vehicle.tripData.attributes.block_id || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Aksesibilitas Kursi Roda:</span>
                        <span className="text-slate-700 font-medium">
                          {vehicle.tripData.attributes.wheelchair_accessible === 1 ? 'Tersedia (Ramah Difabel)' : 'Standar'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    ID Trip: {vehicle.relationships?.trip?.data?.id || 'Tidak ada jadwal trip aktif'}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Parameter Telemetri Armada</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Kecepatan</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">
                    {vehicle.attributes.speed !== null && vehicle.attributes.speed !== undefined
                      ? `${Math.round(vehicle.attributes.speed)} km/j`
                      : 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Sudut Kemudi</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">
                    {vehicle.attributes.bearing !== undefined ? `${vehicle.attributes.bearing}°` : 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Kapasitas Kursi</span>
                  </div>
                  <span className="font-semibold text-slate-800 text-xs">
                    {formatOccupancy(vehicle.attributes.occupancy_status)}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Urutan Halte</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">
                    {vehicle.attributes.current_stop_sequence ?? '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ModalFooter className="px-6 py-3.5 bg-slate-50 border-t border-slate-200">
            <ModalClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
              >
                Tutup
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  )
}
