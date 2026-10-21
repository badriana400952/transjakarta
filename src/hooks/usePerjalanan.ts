import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWithCache } from '../services/api'
import type { ApiResponse, TripItem } from '../types/api'

const DEFAULT_ROUTES = ['1', '15', '22', '23', '28', '39', '57', '66', '741', '742']

export function usePerjalanan(selectedRoutes: string[] = [], pageSize = 25) {
  const [perjalanan, setPerjalanan] = useState<TripItem[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isFetchingRef = useRef(false)

  const routeFilter = selectedRoutes.length > 0 ? selectedRoutes.join(',') : DEFAULT_ROUTES.join(',')

  const getPerjalanans = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setOffset(0)
    try {
      const data = await fetchWithCache<ApiResponse<TripItem>>('/trips', {
        'page[limit]': pageSize,
        'page[offset]': 0,
        'filter[route]': routeFilter,
      })
      setPerjalanan(data.data)
      setOffset(pageSize)
      setHasMore(Boolean(data.links?.next))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat trip')
    } finally {
      setIsLoading(false)
    }
  }, [pageSize, routeFilter])

  useEffect(() => {
    Promise.resolve().then(getPerjalanans)
  }, [getPerjalanans])

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingRef.current || isLoading) return
    isFetchingRef.current = true
    setIsLoadingMore(true)
    try {
      const data = await fetchWithCache<ApiResponse<TripItem>>('/trips', {
        'page[limit]': pageSize,
        'page[offset]': offset,
        'filter[route]': routeFilter,
      })
      setPerjalanan((prev) => {
        const existingIds = new Set(prev.map((t) => t.id))
        const newItems = data.data.filter((t) => !existingIds.has(t.id))
        return [...prev, ...newItems]
      })
      setOffset((prev) => prev + pageSize)
      setHasMore(Boolean(data.links?.next))
    } catch (err: unknown) {
      void err
    } finally {
      isFetchingRef.current = false
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoading, pageSize, offset, routeFilter])

  return {
    perjalanan,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    fetchMore,
    retry: getPerjalanans,
  }
}
