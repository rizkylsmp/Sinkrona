import sequelize from "../config/database.js";
import User from "./User.js";
import Aset from "./Aset.js";
import Riwayat from "./Riwayat.js";
import Notifikasi from "./Notifikasi.js";

// Define associations here to avoid circular dependencies
// User has many Aset (created_by)
User.hasMany(Aset, {
  foreignKey: "created_by",
  as: "assets",
});

// Aset belongs to User (creator)
Aset.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

// User has many Riwayat
User.hasMany(Riwayat, {
  foreignKey: "user_id",
  as: "activities",
});

// Riwayat belongs to User
Riwayat.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User has many Notifikasi
User.hasMany(Notifikasi, {
  foreignKey: "user_id",
  as: "notifications",
});

// Notifikasi belongs to User
Notifikasi.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export { sequelize, User, Aset, Riwayat, Notifikasi };
