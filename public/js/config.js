/**
 * Frontend Configuration untuk AttendChain
 */

const CONFIG = {
  NETWORK: {
    name: "Polygon Amoy",
    chainId: 80002,
    rpc: "https://rpc-amoy.polygon.technology/",
    explorer: "https://amoy.polygonscan.com",
  },

  CONTRACT: {
    address: "0x0000000000000000000000000000000000000000",
    abi: [
      "event TokenDiberikan(address indexed mahasiswa, bytes32 indexed kodeMatkul, uint16 pertemuan, address indexed dosen, uint256 timestamp)",
      "event MatkulDitambah(bytes32 indexed kodeMatkul, string nama, uint16 totalPertemuan)",
      "function tambahDosen(address _addr, string _nama) external",
      "function daftarMahasiswa(address _addr, string _nama) external",
      "function tambahMatkul(string _kode, string _nama, uint16 _totalPertemuan, uint16 _syaratPersen) external",
      "function updateTrustedForwarder(address _forwarder) external",
      "function beriToken(address _mahasiswa, string _kode, uint16 _pertemuan) external",
      "function beriTokenBatch(address[] _addrs, string _kode, uint16 _pertemuan) external",
      "function getToken(address _addr, string _kode) external view returns (uint16)",
      "function cekLayakUAS(address _addr, string _kode) external view returns (bool layak, uint16 tokenDapat, uint16 tokenMinimum)",
      "function cekSemuaLayakUAS(address _addr) external view returns (bytes32[] kodeMatkul, bool[] layakList, uint16[] tokenList, uint16[] minimumList)",
      "function getMatkul(string _kode) external view returns (string nama, uint16 totalPertemuan, uint16 syaratPersen, bool aktif)",
      "function getSemuaMatkul() external view returns (tuple(bytes32 kode, string kodeTeks, string nama, uint16 totalPertemuan, uint16 syaratPersen, bool aktif)[])",
      "function cekSudahHadir(address _addr, string _kode, uint16 _pertemuan) external view returns (bool)",
      "function jumlahMatkul() external view returns (uint256)",
      "function owner() external view returns (address)",
      "function dosenTerdaftar(address) external view returns (bool)",
      "function namaDosen(address) external view returns (string)",
      "function mahasiswaTerdaftar(address) external view returns (bool)",
      "function namaMahasiswa(address) external view returns (string)",
      "function tokenKehadiran(address, bytes32) external view returns (uint16)",
      "function sudahHadir(address, bytes32, uint16) external view returns (bool)",
    ],
  },

  MATKUL: {
    "TIF201": "Aljabar Linear",
    "TIF202": "Jaringan Komputer",
    "TIF203": "Pemrograman Berorientasi Objek",
    "TIF204": "Basis Data",
    "TIF205": "Komunikasi Data",
    "TIF206": "Matematika Diskrit",
    "TIF207": "Sistem Operasi",
    "TIF208": "Algoritma & Pemrograman",
    "MK201": "Etika Profesi",
  },

  UI: {
    demoBanner: true,
    autoRefresh: 30000,
  },
};

function formatAddress(addr) {
  if (!addr) return "–";
  return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
}

function bytes32ToKode(bytes32Hex) {
  try {
    return ethers.toUtf8String(bytes32Hex).replace(/\0/g, "");
  } catch {
    return bytes32Hex;
  }
}

function kodeToBytes32(kode) {
  return ethers.id(kode);
}

function formatPercent(num, total) {
  if (total === 0) return "0%";
  return Math.round((num / total) * 100) + "%";
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("id-ID") + " " + date.toLocaleTimeString("id-ID");
}

console.log("✅ Config loaded. Network:", CONFIG.NETWORK.name);
