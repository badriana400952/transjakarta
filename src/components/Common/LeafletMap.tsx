import React, { useEffect, useRef } from 'react'
import L from 'leaflet'

interface LeafletMapProps {
  latitude: number
  longitude: number
  label: string
  routeColor?: string
  statusLabel?: string
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  label,
  routeColor = '#005DA6',
  statusLabel = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    } else {
      mapRef.current.setView([latitude, longitude], 14)
    }

    const resizeTimer = setTimeout(() => {
      mapRef.current?.invalidateSize()
    }, 150)

    const busHtml = `
      <div style="
        background-color: ${routeColor};
        color: white;
        border: 2.5px solid white;
        border-radius: 9999px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        font-size: 16px;
      ">
        🚌
      </div>
    `

    const customIcon = L.divIcon({
      className: 'tj-bus-marker',
      html: busHtml,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -20],
    })

    const popupContent = `
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
        <strong style="font-size: 13px; color: #005DA6; display: block; margin-bottom: 2px;">
          Armada #${label}
        </strong>
        ${statusLabel ? `<span style="font-size: 11px; color: #475569; display: block; margin-bottom: 4px;">Status: ${statusLabel}</span>` : ''}
        <span style="font-family: monospace; font-size: 11px; color: #64748b;">
          ${latitude.toFixed(5)}, ${longitude.toFixed(5)}
        </span>
      </div>
    `

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude])
      markerRef.current.setIcon(customIcon)
      markerRef.current.setPopupContent(popupContent)
    } else {
      markerRef.current = L.marker([latitude, longitude], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(popupContent)
    }

    markerRef.current.openPopup()

    return () => {
      clearTimeout(resizeTimer)
    }
  }, [latitude, longitude, label, routeColor, statusLabel])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 relative z-0 shadow-inner">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
