export default function MapLegend() {
  const statuses = [
    { label: "Aktif", color: "#10b981", icon: "✓" },
    { label: "Berperkara", color: "#ef4444", icon: "⚠" },
    { label: "Indikasi Berperkara", color: "#3b82f6", icon: "⚡" },
    { label: "Tidak Aktif", color: "#f59e0b", icon: "○" },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border shadow-xl w-44 overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-surface-secondary px-3 py-2.5 flex items-center gap-2">
        <span className="text-sm">🗺️</span>
        <h3 className="font-semibold text-xs text-text-primary">
          Legenda Status
        </h3>
      </div>

      {/* Legend Items */}
      <div className="p-3 space-y-2">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-2.5 group">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
              style={{ backgroundColor: status.color }}
            >
              {status.icon}
            </div>
            <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
              {status.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
