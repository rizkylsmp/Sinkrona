import sequelize from "./src/config/database.js";
import Aset from "./src/models/Aset.js";
import User from "./src/models/User.js";

async function insertSampleData() {
  try {
    // Get admin user
    const adminUser = await User.findOne({ where: { username: "admin" } });
    
    if (!adminUser) {
      console.error("❌ Admin user tidak ditemukan. Jalankan seed.js terlebih dahulu.");
      process.exit(1);
    }

    const sampleAsets = [
      {
        kode_aset: "TH-2024-001",
        nama_aset: "Tanah Kantor Pertanahan Kota",
        lokasi: "Jl. Sudirman No. 45, Kota",
        koordinat_lat: -6.2088,
        koordinat_long: 106.8456,
        luas: 5000.50,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 5000000000,
        tahun_perolehan: 2010,
        nomor_sertifikat: "0128/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk kantor pusat pertanahan kota",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-2024-002",
        nama_aset: "Tanah Parkir Publik Sentral",
        lokasi: "Jl. Ahmad Yani No. 12, Kota",
        koordinat_lat: -6.2150,
        koordinat_long: 106.8520,
        luas: 3500.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 3500000000,
        tahun_perolehan: 2015,
        nomor_sertifikat: "0129/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk fasilitas parkir publik",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-2024-003",
        nama_aset: "Tanah Taman Kota",
        lokasi: "Jl. Gatot Subroto No. 88, Kota",
        koordinat_lat: -6.2200,
        koordinat_long: 106.8380,
        luas: 8750.75,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 8750000000,
        tahun_perolehan: 2012,
        nomor_sertifikat: "0130/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk taman publik dan ruang terbuka hijau",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-2024-004",
        nama_aset: "Tanah Pembangunan Pusat Kesehatan",
        lokasi: "Jl. Letjen Soeprapto No. 5, Kota",
        koordinat_lat: -6.2300,
        koordinat_long: 106.8600,
        luas: 4200.50,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 4200000000,
        tahun_perolehan: 2018,
        nomor_sertifikat: "0131/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk pembangunan pusat kesehatan masyarakat",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-2024-005",
        nama_aset: "Tanah Kawasan Pendidikan",
        lokasi: "Jl. Pendidikan No. 99, Kota",
        koordinat_lat: -6.2400,
        koordinat_long: 106.8300,
        luas: 12000.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 12000000000,
        tahun_perolehan: 2008,
        nomor_sertifikat: "0132/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk kawasan pendidikan dan sekolah-sekolah",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-2024-006",
        nama_aset: "Tanah Terminal Transportasi",
        lokasi: "Jl. Raya Timur No. 150, Kota",
        koordinat_lat: -6.2500,
        koordinat_long: 106.8700,
        luas: 15000.50,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 15000000000,
        tahun_perolehan: 2011,
        nomor_sertifikat: "0133/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk terminal dan pusat transportasi umum",
        created_by: adminUser.id_user,
      },
    ];

    const insertedAsets = await Aset.bulkCreate(sampleAsets);
    console.log(`✅ Berhasil menambahkan ${insertedAsets.length} data tanah ke database`);
    
    insertedAsets.forEach((aset, index) => {
      console.log(`  ${index + 1}. ${aset.kode_aset} - ${aset.nama_aset} (${aset.luas} m²)`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertSampleData();
