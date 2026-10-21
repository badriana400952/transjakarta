import axios, { type InternalAxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: 'https://api-v3.mbta.com',
  timeout: 12000,
  headers: {
    Accept: 'application/vnd.api+json',
  },
})

const cache = new Map<string, { timestamp: number; data: unknown }>()
const inFlight = new Map<string, Promise<unknown>>()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retryCount?: number }) | undefined

    if (error.response?.status === 429 && config) {
      config._retryCount = (config._retryCount || 0) + 1
      if (config._retryCount <= 2) {
        const retryAfter = error.response.headers?.['retry-after']
        const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : config._retryCount * 2500
        await sleep(Math.min(delay, 6000))
        return api(config)
      }
      return Promise.reject(
        new Error('Batas permintaan data tercapai (Rate Limit). Silakan tunggu beberapa detik sebelum mencoba lagi.')
      )
    }

    if (error.response) {
      if (error.response.status >= 500) {
        return Promise.reject(
          new Error('Layanan server transit sedang mengalami gangguan. Coba lagi nanti.')
        )
      }
      return Promise.reject(
        new Error(`Gagal memuat data dari server (Status: ${error.response.status}).`)
      )
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(
        new Error('Waktu permintaan data habis. Periksa koneksi internet Anda.')
      )
    }

    return Promise.reject(
      new Error('Tidak dapat terhubung ke server transit. Periksa koneksi internet Anda.')
    )
  }
)

export async function fetchWithCache<T>(
  url: string,
  params: Record<string, string | number | undefined> = {},
  ttlMs = 180000
): Promise<T> {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
  const key = query ? `${url}?${query}` : url

  const now = Date.now()
  const cached = cache.get(key)
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data as T
  }

  if (inFlight.has(key)) {
    return inFlight.get(key) as Promise<T>
  }

  const promise = api
    .get<T>(url, { params })
    .then((res) => {
      cache.set(key, { timestamp: Date.now(), data: res.data })
      inFlight.delete(key)
      return res.data
    })
    .catch((err) => {
      inFlight.delete(key)
      throw err
    })

  inFlight.set(key, promise)
  return promise
}

export function clearApiCache() {
  cache.clear()
}
