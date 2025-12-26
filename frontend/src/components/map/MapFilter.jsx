import { useState } from "react";

export default function MapFilter({
  selectedLayers,
  onLayerToggle,
  onSearch,
  onFilterChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lokasiFilter, setLokasiFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");

  // Status layers yang bisa di-toggle untuk filter marker di peta
  const statusLayers = [
    { id: "aktif", label: "Aset Aktif", color: "#10b981" },
    { id: "berperkara", label: "Aset Berperkara", color: "#ef4444" },
    {
      id: "indikasi_berperkara",
      label: "Indikasi Berperkara",
      color: "#3b82f6",
    },
    { id: "tidak_aktif", label: "Aset Tidak Aktif", color: "#f59e0b" },
  ];

  const handleLayerToggle = (layerId) => {
    onLayerToggle(layerId);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    onFilterChange({
      status,
      lokasi: lokasiFilter,
      tahun: tahunFilter,
      jenis: jenisFilter,
    });
  };

  const handleLokasiChange = (e) => {
    const lokasi = e.target.value;
    setLokasiFilter(lokasi);
    onFilterChange({
      status: statusFilter,
      lokasi,
      tahun: tahunFilter,
      jenis: jenisFilter,
    });
  };

  const handleTahunChange = (e) => {
    const tahun = e.target.value;
    setTahunFilter(tahun);
    onFilterChange({
      status: statusFilter,
      lokasi: lokasiFilter,
      tahun,
      jenis: jenisFilter,
    });
  };

  const handleJenisChange = (e) => {
    const jenis = e.target.value;
    setJenisFilter(jenis);
    onFilterChange({
      status: statusFilter,
      lokasi: lokasiFilter,
      tahun: tahunFilter,
      jenis,
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filter Status Aset */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <h4 className="font-semibold text-sm text-text-primary mb-3">
          Tampilkan Aset
        </h4>
        <div className="space-y-2">
          {statusLayers.map((layer) => (
            <label
              key={layer.id}
              className="flex items-center cursor-pointer hover:bg-surface p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedLayers[layer.id] !== false}
                onChange={() => handleLayerToggle(layer.id)}
                className="mr-3 w-4 h-4 cursor-pointer rounded accent-accent"
              />
              <span
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-xs text-text-secondary">{layer.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Search */}
      <div>
        <h4 className="font-semibold text-sm text-text-primary mb-2">
          Pencarian
        </h4>
        <div className="flex items-center border border-border rounded-lg bg-surface">
          <span className="px-3 text-text-muted">🔍</span>
          <input
            type="text"
            placeholder="Cari aset..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 px-2 py-2.5 text-sm outline-none rounded-r-lg bg-transparent text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Filters */}
      <div>
        <h4 className="font-semibold text-sm text-text-primary mb-2">Filter</h4>
        <div className="space-y-2">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full border border-border bg-surface text-text-primary rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="">Status Aset</option>
            <option value="aktif">Aktif</option>
            <option value="berperkara">Berperkara</option>
            <option value="tidak_aktif">Tidak Aktif</option>
          </select>

          <select
            value={lokasiFilter}
            onChange={handleLokasiChange}
            className="w-full border border-border bg-surface text-text-primary rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="">Lokasi/Wilayah</option>
            <option value="pasuruan">Kota Pasuruan</option>
            <option value="surabaya">Surabaya</option>
            <option value="malang">Malang</option>
          </select>

          <select
            value={tahunFilter}
            onChange={handleTahunChange}
            className="w-full border border-border bg-surface text-text-primary rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="">Tahun</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>

          <select
            value={jenisFilter}
            onChange={handleJenisChange}
            className="w-full border border-border bg-surface text-text-primary rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          >
            <option value="">Jenis Aset</option>
            <option value="tanah">Tanah</option>
            <option value="bangunan">Bangunan</option>
            <option value="kendaraan">Kendaraan</option>
          </select>
        </div>
      </div>

      {/* Statistik */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <h4 className="font-semibold text-sm text-text-primary mb-3">
          Statistik Aset
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-tertiary">Total Aset</span>
            <span className="font-semibold text-text-primary">5</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-text-tertiary">Aktif</span>
            </div>
            <span className="font-semibold text-green-600 dark:text-green-400">
              3
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-text-tertiary">Berperkara</span>
            </div>
            <span className="font-semibold text-red-600 dark:text-red-400">
              1
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-text-tertiary">Indikasi</span>
            </div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
