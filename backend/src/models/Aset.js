import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Aset = sequelize.define(
  "Aset",
  {
    id_aset: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kode_aset: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    nama_aset: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    koordinat_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    koordinat_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    luas: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Aktif",
        "Berperkara",
        "Indikasi Berperkara",
        "Tidak Aktif"
      ),
      defaultValue: "Aktif",
    },
    jenis_aset: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    nilai_aset: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    tahun_perolehan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nomor_sertifikat: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status_sertifikat: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    foto_aset: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dokumen_pendukung: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id_user",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "aset",
    timestamps: false,
  }
);

export default Aset;
