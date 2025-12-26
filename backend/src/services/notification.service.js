import { Notifikasi, User } from "../models/index.js";

/**
 * Service untuk mengelola notifikasi
 */
class NotificationService {
  /**
   * Kirim notifikasi ke user tertentu
   */
  static async sendToUser({
    user_id,
    judul,
    pesan,
    tipe = "info",
    kategori = "sistem",
    referensi_id = null,
    referensi_tabel = null,
  }) {
    try {
      const notifikasi = await Notifikasi.create({
        user_id,
        judul,
        pesan,
        tipe,
        kategori,
        referensi_id,
        referensi_tabel,
        dibaca: false,
        created_at: new Date(),
      });
      return notifikasi;
    } catch (error) {
      console.error("Error sending notification:", error.message);
      return null;
    }
  }

  /**
   * Kirim notifikasi ke semua user dengan role tertentu
   */
  static async sendToRole({
    role,
    judul,
    pesan,
    tipe = "info",
    kategori = "sistem",
    referensi_id = null,
    referensi_tabel = null,
  }) {
    try {
      const users = await User.findAll({
        where: { role, status_aktif: true },
        attributes: ["id_user"],
      });

      const notifications = await Promise.all(
        users.map((user) =>
          this.sendToUser({
            user_id: user.id_user,
            judul,
            pesan,
            tipe,
            kategori,
            referensi_id,
            referensi_tabel,
          })
        )
      );

      return notifications.filter((n) => n !== null);
    } catch (error) {
      console.error("Error sending notifications to role:", error.message);
      return [];
    }
  }

  /**
   * Kirim notifikasi ke semua admin
   */
  static async sendToAdmins({
    judul,
    pesan,
    tipe = "info",
    kategori = "sistem",
    referensi_id = null,
    referensi_tabel = null,
  }) {
    return this.sendToRole({
      role: "admin",
      judul,
      pesan,
      tipe,
      kategori,
      referensi_id,
      referensi_tabel,
    });
  }

  /**
   * Notifikasi saat aset baru dibuat
   */
  static async notifyAsetCreated(aset, createdBy) {
    // Notify all admins and dinas_aset
    const roles = ["admin", "dinas_aset"];
    for (const role of roles) {
      await this.sendToRole({
        role,
        judul: "Aset Baru Ditambahkan",
        pesan: `Aset "${aset.nama_aset}" (${aset.kode_aset}) telah ditambahkan oleh ${createdBy}`,
        tipe: "success",
        kategori: "aset",
        referensi_id: aset.id_aset,
        referensi_tabel: "aset",
      });
    }
  }

  /**
   * Notifikasi saat status aset berubah
   */
  static async notifyAsetStatusChanged(aset, oldStatus, newStatus, changedBy) {
    const roles = ["admin", "dinas_aset", "bpn", "tata_ruang"];
    const tipe =
      newStatus === "Berperkara" || newStatus === "Indikasi Berperkara"
        ? "warning"
        : "info";

    for (const role of roles) {
      await this.sendToRole({
        role,
        judul: "Status Aset Berubah",
        pesan: `Status aset "${aset.nama_aset}" berubah dari "${oldStatus}" menjadi "${newStatus}" oleh ${changedBy}`,
        tipe,
        kategori: "aset",
        referensi_id: aset.id_aset,
        referensi_tabel: "aset",
      });
    }
  }

  /**
   * Notifikasi saat aset dihapus
   */
  static async notifyAsetDeleted(aset, deletedBy) {
    await this.sendToRole({
      role: "admin",
      judul: "Aset Dihapus",
      pesan: `Aset "${aset.nama_aset}" (${aset.kode_aset}) telah dihapus oleh ${deletedBy}`,
      tipe: "warning",
      kategori: "aset",
    });
  }

  /**
   * Notifikasi login baru
   */
  static async notifyLogin(user, ipAddress) {
    await this.sendToUser({
      user_id: user.id_user,
      judul: "Login Berhasil",
      pesan: `Anda login dari IP ${
        ipAddress || "unknown"
      } pada ${new Date().toLocaleString("id-ID")}`,
      tipe: "info",
      kategori: "sistem",
    });
  }
}

export default NotificationService;
