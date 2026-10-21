import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWithCache } from '../services/api'
import type { ApiResponse, RouteItem } from '../types/api'

export function useRoutes(pageSize = 25) {
  const [route, setRoute] = useState<RouteItem[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isFetchingRef = useRef(false)

  const handleGetRute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setOffset(0)
    try {
      const data = await fetchWithCache<ApiResponse<RouteItem>>('/routes', {
        'page[limit]': pageSize,
        'page[offset]': 0,
        'filter[type]': 3,
      })
      setRoute(data.data)
      setOffset(pageSize)
      setHasMore(Boolean(data.links?.next))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat rute')
    } finally {
      setIsLoading(false)
    }
  }, [pageSize])

  useEffect(() => {
    Promise.resolve().then(handleGetRute)
  }, [handleGetRute])

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingRef.current || isLoading) return
    isFetchingRef.current = true
    setIsLoadingMore(true)
    try {
      const data = await fetchWithCache<ApiResponse<RouteItem>>('/routes', {
        'page[limit]': pageSize,
        'page[offset]': offset,
        'filter[type]': 3,
      })
      setRoute((prev) => {
        const existingIds = new Set(prev.map((r) => r.id))
        const newItems = data.data.filter((r) => !existingIds.has(r.id))
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
  }, [hasMore, isLoading, pageSize, offset])

  return {
    route,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    fetchMore,
    retry: handleGetRute,
  }
}
