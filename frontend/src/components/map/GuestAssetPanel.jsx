import { useNavigate } from "react-router-dom";

export default function GuestAssetPanel({ asset, onClose }) {
  const navigate = useNavigate();

  if (!asset) return null;

  const getStatusColor = (status) => {
    const s = status?.toLowerCase().replace(/\s+/g, "_");
    switch (s) {
      case "aktif":
        return "bg-emerald-500";
      case "berperkara":
        return "bg-red-500";
      case "indikasi_berperkara":
        return "bg-blue-500";
      case "tidak_aktif":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="absolute bottom-52 right-4 bg-surface rounded-xl border border-border w-80 shadow-xl z-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-secondary px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-surface text-xs">📍</span>
          </div>
          <h3 className="font-semibold text-sm text-text-primary">Info Aset</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center hover:bg-surface-tertiary rounded-lg transition-colors text-text-tertiary hover:text-text-primary"
        >
          ✕
        </button>
      </div>

      {/* Preview Content - Limited Info */}
      <div className="p-4 space-y-4">
        {/* Asset Name with Status Indicator */}
        <div className="flex items-start gap-3">
          <div
            className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(
              asset.status
            )}`}
          />
          <div>
            <h4 className="font-semibold text-text-primary text-sm leading-tight">
              {asset.nama_aset}
            </h4>
            <p className="text-xs text-text-tertiary mt-1">{asset.kode_aset}</p>
          </div>
        </div>

        {/* Blurred/Hidden Info Placeholder */}
        <div className="relative">
          {/* Blurred content simulation */}
          <div className="space-y-2 blur-sm select-none pointer-events-none">
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary">Lokasi</span>
              <span className="text-xs text-text-secondary">
                ██████████████
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary">Luas</span>
              <span className="text-xs text-text-secondary">████ m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary">Tahun</span>
              <span className="text-xs text-text-secondary">████</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-tertiary">Nilai Aset</span>
              <span className="text-xs text-text-secondary">Rp ██████████</span>
            </div>
          </div>

          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-surface/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-2 text-text-secondary">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-xs font-medium">Detail Terkunci</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Login CTA */}
        <div className="text-center space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-primary">
              Ingin melihat detail lengkap?
            </p>
            <p className="text-xs text-text-tertiary">
              Login untuk mengakses informasi detail aset
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-accent text-white px-4 py-2.5 text-sm font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
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
            <span>Login Sekarang</span>
          </button>

          <p className="text-[10px] text-text-muted">
            Belum punya akun? Hubungi administrator
          </p>
        </div>
      </div>
    </div>
  );
}
