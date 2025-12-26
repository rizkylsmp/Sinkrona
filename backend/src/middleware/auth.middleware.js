import jwt from "jsonwebtoken";

// ===========================================
// ROLE PERMISSIONS berdasarkan Use Case Diagram
// ===========================================
//
// Admin Kantor Pertanahan (admin):
//   - Backup & restore data
//   - Melihat data aset & data pemerintahan
//   - Mengelola data aset (CRUD)
//   - Melihat riwayat aktivitas
//   - Melihat notifikasi waktu login
//   - Melihat peta interaktif aset (semua layer)
//
// Dinas Aset Pemkot (dinas_aset):
//   - Melihat data aset & data pemerintahan
//   - Mengelola data aset (CRUD)
//   - Melihat riwayat aktivitas
//   - Melihat layer rencana tata ruang
//   - Melihat layer potensi aset berperkara
//
// Badan Pertanahan Nasional (bpn):
//   - Melihat layer rencana tata ruang
//   - Melihat layer potensi aset berperkara
//   - Melihat data aset (READ only)
//
// Dinas Tata Ruang (tata_ruang):
//   - Melihat layer potensi aset berperkara
//   - Melihat layer sebaran perkara
//   - Melihat data aset (READ only)
//
// Masyarakat (masyarakat):
//   - Login ke sistem
//   - Melihat peta interaktif (layer umum only)
//   - Melihat data aset publik (READ only, limited)
// ===========================================

// Permission constants
export const PERMISSIONS = {
  // Aset Management
  ASET_CREATE: "aset:create",
  ASET_READ: "aset:read",
  ASET_READ_ALL: "aset:read_all",
  ASET_UPDATE: "aset:update",
  ASET_DELETE: "aset:delete",

  // Peta/Map Layers
  PETA_VIEW: "peta:view",
  LAYER_UMUM: "layer:umum",
  LAYER_TATA_RUANG: "layer:tata_ruang",
  LAYER_POTENSI_BERPERKARA: "layer:potensi_berperkara",
  LAYER_SEBARAN_PERKARA: "layer:sebaran_perkara",

  // System Features
  RIWAYAT_VIEW: "riwayat:view",
  NOTIFIKASI_VIEW: "notifikasi:view",
  BACKUP_MANAGE: "backup:manage",
  USER_MANAGE: "user:manage",

  // Dashboard
  DASHBOARD_FULL: "dashboard:full",
  DASHBOARD_LIMITED: "dashboard:limited",
};

// Role-Permission mapping berdasarkan Use Case
// Note: Masyarakat/Public tidak perlu login - akses via /peta-publik
export const ROLE_PERMISSIONS = {
  admin: [
    // Full access to everything
    PERMISSIONS.ASET_CREATE,
    PERMISSIONS.ASET_READ,
    PERMISSIONS.ASET_READ_ALL,
    PERMISSIONS.ASET_UPDATE,
    PERMISSIONS.ASET_DELETE,
    PERMISSIONS.PETA_VIEW,
    PERMISSIONS.LAYER_UMUM,
    PERMISSIONS.LAYER_TATA_RUANG,
    PERMISSIONS.LAYER_POTENSI_BERPERKARA,
    PERMISSIONS.LAYER_SEBARAN_PERKARA,
    PERMISSIONS.RIWAYAT_VIEW,
    PERMISSIONS.NOTIFIKASI_VIEW,
    PERMISSIONS.BACKUP_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.DASHBOARD_FULL,
  ],

  dinas_aset: [
    // Mengelola data aset (CRUD)
    PERMISSIONS.ASET_CREATE,
    PERMISSIONS.ASET_READ,
    PERMISSIONS.ASET_READ_ALL,
    PERMISSIONS.ASET_UPDATE,
    PERMISSIONS.ASET_DELETE,
    // Melihat peta dengan beberapa layer
    PERMISSIONS.PETA_VIEW,
    PERMISSIONS.LAYER_UMUM,
    PERMISSIONS.LAYER_TATA_RUANG,
    PERMISSIONS.LAYER_POTENSI_BERPERKARA,
    // Melihat riwayat aktivitas
    PERMISSIONS.RIWAYAT_VIEW,
    PERMISSIONS.NOTIFIKASI_VIEW,
    PERMISSIONS.DASHBOARD_FULL,
  ],

  bpn: [
    // Read only untuk data aset
    PERMISSIONS.ASET_READ,
    PERMISSIONS.ASET_READ_ALL,
    // Melihat layer tertentu
    PERMISSIONS.PETA_VIEW,
    PERMISSIONS.LAYER_UMUM,
    PERMISSIONS.LAYER_TATA_RUANG,
    PERMISSIONS.LAYER_POTENSI_BERPERKARA,
    PERMISSIONS.NOTIFIKASI_VIEW,
    PERMISSIONS.DASHBOARD_LIMITED,
  ],

  tata_ruang: [
    // Read only untuk data aset
    PERMISSIONS.ASET_READ,
    PERMISSIONS.ASET_READ_ALL,
    // Melihat layer tertentu
    PERMISSIONS.PETA_VIEW,
    PERMISSIONS.LAYER_UMUM,
    PERMISSIONS.LAYER_POTENSI_BERPERKARA,
    PERMISSIONS.LAYER_SEBARAN_PERKARA,
    PERMISSIONS.NOTIFIKASI_VIEW,
    PERMISSIONS.DASHBOARD_LIMITED,
  ],
};

// ===========================================
// MIDDLEWARE FUNCTIONS
// ===========================================

/**
 * Authentication middleware - verify JWT token
 */
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Normalize role to lowercase for permission checking
    const normalizedRole = decoded.role?.toLowerCase();
    req.user.normalizedRole = normalizedRole;

    // Attach user permissions
    req.user.permissions = ROLE_PERMISSIONS[normalizedRole] || [];

    next();
  } catch (error) {
    res.status(401).json({ error: "Token tidak valid atau sudah expired" });
  }
};

/**
 * Role-based middleware - check if user has one of allowed roles
 */
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Use normalized role for comparison
    const userRole = req.user.normalizedRole || req.user.role?.toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Akses ditolak",
        message: `Role '${req.user.role}' tidak memiliki akses ke resource ini`,
        requiredRoles: allowedRoles,
      });
    }
    next();
  };
};

/**
 * Permission-based middleware - check if user has required permission
 */
export const permissionMiddleware = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userRole = req.user.normalizedRole || req.user.role?.toLowerCase();
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: "Akses ditolak",
        message: "Anda tidak memiliki izin untuk melakukan aksi ini",
        requiredPermissions,
      });
    }
    next();
  };
};

/**
 * Check if user has ANY of the required permissions
 */
export const anyPermissionMiddleware = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userRole = req.user.normalizedRole || req.user.role?.toLowerCase();
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    const hasAnyPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({
        error: "Akses ditolak",
        message: "Anda tidak memiliki izin untuk melakukan aksi ini",
      });
    }
    next();
  };
};

/**
 * Helper to check permission in code (not middleware)
 */
export const hasPermission = (role, permission) => {
  const normalizedRole = role?.toLowerCase();
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
  return permissions.includes(permission);
};

/**
 * Helper to get all permissions for a role
 */
export const getPermissions = (role) => {
  const normalizedRole = role?.toLowerCase();
  return ROLE_PERMISSIONS[normalizedRole] || [];
};

// ===========================================
// PRESET MIDDLEWARE COMBINATIONS
// ===========================================

// Hanya Admin
export const adminOnly = roleMiddleware("admin");

// Admin dan Dinas Aset (yang bisa CRUD aset)
export const canManageAset = roleMiddleware("admin", "dinas_aset");

// Semua role yang login bisa melihat aset
export const canViewAset = roleMiddleware(
  "admin",
  "dinas_aset",
  "bpn",
  "tata_ruang"
);

// Role yang bisa melihat data detail/lengkap
export const canViewFullData = roleMiddleware(
  "admin",
  "dinas_aset",
  "bpn",
  "tata_ruang"
);

// Role yang bisa melihat riwayat
export const canViewRiwayat = roleMiddleware("admin", "dinas_aset");

// Role yang bisa backup/restore
export const canBackup = roleMiddleware("admin");

// Role yang bisa manage users
export const canManageUsers = roleMiddleware("admin");
