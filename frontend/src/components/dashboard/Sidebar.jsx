import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import {
  canAccessMenu,
  getRoleDisplayName,
  getRoleBadgeColor,
} from "../../utils/permissions";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const userRole = user?.role || "bpn";

  // All menu items with their permission IDs
  const allMenuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard", path: "/dashboard" },
    { id: "aset", icon: "📁", label: "Kelola Aset", path: "/aset" },
    { id: "peta", icon: "🗺️", label: "Peta", path: "/peta" },
    { id: "riwayat", icon: "⏱️", label: "Riwayat Aktivitas", path: "/riwayat" },
    { id: "notifikasi", icon: "🔔", label: "Notifikasi", path: "/notifikasi" },
    { id: "user", icon: "👥", label: "Manajemen User", path: "/users" },
    { id: "backup", icon: "💾", label: "Backup & Restore", path: "/backup" },
    { id: "pengaturan", icon: "⚙️", label: "Pengaturan", path: "/pengaturan" },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) =>
    canAccessMenu(userRole, item.id)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <aside className="border-r-2 border-black bg-white w-64 min-h-screen flex flex-col">
      {/* User Info Card */}
      <div className="border-2 border-black bg-gray-50 m-4 p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center text-lg font-bold">
            {user?.nama?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{user?.nama || "User"}</p>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getRoleBadgeColor(
                userRole
              )}`}
            >
              {getRoleDisplayName(userRole)}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Title */}
      <div className="border-2 border-black bg-white px-4 py-3 font-bold text-sm mx-4">
        MENU
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2 px-4 py-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full text-left border-2 border-black px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 mt-8 space-y-2">
        <button
          onClick={() => handleMenuClick("/profil")}
          className="w-full text-left border-2 border-black px-4 py-2 text-sm hover:bg-blue-100 transition font-medium"
        >
          👤 Profil Saya
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left border-2 border-black px-4 py-2 text-sm hover:bg-red-100 transition font-medium"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
