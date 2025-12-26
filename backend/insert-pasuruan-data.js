import sequelize from "./src/config/database.js";
import Aset from "./src/models/Aset.js";
import User from "./src/models/User.js";

async function insertPasuruanData() {
  try {
    // Get admin user
    const adminUser = await User.findOne({ where: { username: "admin" } });
    
    if (!adminUser) {
      console.error("❌ Admin user tidak ditemukan. Jalankan seed.js terlebih dahulu.");
      process.exit(1);
    }

    const pasuruanAsets = [
      {
        kode_aset: "TH-PSR-2024-001",
        nama_aset: "Tanah Kantor Camat Pasuruan Kota",
        lokasi: "Jl. Sudirman No. 12, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6450,
        koordinat_long: 112.9050,
        luas: 3500.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 3500000000,
        tahun_perolehan: 2012,
        nomor_sertifikat: "0145/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk kantor camat Pasuruan Kota",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-002",
        nama_aset: "Tanah Pasar Tradisional Pasuruan",
        lokasi: "Jl. Pasar Baru No. 45, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6520,
        koordinat_long: 112.9120,
        luas: 5200.50,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 5200000000,
        tahun_perolehan: 2008,
        nomor_sertifikat: "0146/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk pasar tradisional dan pedagang kaki lima Pasuruan",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-003",
        nama_aset: "Tanah Taman Rekreasi Pasir Putih",
        lokasi: "Jl. Pantai Pasir Putih No. 88, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6280,
        koordinat_long: 112.8980,
        luas: 8500.75,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 8500000000,
        tahun_perolehan: 2015,
        nomor_sertifikat: "0147/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk taman rekreasi dan pantai publik Pasuruan",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-004",
        nama_aset: "Tanah Pusat Kesehatan Masyarakat Pasuruan",
        lokasi: "Jl. Dr. Sutomo No. 25, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6600,
        koordinat_long: 112.9200,
        luas: 4000.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 4000000000,
        tahun_perolehan: 2018,
        nomor_sertifikat: "0148/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk fasilitas kesehatan masyarakat Pasuruan",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-005",
        nama_aset: "Tanah Kawasan Pendidikan Pesantren",
        lokasi: "Jl. Raya Pesantren No. 99, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6750,
        koordinat_long: 112.8850,
        luas: 10000.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 10000000000,
        tahun_perolehan: 2010,
        nomor_sertifikat: "0149/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk kawasan pendidikan pesantren modern Pasuruan",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-006",
        nama_aset: "Tanah Pelabuhan Ikan Tanjung Wangi",
        lokasi: "Jl. Pantai Pelabuhan No. 150, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6100,
        koordinat_long: 112.9350,
        luas: 12000.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 12000000000,
        tahun_perolehan: 2011,
        nomor_sertifikat: "0150/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk pelabuhan ikan Tanjung Wangi Pasuruan",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-007",
        nama_aset: "Tanah Stasiun Kereta Api Pasuruan",
        lokasi: "Jl. Stasiun No. 5, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6380,
        koordinat_long: 112.9050,
        luas: 6500.50,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 6500000000,
        tahun_perolehan: 2009,
        nomor_sertifikat: "0151/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk operasional stasiun kereta api Pasuruan",
        created_by: adminUser.id_user,
      },
      {
        kode_aset: "TH-PSR-2024-008",
        nama_aset: "Tanah Terminal Bus Kota Pasuruan",
        lokasi: "Jl. Raya Timur No. 200, Pasuruan, Jawa Timur",
        koordinat_lat: -7.6650,
        koordinat_long: 112.9400,
        luas: 7500.00,
        status: "Aktif",
        jenis_aset: "Tanah",
        nilai_aset: 7500000000,
        tahun_perolehan: 2016,
        nomor_sertifikat: "0152/PSR/2024",
        status_sertifikat: "Terdaftar",
        keterangan: "Tanah untuk terminal bus antarkota Pasuruan",
        created_by: adminUser.id_user,
      },
    ];

    const insertedAsets = await Aset.bulkCreate(pasuruanAsets);
    console.log(`✅ Berhasil menambahkan ${insertedAsets.length} data tanah Pasuruan ke database\n`);
    
    insertedAsets.forEach((aset, index) => {
      console.log(`  ${index + 1}. ${aset.kode_aset}`);
      console.log(`     📍 ${aset.nama_aset}`);
      console.log(`     📏 Luas: ${aset.luas.toLocaleString('id-ID')} m²`);
      console.log(`     💰 Nilai: Rp ${(aset.nilai_aset / 1000000000).toFixed(1)} Miliar`);
      console.log();
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertPasuruanData();
