import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import AssetSearch from "../components/asset/AssetSearch";
import AssetTable from "../components/asset/AssetTable";
import Pagination from "../components/asset/Pagination";
import AssetFormModal from "../components/asset/AssetFormModal";
import { asetService } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { hasPermission } from "../utils/permissions";
import { useConfirm } from "../components/ui/ConfirmDialog";

export default function AssetPage() {
  // Auth & Permissions
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "bpn";
  const canCreate = hasPermission(userRole, "aset", "create");
  const canUpdate = hasPermission(userRole, "aset", "update");
  const canDelete = hasPermission(userRole, "aset", "delete");
  const confirm = useConfirm();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "" });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
      };

      const response = await asetService.getAll(params);
      const { data, pagination } = response.data;

      setAssets(data || []);
      setTotalPages(pagination?.totalPages || 1);
      setTotalItems(pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Gagal memuat data aset");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filters]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleOpenAddForm = () => {
    setEditingAsset(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = async (assetId) => {
    try {
      const response = await asetService.getById(assetId);
      setEditingAsset(response.data.data);
      setIsFormModalOpen(true);
    } catch (error) {
      console.error("Error fetching asset:", error);
      toast.error("Gagal memuat data aset");
    }
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingAsset(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingAsset?.id_aset) {
        // Update existing asset
        await asetService.update(editingAsset.id_aset, formData);
        toast.success("Aset berhasil diperbarui");
      } else {
        // Create new asset
        await asetService.create(formData);
        toast.success("Aset berhasil ditambahkan");
      }
      handleCloseForm();
      fetchAssets(); // Refresh data
    } catch (error) {
      console.error("Error saving asset:", error);
      const errorMsg = error.response?.data?.error || "Gagal menyimpan aset";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    const confirmed = await confirm({
      title: "Hapus Aset",
      message:
        "Apakah Anda yakin ingin menghapus aset ini? Data yang dihapus tidak dapat dikembalikan.",
      confirmText: "Hapus",
      cancelText: "Batal",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      await asetService.delete(assetId);
      toast.success("Aset berhasil dihapus");
      fetchAssets(); // Refresh data
    } catch (error) {
      console.error("Error deleting asset:", error);
      const errorMsg = error.response?.data?.error || "Gagal menghapus aset";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">
            Manajemen Data Aset
          </h1>
          <p className="text-text-tertiary text-sm mt-1">
            Kelola dan monitor semua aset tanah ({totalItems} total)
          </p>
        </div>
        {canCreate && (
          <button
            onClick={handleOpenAddForm}
            className="flex items-center justify-center gap-2 bg-accent text-white dark:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-all shadow-lg hover:shadow-xl text-sm font-medium w-full sm:w-auto"
          >
            <span>➕</span>
            Tambah Aset
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <AssetSearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Asset Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <AssetTable
          assets={assets}
          loading={loading}
          onEditClick={canUpdate ? handleOpenEditForm : null}
          onDeleteClick={canDelete ? handleDeleteAsset : null}
          currentPage={currentPage}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Asset Form Modal */}
      <AssetFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        assetData={editingAsset}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
