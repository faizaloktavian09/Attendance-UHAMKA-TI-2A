# AttendChain — Sistem Absensi Blockchain UHAMKA

Sistem absensi berbasis smart contract Bitcoin/Ethereum untuk Kelas 2A Teknik Informatika UHAMKA.

## 🎯 Fitur Utama

- ✅ **Gas-Free Transactions** — Mahasiswa tidak perlu bayar gas fee
- ✅ **Polygon Amoy Testnet** — Aman, gratis, dan mudah testing
- ✅ **Token Kehadiran** — ERC-20 token otomatis dikirim ke wallet
- ✅ **Per-Matkul Eligibility** — Kelayakan UAS dihitung per mata kuliah (75% minimum)
- ✅ **Batch Processing** — Dosen bisa kirim token ke banyak mahasiswa sekaligus
- ✅ **On-Chain Verification** — Kartu ujian terverifikasi smart contract

## 📦 Struktur Project

```
Attendance-UHAMKA-TI-2A/
├── contracts/                    # Smart Contract Solidity
│   └── AttendChain.sol          # Main contract dengan EIP-2771 support
├── functions/                    # Backend Serverless (API)
│   ├── api.js                    # Express API untuk gasless tx
│   └── relayer.js                # OpenZeppelin Defender Relay integration
├── scripts/                       # Deployment & Setup
│   ├── deploy.js                 # Deploy contract ke Amoy
│   └── setup-testnet.js          # Setup initial data
├── test/                          # Unit tests
│   └── attendchain.test.js       # Contract tests
├── public/                        # Frontend static files
│   ├── index.html                # UI utama
│   ├── css/
│   │   └── style.css             # Styling
│   └── js/
│       ├── config.js             # Konfigurasi global
│       ├── data.js               # Data structures
│       ├── web3.js               # Web3 integration
│       └── ui.js                 # UI logic
├── .env.example                   # Environment variables template
└── README.md                      # Dokumentasi
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
npm install
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_dosen_private_key_here
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGONSCAN_API_KEY=your_key_here
GELATO_RELAY_API_KEY=your_key_here
```

### 2. Deploy Smart Contract

```bash
npm run deploy:contract
```

Output akan memberikan contract address → **simpan di `.env` sebagai `CONTRACT_ADDRESS`**

### 3. Setup Initial Data

```bash
npm run setup:testnet
```

Ini akan:
- Register dosen
- Register mahasiswa (27 orang Kelas 2A)
- Tambah 9 mata kuliah

### 4. Run Frontend

```bash
# Buka public/index.html di browser
# atau gunakan local server
npx http-server public -p 8080
```

### 5. Test Gas-Free Transaction

1. Buka http://localhost:8080
2. Login sebagai **Dosen** (MetaMask)
3. Pilih mata kuliah
4. Klik "Kirim Token ke Semua yang Hadir"
5. ✅ Transaksi akan diproses tanpa gas fee (via Gelato Relay)

---

## 🔐 Gas-Free How It Works?

### Opsi 1: Gelato Web3 Function (Recommended)
- Dosen trigger dari UI
- Backend call Gelato Relay API
- Gelato bot execute transaksi + bayar gas
- Mahasiswa dapat token tanpa perlu POL

### Opsi 2: Meta-Transaction (EIP-2771)
- Dosen sign transaction (tidak execute)
- Relayer execute dengan trusted forwarder
- Gas-free untuk pengguna

---

## 📱 Frontend Usage

### Login Mahasiswa
1. Pilih nama dari dropdown
2. Klik "Hubungkan MetaMask"
3. Lihat dashboard → kehadiran, token, kelayakan UAS

### Login Dosen
1. Pilih nama dosen
2. Klik "Hubungkan MetaMask sebagai Dosen"
3. Input contract address di Panel Dosen
4. Pilih mata kuliah & pertemuan
5. Klik checkbox mahasiswa yang hadir
6. Klik "Kirim Token ke Semua yang Hadir"

---

## 🧪 Testing on Testnet

### Get POL (untuk gas deploy)
1. Buka https://faucet.polygon.technology/
2. Masukkan wallet address dosen
3. Tunggu 1-2 menit, POL akan masuk

### Monitor Transaction
- https://amoy.polygonscan.com
- Cari contract address
- Lihat event log & transaction history

---

## 📊 Smart Contract Functions

### Dosen Call
```solidity
beriToken(mahasiswaAddr, "TIF202", 11)  // Beri 1 token pertemuan 11
beriTokenBatch(addrList, "TIF202", 11)  // Batch lebih hemat gas
```

### Mahasiswa Call (Read-Only)
```solidity
getToken(addr, "TIF202")                 // Cek token diadapat
cekLayakUAS(addr, "TIF202")              // Cek layak UAS per matkul
cekSemuaLayakUAS(addr)                   // Cek semua matkul
```

---

## ⚙️ Environment Variables

```env
# Network
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
CHAIN_ID=80002

# Wallet (PRIVATE KEY JANGAN DI-SHARE!)
PRIVATE_KEY=0x...

# Contract
CONTRACT_ADDRESS=0x...

# Gasless Relay (Gelato)
GELATO_RELAY_API_KEY=...
GELATO_RELAY_URL=https://relay.gelato.digital/...

# Verification
POLYGONSCAN_API_KEY=...
```

---

## 🐛 Troubleshooting

### "Bukan dosen terdaftar"
→ Wallet Anda belum didaftar. Jalankan setup:
```bash
npm run setup:testnet
```

### "Mahasiswa belum terdaftar"
→ Tambahkan di `scripts/setup-testnet.js` atau call `daftarMahasiswa()` di contract

### "Contract tidak ditemukan"
→ Cek contract address di `.env` dan verifikasi di https://amoy.polygonscan.com

### Gas fee tidak 0?
→ Pastikan menggunakan Gelato Relay. Lihat `functions/relayer.js`

---

## 📚 Referensi

- **Polygon Amoy Docs**: https://polygon.technology/developers/polygon-amoy
- **EIP-2771**: https://eips.ethereum.org/EIPS/eip-2771
- **Gelato Web3 Functions**: https://docs.gelato.network/
- **ethers.js**: https://docs.ethers.org/v6/
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts/

---

## 👨‍🎓 Pembuat

**Ahmad Faizal Oktavian** — 2503015048  
Teknik Informatika UHAMKA  

---

## 📄 License

MIT License — Bebas digunakan untuk keperluan pendidikan
