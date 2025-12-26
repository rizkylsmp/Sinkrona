export default function ActionButtons({
  onEdit,
  onView,
  onDelete,
  assetId,
  showEdit = true,
  showDelete = true,
}) {
  return (
    <div className="flex gap-1 justify-center">
      <button
        onClick={() => onView(assetId)}
        className="p-2 text-text-tertiary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
        title="Lihat detail"
      >
        👁️
      </button>
      {showEdit && onEdit && (
        <button
          onClick={() => onEdit(assetId)}
          className="p-2 text-text-tertiary hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all"
          title="Edit"
        >
          ✏️
        </button>
      )}
      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(assetId)}
          className="p-2 text-text-tertiary hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          title="Hapus"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
