import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
const selectedIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; border: 3px solid white; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 3px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  className: "custom-marker",
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

// Component to recenter map when position changes
function MapRecenter({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }
  }, [position, map]);
  
  return null;
}

export default function MapCoordinatePicker({
  latitude,
  longitude,
  onCoordinateChange,
  label = "Pilih Lokasi di Peta",
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultCenter = [-7.6469, 112.9075]; // Kota Pasuruan
  
  // Determine map center and marker position
  const hasValidCoords = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
  const position = hasValidCoords ? [parseFloat(latitude), parseFloat(longitude)] : null;
  const mapCenter = position || defaultCenter;

  const handleLocationSelect = (lat, lng) => {
    onCoordinateChange(lat.toFixed(6), lng.toFixed(6));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          onCoordinateChange(lat.toFixed(6), lng.toFixed(6));
        },
        (error) => {
          alert("Tidak dapat mengakses lokasi. Pastikan izin lokasi diaktifkan.");
        }
      );
    } else {
      alert("Browser tidak mendukung Geolocation");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-text-primary">
        {label}
      </label>
      
      {/* Coordinate Display & Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="bg-surface-secondary border border-border rounded-lg px-3 py-2">
            <span className="text-xs text-text-tertiary">Latitude</span>
            <p className="text-sm font-medium text-text-primary">
              {latitude || "-"}
            </p>
          </div>
          <div className="bg-surface-secondary border border-border rounded-lg px-3 py-2">
            <span className="text-xs text-text-tertiary">Longitude</span>
            <p className="text-sm font-medium text-text-primary">
              {longitude || "-"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition text-sm font-medium h-full"
          title={isExpanded ? "Tutup Peta" : "Buka Peta"}
        >
          {isExpanded ? "🗺️ Tutup" : "🗺️ Pilih"}
        </button>
      </div>

      {/* Expandable Map */}
      {isExpanded && (
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Map Toolbar */}
          <div className="bg-surface-secondary px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              📍 Klik pada peta untuk memilih lokasi
            </span>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="text-xs bg-accent/10 text-accent px-2 py-1 rounded hover:bg-accent/20 transition font-medium"
            >
              📍 Lokasi Saya
            </button>
          </div>
          
          {/* Map Container */}
          <div className="h-64 relative">
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              
              <MapClickHandler onLocationSelect={handleLocationSelect} />
              <MapRecenter position={position} />
              
              {/* Marker at selected position */}
              {position && (
                <Marker position={position} icon={selectedIcon} />
              )}
            </MapContainer>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-2 right-2 bg-surface rounded-lg border border-border shadow-lg overflow-hidden z-1000">
              <button
                type="button"
                onClick={() => {
                  const mapEl = document.querySelector('.leaflet-container');
                  if (mapEl && mapEl._leaflet_map) {
                    mapEl._leaflet_map.zoomIn();
                  }
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors border-b border-border font-medium text-sm"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  const mapEl = document.querySelector('.leaflet-container');
                  if (mapEl && mapEl._leaflet_map) {
                    mapEl._leaflet_map.zoomOut();
                  }
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors font-medium text-sm"
              >
                −
              </button>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-surface-secondary px-3 py-2 border-t border-border">
            <p className="text-xs text-text-tertiary text-center">
              💡 Geser peta dan klik untuk menentukan titik koordinat yang tepat
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
