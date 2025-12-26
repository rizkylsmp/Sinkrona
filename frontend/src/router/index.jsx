import { createHashRouter, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AssetPage from "../pages/AssetPage";
import MapPage from "../pages/MapPage";
import RiwayatPage from "../pages/RiwayatPage";
import NotifikasiPage from "../pages/NotifikasiPage";
import BackupPage from "../pages/BackupPage";
import ProfilPage from "../pages/ProfilPage";
import PengaturanPage from "../pages/PengaturanPage";
import UserManagementPage from "../pages/UserManagementPage";

// Auth Guard Components
import ProtectedRoute from "../components/ProtectedRoute";
import RoleGuard from "../components/RoleGuard";

// Router configuration using createHashRouter
const router = createHashRouter([
  // Public routes - Login page with map background
  {
    path: "/login",
    element: <LoginPage />,
  },

  // Protected routes with Dashboard Layout
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "aset",
        element: <AssetPage />,
      },
      {
        path: "peta",
        element: <MapPage />,
      },
      {
        path: "riwayat",
        element: <RiwayatPage />,
      },
      {
        path: "notifikasi",
        element: <NotifikasiPage />,
      },
      {
        path: "backup",
        element: (
          <RoleGuard menuId="backup">
            <BackupPage />
          </RoleGuard>
        ),
      },
      {
        path: "profil",
        element: <ProfilPage />,
      },
      {
        path: "pengaturan",
        element: (
          <RoleGuard menuId="pengaturan">
            <PengaturanPage />
          </RoleGuard>
        ),
      },
      {
        path: "users",
        element: (
          <RoleGuard menuId="user">
            <UserManagementPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // Catch all - redirect to dashboard
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
