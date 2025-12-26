import { useState, useEffect, useCallback } from "react";

export default function AssetSearch({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    onFilterChange({ status });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    onSearch("");
    onFilterChange({ status: "" });
  };

  return (
    <div className="flex gap-4 items-center flex-wrap">
      {/* Search Input */}
      <div className="flex-1 min-w-64">
        <div className="flex items-center border border-border rounded-lg bg-surface">
          <span className="px-3 text-text-tertiary">🔍</span>
          <input
            type="text"
            placeholder="Cari kode, nama, atau lokasi aset..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 px-3 py-2.5 text-sm outline-none rounded-r-lg bg-transparent text-text-primary placeholder:text-text-muted"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={handleStatusChange}
        className="border border-border bg-surface text-text-secondary rounded-lg px-4 py-2.5 text-sm hover:border-text-tertiary cursor-pointer focus:ring-2 focus:ring-accent focus:border-accent transition-all"
      >
        <option value="">Semua Status</option>
        <option value="Aktif">Aktif</option>
        <option value="Berperkara">Berperkara</option>
        <option value="Indikasi Berperkara">Indikasi Berperkara</option>
        <option value="Tidak Aktif">Tidak Aktif</option>
      </select>

      {/* Clear Filters */}
      {(searchTerm || statusFilter) && (
        <button
          onClick={handleClearFilters}
          className="border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:border-text-tertiary transition-all"
        >
          🗑️ Reset
        </button>
      )}
    </div>
  );
}
