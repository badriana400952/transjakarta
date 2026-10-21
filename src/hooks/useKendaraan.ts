import { useState, useEffect, useCallback } from 'react'
import { fetchWithCache } from '../services/api'
import type { ApiResponse, RouteItem, TripItem, Vehicle, VehicleEnriched } from '../types/api'

function handleKendaraan(
  vehicles: Vehicle[],
  included?: Array<RouteItem | TripItem | Record<string, unknown>>
): VehicleEnriched[] {
  if (!included || included.length === 0) {
    return vehicles.map((v) => ({ ...v }))
  }

  const routeMap = new Map<string, RouteItem>()
  const tripMap = new Map<string, TripItem>()

  for (const item of included) {
    if (item && typeof item === 'object' && 'type' in item) {
      if (item.type === 'route') {
        routeMap.set((item as RouteItem).id, item as RouteItem)
      } else if (item.type === 'trip') {
        tripMap.set((item as TripItem).id, item as TripItem)
      }
    }
  }

  return vehicles.map((vehicle) => {
    const routeId = vehicle.relationships?.route?.data?.id
    const tripId = vehicle.relationships?.trip?.data?.id

    return {
      ...vehicle,
      routeData: routeId ? routeMap.get(routeId) : undefined,
      tripData: tripId ? tripMap.get(tripId) : undefined,
    }
  })
}

function extractTotalCount(
  links: ApiResponse<unknown>['links'],
  currentDataLength: number,
  offset: number,
  limit: number
): number {
  if (links?.last) {
    try {
      const lastUrl = new URL(links.last)
      const lastOffset = lastUrl.searchParams.get('page[offset]')
      if (lastOffset !== null) {
        return parseInt(lastOffset, 10) + limit
      }
    } catch (err: unknown) {
      void err
    }
  }

  if (!links?.next) {
    return offset + currentDataLength
  }

  return offset + currentDataLength + limit
}

interface UseGetKendaraanOptions {
  page: number
  pageSize: number
  selectedRoutes?: string[]
  selectedTrips?: string[]
}

export function useGetKendaraan({
  page,
  pageSize,
  selectedRoutes = [],
  selectedTrips = [],
}: UseGetKendaraanOptions) {
  const [kendaraan, setKendaraan] = useState<VehicleEnriched[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null)

  const offset = (page - 1) * pageSize
  const routesKey = selectedRoutes.join(',')
  const tripsKey = selectedTrips.join(',')

  const handleGetKendaraan = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const params: Record<string, string | number> = {
      'page[limit]': pageSize,
      'page[offset]': offset,
      include: 'route,trip',
    }

    if (routesKey) {
      params['filter[route]'] = routesKey
    }

    if (tripsKey) {
      params['filter[trip]'] = tripsKey
    }

    try {
      const data = await fetchWithCache<ApiResponse<Vehicle>>('/vehicles', params, 15000)
      const dataKendaraan = handleKendaraan(data.data, data.included)
      const count = extractTotalCount(data.links, data.data.length, offset, pageSize)

      setKendaraan(dataKendaraan)
      setTotalCount(count)
      setLastFetchedAt(new Date())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data kendaraan')
    } finally {
      setIsLoading(false)
    }
  }, [pageSize, offset, routesKey, tripsKey])

  useEffect(() => {
    Promise.resolve().then(handleGetKendaraan)
  }, [handleGetKendaraan])

  return {
    kendaraan,
    totalCount,
    isLoading,
    error,
    refresh: handleGetKendaraan,
    lastFetchedAt,
  }
}
