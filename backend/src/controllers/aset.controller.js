import { Op } from "sequelize";
import { Aset, User } from "../models/index.js";
import AuditService from "../services/audit.service.js";

/**
 * Get all assets with pagination
 * GET /api/aset
 */
export const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      jenis_aset,
      tahun,
      sort = "created_at",
      order = "DESC",
    } = req.query;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { nama_aset: { [Op.iLike]: `%${search}%` } },
        { kode_aset: { [Op.iLike]: `%${search}%` } },
        { lokasi: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (jenis_aset) where.jenis_aset = jenis_aset;
    if (tahun) where.tahun_perolehan = tahun;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get assets with pagination
    const { count, rows: assets } = await Aset.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sort, order.toUpperCase()]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id_user", "nama_lengkap", "username"],
        },
      ],
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: assets,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get asset statistics
 * GET /api/aset/stats
 */
export const getStats = async (req, res) => {
  try {
    const totalAset = await Aset.count();

    const statusCounts = await Aset.findAll({
      attributes: [
        "status",
        [Aset.sequelize.fn("COUNT", Aset.sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    const jenisCounts = await Aset.findAll({
      attributes: [
        "jenis_aset",
        [Aset.sequelize.fn("COUNT", Aset.sequelize.col("jenis_aset")), "count"],
      ],
      group: ["jenis_aset"],
    });

    const totalLuas = (await Aset.sum("luas")) || 0;
    const totalNilai = (await Aset.sum("nilai_aset")) || 0;

    res.json({
      success: true,
      data: {
        totalAset,
        totalLuas: parseFloat(totalLuas),
        totalNilai: parseFloat(totalNilai),
        byStatus: statusCounts.reduce((acc, item) => {
          acc[item.status] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        byJenis: jenisCounts.reduce((acc, item) => {
          if (item.jenis_aset) {
            acc[item.jenis_aset] = parseInt(item.dataValues.count);
          }
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get assets for map display
 * GET /api/aset/map
 */
export const getForMap = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {
      koordinat_lat: { [Op.ne]: null },
      koordinat_long: { [Op.ne]: null },
    };

    if (status) where.status = status;

    const assets = await Aset.findAll({
      where,
      attributes: [
        "id_aset",
        "kode_aset",
        "nama_aset",
        "lokasi",
        "koordinat_lat",
        "koordinat_long",
        "status",
        "luas",
        "jenis_aset",
      ],
    });

    res.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error("Error fetching map assets:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get asset by ID
 * GET /api/aset/:id
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await Aset.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id_user", "nama_lengkap", "username"],
        },
      ],
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "Aset tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: asset,
    });
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Create new asset
 * POST /api/aset
 */
export const create = async (req, res) => {
  try {
    const {
      kode_aset,
      nama_aset,
      lokasi,
      koordinat_lat,
      koordinat_long,
      luas,
      status,
      jenis_aset,
      nilai_aset,
      tahun_perolehan,
      nomor_sertifikat,
      status_sertifikat,
      foto_aset,
      dokumen_pendukung,
      keterangan,
    } = req.body;

    // Validasi required fields
    if (!kode_aset || !nama_aset || !lokasi) {
      return res.status(400).json({
        success: false,
        error: "Kode aset, nama aset, dan lokasi wajib diisi",
      });
    }

    // Check if kode_aset already exists
    const existingAset = await Aset.findOne({ where: { kode_aset } });
    if (existingAset) {
      return res.status(400).json({
        success: false,
        error: "Kode aset sudah digunakan",
      });
    }

    const newAset = await Aset.create({
      kode_aset,
      nama_aset,
      lokasi,
      koordinat_lat: koordinat_lat || null,
      koordinat_long: koordinat_long || null,
      luas: luas || null,
      status: status || "Aktif",
      jenis_aset: jenis_aset || null,
      nilai_aset: nilai_aset || null,
      tahun_perolehan: tahun_perolehan || null,
      nomor_sertifikat: nomor_sertifikat || null,
      status_sertifikat: status_sertifikat || null,
      foto_aset: foto_aset || null,
      dokumen_pendukung: dokumen_pendukung || null,
      keterangan: keterangan || null,
      created_by: req.user.id_user,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Log audit
    await AuditService.logCreate({
      tabel: "aset",
      id_referensi: newAset.id_aset,
      data_baru: newAset.toJSON(),
      keterangan: `Menambahkan aset baru: ${newAset.nama_aset}`,
      user_id: req.user.id_user,
      req,
    });

    res.status(201).json({
      success: true,
      message: "Aset berhasil ditambahkan",
      data: newAset,
    });
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update asset
 * PUT /api/aset/:id
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const asset = await Aset.findByPk(id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "Aset tidak ditemukan",
      });
    }

    // If kode_aset is being changed, check if new one already exists
    if (updateData.kode_aset && updateData.kode_aset !== asset.kode_aset) {
      const existingAset = await Aset.findOne({
        where: { kode_aset: updateData.kode_aset },
      });
      if (existingAset) {
        return res.status(400).json({
          success: false,
          error: "Kode aset sudah digunakan",
        });
      }
    }

    // Update timestamp
    updateData.updated_at = new Date();

    // Store old data for audit
    const oldData = asset.toJSON();

    await asset.update(updateData);

    // Fetch updated asset with creator info
    const updatedAsset = await Aset.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id_user", "nama_lengkap", "username"],
        },
      ],
    });

    // Log audit
    await AuditService.logUpdate({
      tabel: "aset",
      id_referensi: parseInt(id),
      data_lama: oldData,
      data_baru: updatedAsset.toJSON(),
      keterangan: `Memperbarui aset: ${updatedAsset.nama_aset}`,
      user_id: req.user.id_user,
      req,
    });

    res.json({
      success: true,
      message: "Aset berhasil diperbarui",
      data: updatedAsset,
    });
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete asset
 * DELETE /api/aset/:id
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await Aset.findByPk(id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: "Aset tidak ditemukan",
      });
    }

    // Store data for audit before delete
    const deletedData = asset.toJSON();

    await asset.destroy();

    // Log audit
    await AuditService.logDelete({
      tabel: "aset",
      id_referensi: parseInt(id),
      data_lama: deletedData,
      keterangan: `Menghapus aset: ${deletedData.nama_aset}`,
      user_id: req.user.id_user,
      req,
    });

    res.json({
      success: true,
      message: "Aset berhasil dihapus",
      data: { id_aset: parseInt(id) },
    });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
