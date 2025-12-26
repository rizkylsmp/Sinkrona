import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { notifikasiService } from "../services/api";

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === "belum_dibaca") params.unreadOnly = "true";

      const response = await notifikasiService.getAll(params);
      const data = response.data.data || [];

      // Transform API data to component format
      const transformedData = data.map((notif) => ({
        id: notif.id_notifikasi,
        type: notif.kategori || "info",
        icon: getNotifIcon(notif.kategori),
        iconBg: getNotifIconBg(notif.kategori),
        title: notif.judul,
        isNew: !notif.dibaca,
        time: formatTimeAgo(notif.created_at),
        content: notif.pesan,
        detail: notif.detail || "",
        isRead: notif.dibaca,
        referensi: notif.referensi,
        referensi_id: notif.referensi_id,
      }));

      setNotifications(transformedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Use sample data as fallback
      setNotifications(getSampleNotifications());
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notifikasiService.getUnreadCount();
      setUnreadCount(response.data.data?.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Helper functions
  const getNotifIcon = (kategori) => {
    const icons = {
      login: "👤",
      update: "📝",
      warning: "⚠️",
      success: "✅",
      backup: "💾",
      user: "👥",
      report: "📊",
      info: "ℹ️",
      aset: "🏢",
    };
    return icons[kategori] || "🔔";
  };

  const getNotifIconBg = (kategori) => {
    const bgs = {
      login: "bg-gray-100 dark:bg-gray-800",
      update: "bg-amber-100 dark:bg-amber-900/30",
      warning: "bg-orange-100 dark:bg-orange-900/30",
      success: "bg-emerald-100 dark:bg-emerald-900/30",
      backup: "bg-purple-100 dark:bg-purple-900/30",
      user: "bg-blue-100 dark:bg-blue-900/30",
      report: "bg-orange-100 dark:bg-orange-900/30",
      info: "bg-blue-100 dark:bg-blue-900/30",
      aset: "bg-indigo-100 dark:bg-indigo-900/30",
    };
    return bgs[kategori] || "bg-gray-100 dark:bg-gray-800";
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return date.toLocaleDateString("id-ID");
  };

  // Sample data fallback
  const getSampleNotifications = () => [
    {
      id: 1,
      type: "info",
      icon: "ℹ️",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Selamat Datang",
      isNew: true,
      time: "Baru saja",
      content:
        "Selamat datang di Sinkrona! Mulai kelola aset tanah Anda dengan mudah.",
      detail: "",
      isRead: false,
    },
  ];

  // Statistics (computed from data)
  const stats = {
    total: notifications.length,
    belumDibaca: notifications.filter((n) => !n.isRead).length,
    hariIni: notifications.filter(
      (n) =>
        n.time.includes("menit") ||
        n.time.includes("jam") ||
        n.time === "Baru saja"
    ).length,
  };

  const tabs = [
    { id: "semua", label: "Semua", count: stats.total },
    { id: "belum_dibaca", label: "Belum Dibaca", count: stats.belumDibaca },
    {
      id: "sudah_dibaca",
      label: "Sudah Dibaca",
      count: stats.total - stats.belumDibaca,
    },
  ];

  const handleMarkAsRead = async (id) => {
    try {
      await notifikasiService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true, isNew: false } : n
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking as read:", error);
      // Still update locally for better UX
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true, isNew: false } : n
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notifikasiService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, isNew: false }))
      );
      setUnreadCount(0);
      toast.success("Semua notifikasi ditandai sudah dibaca");
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Still update locally
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, isNew: false }))
      );
    }
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notifikasi dihapus");
  };

  const handleDeleteAll = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua notifikasi?")) {
      setNotifications([]);
      toast.success("Semua notifikasi dihapus");
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    fetchUnreadCount();
    toast.success("Data diperbarui");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "belum_dibaca") return !n.isRead;
    if (activeTab === "sudah_dibaca") return n.isRead;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifikasi</h1>
          <p className="text-text-tertiary text-sm mt-1">
            Kelola pemberitahuan dan aktivitas terbaru
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-tertiary transition-all disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleMarkAllAsRead}
            disabled={stats.belumDibaca === 0}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-tertiary transition-all disabled:opacity-50"
          >
            <span>✓</span>
            <span className="hidden sm:inline">Tandai Semua Dibaca</span>
            <span className="sm:hidden text-xs">Dibaca</span>
          </button>
          <button
            onClick={handleDeleteAll}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-surface border border-border rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <span>🗑️</span>
            <span className="hidden sm:inline">Hapus Semua</span>
            <span className="sm:hidden text-xs">Hapus</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-surface rounded-xl border border-border p-3 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-sm sm:text-lg">🔔</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-bold text-text-primary">
                {stats.total}
              </div>
              <div className="text-xs sm:text-sm text-text-tertiary">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-3 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-sm sm:text-lg">📬</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-bold text-text-primary">
                {stats.belumDibaca}
              </div>
              <div className="text-xs sm:text-sm text-text-tertiary">Belum</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-3 sm:p-5 hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-sm sm:text-lg">📅</span>
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-2xl font-bold text-text-primary">
                {stats.hariIni}
              </div>
              <div className="text-xs sm:text-sm text-text-tertiary">Hari Ini</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Notifications */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex min-w-full sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-3 sm:py-4 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-text-primary border-b-2 border-accent"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span
                  className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                    activeTab === tab.id
                      ? "bg-accent text-white dark:text-gray-900"
                      : "bg-surface-tertiary text-text-secondary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-border-light">
          {filteredNotifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-text-muted">Tidak ada notifikasi</div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 sm:px-6 py-4 hover:bg-surface-secondary transition-colors ${
                  !notif.isRead ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${notif.iconBg} dark:opacity-80 rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <span className="text-lg sm:text-xl">{notif.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h4 className="font-semibold text-text-primary text-sm sm:text-base">
                        {notif.title}
                      </h4>
                      {notif.isNew && (
                        <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full w-fit">
                          BARU
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary mb-1">
                      {notif.content}
                    </p>
                    <p className="text-xs text-text-muted mb-3">
                      {notif.detail}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="px-2 sm:px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-border transition-colors whitespace-nowrap"
                        >
                          ✓ <span className="hidden sm:inline">Tandai Dibaca</span>
                          <span className="sm:hidden">Dibaca</span>
                        </button>
                      )}
                      {notif.actions && notif.actions.includes("lihat_detail") && (
                        <button
                          onClick={() =>
                            alert(
                              "Lihat Detail (Logic akan diimplementasikan nanti)"
                            )
                          }
                          className="px-2 sm:px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-border transition-colors whitespace-nowrap"
                        >
                          → <span className="hidden sm:inline">Lihat Detail</span>
                          <span className="sm:hidden">Detail</span>
                        </button>
                      )}
                      {notif.actions && notif.actions.includes("download") && (
                        <button
                          onClick={() =>
                            alert(
                              "Download (Logic akan diimplementasikan nanti)"
                            )
                          }
                          className="px-2 sm:px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-border transition-colors whitespace-nowrap"
                        >
                          ↓ <span className="hidden sm:inline">Download</span>
                        </button>
                      )}
                      {notif.actions && notif.actions.includes("download_laporan") && (
                        <button
                          onClick={() =>
                            alert(
                              "Download Laporan (Logic akan diimplementasikan nanti)"
                            )
                          }
                          className="px-2 sm:px-3 py-1.5 text-xs font-medium text-text-secondary bg-surface-tertiary rounded-lg hover:bg-border transition-colors whitespace-nowrap"
                        >
                          ↓ <span className="hidden sm:inline">Download Laporan</span>
                          <span className="sm:hidden">Laporan</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="px-2 sm:px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors whitespace-nowrap"
                      >
                        × <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-xs text-text-muted shrink-0 mt-2 sm:mt-0">
                    {notif.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
