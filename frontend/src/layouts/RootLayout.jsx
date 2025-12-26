import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";

// Main Root Layout
export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Halaman peta tidak perlu scroll wrapper
  const isMapPage = location.pathname === "/peta";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen bg-surface-secondary flex flex-col overflow-hidden">
      <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Desktop Sidebar - fixed height, no scroll */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar with Overlay */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar onNavigate={closeSidebar} />
            </div>
          </>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-hidden ${
            isMapPage ? "" : "overflow-y-auto"
          }`}
        >
          {isMapPage ? (
            <Outlet />
          ) : (
            <div className="h-full overflow-y-auto pb-20 sm:pb-6">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
