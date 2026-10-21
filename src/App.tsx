import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { StatsOverview } from './components/CardStatis'
import { FilterBar } from './components/Filters/Filter'
import { VehicleGrid } from './components/kendaraan/kendaraan'
import { Pagination } from './components/Common/Pagination'
import { VehicleDetailModal } from './components/kendaraan/DetilModalKendaraan'
import { useGetKendaraan } from './hooks/useKendaraan'
import type { VehicleEnriched } from './types/api'
import { Navbar } from './components/Navbar'

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const currentPage = isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl

  const limitFromUrl = parseInt(searchParams.get('limit') || '12', 10)
  const pageSize = [6, 12, 24, 48].includes(limitFromUrl) ? limitFromUrl : 12

  const selectedRoutes = useMemo(() => {
    const raw = searchParams.get('routes')
    return raw ? raw.split(',').filter(Boolean) : []
  }, [searchParams])

  const selectedTrips = useMemo(() => {
    const raw = searchParams.get('trips')
    return raw ? raw.split(',').filter(Boolean) : []
  }, [searchParams])

  const vehicleIdFromUrl = searchParams.get('vehicle')

  const {
    kendaraan,
    totalCount,
    isLoading,
    error,
    refresh: handleRefresh,
    lastFetchedAt,
  } = useGetKendaraan({
    page: currentPage,
    pageSize,
    selectedRoutes,
    selectedTrips,
  })

  const selectedVehicle = useMemo(() => {
    if (!vehicleIdFromUrl) return null
    return kendaraan.find((v) => v.id === vehicleIdFromUrl) || null
  }, [vehicleIdFromUrl, kendaraan])

  const updateUrlParams = useCallback(
    (newParams: {
      page?: number
      limit?: number
      routes?: string[]
      trips?: string[]
      vehicle?: string | null
    }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)

        if (newParams.page !== undefined) {
          if (newParams.page === 1) next.delete('page')
          else next.set('page', String(newParams.page))
        }

        if (newParams.limit !== undefined) {
          if (newParams.limit === 12) next.delete('limit')
          else next.set('limit', String(newParams.limit))
        }

        if (newParams.routes !== undefined) {
          if (newParams.routes.length === 0) next.delete('routes')
          else next.set('routes', newParams.routes.join(','))
        }

        if (newParams.trips !== undefined) {
          if (newParams.trips.length === 0) next.delete('trips')
          else next.set('trips', newParams.trips.join(','))
        }

        if (newParams.vehicle !== undefined) {
          if (!newParams.vehicle) next.delete('vehicle')
          else next.set('vehicle', newParams.vehicle)
        }

        return next
      })
    },
    [setSearchParams]
  )

  const handleRoutesChange = (routes: string[]) => {
    updateUrlParams({ routes, page: 1 })
  }

  const handleTripsChange = (trips: string[]) => {
    updateUrlParams({ trips, page: 1 })
  }

  const handleResetFilters = () => {
    updateUrlParams({ routes: [], trips: [], page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newSize: number) => {
    updateUrlParams({ limit: newSize, page: 1 })
  }

  const handleOpenDetail = (vehicle: VehicleEnriched) => {
    updateUrlParams({ vehicle: vehicle.id })
  }

  const handleCloseDetail = () => {
    updateUrlParams({ vehicle: null })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
        lastFetchedAt={lastFetchedAt}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sistem Manajemen Armada & Pemantauan Bus
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau koordinat posisi, status operasional, serta jadwal rute bus secara waktu nyata (real-time).
            </p>
          </div>
        </div>

        <StatsOverview
          kendaraan={kendaraan}
          totalCount={totalCount}
          isLoading={isLoading}
        />

        <FilterBar
          selectedRoutes={selectedRoutes}
          selectedTrips={selectedTrips}
          onRoutesChange={handleRoutesChange}
          onTripsChange={handleTripsChange}
          onResetFilters={handleResetFilters}
        />

        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            Daftar Armada Aktif
          </span>
          {kendaraan.length > 0 && !isLoading && (
            <span>
              Menampilkan {kendaraan.length} bus pada halaman {currentPage}
            </span>
          )}
        </div>

        <VehicleGrid
          kendaraan={kendaraan}
          isLoading={isLoading}
          error={error}
          onRetry={handleRefresh}
          onSelectVehicle={handleOpenDetail}
          itemsPerPage={pageSize}
        />

        {!error && kendaraan.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
          />
        )}
      </main>

      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={handleCloseDetail}
      />

      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#005DA6]">Transjakarta</span>
            <span>&bull;</span>
            <span>Tes Teknis Frontend Engineer</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
