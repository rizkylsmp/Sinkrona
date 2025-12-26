import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { userService } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import {
  hasPermission,
  ROLES,
  getRoleDisplayName,
  getRoleBadgeColor,
} from "../utils/permissions";
import { useConfirm } from "../components/ui/ConfirmDialog";

export default function UserManagementPage() {
  // Auth & Permissions
  const currentUser = useAuthStore((state) => state.user);
  const userRole = currentUser?.role || "bpn";
  const canCreate = hasPermission(userRole, "user", "create");
  const canUpdate = hasPermission(userRole, "user", "update");
  const canDelete = hasPermission(userRole, "user", "delete");
  const confirm = useConfirm();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminCount: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    role: "bpn",
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole && { role: filterRole }),
      };
      const response = await userService.getAll(params);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data user");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterRole]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await userService.getStats();
      const data = response.data.data || {};
      setStats({
        totalUsers: data.total || 0,
        activeUsers: data.active || data.total || 0,
        adminCount: data.byRole?.admin || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      nama: "",
      username: "",
      email: "",
      password: "",
      role: "bpn",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nama: user.nama || "",
      username: user.username || "",
      email: user.email || "",
      password: "",
      role: user.role || "bpn",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Update
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.update(editingUser.id_user, updateData);
        toast.success("User berhasil diperbarui");
      } else {
        // Create
        await userService.create(formData);
        toast.success("User berhasil ditambahkan");
      }
      handleCloseModal();
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMsg = error.response?.data?.error || "Gagal menyimpan user";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser?.id_user) {
      toast.error("Tidak dapat menghapus akun sendiri!");
      return;
    }

    const confirmed = await confirm({
      title: "Hapus User",
      message:
        "Apakah Anda yakin ingin menghapus user ini? Data yang dihapus tidak dapat dikembalikan.",
      confirmText: "Hapus",
      cancelText: "Batal",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      await userService.delete(userId);
      toast.success("User berhasil dihapus");
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMsg = error.response?.data?.error || "Gagal menghapus user";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">
            Manajemen User
          </h1>
          <p className="text-text-tertiary text-sm mt-1">
            Kelola akun pengguna sistem ({stats.totalUsers} total)
          </p>
        </div>
        {canCreate && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-accent text-white dark:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-all shadow-lg hover:shadow-xl text-sm font-medium w-full sm:w-auto"
          >
            <span>➕</span>
            Tambah User
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {stats.totalUsers}
              </div>
              <div className="text-xs text-text-tertiary">Total User</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.activeUsers}
              </div>
              <div className="text-xs text-text-tertiary">User Aktif</div>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">👑</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.adminCount}
              </div>
              <div className="text-xs text-text-tertiary">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama atau username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full border border-border bg-surface text-text-primary rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            >
              <option value="">Semua Role</option>
              <option value="admin">Administrator</option>
              <option value="dinas_aset">Dinas Aset</option>
              <option value="bpn">BPN</option>
              <option value="tata_ruang">Tata Ruang</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-accent text-white dark:text-gray-900 px-6 py-2.5 rounded-lg hover:bg-accent-hover transition-all text-sm font-medium"
          >
            🔍 Cari
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-text-tertiary">Memuat data user...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Tidak ada data user
            </h3>
            <p className="text-text-tertiary text-sm">
              Belum ada user yang terdaftar atau tidak ada hasil pencarian
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-secondary border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user, idx) => (
                  <tr
                    key={user.id_user}
                    className="hover:bg-surface-secondary transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-semibold">
                          {user.nama?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {user.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-tertiary">
                      {user.email || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        {canUpdate && (
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-2 text-text-tertiary hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all"
                            title="Edit"
                          >
                            ✏️
                          </button>
                        )}
                        {canDelete && user.id_user !== currentUser?.id_user && (
                          <button
                            onClick={() => handleDelete(user.id_user)}
                            className="p-2 text-text-tertiary hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        )}
                        {user.id_user === currentUser?.id_user && (
                          <span className="text-xs text-text-tertiary italic py-2">
                            (Anda)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingUser ? "Edit User" : "Tambah User Baru"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Password{" "}
                  {editingUser ? (
                    <span className="text-text-tertiary font-normal">
                      (kosongkan jika tidak diubah)
                    </span>
                  ) : (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required={!editingUser}
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder={
                    editingUser ? "Masukkan password baru" : "Masukkan password"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-border bg-surface text-text-primary rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                >
                  <option value="admin">Administrator</option>
                  <option value="dinas_aset">Dinas Aset</option>
                  <option value="bpn">BPN</option>
                  <option value="tata_ruang">Tata Ruang</option>
                </select>
              </div>

              {/* Role Description */}
              <div className="bg-surface-secondary rounded-lg p-3 text-sm">
                <p className="font-medium text-text-primary mb-1">
                  Hak Akses Role:
                </p>
                <ul className="text-text-tertiary text-xs space-y-0.5">
                  {formData.role === "admin" && (
                    <>
                      <li>• Full access ke semua fitur</li>
                      <li>• CRUD User, Aset, Backup & Restore</li>
                    </>
                  )}
                  {formData.role === "dinas_aset" && (
                    <>
                      <li>• CRUD Data Aset</li>
                      <li>• Akses Peta dengan semua layer</li>
                      <li>• Lihat Riwayat & Notifikasi</li>
                    </>
                  )}
                  {formData.role === "bpn" && (
                    <>
                      <li>• View Data Aset</li>
                      <li>• Akses Peta dengan layer BPN</li>
                      <li>• Lihat Riwayat & Notifikasi</li>
                    </>
                  )}
                  {formData.role === "tata_ruang" && (
                    <>
                      <li>• View Data Aset</li>
                      <li>• Akses Peta dengan layer Tata Ruang</li>
                      <li>• Lihat Riwayat & Notifikasi</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-text-secondary hover:bg-surface-secondary transition-all text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-accent text-white dark:text-gray-900 rounded-lg hover:bg-accent-hover transition-all text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingUser
                    ? "Update"
                    : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
