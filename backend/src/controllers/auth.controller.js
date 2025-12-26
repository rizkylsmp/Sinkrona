import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import AuditService from "../services/audit.service.js";

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username dan password wajib diisi",
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Username atau password salah",
      });
    }

    // Check if user is active
    if (!user.status_aktif) {
      return res.status(403).json({
        success: false,
        error: "Akun tidak aktif. Hubungi administrator.",
      });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Username atau password salah",
      });
    }

    const token = jwt.sign(
      { id_user: user.id_user, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "24h" }
    );

    // Log audit for login
    await AuditService.logLogin({
      user_id: user.id_user,
      keterangan: `User ${user.username} berhasil login`,
      req,
    });

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id_user: user.id_user,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_user, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: {
        id_user: user.id_user,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        email: user.email,
        jabatan: user.jabatan,
        instansi: user.instansi,
        status_aktif: user.status_aktif,
      },
    });
  } catch (error) {
    console.error("Error get current user:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    // Log audit for logout
    await AuditService.logLogout({
      user_id: req.user.id_user,
      keterangan: `User ${req.user.username} logout`,
      req,
    });

    res.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Error logout:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, password, email, nama_lengkap, role } = req.body;

    // Validate required fields
    if (!username || !password || !email || !nama_lengkap) {
      return res.status(400).json({
        success: false,
        error: "Semua field wajib diisi",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username sudah digunakan",
      });
    }

    const user = await User.create({
      username,
      password,
      email,
      nama_lengkap,
      role: role || "Masyarakat",
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error register:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
