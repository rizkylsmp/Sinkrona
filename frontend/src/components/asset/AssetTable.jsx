import { useState } from "react";
import ActionButtons from "./ActionButtons";

export default function AssetTable({
  assets = [],
  loading = false,
  onEditClick,
  onDeleteClick,
  currentPage = 1,
  itemsPerPage = 10,
  canUpdate = true,
  canDelete = true,
}) {
  const [sortBy, setSortBy] = useState("kode_aset");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleEdit = (id) => {
    onEditClick(id);
  };

  const handleView = (asset) => {
    // Just log for now - could open a detail modal in the future
    console.log("View asset:", asset);
  };

  const handleDelete = (id) => {
    onDeleteClick(id);
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column)
      return <span className="text-text-muted ml-1">↕</span>;
    return (
      <span className="text-accent ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  // Status badge colors - consistent with map markers
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const statusMap = {
      aktif:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
      berperkara:
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
      "indikasi berperkara":
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      "tidak aktif":
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
    };
    return (
      statusMap[statusLower] ||
      "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
    );
  };

  // Status icon
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    const iconMap = {
      aktif: "✓",
      berperkara: "⚠",
      "indikasi berperkara": "⚡",
      "tidak aktif": "○",
    };
    return iconMap[statusLower] || "•";
  };

  const sortedAssets = [...assets].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === "luas") {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-secondary border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-12">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Kode Aset
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Nama Aset
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Luas (m²)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Tahun
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(5)].map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="px-4 py-3">
                  <div className="h-4 bg-surface-tertiary rounded w-6"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-surface-tertiary rounded w-20"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-surface-tertiary rounded w-32"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-surface-tertiary rounded w-40"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-6 bg-surface-tertiary rounded w-16"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-surface-tertiary rounded w-16"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-surface-tertiary rounded w-12"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-8 bg-surface-tertiary rounded w-24 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Tidak ada data aset
        </h3>
        <p className="text-text-tertiary text-sm">
          Belum ada aset yang terdaftar atau tidak ada hasil pencarian
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-secondary border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider w-12">
              No
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-tertiary transition-colors"
              onClick={() => handleSort("kode_aset")}
            >
              Kode Aset <SortIcon column="kode_aset" />
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-tertiary transition-colors"
              onClick={() => handleSort("nama_aset")}
            >
              Nama Aset <SortIcon column="nama_aset" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Lokasi
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-tertiary transition-colors"
              onClick={() => handleSort("status")}
            >
              Status <SortIcon column="status" />
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-tertiary transition-colors"
              onClick={() => handleSort("luas")}
            >
              Luas (m²) <SortIcon column="luas" />
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-tertiary transition-colors"
              onClick={() => handleSort("tahun_perolehan")}
            >
              Tahun <SortIcon column="tahun_perolehan" />
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedAssets.map((asset, idx) => (
            <tr
              key={asset.id_aset}
              className="hover:bg-surface-secondary transition-colors"
            >
              <td className="px-4 py-3 text-sm text-text-secondary">
                {(currentPage - 1) * itemsPerPage + idx + 1}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-text-primary">
                {asset.kode_aset}
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary">
                {asset.nama_aset}
              </td>
              <td
                className="px-4 py-3 text-sm text-text-tertiary max-w-xs truncate"
                title={asset.lokasi}
              >
                {asset.lokasi}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    asset.status
                  )}`}
                >
                  <span>{getStatusIcon(asset.status)}</span>
                  {asset.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right text-text-secondary font-medium">
                {parseFloat(asset.luas || 0).toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-3 text-sm text-center text-text-tertiary">
                {asset.tahun_perolehan}
              </td>
              <td className="px-4 py-3">
                <ActionButtons
                  assetId={asset.id_aset}
                  onEdit={canUpdate ? handleEdit : null}
                  onView={() => handleView(asset)}
                  onDelete={canDelete ? handleDelete : null}
                  showEdit={canUpdate}
                  showDelete={canDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
