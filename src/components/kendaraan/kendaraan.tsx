import React from 'react'
import { AlertCircle, RotateCcw, BusFront } from 'lucide-react'
import { VehicleCard } from './CardKendaraan'
import { LoadingSkeleton } from '../Common/LoadingSkeleton'
import type { VehicleEnriched } from '../../types/api'
import { Button } from '../ui/button'

interface VehicleGridProps {
  kendaraan: VehicleEnriched[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onSelectVehicle: (vehicle: VehicleEnriched) => void
  itemsPerPage: number
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  kendaraan,
  isLoading,
  error,
  onRetry,
  onSelectVehicle,
  itemsPerPage,
}) => {
  if (isLoading) {
    return <LoadingSkeleton count={itemsPerPage} />
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto my-8">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3.5">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          Kendala Memuat Data Armada
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
          {error}
        </p>
        <Button
          type="button"
          onClick={onRetry}
          size="sm"
          className="text-xs sm:text-sm font-semibold"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          <span>Muat Ulang Data</span>
        </Button>
      </div>
    )
  }

  if (kendaraan.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3.5">
          <BusFront className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
          Tidak Ada Armada Ditemukan
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Tidak ada data bus aktif yang sesuai dengan filter rute atau trip yang Anda pilih. Silakan sesuaikan atau reset filter pencarian Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {kendaraan.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onSelect={onSelectVehicle}
        />
      ))}
    </div>
  )
}
