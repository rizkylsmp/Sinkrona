import { useState } from "react";

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState("umum");
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    namaAplikasi: "SINKRONA - Sistem Manajemen Aset Tanah",
    deskripsiAplikasi: "Sistem informasi manajemen aset tanah terintegrasi",
    emailAdmin: "admin@sinkrona.go.id",
    teleponAdmin: "0274-123456",
    alamatKantor: "Jl. Tata Bumi No. 5, Gamping, Sleman, Yogyakarta",
    timezone: "Asia/Jakarta",
    bahasa: "id",
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    emailNotifikasi: true,
    pushNotifikasi: true,
    notifLogin: true,
    notifPerubahanData: true,
    notifBackup: true,
    notifUserBaru: true,
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    tema: "light",
    itemPerHalaman: "10",
    formatTanggal: "DD/MM/YYYY",
  });

  // Users list
  const [users, setUsers] = useState([
    { id: 1, username: "admin01", namaLengkap: "Budi Santoso", role: "Admin", status: "Aktif", lastLogin: "15/01/2025" },
    { id: 2, username: "dinas_aset01", namaLengkap: "Siti Rahayu", role: "DinasAsetPemkot", status: "Aktif", lastLogin: "15/01/2025" },
    { id: 3, username: "bpn_user01", namaLengkap: "Ahmad Fauzi", role: "BPN", status: "Aktif", lastLogin: "14/01/2025" },
    { id: 4, username: "tata_ruang01", namaLengkap: "Dewi Lestari", role: "DinasTataRuang", status: "Aktif", lastLogin: "13/01/2025" },
    { id: 5, username: "masyarakat01", namaLengkap: "Joko Widodo", role: "Masyarakat", status: "Nonaktif", lastLogin: "10/01/2025" },
  ]);

  const tabs = [
    { id: "umum", label: "Umum", icon: "⚙️" },
    { id: "notifikasi", label: "Notifikasi", icon: "🔔" },
    { id: "tampilan", label: "Tampilan", icon: "🎨" },
    { id: "manajemen_user", label: "Manajemen User", icon: "👥" },
  ];

  const handleGeneralChange = (field, value) => {
    setGeneralSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotifChange = (field, value) => {
    setNotifSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleDisplayChange = (field, value) => {
    setDisplaySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    alert("Pengaturan berhasil disimpan! (Logic akan diimplementasikan nanti)");
  };

  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : u
      )
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Admin": return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      case "DinasAsetPemkot": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "BPN": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "DinasTataRuang": return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "Masyarakat": return "bg-surface-secondary text-text-secondary";
      default: return "bg-surface-secondary text-text-secondary";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Pengaturan Sistem</h1>
          <p className="text-text-tertiary text-sm mt-1">Konfigurasi dan pengaturan aplikasi</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
          <span className="text-blue-600 dark:text-blue-400 text-lg shrink-0">ℹ️</span>
          <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Hanya dapat diakses oleh <strong>Administrator</strong></span>
        </div>
      </div>

      {/* Settings Container */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex min-w-full sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-text-primary border-b-2 border-accent"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Tab: Umum */}
          {activeTab === "umum" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Nama Aplikasi</label>
                <input
                  type="text"
                  value={generalSettings.namaAplikasi}
                  onChange={(e) => handleGeneralChange("namaAplikasi", e.target.value)}
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Deskripsi Aplikasi</label>
                <textarea
                  value={generalSettings.deskripsiAplikasi}
                  onChange={(e) => handleGeneralChange("deskripsiAplikasi", e.target.value)}
                  rows={2}
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Admin</label>
                  <input
                    type="email"
                    value={generalSettings.emailAdmin}
                    onChange={(e) => handleGeneralChange("emailAdmin", e.target.value)}
                    className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Telepon Kantor</label>
                  <input
                    type="tel"
                    value={generalSettings.teleponAdmin}
                    onChange={(e) => handleGeneralChange("teleponAdmin", e.target.value)}
                    className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Alamat Kantor</label>
                <textarea
                  value={generalSettings.alamatKantor}
                  onChange={(e) => handleGeneralChange("alamatKantor", e.target.value)}
                  rows={2}
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => handleGeneralChange("timezone", e.target.value)}
                    className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Bahasa</label>
                  <select
                    value={generalSettings.bahasa}
                    onChange={(e) => handleGeneralChange("bahasa", e.target.value)}
                    className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveSettings}
                  className="bg-accent text-surface px-6 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* Tab: Notifikasi */}
          {activeTab === "notifikasi" && (
            <div className="max-w-xl space-y-6">
              <div className="bg-surface-secondary rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-text-primary">Channel Notifikasi</h4>
                <label className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-text-tertiary transition-colors">
                  <div className="flex items-center gap-3">
                    <span>📧</span>
                    <span className="text-sm text-text-primary">Email Notifikasi</span>
                  </div>
                  <button
                    onClick={() => handleNotifChange("emailNotifikasi", !notifSettings.emailNotifikasi)}
                    className={`w-11 h-6 rounded-full transition-colors ${notifSettings.emailNotifikasi ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings.emailNotifikasi ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </label>
                <label className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-text-tertiary transition-colors">
                  <div className="flex items-center gap-3">
                    <span>🔔</span>
                    <span className="text-sm text-text-primary">Push Notifikasi (In-App)</span>
                  </div>
                  <button
                    onClick={() => handleNotifChange("pushNotifikasi", !notifSettings.pushNotifikasi)}
                    className={`w-11 h-6 rounded-full transition-colors ${notifSettings.pushNotifikasi ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings.pushNotifikasi ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </label>
              </div>

              <div className="bg-surface-secondary rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-text-primary">Jenis Notifikasi</h4>
                {[
                  { key: "notifLogin", label: "Notifikasi Login", icon: "🔐" },
                  { key: "notifPerubahanData", label: "Perubahan Data Aset", icon: "📝" },
                  { key: "notifBackup", label: "Backup & Restore", icon: "💾" },
                  { key: "notifUserBaru", label: "User Baru", icon: "👤" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:border-text-tertiary transition-colors">
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span className="text-sm text-text-primary">{item.label}</span>
                    </div>
                    <button
                      onClick={() => handleNotifChange(item.key, !notifSettings[item.key])}
                      className={`w-11 h-6 rounded-full transition-colors ${notifSettings[item.key] ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="bg-accent text-surface px-6 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* Tab: Tampilan */}
          {activeTab === "tampilan" && (
            <div className="max-w-xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">Tema Aplikasi</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleDisplayChange("tema", "light")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      displaySettings.tema === "light"
                        ? "border-accent bg-surface-secondary"
                        : "border-border hover:border-text-tertiary"
                    }`}
                  >
                    <div className="w-full h-16 bg-white rounded border border-gray-200 mb-2 flex items-center justify-center">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">Light Mode</span>
                  </button>
                  <button
                    onClick={() => handleDisplayChange("tema", "dark")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      displaySettings.tema === "dark"
                        ? "border-accent bg-surface-secondary"
                        : "border-border hover:border-text-tertiary"
                    }`}
                  >
                    <div className="w-full h-16 bg-gray-800 rounded mb-2 flex items-center justify-center">
                      <span className="text-2xl">🌙</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">Dark Mode</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Item Per Halaman</label>
                  <select
                    value={displaySettings.itemPerHalaman}
                    onChange={(e) => handleDisplayChange("itemPerHalaman", e.target.value)}
                    className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Format Tanggal</label>
                  <select
                    value={displaySettings.formatTanggal}
                    onChange={(e) => handleDisplayChange("formatTanggal", e.target.value)}
                    className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="bg-accent text-surface px-6 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* Tab: Manajemen User */}
          {activeTab === "manajemen_user" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="font-semibold text-text-primary">Daftar User</h3>
                <button 
                  onClick={() => alert('Tambah User (Logic akan diimplementasikan nanti)')}
                  className="bg-accent text-surface px-4 py-2 rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center justify-center sm:justify-start gap-2"
                >
                  <span>➕</span>
                  <span className="hidden sm:inline">Tambah User</span>
                  <span className="sm:hidden">Tambah</span>
                </button>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full">
                  <thead className="bg-surface-secondary">
                    <tr>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider">Username</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Nama Lengkap</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Login Terakhir</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-secondary transition-colors">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-text-primary">{user.username}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-secondary hidden sm:table-cell">{user.namaLengkap}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getRoleBadgeStyle(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            user.status === "Aktif" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-tertiary hidden md:table-cell">{user.lastLogin}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-text-secondary bg-surface-secondary rounded-lg hover:bg-border transition-colors whitespace-nowrap"
                            >
                              {user.status === "Aktif" ? "Nonaktif" : "Aktif"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
