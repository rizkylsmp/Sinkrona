import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "📁", label: "Kelola Aset", path: "/aset" },
    { icon: "🗺️", label: "Peta", path: "/peta" },
    { icon: "⏱️", label: "Riwayat", path: "/riwayat" },
    { icon: "🔔", label: "Notifikasi", path: "/notifikasi" },
    { icon: "💾", label: "Backup", path: "/backup" },
    { icon: "⚙️", label: "Pengaturan", path: "/pengaturan" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    onNavigate?.();
  };

  const handleMenuClick = (path) => {
    navigate(path);
    onNavigate?.();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="bg-surface w-60 flex flex-col border-r border-border shadow-sm h-full overflow-hidden">
      {/* Menu Title */}
      <div className="px-4 py-4 border-b border-border-light">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Menu Utama
        </span>
      </div>

      {/* Menu Items - No scroll, fit content */}
      <nav className="flex-1 py-2 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item.path)}
            className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all duration-200 ${
              isActivePath(item.path)
                ? "bg-accent text-white dark:bg-white dark:text-gray-900 border-l-4 border-accent dark:border-white"
                : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary border-l-4 border-transparent"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section - Fixed at bottom */}
      <div className="border-t border-border-light p-3 space-y-1 bg-surface mt-auto">
        <button
          onClick={() => handleMenuClick("/profil")}
          className="w-full text-left px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-tertiary hover:text-text-primary rounded-lg flex items-center gap-3 transition-all duration-200"
        >
          <span className="text-lg">👤</span>
          <span className="font-medium">Profil Saya</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2.5 text-sm text-text-muted hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg flex items-center gap-3 transition-all duration-200"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
