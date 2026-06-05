const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AttendChain Contract", function () {
  let contract;
  let owner, dosen, mahasiswa, other;

  beforeEach(async function () {
    [owner, dosen, mahasiswa, other] = await ethers.getSigners();

    const AttendChain = await ethers.getContractFactory("AttendChain");
    contract = await AttendChain.deploy(ethers.ZeroAddress);
    await contract.waitForDeployment();
  });

  describe("Setup", function () {
    it("Should register dosen", async function () {
      await contract.tambahDosen(dosen.address, "Dr. Test");
      expect(await contract.dosenTerdaftar(dosen.address)).to.be.true;
    });

    it("Should register mahasiswa", async function () {
      await contract.daftarMahasiswa(mahasiswa.address, "Mahasiswa Test");
      expect(await contract.mahasiswaTerdaftar(mahasiswa.address)).to.be.true;
    });

    it("Should add matkul", async function () {
      await contract.tambahMatkul("TIF202", "Jaringan Komputer", 16, 75);
      expect(await contract.jumlahMatkul()).to.equal(1);
    });
  });

  describe("Token Distribution", function () {
    beforeEach(async function () {
      await contract.tambahDosen(dosen.address, "Dr. Test");
      await contract.daftarMahasiswa(mahasiswa.address, "Mahasiswa Test");
      await contract.tambahMatkul("TIF202", "Jaringan Komputer", 16, 75);
    });

    it("Should give token", async function () {
      await contract
        .connect(dosen)
        .beriToken(mahasiswa.address, "TIF202", 1);
      const balance = await contract.getToken(mahasiswa.address, "TIF202");
      expect(balance).to.equal(1);
    });

    it("Should prevent double attendance", async function () {
      await contract
        .connect(dosen)
        .beriToken(mahasiswa.address, "TIF202", 1);
      await expect(
        contract.connect(dosen).beriToken(mahasiswa.address, "TIF202", 1)
      ).to.be.revertedWith("Sudah hadir di pertemuan ini");
    });

    it("Should batch give tokens", async function () {
      const addrs = [mahasiswa.address, other.address];
      await contract.daftarMahasiswa(other.address, "Other");
      await contract
        .connect(dosen)
        .beriTokenBatch(addrs, "TIF202", 1);

      expect(await contract.getToken(mahasiswa.address, "TIF202")).to.equal(1);
      expect(await contract.getToken(other.address, "TIF202")).to.equal(1);
    });
  });

  describe("Eligibility Check", function () {
    beforeEach(async function () {
      await contract.tambahDosen(dosen.address, "Dr. Test");
      await contract.daftarMahasiswa(mahasiswa.address, "Mahasiswa Test");
      await contract.tambahMatkul("TIF202", "Jaringan Komputer", 16, 75);
    });

    it("Should calculate eligibility correctly", async function () {
      // 75% of 16 = 12 tokens minimum
      for (let i = 1; i <= 12; i++) {
        await contract
          .connect(dosen)
          .beriToken(mahasiswa.address, "TIF202", i);
      }

      const result = await contract.cekLayakUAS(mahasiswa.address, "TIF202");
      expect(result.layak).to.be.true;
      expect(result.tokenDapat).to.equal(12);
      expect(result.tokenMinimum).to.equal(12);
    });

    it("Should detect when not eligible", async function () {
      for (let i = 1; i <= 11; i++) {
        await contract
          .connect(dosen)
          .beriToken(mahasiswa.address, "TIF202", i);
      }

      const result = await contract.cekLayakUAS(mahasiswa.address, "TIF202");
      expect(result.layak).to.be.false;
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to register dosen", async function () {
      await expect(
        contract.connect(other).tambahDosen(dosen.address, "Dr. Test")
      ).to.be.revertedWith("Hanya owner");
    });

    it("Should only allow registered dosen to give tokens", async function () {
      await contract.daftarMahasiswa(mahasiswa.address, "Mahasiswa");
      await contract.tambahMatkul("TIF202", "Test", 16, 75);

      await expect(
        contract
          .connect(other)
          .beriToken(mahasiswa.address, "TIF202", 1)
      ).to.be.revertedWith("Hanya dosen terdaftar");
    });
  });
});
