export function formatVehicleStatus(status: string): {
  label: string
  bgClass: string
  textClass: string
  dotClass: string
} {
  switch (status) {
    case 'IN_TRANSIT_TO':
      return {
        label: 'Sedang Berjalan (In Transit)',
        bgClass: 'bg-emerald-50 border-emerald-200',
        textClass: 'text-emerald-700',
        dotClass: 'bg-emerald-500 animate-pulse',
      }
    case 'STOPPED_AT':
      return {
        label: 'Berhenti di Halte (Stopped)',
        bgClass: 'bg-amber-50 border-amber-200',
        textClass: 'text-amber-800',
        dotClass: 'bg-amber-500',
      }
    case 'INCOMING_AT':
      return {
        label: 'Mendekati Halte (Incoming)',
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-700',
        dotClass: 'bg-blue-500 animate-ping',
      }
    default:
      return {
        label: status ? status.replace(/_/g, ' ') : 'Status Tidak Diketahui',
        bgClass: 'bg-slate-100 border-slate-200',
        textClass: 'text-slate-700',
        dotClass: 'bg-slate-400',
      }
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-'
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return isoString

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  } catch {
    return isoString
  }
}

export function formatTimeAgo(isoString: string): string {
  if (!isoString) return '-'
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 10) return 'Baru saja'
    if (diffSec < 60) return `${diffSec} detik lalu`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} menit lalu`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} jam lalu`
    return formatDateTime(isoString)
  } catch {
    return formatDateTime(isoString)
  }
}

export function formatOccupancy(occupancy?: string | null): string {
  if (!occupancy) return 'Tidak ada data'
  switch (occupancy) {
    case 'EMPTY':
      return 'Kosong'
    case 'MANY_SEATS_AVAILABLE':
      return 'Banyak Kursi Tersedia'
    case 'FEW_SEATS_AVAILABLE':
      return 'Sedikit Kursi Tersedia'
    case 'STANDING_ROOM_ONLY':
      return 'Hanya Ruang Berdiri'
    case 'CRUSHED_STANDING_ROOM_ONLY':
      return 'Sangat Padat'
    case 'FULL':
      return 'Penuh'
    default:
      return occupancy.replace(/_/g, ' ')
  }
}

export function formatCoordinate(lat: number, lon: number): string {
  if (lat === undefined || lon === undefined) return 'Lokasi tidak tersedia'
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`
}
