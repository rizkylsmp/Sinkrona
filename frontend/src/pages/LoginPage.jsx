import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { authService } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

// Custom marker icon
const getMarkerIcon = (status) => {
  const colors = {
    aktif: "#10b981",
    berperkara: "#ef4444",
    indikasi_berperkara: "#3b82f6",
    tidak_aktif: "#f59e0b",
  };
  const s = status?.toLowerCase().replace(/\s+/g, "_");
  const color = colors[s] || "#6b7280";
  return L.divIcon({
    html: `<div style="background-color: ${color}; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    className: "custom-marker",
  });
};

// Sample assets for map preview
const sampleAssets = [
  {
    id: 1,
    nama: "Tanah Alun-Alun",
    status: "aktif",
    lat: -7.6457,
    lng: 112.9061,
  },
  {
    id: 2,
    nama: "Gedung Kantor Pemkot",
    status: "aktif",
    lat: -7.6485,
    lng: 112.9095,
  },
  {
    id: 3,
    nama: "Tanah Pelabuhan",
    status: "berperkara",
    lat: -7.635,
    lng: 112.902,
  },
  {
    id: 4,
    nama: "Lapangan Untung Suropati",
    status: "aktif",
    lat: -7.652,
    lng: 112.915,
  },
  {
    id: 5,
    nama: "Taman Kota",
    status: "indikasi_berperkara",
    lat: -7.64,
    lng: 112.913,
  },
  {
    id: 6,
    nama: "Kawasan Industri",
    status: "aktif",
    lat: -7.638,
    lng: 112.895,
  },
  {
    id: 7,
    nama: "Terminal Bus",
    status: "tidak_aktif",
    lat: -7.655,
    lng: 112.92,
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPanel, setShowLoginPanel] = useState(true);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username || !password) {
        setError("Username dan password harus diisi");
        setLoading(false);
        return;
      }

      const response = await authService.login(username, password);
      setToken(response.data.token);
      setUser(response.data.user);
      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login gagal";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    {
      label: "Admin",
      username: "admin",
      password: "admin123",
      color: "bg-gray-900",
    },
    {
      label: "Dinas Aset",
      username: "dinas_aset",
      password: "dinas123",
      color: "bg-emerald-600",
    },
    {
      label: "BPN",
      username: "bpn_user",
      password: "bpn123",
      color: "bg-blue-600",
    },
    {
      label: "Tata Ruang",
      username: "tata_ruang",
      password: "tataruang123",
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gray-900">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[-7.6469, 112.9075]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          scrollWheelZoom={true}
          dragging={true}
          doubleClickZoom={true}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {sampleAssets.map((asset) => (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={getMarkerIcon(asset.status)}
            >
              <Popup closeButton={false} className="simple-popup">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      asset.status === "aktif"
                        ? "bg-emerald-500"
                        : asset.status === "berperkara"
                        ? "bg-red-500"
                        : asset.status === "indikasi_berperkara"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {asset.nama}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Top Left - Logo Badge */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-auto">
        <div className="flex items-center gap-2 md:gap-3 bg-gray-900/80 backdrop-blur-md rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg border border-white/10">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center">
            <span className="text-base md:text-xl font-black text-gray-900">
              S
            </span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm md:text-lg tracking-tight">
              SINKRONA
            </h1>
            <p className="text-white/70 text-[10px] md:text-xs hidden sm:block">
              Sistem Manajemen Aset Tanah
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Left - Legend (compact) */}
      <div
        className={`absolute ${
          showLoginPanel ? "bottom-4" : "bottom-24"
        } sm:bottom-4 md:bottom-6 left-4 md:left-6 z-10 pointer-events-auto transition-all duration-300`}
      >
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 md:gap-4">
            {[
              { label: "Aktif", color: "bg-emerald-500" },
              { label: "Berperkara", color: "bg-red-500" },
              { label: "Indikasi", color: "bg-blue-500" },
              { label: "Tidak Aktif", color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${item.color}`}
                />
                <span className="text-white text-[10px] md:text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Panel - Right Side */}
      <div
        className={`absolute top-0 right-0 h-full z-30 transition-all duration-500 ease-out ${
          showLoginPanel
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="h-full w-screen sm:w-[380px] md:w-[400px] bg-white flex flex-col shadow-2xl max-h-screen overflow-hidden">
          {/* Toggle Button */}
          <button
            onClick={() => setShowLoginPanel(false)}
            className="absolute top-1/2 -translate-y-1/2 -left-8 md:-left-10 hidden sm:flex w-8 md:w-10 h-16 md:h-20 bg-white rounded-l-xl items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all group"
            title="Jelajahi Peta"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform"
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

          {/* Mobile Close */}
          <button
            onClick={() => setShowLoginPanel(false)}
            className="absolute top-3 right-3 sm:hidden w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Header */}
            <div className="px-6 md:px-8 pt-8 md:pt-12 pb-4 md:pb-8 text-center bg-gradient-to-b from-gray-50 to-white">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-900 rounded-xl md:rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3 md:mb-5">
                <span className="text-lg md:text-2xl font-black text-white">
                  S
                </span>
              </div>
              <h2 className="text-gray-900 font-bold text-base md:text-xl">
                SINKRONA
              </h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                Masuk ke Akun
              </p>
            </div>

            {/* Form */}
            <div className="px-6 md:px-8 py-3 md:py-6">
              {/* Error */}
              {error && (
                <div className="mb-4 md:mb-5 bg-red-50 border border-red-100 rounded-lg md:rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs md:text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
                <div className="space-y-1.5 md:space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-xs md:text-sm font-medium text-gray-700"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="Masukkan username"
                    className="w-full h-10 md:h-12 px-3 md:px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs md:text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toast("Fitur dalam pengembangan!", { icon: "🔧" });
                      }}
                      className="text-[10px] md:text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Masukkan password"
                    className="w-full h-10 md:h-12 px-3 md:px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition-all"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 md:h-12 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>

              {/* Explore Map */}
              <button
                onClick={() => setShowLoginPanel(false)}
                className="w-full mt-3 md:mt-4 h-9 md:h-11 text-xs md:text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg md:rounded-xl"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Jelajahi Peta Terlebih Dahulu
              </button>
            </div>

            {/* Demo Credentials - Compact on mobile */}
            <div className="px-6 md:px-8 py-2 md:py-6 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-4 text-center">
                Demo Credentials
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-2 gap-1 md:gap-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.username}
                    type="button"
                    onClick={() => {
                      setUsername(cred.username);
                      setPassword(cred.password);
                    }}
                    className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-1.5 md:p-3 text-center sm:text-left hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-center sm:justify-start gap-1 md:gap-2 mb-0 sm:mb-1">
                      <div
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${cred.color}`}
                      />
                      <span className="font-semibold text-gray-900 text-[9px] md:text-xs">
                        {cred.label}
                      </span>
                    </div>
                    <p className="hidden sm:block text-[9px] md:text-[10px] text-gray-400 font-mono truncate">
                      {cred.username}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 py-2 md:py-4 border-t border-gray-100 bg-white shrink-0">
            <p className="text-center text-gray-400 text-[10px] md:text-xs">
              © 2025 SINKRONA • Fikry Satrio
            </p>
          </div>
        </div>
      </div>

      {/* Floating Login Button (when panel hidden) - Desktop only */}
      {!showLoginPanel && (
        <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 hidden sm:block">
          <button
            onClick={() => setShowLoginPanel(true)}
            className="bg-white text-gray-900 pl-4 md:pl-5 pr-5 md:pr-6 py-2.5 md:py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 md:gap-3 group"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <span className="text-xs md:text-sm">Masuk untuk Akses Penuh</span>
          </button>
        </div>
      )}

      {/* Mobile Bottom Bar (when panel hidden) */}
      {!showLoginPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-10 sm:hidden">
          <button
            onClick={() => setShowLoginPanel(true)}
            className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2 text-base border-2 border-gray-200"
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Masuk
          </button>
        </div>
      )}
    </div>
  );
}
