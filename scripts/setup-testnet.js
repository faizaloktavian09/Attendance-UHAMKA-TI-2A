#!/usr/bin/env node
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("📚 Setting up initial data on Polygon Amoy...\n");

  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("❌ CONTRACT_ADDRESS tidak ditemukan di .env");
    process.exit(1);
  }

  const contract = await hre.ethers.getContractAt("AttendChain", contractAddress);
  const [owner] = await hre.ethers.getSigners();

  console.log("📍 Owner:", owner.address);
  console.log("📍 Contract:", contractAddress);

  // Tambah dosen
  console.log("\n👨‍🏫 Registering Dosen...");
  
  const dosen = [
    { addr: "0x1111111111111111111111111111111111111111", nama: "Dr. Dan Mugisidi, S.T., M.Si." },
    { addr: "0x2222222222222222222222222222222222222222", nama: "Dr. Ahmad Fauzi" },
    { addr: "0x3333333333333333333333333333333333333333", nama: "Dr. Siti Rahayu" },
    { addr: "0x4444444444444444444444444444444444444444", nama: "Prof. Budi Hartono" },
    { addr: "0x5555555555555555555555555555555555555555", nama: "Dr. Laila Susanti" },
    { addr: "0x6666666666666666666666666666666666666666", nama: "Dr. Dian Puspita" },
    { addr: "0x7777777777777777777777777777777777777777", nama: "Dr. Rahmat Hidayat" },
  ];

  for (const d of dosen) {
    try {
      const tx = await contract.tambahDosen(d.addr, d.nama);
      await tx.wait();
      console.log(`  ✅ ${d.nama}`);
    } catch (e) {
      console.log(`  ⚠️  ${d.nama}`);
    }
  }

  // Tambah mata kuliah
  console.log("\n📚 Registering Mata Kuliah...");

  const matkul = [
    { kode: "TIF201", nama: "Aljabar Linear", total: 16, syarat: 75 },
    { kode: "TIF202", nama: "Jaringan Komputer", total: 16, syarat: 75 },
    { kode: "TIF203", nama: "Pemrograman Berorientasi Objek", total: 16, syarat: 75 },
    { kode: "TIF204", nama: "Basis Data", total: 16, syarat: 75 },
    { kode: "TIF205", nama: "Komunikasi Data", total: 16, syarat: 75 },
    { kode: "TIF206", nama: "Matematika Diskrit", total: 16, syarat: 75 },
    { kode: "TIF207", nama: "Sistem Operasi", total: 16, syarat: 75 },
    { kode: "TIF208", nama: "Algoritma & Pemrograman", total: 16, syarat: 75 },
    { kode: "MK201", nama: "Etika Profesi", total: 16, syarat: 75 },
  ];

  for (const m of matkul) {
    try {
      const tx = await contract.tambahMatkul(m.kode, m.nama, m.total, m.syarat);
      await tx.wait();
      console.log(`  ✅ ${m.kode}`);
    } catch (e) {
      console.log(`  ⚠️  ${m.kode}`);
    }
  }

  console.log("\n✅ Setup selesai!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
