# Deployment Guide - AttendChain ke Polygon Amoy

## Prerequisites

- Node.js v16+ & npm
- MetaMask installed di browser
- POL testnet di wallet (ambil dari faucet)
- GitHub account (optional)

---

## Step 1: Setup Project

```bash
git clone https://github.com/faizaloktavian09/Attendance-UHAMKA-TI-2A.git
cd Attendance-UHAMKA-TI-2A
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# WAJIB ISI:
PRIVATE_KEY=0x... # Private key wallet dosen (tanpa 0x di awal juga ok)

# OPTIONAL:
POLYGONSCAN_API_KEY=... # Untuk verify contract di explorer
```

### ⚠️ WARNING: Private Key Safety

- **JANGAN** share private key ke siapa pun
- **JANGAN** commit `.env` ke git
- Gunakan wallet dengan sedikit POL (untuk test saja)
- Di production, gunakan hardware wallet atau key management service

## Step 3: Get POL dari Faucet

1. Buka https://faucet.polygon.technology/
2. Masukkan wallet address dosen
3. Tunggu 1-2 menit, POL akan masuk ke wallet

Verifikasi:
```bash
metamask > Wallet > Lihat POL balance
```

## Step 4: Deploy Smart Contract

```bash
npm run deploy:contract
```

**Output:**

```
✅ AttendChain deployed to: 0xABC123...
📝 Add this to .env:
CONTRACT_ADDRESS=0xABC123...
✅ Contract address saved to .env
```

Copy contract address → Sudah tersimpan di `.env`

## Step 5: Setup Initial Data

```bash
npm run setup:testnet
```

Ini akan register:

- 7 dosen
- 27 mahasiswa Kelas 2A
- 9 mata kuliah

**Output:**

```
👨‍🏫 Registering Dosen...
  ✅ Dr. Dan Mugisidi, S.T., M.Si.
  ✅ Dr. Ahmad Fauzi
  ... (dan 5 dosen lainnya)

📚 Registering Mata Kuliah...
  ✅ TIF201 - Aljabar Linear
  ... (dan 8 matkul lainnya)

👨‍🎓 Registering Mahasiswa Kelas 2A...
  ✅ Batch 1: 5 mahasiswa
  ... (total 27)

✅ Setup selesai!
```

## Step 6: Update Frontend Config

Edit `public/js/config.js`:

```javascript
CONTRACT: {
    address: "0xABC123...", // ⚠️ UPDATE DENGAN CONTRACT ADDRESS ANDA
    ...
}
```

## Step 7: Run Frontend

```bash
cd public
npx http-server . -p 8080
```

**Akses:**

http://localhost:8080

---

## Testing on Testnet

### Test Login Mahasiswa

1. Buka http://localhost:8080
2. Tab "Mahasiswa" → Pilih nama
3. Klik "Hubungkan MetaMask"
4. Approve di MetaMask
5. ✅ Lihat dashboard dengan token

### Test Login Dosen

1. Tab "Dosen" → Pilih dosen
2. Klik "Hubungkan MetaMask sebagai Dosen"
3. Input contract address di "Panel Dosen"
4. Pilih mata kuliah (e.g., TIF202)
5. Pilih pertemuan (e.g., 11)
6. Checkbox beberapa mahasiswa
7. Klik "Kirim Token ke Semua yang Hadir"
8. Sign di MetaMask → ✅ Transaction berhasil

### Verify di Blockchain

1. Buka https://amoy.polygonscan.com
2. Cari contract address
3. Tab "Transactions" → Lihat semua tx
4. Klik tx untuk detail
5. Lihat event log

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Failed to connect to node" | Check RPC URL di `.env` |
| "Insufficient gas" | Get more POL dari faucet |
| "Contract not found" | Pastikan contract address benar |
| "Account not registered" | Jalankan `npm run setup:testnet` |
| "MetaMask network wrong" | Add Polygon Amoy ke MetaMask |

---

## Production Checklist

- [ ] Contract verified di PolygonScan
- [ ] Frontend di domain sendiri (HTTPS)
- [ ] Private key tidak tercantum di repo
- [ ] Contract address tidak hardcoded di frontend
- [ ] Error handling untuk network issues
- [ ] Gas limit testing untuk batch size besar
- [ ] Monitoring & logging untuk production
- [ ] Backup data (event log di blockchain)

---

## Support & Links

- **Contract Address**: https://amoy.polygonscan.com/address/CONTRACT_ADDRESS
- **RPC Endpoint**: https://rpc-amoy.polygon.technology/
- **Faucet**: https://faucet.polygon.technology/
- **Polygon Docs**: https://polygon.technology/developers/polygon-amoy

---

Last Updated: 2026-06-05
