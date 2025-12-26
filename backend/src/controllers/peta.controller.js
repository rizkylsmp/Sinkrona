import { Op } from "sequelize";
import { Aset } from "../models/index.js";
import { hasPermission, PERMISSIONS } from "../middleware/auth.middleware.js";

/**
 * Get available map layers for user
 * GET /api/peta/layers
 */
export const getLayers = async (req, res) => {
  try {
    const { role } = req.user;

    // Build available layers based on role permissions
    const layers = [];

    // Layer Umum - semua role
    if (hasPermission(role, PERMISSIONS.LAYER_UMUM)) {
      layers.push({
        id: "umum",
        name: "Layer Umum",
        description: "Peta dasar dengan lokasi aset",
        enabled: true,
      });
    }

    // Layer Tata Ruang
    if (hasPermission(role, PERMISSIONS.LAYER_TATA_RUANG)) {
      layers.push({
        id: "tata_ruang",
        name: "Rencana Tata Ruang",
        description: "Layer rencana tata ruang wilayah",
        enabled: true,
      });
    }

    // Layer Potensi Berperkara
    if (hasPermission(role, PERMISSIONS.LAYER_POTENSI_BERPERKARA)) {
      layers.push({
        id: "potensi_berperkara",
        name: "Potensi Aset Berperkara",
        description: "Layer aset dengan potensi sengketa/perkara",
        enabled: true,
      });
    }

    // Layer Sebaran Perkara
    if (hasPermission(role, PERMISSIONS.LAYER_SEBARAN_PERKARA)) {
      layers.push({
        id: "sebaran_perkara",
        name: "Sebaran Perkara",
        description: "Layer sebaran kasus perkara tanah",
        enabled: true,
      });
    }

    res.json({
      success: true,
      data: {
        role,
        layers,
        totalLayers: layers.length,
      },
    });
  } catch (error) {
    console.error("Error fetching layers:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get all map markers
 * GET /api/peta/markers
 */
export const getMarkers = async (req, res) => {
  try {
    const { status, jenis_aset } = req.query;

    const where = {
      koordinat_lat: { [Op.ne]: null },
      koordinat_long: { [Op.ne]: null },
    };

    if (status) where.status = status;
    if (jenis_aset) where.jenis_aset = jenis_aset;

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
        "tahun_perolehan",
      ],
    });

    // Transform to marker format
    const markers = assets.map((asset) => ({
      id: asset.id_aset,
      kode: asset.kode_aset,
      nama: asset.nama_aset,
      lokasi: asset.lokasi,
      lat: parseFloat(asset.koordinat_lat),
      lng: parseFloat(asset.koordinat_long),
      status: asset.status,
      luas: asset.luas ? parseFloat(asset.luas) : null,
      jenis: asset.jenis_aset,
      tahun: asset.tahun_perolehan,
    }));

    res.json({
      success: true,
      data: markers,
      total: markers.length,
    });
  } catch (error) {
    console.error("Error fetching markers:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get map statistics
 * GET /api/peta/stats
 */
export const getStats = async (req, res) => {
  try {
    // Count assets with coordinates
    const totalWithCoords = await Aset.count({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
      },
    });

    const totalWithoutCoords = await Aset.count({
      where: {
        [Op.or]: [{ koordinat_lat: null }, { koordinat_long: null }],
      },
    });

    // Count by status (only with coordinates)
    const byStatus = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
      },
      attributes: ["status", [Aset.sequelize.fn("COUNT", "*"), "count"]],
      group: ["status"],
    });

    // Total luas by status
    const luasByStatus = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
      },
      attributes: [
        "status",
        [Aset.sequelize.fn("SUM", Aset.sequelize.col("luas")), "total_luas"],
      ],
      group: ["status"],
    });

    res.json({
      success: true,
      data: {
        totalMapped: totalWithCoords,
        totalUnmapped: totalWithoutCoords,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        luasByStatus: luasByStatus.reduce((acc, item) => {
          acc[item.status] = parseFloat(item.dataValues.total_luas) || 0;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Error fetching map stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get Layer Umum data
 * GET /api/peta/layer/umum
 */
export const getLayerUmum = async (req, res) => {
  try {
    const assets = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
      },
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

    const features = assets.map((asset) => ({
      type: "Feature",
      properties: {
        id: asset.id_aset,
        kode: asset.kode_aset,
        nama: asset.nama_aset,
        lokasi: asset.lokasi,
        status: asset.status,
        luas: asset.luas,
        jenis: asset.jenis_aset,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(asset.koordinat_long),
          parseFloat(asset.koordinat_lat),
        ],
      },
    }));

    res.json({
      success: true,
      data: {
        type: "FeatureCollection",
        features,
      },
      total: features.length,
    });
  } catch (error) {
    console.error("Error fetching layer umum:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get Layer Tata Ruang data
 * GET /api/peta/layer/tata-ruang
 */
export const getLayerTataRuang = async (req, res) => {
  try {
    const assets = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
      },
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
        "tahun_perolehan",
        "nomor_sertifikat",
      ],
    });

    const features = assets.map((asset) => ({
      type: "Feature",
      properties: {
        id: asset.id_aset,
        kode: asset.kode_aset,
        nama: asset.nama_aset,
        lokasi: asset.lokasi,
        status: asset.status,
        luas: asset.luas,
        jenis: asset.jenis_aset,
        tahun: asset.tahun_perolehan,
        sertifikat: asset.nomor_sertifikat,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(asset.koordinat_long),
          parseFloat(asset.koordinat_lat),
        ],
      },
    }));

    res.json({
      success: true,
      data: {
        type: "FeatureCollection",
        features,
      },
      total: features.length,
    });
  } catch (error) {
    console.error("Error fetching layer tata ruang:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get Layer Potensi Berperkara data
 * GET /api/peta/layer/potensi-berperkara
 */
export const getLayerPotensiBerperkara = async (req, res) => {
  try {
    const assets = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
        status: { [Op.in]: ["Berperkara", "Indikasi Berperkara"] },
      },
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
        "keterangan",
      ],
    });

    const features = assets.map((asset) => ({
      type: "Feature",
      properties: {
        id: asset.id_aset,
        kode: asset.kode_aset,
        nama: asset.nama_aset,
        lokasi: asset.lokasi,
        status: asset.status,
        luas: asset.luas,
        jenis: asset.jenis_aset,
        keterangan: asset.keterangan,
        risk_level: asset.status === "Berperkara" ? "high" : "medium",
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(asset.koordinat_long),
          parseFloat(asset.koordinat_lat),
        ],
      },
    }));

    res.json({
      success: true,
      data: {
        type: "FeatureCollection",
        features,
      },
      total: features.length,
      summary: {
        berperkara: assets.filter((a) => a.status === "Berperkara").length,
        indikasiBerperkara: assets.filter(
          (a) => a.status === "Indikasi Berperkara"
        ).length,
      },
    });
  } catch (error) {
    console.error("Error fetching layer potensi berperkara:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get Layer Sebaran Perkara data
 * GET /api/peta/layer/sebaran-perkara
 */
export const getLayerSebaranPerkara = async (req, res) => {
  try {
    const assets = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
        status: "Berperkara",
      },
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
        "keterangan",
        "tahun_perolehan",
      ],
    });

    const features = assets.map((asset) => ({
      type: "Feature",
      properties: {
        id: asset.id_aset,
        kode: asset.kode_aset,
        nama: asset.nama_aset,
        lokasi: asset.lokasi,
        status: asset.status,
        luas: asset.luas,
        jenis: asset.jenis_aset,
        keterangan: asset.keterangan,
        tahun: asset.tahun_perolehan,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(asset.koordinat_long),
          parseFloat(asset.koordinat_lat),
        ],
      },
    }));

    res.json({
      success: true,
      data: {
        type: "FeatureCollection",
        features,
      },
      total: features.length,
    });
  } catch (error) {
    console.error("Error fetching layer sebaran perkara:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Search assets on map
 * GET /api/peta/search
 */
export const search = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Query minimal 2 karakter",
      });
    }

    const assets = await Aset.findAll({
      where: {
        koordinat_lat: { [Op.ne]: null },
        koordinat_long: { [Op.ne]: null },
        [Op.or]: [
          { nama_aset: { [Op.iLike]: `%${q}%` } },
          { kode_aset: { [Op.iLike]: `%${q}%` } },
          { lokasi: { [Op.iLike]: `%${q}%` } },
        ],
      },
      attributes: [
        "id_aset",
        "kode_aset",
        "nama_aset",
        "lokasi",
        "koordinat_lat",
        "koordinat_long",
        "status",
      ],
      limit: parseInt(limit),
    });

    const results = assets.map((asset) => ({
      id: asset.id_aset,
      kode: asset.kode_aset,
      nama: asset.nama_aset,
      lokasi: asset.lokasi,
      lat: parseFloat(asset.koordinat_lat),
      lng: parseFloat(asset.koordinat_long),
      status: asset.status,
    }));

    res.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Error searching on map:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get asset detail for map popup
 * GET /api/peta/detail/:id
 */
export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await Aset.findByPk(id, {
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
        "tahun_perolehan",
        "nomor_sertifikat",
        "status_sertifikat",
        "nilai_aset",
        "keterangan",
        "foto_aset",
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
    console.error("Error fetching asset detail:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
