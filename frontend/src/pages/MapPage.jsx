import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import MapFilter from "../components/map/MapFilter";
import MapDisplay from "../components/map/MapDisplay";
import AssetDetailPanel from "../components/map/AssetDetailPanel";
import AssetDetailSlidePanel from "../components/map/AssetDetailSlidePanel";
import MapLegend from "../components/map/MapLegend";
import { petaService, asetService } from "../services/api";

export default function MapPage() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(true);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  // Status filter untuk menampilkan/menyembunyikan marker berdasarkan status
  const [selectedLayers, setSelectedLayers] = useState({
    aktif: true,
    berperkara: true,
    tidak_aktif: true,
    indikasi_berperkara: true,
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [detailAsset, setDetailAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    lokasi: "",
    tahun: "",
    jenis: "",
  });

  // Fetch markers from API
  const fetchMarkers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await petaService.getMarkers();
      const markers = response.data.data || [];

      // Transform to consistent format
      const transformedAssets = markers.map((marker) => ({
        id: marker.id,
        kode_aset: marker.kode,
        nama_aset: marker.nama,
        lokasi: marker.lokasi,
        status: marker.status?.toLowerCase().replace(/\s+/g, "_") || "aktif",
        luas: marker.luas?.toString() || "0",
        tahun: marker.tahun?.toString() || "-",
        jenis_aset: marker.jenis,
        latitude: marker.lat,
        longitude: marker.lng,
      }));

      setAssets(transformedAssets);
    } catch (error) {
      console.error("Error fetching markers:", error);
      toast.error("Gagal memuat data peta");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  // Fetch full asset detail
  const fetchAssetDetail = async (assetId) => {
    try {
      const response = await asetService.getById(assetId);
      if (response.data.success) {
        setDetailAsset(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching asset detail:", error);
      toast.error("Gagal memuat detail aset");
    }
  };

  const handleLayerToggle = (layerId) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMarkerClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseDetail = () => {
    setSelectedAsset(null);
  };

  const handleViewDetail = (asset) => {
    fetchAssetDetail(asset.id);
  };

  const handleCloseSlidePanel = () => {
    setDetailAsset(null);
  };

  // Filter assets based on search, filters, and selected layers (status checkboxes)
  const filteredAssets = assets.filter((asset) => {
    // Filter berdasarkan checkbox status layer
    const normalizedStatus = asset.status?.toLowerCase().replace(/\s+/g, "_");
    const matchLayer = selectedLayers[normalizedStatus] !== false;

    const matchSearch =
      !searchTerm ||
      asset.nama_aset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.kode_aset?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !filters.status || normalizedStatus === filters.status;
    const matchTahun = !filters.tahun || asset.tahun === filters.tahun;
    const matchJenis = !filters.jenis || asset.jenis_aset === filters.jenis;

    return matchLayer && matchSearch && matchStatus && matchTahun && matchJenis;
  });

  return (
    <div className="flex h-full overflow-hidden bg-surface-secondary">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-surface/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full"></div>
            <span className="text-sm text-text-secondary">Memuat peta...</span>
          </div>
        </div>
      )}

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-surface z-50 lg:hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-border-light shrink-0 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-text-primary">Filter Peta</h2>
                <p className="text-xs text-text-muted mt-1">
                  Atur tampilan layer peta
                </p>
              </div>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-surface-tertiary rounded-lg transition-colors text-text-secondary"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MapFilter
                selectedLayers={selectedLayers}
                onLayerToggle={handleLayerToggle}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </>
      )}

      {/* Map Display - Full width */}
      <div className="flex-1 relative h-full overflow-hidden">
        <MapDisplay assets={filteredAssets} onMarkerClick={handleMarkerClick} />

        {/* Desktop Filter Sidebar - Overlay */}
        <div
          className={`hidden lg:flex lg:flex-col absolute top-0 left-0 h-full bg-surface border-r border-border shadow-xl z-20 transition-transform duration-300 ${
            showDesktopFilter ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ width: "320px" }}
        >
          <div className="p-4 border-b border-border-light shrink-0 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-text-primary">Filter Peta</h2>
              <p className="text-xs text-text-muted mt-1">
                Atur tampilan layer peta
              </p>
            </div>
            <button
              onClick={() => setShowDesktopFilter(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-surface-tertiary rounded-lg transition-colors text-text-secondary"
              title="Sembunyikan Filter"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <MapFilter
              selectedLayers={selectedLayers}
              onLayerToggle={handleLayerToggle}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="lg:hidden absolute top-4 left-4 bg-surface rounded-xl border border-border shadow-lg px-4 py-2.5 flex items-center gap-2 z-10 hover:bg-surface-secondary transition-all"
        >
          <svg
            className="w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="text-sm font-medium text-text-secondary">
            Filter
          </span>
        </button>

        {/* Desktop Toggle Filter Button - Show when sidebar is hidden */}
        {!showDesktopFilter && (
          <button
            onClick={() => setShowDesktopFilter(true)}
            className="hidden lg:flex absolute top-4 left-4 bg-surface rounded-xl border border-border shadow-lg px-4 py-2.5 items-center gap-2 z-10 hover:bg-surface-secondary transition-all"
            title="Tampilkan Filter"
          >
            <svg
              className="w-5 h-5 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="text-sm font-medium text-text-secondary">
              Filter
            </span>
          </button>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4">
          <MapLegend />
        </div>

        {/* Asset Detail Panel */}
        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={handleCloseDetail}
            onViewDetail={handleViewDetail}
          />
        )}
      </div>

      {/* Asset Detail Slide Panel */}
      {detailAsset && (
        <AssetDetailSlidePanel
          asset={detailAsset}
          onClose={handleCloseSlidePanel}
        />
      )}
    </div>
  );
}
