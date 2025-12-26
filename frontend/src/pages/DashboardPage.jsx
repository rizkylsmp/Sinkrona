import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { asetService, userService, riwayatService } from "../services/api";
import { useAuthStore } from "../stores/authStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [asetStats, setAsetStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [riwayatStats, setRiwayatStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [asetRes, userRes, riwayatRes, activitiesRes] = await Promise.all([
        asetService.getStats(),
        userService.getStats().catch(() => null), // May fail for non-admin
        riwayatService.getStats(),
        riwayatService.getAll({ limit: 5 }),
      ]);

      setAsetStats(asetRes.data.data);
      if (userRes) setUserStats(userRes.data.data);
      setRiwayatStats(riwayatRes.data.data);
      setRecentActivities(activitiesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatCurrency = (num) => {
    if (!num) return "Rp 0";
    if (num >= 1e12) return `Rp ${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)}M`;
    if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(1)}Jt`;
    return `Rp ${formatNumber(num)}`;
  };

  const formatArea = (num) => {
    if (!num) return "0 m²";
    if (num >= 10000) return `${(num / 10000).toFixed(1)} ha`;
    return `${formatNumber(num)} m²`;
  };

  const getActivityBadge = (aksi) => {
    const badges = {
      CREATE:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      UPDATE:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      DELETE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      VIEW: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      LOGIN:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
      LOGOUT:
        "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
      BACKUP:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
      RESTORE:
        "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
    };
    return (
      badges[aksi?.toUpperCase()] || "bg-surface-tertiary text-text-secondary"
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats cards data
  const statsCards = [
    {
      label: "Total Aset",
      value: formatNumber(asetStats?.totalAset || 0),
      icon: "📊",
      color: "bg-blue-500",
      detail: `${formatArea(asetStats?.totalLuas)} total luas`,
    },
    {
      label: "Aset Aktif",
      value: formatNumber(asetStats?.byStatus?.Aktif || 0),
      icon: "✅",
      color: "bg-emerald-500",
      detail: "Status aktif & siap pakai",
    },
    {
      label: "Aset Berperkara",
      value: formatNumber(
        (asetStats?.byStatus?.Berperkara || 0) +
          (asetStats?.byStatus?.["Indikasi Berperkara"] || 0)
      ),
      icon: "⚠️",
      color: "bg-red-500",
      detail: `${asetStats?.byStatus?.Berperkara || 0} berperkara, ${
        asetStats?.byStatus?.["Indikasi Berperkara"] || 0
      } indikasi`,
    },
    {
      label: "Total Nilai Aset",
      value: formatCurrency(asetStats?.totalNilai || 0),
      icon: "💰",
      color: "bg-amber-500",
      detail: "Nilai keseluruhan aset",
    },
  ];

  // Status distribution for chart data
  const statusData = asetStats?.byStatus
    ? Object.entries(asetStats.byStatus).map(([status, count]) => ({
        status,
        count,
        color:
          status === "Aktif"
            ? "#10b981"
            : status === "Berperkara"
            ? "#ef4444"
            : status === "Indikasi Berperkara"
            ? "#3b82f6"
            : "#f59e0b",
      }))
    : [];

  const totalStatus = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-tertiary text-sm mt-1">
            Selamat datang kembali, {user?.nama_lengkap || "User"} 👋
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-text-tertiary">Role:</span>
          <span className="text-sm font-semibold text-text-primary bg-surface-tertiary px-2 py-0.5 rounded">
            {user?.role?.toUpperCase() || "ADMIN"}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-border p-5 hover:shadow-lg transition-all duration-300"
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-surface-secondary rounded-lg"></div>
                  <div className="w-16 h-6 bg-surface-secondary rounded"></div>
                </div>
                <div className="h-8 bg-surface-secondary rounded w-20 mb-2"></div>
                <div className="h-4 bg-surface-secondary rounded w-32"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-text-secondary">
                  {stat.label}
                </div>
                <div className="text-xs text-text-tertiary mt-1">
                  {stat.detail}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Charts & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">
            Distribusi Status Aset
          </h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : statusData.length > 0 ? (
            <div className="space-y-4">
              {/* Simple bar visualization */}
              <div className="h-8 flex rounded-lg overflow-hidden">
                {statusData.map((item, idx) => (
                  <div
                    key={idx}
                    className="transition-all duration-500"
                    style={{
                      width: `${(item.count / totalStatus) * 100}%`,
                      backgroundColor: item.color,
                    }}
                    title={`${item.status}: ${item.count}`}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="space-y-2">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-text-secondary">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {item.count}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        (
                        {totalStatus > 0
                          ? ((item.count / totalStatus) * 100).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <span className="text-4xl block mb-2">📊</span>
                <span className="text-sm">Belum ada data aset</span>
              </div>
            </div>
          )}
        </div>

        {/* Asset by Type */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Jenis Aset</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : asetStats?.byJenis &&
            Object.keys(asetStats.byJenis).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(asetStats.byJenis).map(([jenis, count], idx) => {
                const total = asetStats.totalAset || 1;
                const percentage = (count / total) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary capitalize">
                        {jenis}
                      </span>
                      <span className="font-semibold text-text-primary">
                        {count}
                      </span>
                    </div>
                    <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <span className="text-4xl block mb-2">🏢</span>
                <span className="text-sm">Belum ada data jenis aset</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Ringkasan</h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-surface-secondary rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📐</span>
                  <span className="text-sm text-text-secondary">
                    Total Luas
                  </span>
                </div>
                <span className="font-semibold text-text-primary">
                  {formatArea(asetStats?.totalLuas)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💵</span>
                  <span className="text-sm text-text-secondary">
                    Total Nilai
                  </span>
                </div>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(asetStats?.totalNilai)}
                </span>
              </div>
              {userStats && (
                <>
                  <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👥</span>
                      <span className="text-sm text-text-secondary">
                        Total User
                      </span>
                    </div>
                    <span className="font-semibold text-text-primary">
                      {formatNumber(userStats.totalUsers)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✓</span>
                      <span className="text-sm text-text-secondary">
                        User Aktif
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(userStats.activeUsers)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <span className="text-sm text-text-secondary">
                    Total Aktivitas
                  </span>
                </div>
                <span className="font-semibold text-text-primary">
                  {formatNumber(riwayatStats?.totalActivities)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-gray-900 text-sm">📋</span>
            </div>
            <h3 className="font-semibold text-text-primary">
              Aktivitas Terbaru
            </h3>
          </div>
          <button
            onClick={() => navigate("/riwayat")}
            className="text-sm text-text-secondary hover:text-text-primary font-medium transition-colors flex items-center gap-1"
          >
            Lihat Semua
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-20 h-4 bg-surface-secondary rounded"></div>
                  <div className="w-24 h-4 bg-surface-secondary rounded"></div>
                  <div className="w-16 h-6 bg-surface-secondary rounded-full"></div>
                  <div className="flex-1 h-4 bg-surface-secondary rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-secondary border-b border-border-light">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Aksi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Tabel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Deskripsi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {recentActivities.map((activity, idx) => (
                  <tr
                    key={activity.id_riwayat || idx}
                    className="hover:bg-surface-secondary transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-text-tertiary whitespace-nowrap">
                      {formatDateTime(activity.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {activity.user?.username || activity.user_id || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityBadge(
                          activity.aksi
                        )}`}
                      >
                        {activity.aksi}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary capitalize">
                      {activity.tabel || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">
                      {activity.keterangan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <span className="text-4xl block mb-2">📋</span>
            <span className="text-sm">Belum ada aktivitas terbaru</span>
          </div>
        )}
      </div>
    </div>
  );
}
