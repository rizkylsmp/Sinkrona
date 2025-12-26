import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icon colors based on status - consistent across app
const getMarkerIcon = (status) => {
  const colors = {
    aktif: "#10b981", // emerald-500
    berperkara: "#ef4444", // red-500
    tidak_aktif: "#f59e0b", // amber-500
    indikasi_berperkara: "#3b82f6", // blue-500
    "tidak aktif": "#f59e0b",
    "indikasi berperkara": "#3b82f6",
  };

  const color = colors[status?.toLowerCase()] || "#6b7280";

  return L.divIcon({
    html: `<div style="background-color: ${color}; border: 3px solid white; border-radius: 50%; width: 28px; height: 28px; box-shadow: 0 3px 8px rgba(0,0,0,0.25);"></div>`,
    iconSize: [28, 28],
    className: "custom-marker",
  });
};

// Zoom Controls Component (must be inside MapContainer)
function ZoomControls({ defaultCenter, defaultZoom }) {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleFullscreen = () => {
    const mapContainer = document.querySelector(".leaflet-container");
    if (!document.fullscreenElement) {
      mapContainer?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 15, { duration: 1.5 });
        },
        () => {
          // If geolocation fails, go back to default center
          map.flyTo(defaultCenter, defaultZoom, { duration: 1 });
        }
      );
    } else {
      // Fallback to default center
      map.flyTo(defaultCenter, defaultZoom, { duration: 1 });
    }
  };

  return (
    <div className="absolute bottom-4 right-4 bg-surface rounded-xl border border-border shadow-lg overflow-hidden z-[1000]">
      <button
        onClick={handleZoomIn}
        title="Perbesar"
        className="w-10 h-10 flex items-center justify-center hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors border-b border-border font-medium"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        title="Perkecil"
        className="w-10 h-10 flex items-center justify-center hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors border-b border-border font-medium"
      >
        −
      </button>
      <button
        onClick={handleFullscreen}
        title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
        className="w-10 h-10 flex items-center justify-center hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors border-b border-border"
      >
        {isFullscreen ? "⛶" : "⛶"}
      </button>
      <button
        onClick={handleLocate}
        title="Lokasi Saya"
        className="w-10 h-10 flex items-center justify-center hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors text-sm"
      >
        📍
      </button>
    </div>
  );
}

export default function MapContainer_({ assets, onMarkerClick }) {
  const defaultCenter = [-7.6469, 112.9075]; // Kota Pasuruan, Jawa Timur
  const defaultZoom = 13;

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        className="map-container"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Markers */}
        {assets.map((asset) => (
          <Marker
            key={asset.id}
            position={[asset.latitude, asset.longitude]}
            icon={getMarkerIcon(asset.status)}
            eventHandlers={{
              click: () => onMarkerClick(asset),
            }}
          >
            <Popup>
              <div className="text-xs p-1">
                <strong className="text-text-primary">{asset.nama_aset}</strong>
                <br />
                <span className="text-text-tertiary">{asset.kode_aset}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Zoom Controls - Inside MapContainer to access map instance */}
        <ZoomControls defaultCenter={defaultCenter} defaultZoom={defaultZoom} />
      </MapContainer>

      {/* Map Title - Hidden on mobile */}
      <div className="hidden sm:block absolute top-4 left-1/2 transform -translate-x-1/2 bg-surface/95 backdrop-blur-sm rounded-xl border border-border px-5 py-2.5 shadow-lg z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <h1 className="font-semibold text-sm text-text-primary">
            Peta Interaktif Aset Tanah
          </h1>
        </div>
      </div>
    </div>
  );
}
