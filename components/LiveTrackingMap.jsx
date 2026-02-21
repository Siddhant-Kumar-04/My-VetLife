"use client"

// ⚠️  This file is intentionally NOT a default export at the top level.
//     It is only ever loaded via next/dynamic with { ssr: false } to avoid
//     SSR errors from Leaflet accessing window/document.

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet's broken default icon paths in webpack / Next.js
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Custom pulsing "doctor" icon
const doctorIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="position:relative;width:36px;height:36px">
      <div style="
        position:absolute;inset:0;
        background:rgba(34,197,94,0.25);
        border-radius:50%;
        animation:pulse 1.5s ease-out infinite;
      "></div>
      <div style="
        position:absolute;inset:6px;
        background:#22c55e;
        border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0%   { transform:scale(1);   opacity:.8; }
        100% { transform:scale(2.5); opacity:0;  }
      }
    </style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

// Inner helper: re-centers the map when coordinates change
function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true })
  }, [lat, lng, map])
  return null
}

/**
 * Props:
 *   latitude  {number}  — doctor's current latitude
 *   longitude {number}  — doctor's current longitude
 *   doctorName {string} — shown in the popup
 */
export default function LiveTrackingMap({ latitude, longitude, doctorName = "Doctor" }) {
  if (!latitude || !longitude) return null

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{ height: "260px", width: "100%", borderRadius: "12px" }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={doctorIcon}>
        <Popup>
          <strong>{doctorName}</strong>
          <br />
          <span style={{ fontSize: "11px", color: "#666" }}>
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        </Popup>
      </Marker>
      <RecenterMap lat={latitude} lng={longitude} />
    </MapContainer>
  )
}
