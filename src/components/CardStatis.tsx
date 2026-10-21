import React from 'react'
import { Activity, Compass, MapPin, Bus } from 'lucide-react'
import type { VehicleEnriched } from '../types/api'
import { Card } from './ui/card'

interface StatsOverviewProps {
  kendaraan: VehicleEnriched[]
  totalCount: number
  isLoading: boolean
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ kendaraan = [], totalCount = 0, isLoading }) => {
  const safeKendaraan = Array.isArray(kendaraan) ? kendaraan : []
  const inTransitCount = safeKendaraan.filter((v) => v?.attributes?.current_status === 'IN_TRANSIT_TO').length
  const stoppedCount = safeKendaraan.filter((v) => v?.attributes?.current_status === 'STOPPED_AT').length
  const incomingCount = safeKendaraan.filter((v) => v?.attributes?.current_status === 'INCOMING_AT').length

  const stats = [
    {
      label: 'Total Terpantau',
      value: isLoading ? '...' : totalCount.toLocaleString('id-ID'),
      subtext: `${kendaraan.length} armada di halaman ini`,
      icon: Bus,
      iconBg: 'bg-blue-100 text-[#005DA6]',
      borderHover: 'hover:border-blue-300',
    },
    {
      label: 'Sedang Bergerak',
      value: isLoading ? '...' : inTransitCount,
      subtext: 'Status IN_TRANSIT_TO',
      icon: Activity,
      iconBg: 'bg-emerald-100 text-emerald-700',
      borderHover: 'hover:border-emerald-300',
    },
    {
      label: 'Berhenti di Halte',
      value: isLoading ? '...' : stoppedCount,
      subtext: 'Status STOPPED_AT',
      icon: MapPin,
      iconBg: 'bg-amber-100 text-amber-700',
      borderHover: 'hover:border-amber-300',
    },
    {
      label: 'Mendekati Halte',
      value: isLoading ? '...' : incomingCount,
      subtext: 'Status INCOMING_AT',
      icon: Compass,
      iconBg: 'bg-indigo-100 text-indigo-700',
      borderHover: 'hover:border-indigo-300',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className={`p-3 sm:p-4 transition duration-150 ${stat.borderHover}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {stat.value}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              {stat.subtext}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
