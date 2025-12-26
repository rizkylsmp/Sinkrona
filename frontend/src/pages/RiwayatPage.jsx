import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { riwayatService } from "../services/api";

export default function RiwayatPage() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalData: 0,
  });

  const [filters, setFilters] = useState({
    tanggalMulai: "",
    tanggalAkhir: "",
    user: "",
    jenis: "",
    deskripsi: "",
  });

  const [expandedRow, setExpandedRow] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(true);
  const filterDropdownRef = useRef(null);

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filters.jenis) params.aksi = filters.jenis;
      if (filters.tanggalMulai) params.startDate = filters.tanggalMulai;
      if (filters.tanggalAkhir) params.endDate = filters.tanggalAkhir;

      const response = await riwayatService.getAll(params);
      const { data, pagination: paginationData } = response.data;

      setActivities(data || []);
      if (paginationData) {
        setPagination((prev) => ({
          ...prev,
          totalPages: paginationData.totalPages,
          totalData: paginationData.totalData,
        }));
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Gagal memuat riwayat aktivitas");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.jenis,
    filters.tanggalMulai,
    filters.tanggalAkhir,
  ]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await riwayatService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [fetchActivities, fetchStats]);

  // User list for filter
  const userList = [
    "admin01",
    "dinas_aset01",
    "bpn_user01",
    "tata_ruang01",
    "masyarakat01",
  ];

  // Activity types
  const jenisAktivitas = [
    { value: "", label: "Semua Jenis" },
    { value: "CREATE", label: "Create" },
    { value: "VIEW", label: "View" },
    { value: "UPDATE", label: "Update" },
    { value: "DELETE", label: "Delete" },
    { value: "LOGIN", label: "Login" },
    { value: "LOGOUT", label: "Logout" },
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      tanggalMulai: "",
      tanggalAkhir: "",
      user: "",
      jenis: "",
      deskripsi: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleApplyFilter = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchActivities();
  };

  const handleRefresh = () => {
    fetchActivities();
    fetchStats();
    toast.success("Data diperbarui");
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Count active filters
  const activeFilterCount = [
    filters.user,
    filters.jenis,
    filters.tanggalMulai,
    filters.tanggalAkhir,
  ].filter(Boolean).length;

  const getJenisStyle = (jenis) => {
    switch (jenis?.toUpperCase()) {
      case "CREATE":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
      case "VIEW":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "UPDATE":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "DELETE":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "LOGIN":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "LOGOUT":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
      case "BACKUP":
        return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400";
      case "RESTORE":
        return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400";
      default:
        return "bg-surface-tertiary text-text-secondary";
    }
  };

  // Calculate stats from data
  const displayStats = {
    totalAktivitas: stats?.totalActivities || pagination.totalData || 0,
    loginHariIni: stats?.byAksi?.LOGIN || 0,
    perubahanData:
      (stats?.byAksi?.CREATE || 0) +
      (stats?.byAksi?.UPDATE || 0) +
      (stats?.byAksi?.DELETE || 0),
    createCount: stats?.byAksi?.CREATE || 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Riwayat Aktivitas
          </h1>
          <p className="text-text-tertiary text-sm mt-1">
            Monitor semua aktivitas pengguna dalam sistem
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-surface-tertiary text-text-secondary px-4 py-2.5 rounded-lg hover:bg-border transition-all text-sm font-medium disabled:opacity-50"
        >
          <span className={loading ? "animate-spin" : ""}>🔄</span>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {displayStats.totalAktivitas.toLocaleString()}
              </div>
              <div className="text-sm text-text-tertiary">Total Aktivitas</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔐</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {displayStats.loginHariIni}
              </div>
              <div className="text-sm text-text-tertiary">Total Login</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {displayStats.perubahanData}
              </div>
              <div className="text-sm text-text-tertiary">Perubahan Data</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">➕</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {displayStats.createCount}
              </div>
              <div className="text-sm text-text-tertiary">Data Baru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setShowFilterSection(!showFilterSection)}
          className="w-full px-6 py-4 border-b border-border-light flex items-center justify-between hover:bg-surface-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <h3 className="font-semibold text-text-primary">
              Filter & Pencarian
            </h3>
          </div>
          <svg
            className={`w-5 h-5 text-red-500 transition-transform duration-200 ${
              showFilterSection ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showFilterSection && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={filters.tanggalMulai}
                  onChange={(e) =>
                    handleFilterChange("tanggalMulai", e.target.value)
                  }
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={filters.tanggalAkhir}
                  onChange={(e) =>
                    handleFilterChange("tanggalAkhir", e.target.value)
                  }
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  User
                </label>
                <select
                  value={filters.user}
                  onChange={(e) => handleFilterChange("user", e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                >
                  <option value="">Semua User</option>
                  {userList.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Jenis
                </label>
                <select
                  value={filters.jenis}
                  onChange={(e) => handleFilterChange("jenis", e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                >
                  {jenisAktivitas.map((j) => (
                    <option key={j.value} value={j.value}>
                      {j.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleApplyFilter}
                  className="flex-1 bg-accent text-white dark:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-all text-sm font-medium"
                >
                  Terapkan
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 border border-border rounded-lg hover:bg-surface-secondary text-text-secondary transition-all text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Log Aktivitas</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-tertiary">
              {activities.length} aktivitas
            </span>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilterCount > 0
                    ? "bg-accent text-white dark:text-gray-900"
                    : "bg-surface-tertiary text-text-secondary hover:bg-border"
                }`}
              >
                <svg
                  className="w-4 h-4"
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
                Filter
                {activeFilterCount > 0 && (
                  <span className="bg-white dark:bg-gray-900 text-accent text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                  <div className="bg-surface-secondary px-4 py-3 border-b border-border-light flex items-center justify-between">
                    <span className="font-semibold text-sm text-text-primary">
                      Filter Aktivitas
                    </span>
                    <button
                      onClick={() => {
                        handleReset();
                        setShowFilterDropdown(false);
                      }}
                      className="text-xs text-text-muted hover:text-text-secondary"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* User Filter */}
                    <div>
                      <label className="block text-xs font-medium text-text-tertiary mb-1.5">
                        User
                      </label>
                      <select
                        value={filters.user}
                        onChange={(e) =>
                          handleFilterChange("user", e.target.value)
                        }
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      >
                        <option value="">Semua User</option>
                        {userList.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Jenis Filter */}
                    <div>
                      <label className="block text-xs font-medium text-text-tertiary mb-1.5">
                        Jenis Aktivitas
                      </label>
                      <select
                        value={filters.jenis}
                        onChange={(e) =>
                          handleFilterChange("jenis", e.target.value)
                        }
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      >
                        {jenisAktivitas.map((j) => (
                          <option key={j.value} value={j.value}>
                            {j.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-text-tertiary mb-1.5">
                          Dari
                        </label>
                        <input
                          type="date"
                          value={filters.tanggalMulai}
                          onChange={(e) =>
                            handleFilterChange("tanggalMulai", e.target.value)
                          }
                          className="w-full border border-border rounded-lg px-2 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-tertiary mb-1.5">
                          Sampai
                        </label>
                        <input
                          type="date"
                          value={filters.tanggalAkhir}
                          onChange={(e) =>
                            handleFilterChange("tanggalAkhir", e.target.value)
                          }
                          className="w-full border border-border rounded-lg px-2 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        />
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => {
                        handleApplyFilter();
                        setShowFilterDropdown(false);
                      }}
                      className="w-full bg-accent text-white dark:text-gray-900 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition-all"
                    >
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
                <span className="text-sm text-text-secondary">
                  Memuat data...
                </span>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              <span className="text-4xl block mb-2">📋</span>
              <span className="text-sm">Belum ada riwayat aktivitas</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-surface-secondary border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    No
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Aksi
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Tabel
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {activities.map((item, index) => (
                  <>
                    <tr
                      key={item.id_riwayat}
                      className="hover:bg-surface-secondary transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-text-primary">
                          {item.user?.username || item.user_id || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getJenisStyle(
                            item.aksi
                          )}`}
                        >
                          {item.aksi}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary capitalize">
                        {item.tabel || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                        {item.keterangan || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRowExpand(item.id_riwayat)}
                          className="text-text-muted hover:text-text-primary transition-colors text-sm"
                        >
                          {expandedRow === item.id_riwayat
                            ? "▲ Tutup"
                            : "▼ Detail"}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === item.id_riwayat && (
                      <tr
                        key={`${item.id_riwayat}-detail`}
                        className="bg-surface-secondary"
                      >
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-text-secondary">
                                ID Riwayat:
                              </span>
                              <span className="ml-2 text-text-tertiary font-mono">
                                {item.id_riwayat}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-text-secondary">
                                Timestamp:
                              </span>
                              <span className="ml-2 text-text-tertiary font-mono text-xs">
                                {new Date(item.created_at).toISOString()}
                              </span>
                            </div>
                            {item.referensi_id && (
                              <div>
                                <span className="font-medium text-text-secondary">
                                  ID Referensi:
                                </span>
                                <span className="ml-2 text-text-tertiary">
                                  {item.referensi_id}
                                </span>
                              </div>
                            )}
                            {item.data_lama && (
                              <div className="col-span-2">
                                <span className="font-medium text-text-secondary">
                                  Data Lama:
                                </span>
                                <pre className="mt-1 p-2 bg-surface rounded text-xs text-text-tertiary overflow-x-auto">
                                  {JSON.stringify(item.data_lama, null, 2)}
                                </pre>
                              </div>
                            )}
                            {item.data_baru && (
                              <div className="col-span-2">
                                <span className="font-medium text-text-secondary">
                                  Data Baru:
                                </span>
                                <pre className="mt-1 p-2 bg-surface rounded text-xs text-text-tertiary overflow-x-auto">
                                  {JSON.stringify(item.data_baru, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-tertiary">
            Menampilkan{" "}
            {activities.length > 0
              ? (pagination.page - 1) * pagination.limit + 1
              : 0}
            -
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalData || 0
            )}{" "}
            dari {(pagination.totalData || 0).toLocaleString()} aktivitas
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {(pagination.totalPages || 1) > 0 &&
              Array.from(
                { length: Math.min(5, pagination.totalPages || 1) },
                (_, i) => {
                  let pageNum;
                  const totalPages = pagination.totalPages || 1;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === pageNum
                          ? "bg-accent text-white dark:text-gray-900"
                          : "border border-border text-text-secondary hover:bg-surface-secondary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= (pagination.totalPages || 1)}
              className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
