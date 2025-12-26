import { useState, useEffect } from "react";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormTextarea from "../form/FormTextarea";
import FormFileUpload from "../form/FormFileUpload";
import MapCoordinatePicker from "../form/MapCoordinatePicker";

const initialFormData = {
  kode_aset: "",
  nama_aset: "",
  lokasi: "",
  koordinat_lat: "",
  koordinat_long: "",
  luas: "",
  status: "",
  jenis_aset: "",
  tahun_perolehan: new Date().getFullYear().toString(),
  nomor_sertifikat: "",
  status_sertifikat: "",
  nilai_aset: "",
  foto_aset: null,
  dokumen_pendukung: null,
  keterangan: "",
};

export default function AssetFormModal({
  isOpen,
  onClose,
  onSubmit,
  assetData = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialFormData);

  // Update form when assetData changes (for edit mode)
  useEffect(() => {
    if (assetData) {
      setFormData({
        kode_aset: assetData.kode_aset || "",
        nama_aset: assetData.nama_aset || "",
        lokasi: assetData.lokasi || "",
        koordinat_lat: assetData.koordinat_lat || "",
        koordinat_long: assetData.koordinat_long || "",
        luas: assetData.luas || "",
        status: assetData.status || "",
        jenis_aset: assetData.jenis_aset || "",
        tahun_perolehan:
          assetData.tahun_perolehan || new Date().getFullYear().toString(),
        nomor_sertifikat: assetData.nomor_sertifikat || "",
        status_sertifikat: assetData.status_sertifikat || "",
        nilai_aset: assetData.nilai_aset || "",
        foto_aset: null,
        dokumen_pendukung: null,
        keterangan: assetData.keterangan || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [assetData, isOpen]);

  const statusOptions = [
    { value: "Aktif", label: "Aktif" },
    { value: "Berperkara", label: "Berperkara" },
    { value: "Indikasi Berperkara", label: "Indikasi Berperkara" },
    { value: "Tidak Aktif", label: "Tidak Aktif" },
  ];

  const jenisAsetOptions = [
    { value: "tanah", label: "Tanah" },
    { value: "bangunan", label: "Bangunan" },
    { value: "kendaraan", label: "Kendaraan" },
    { value: "peralatan", label: "Peralatan" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const statusSertifikatOptions = [
    { value: "shm", label: "SHM (Sertifikat Hak Milik)" },
    { value: "hgb", label: "HGB (Hak Guna Bangunan)" },
    { value: "hgu", label: "HGU (Hak Guna Usaha)" },
    { value: "sppt", label: "SPPT (Pajak)" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMultipleFiles = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data for API
    const submitData = {
      ...formData,
      luas: parseFloat(formData.luas) || 0,
      nilai_aset: parseFloat(formData.nilai_aset) || 0,
      tahun_perolehan:
        parseInt(formData.tahun_perolehan) || new Date().getFullYear(),
    };
    onSubmit(submitData);
  };

  const handleBatal = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-surface border border-border shadow-xl w-full max-w-2xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-secondary px-6 py-4 rounded-t-xl sticky top-0 z-10">
            <h2 className="text-lg font-bold text-text-primary">
              {assetData ? "FORM EDIT ASET" : "FORM TAMBAH ASET TANAH"}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl font-bold text-text-secondary hover:bg-surface-tertiary rounded px-2 py-1 transition"
            >
              ✕
            </button>
          </div>

          {/* Form Content - scrollable */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Row 1: Kode & Nama */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Kode Aset"
                  name="kode_aset"
                  placeholder="AST-XXX"
                  value={formData.kode_aset}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Nama Aset"
                  name="nama_aset"
                  placeholder="Nama Aset"
                  value={formData.nama_aset}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Row 2: Lokasi */}
              <FormTextarea
                label="Lokasi/Alamat"
                name="lokasi"
                placeholder="Alamat lengkap"
                value={formData.lokasi}
                onChange={handleInputChange}
                required
                rows={3}
              />

              {/* Row 3: Koordinat dengan Map Picker */}
              <MapCoordinatePicker
                latitude={formData.koordinat_lat}
                longitude={formData.koordinat_long}
                onCoordinateChange={(lat, lng) => {
                  setFormData((prev) => ({
                    ...prev,
                    koordinat_lat: lat,
                    koordinat_long: lng,
                  }));
                }}
                label="Koordinat Lokasi"
              />

              {/* Row 4: Luas & Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Luas (m²)"
                  name="luas"
                  type="number"
                  placeholder="0.00"
                  value={formData.luas}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
                <FormSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                  placeholder="Pilih Status"
                  required
                />
              </div>

              {/* Row 5: Jenis & Tahun */}
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Jenis Aset"
                  name="jenis_aset"
                  value={formData.jenis_aset}
                  onChange={handleInputChange}
                  options={jenisAsetOptions}
                  placeholder="Pilih Jenis"
                />
                <FormInput
                  label="Tahun Perolehan"
                  name="tahun_perolehan"
                  type="number"
                  placeholder="2025"
                  value={formData.tahun_perolehan}
                  onChange={handleInputChange}
                />
              </div>

              {/* Row 6: Sertifikat */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Nomor Sertifikat"
                  name="nomor_sertifikat"
                  placeholder="No. Sertifikat"
                  value={formData.nomor_sertifikat}
                  onChange={handleInputChange}
                />
                <FormSelect
                  label="Status Sertifikat"
                  name="status_sertifikat"
                  value={formData.status_sertifikat}
                  onChange={handleInputChange}
                  options={statusSertifikatOptions}
                  placeholder="SHM/HGB"
                />
              </div>

              {/* Row 7: Nilai Aset */}
              <FormInput
                label="Nilai Aset (Rp)"
                name="nilai_aset"
                type="number"
                placeholder="0.00"
                value={formData.nilai_aset}
                onChange={handleInputChange}
                step="0.01"
              />

              {/* Row 8: Foto */}
              <FormFileUpload
                label="Foto Aset"
                name="foto_aset"
                onChange={handleInputChange}
                accept="image/*"
              />

              {/* Row 9: Dokumen */}
              <FormFileUpload
                label="Dokumen Pendukung"
                name="dokumen_pendukung"
                onChange={(e) => handleMultipleFiles(e)}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png"
              />

              {/* Row 10: Keterangan */}
              <FormTextarea
                label="Keterangan"
                name="keterangan"
                placeholder="Keterangan tambahan"
                value={formData.keterangan}
                onChange={handleInputChange}
                rows={3}
              />

              {/* Buttons */}
              <div className="flex gap-4 justify-center pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={handleBatal}
                  disabled={isSubmitting}
                  className="border border-border text-text-primary px-8 py-2 text-sm font-bold hover:bg-surface-secondary rounded-lg transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent text-white px-8 py-2 text-sm font-bold hover:opacity-90 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
