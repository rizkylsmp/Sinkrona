import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";

export default function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const notifications = [
    {
      id: 1,
      icon: "👤",
      title: "Login Berhasil",
      time: "2 menit lalu",
      isNew: true,
    },
    {
      id: 2,
      icon: "📝",
      title: "Data Aset Diperbarui",
      time: "15 menit lalu",
      isNew: true,
    },
    {
      id: 3,
      icon: "⚠️",
      title: "Peringatan Sistem",
      time: "1 jam lalu",
      isNew: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.isNew).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setShowNotifDropdown(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 gap-3 md:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-tertiary transition-all duration-200 mr-2"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-gray-900 font-bold text-sm">
              S
            </span>
          </div>
          <div>
            <h1 className="font-bold text-text-primary text-lg leading-tight group-hover:text-text-secondary transition-colors">
              SINKRONA
            </h1>
            <p className="text-[10px] text-text-muted -mt-0.5 md:block hidden">
              Sistem Manajemen Aset
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center md:gap-2 gap-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-tertiary transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowProfileDropdown(false);
              }}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:bg-surface-tertiary transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute -right-18 sm:right-0 mt-2 w-72 sm:w-80 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                <div className="bg-accent text-white dark:text-gray-900 px-4 py-3 flex items-center justify-between">
                  <span className="font-semibold text-sm">Notifikasi</span>
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} Baru
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-border-light hover:bg-surface-tertiary cursor-pointer transition-colors ${
                        notif.isNew ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{notif.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-text-primary">
                              {notif.title}
                            </span>
                            {notif.isNew && (
                              <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                BARU
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-text-muted">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowNotifDropdown(false);
                    navigate("/notifikasi");
                  }}
                  className="w-full px-4 py-3 text-center text-sm font-medium text-text-secondary hover:bg-surface-tertiary border-t border-border-light transition-colors"
                >
                  Lihat Semua Notifikasi →
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-tertiary transition-all duration-200"
            >
              <div className="w-8 h-8 bg-surface-tertiary rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text-primary leading-tight">
                  {user?.nama_lengkap || "User"}
                </p>
                <p className="text-[10px] text-text-muted">
                  {user?.role || "Role"}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-4 bg-surface-secondary border-b border-border-light">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-surface-tertiary rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {user?.nama_lengkap || "User"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {user?.email || "email@domain.com"}
                      </p>
                      <span className="inline-block mt-1 bg-accent text-white dark:text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {user?.role || "User"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/profil");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:bg-surface-tertiary flex items-center gap-3 transition-colors"
                  >
                    <span>👤</span> Profil Saya
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/pengaturan");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:bg-surface-tertiary flex items-center gap-3 transition-colors"
                  >
                    <span>⚙️</span> Pengaturan
                  </button>
                </div>
                <div className="border-t border-border-light">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 font-medium transition-colors"
                  >
                    <span>🚪</span> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
