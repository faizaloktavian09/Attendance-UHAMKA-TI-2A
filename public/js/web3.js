/**
 * Web3 Integration untuk AttendChain
 */

let provider;
let signer;
let contract;
let currentUser = null;
let currentRole = null;
let isDemo = false;

async function initMetaMaskListeners() {
  if (!window.ethereum) {
    console.warn("MetaMask not detected");
    return;
  }

  window.ethereum.on("accountsChanged", async (accounts) => {
    if (accounts.length === 0) {
      console.log("Wallet disconnected");
      currentUser = null;
      updateChainBar();
    } else {
      console.log("Account switched to:", accounts[0]);
      if (currentUser) {
        currentUser = accounts[0];
        updateChainBar();
      }
    }
  });

  window.ethereum.on("chainChanged", (chainId) => {
    console.log("Chain switched to:", chainId);
    window.location.reload();
  });
}

async function doConnectMhs() {
  const selectedIdx = document.getElementById("sel-mhs").value;
  if (!selectedIdx) {
    showToast("Pilih mahasiswa terlebih dahulu");
    return;
  }

  try {
    if (!window.ethereum) {
      showToast("MetaMask tidak terdeteksi");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    currentUser = accounts[0];
    currentRole = "mahasiswa";
    isDemo = false;

    await initWeb3();
    showMainLayout();
    updateChainBar();
    await loadMahasiswaData();
  } catch (err) {
    console.error(err);
    showToast("Gagal connect MetaMask: " + err.message);
  }
}

async function doConnectDosen() {
  const selectedDosen = document.getElementById("sel-dosen").value;
  if (!selectedDosen) {
    showToast("Pilih dosen terlebih dahulu");
    return;
  }

  try {
    if (!window.ethereum) {
      showToast("MetaMask tidak terdeteksi");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    currentUser = accounts[0];
    currentRole = "dosen";
    isDemo = false;

    await initWeb3();
    showMainLayout();
    updateChainBar();
    await loadDosenPanel();
  } catch (err) {
    console.error(err);
    showToast("Gagal connect MetaMask: " + err.message);
  }
}

function loginDemo(role) {
  currentRole = role;
  isDemo = true;
  currentUser = "0x0000000000000000000000000000000000000000";
  showMainLayout();
  updateChainBar();

  if (role === "mahasiswa") {
    loadMahasiswaData();
  } else {
    loadDosenPanel();
  }
}

async function initWeb3() {
  if (isDemo) {
    console.log("Demo mode - tanpa Web3");
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONFIG.CONTRACT.address, CONFIG.CONTRACT.abi, signer);

    console.log("✅ Web3 initialized");
  } catch (err) {
    console.error("Web3 init error:", err);
    showToast("Error: " + err.message);
  }
}

function updateContractAddress(addr) {
  CONFIG.CONTRACT.address = addr;
  document.getElementById("login-contract-preview").textContent = formatAddress(addr);
  document.getElementById("contract-addr-display").textContent = addr;
  document.getElementById("sc-addr-display").textContent = formatAddress(addr);
}

async function beriToken(mahasiswaAddr, kodeMatkul, nomorPertemuan) {
  if (isDemo) {
    showToast("Demo mode - tidak bisa transaction");
    return;
  }

  try {
    const tx = await contract.beriToken(mahasiswaAddr, kodeMatkul, nomorPertemuan);
    showToast("Mengirim transaksi...");
    await tx.wait();
    showToast("✅ Token berhasil dikirim!");
    return true;
  } catch (err) {
    console.error(err);
    showToast("❌ Error: " + (err.reason || err.message));
    return false;
  }
}

async function beriTokenBatch(addrList, kodeMatkul, nomorPertemuan) {
  if (isDemo) {
    showToast("Demo mode - tidak bisa transaction");
    return;
  }

  try {
    const tx = await contract.beriTokenBatch(addrList, kodeMatkul, nomorPertemuan);
    showToast(`Mengirim token ke ${addrList.length} mahasiswa...`);
    await tx.wait();
    showToast(`✅ ${addrList.length} token berhasil dikirim!`);
    return true;
  } catch (err) {
    console.error(err);
    showToast("❌ Error: " + (err.reason || err.message));
    return false;
  }
}

async function getTokenBalance(addr, kodeMatkul) {
  if (isDemo) return Math.floor(Math.random() * 16);

  try {
    const balance = await contract.getToken(addr, kodeMatkul);
    return Number(balance);
  } catch (err) {
    console.error(err);
    return 0;
  }
}

async function checkEligibility(addr, kodeMatkul) {
  if (isDemo) {
    return { layak: true, tokenDapat: 12, tokenMinimum: 12 };
  }

  try {
    const result = await contract.cekLayakUAS(addr, kodeMatkul);
    return {
      layak: result.layak,
      tokenDapat: Number(result.tokenDapat),
      tokenMinimum: Number(result.tokenMinimum),
    };
  } catch (err) {
    console.error(err);
    return { layak: false, tokenDapat: 0, tokenMinimum: 0 };
  }
}

async function checkAllEligibility(addr) {
  if (isDemo) {
    const matkul = Object.keys(CONFIG.MATKUL);
    return {
      kodeMatkul: matkul,
      layakList: matkul.map(() => Math.random() > 0.3),
      tokenList: matkul.map(() => Math.floor(Math.random() * 16)),
      minimumList: matkul.map(() => 12),
    };
  }

  try {
    const result = await contract.cekSemuaLayakUAS(addr);
    return {
      kodeMatkul: result.kodeMatkul,
      layakList: result.layakList,
      tokenList: result.tokenList.map((t) => Number(t)),
      minimumList: result.minimumList.map((m) => Number(m)),
    };
  } catch (err) {
    console.error(err);
    return { kodeMatkul: [], layakList: [], tokenList: [], minimumList: [] };
  }
}

async function getMatkulDetail(kodeMatkul) {
  if (isDemo) {
    return {
      nama: CONFIG.MATKUL[kodeMatkul] || kodeMatkul,
      totalPertemuan: 16,
      syaratPersen: 75,
      aktif: true,
    };
  }

  try {
    const result = await contract.getMatkul(kodeMatkul);
    return {
      nama: result.nama,
      totalPertemuan: Number(result.totalPertemuan),
      syaratPersen: Number(result.syaratPersen),
      aktif: result.aktif,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getAllMatkul() {
  if (isDemo) {
    return Object.entries(CONFIG.MATKUL).map(([kode, nama]) => ({
      kodeTeks: kode,
      nama: nama,
      totalPertemuan: 16,
      syaratPersen: 75,
      aktif: true,
    }));
  }

  try {
    const result = await contract.getSemuaMatkul();
    return result.map((m) => ({
      kodeTeks: m.kodeTeks,
      nama: m.nama,
      totalPertemuan: Number(m.totalPertemuan),
      syaratPersen: Number(m.syaratPersen),
      aktif: m.aktif,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function updateChainBar() {
  const dot = document.getElementById("chain-dot");
  const label = document.getElementById("chain-label");
  const walletAddr = document.getElementById("wallet-addr");
  const walletNet = document.getElementById("wallet-net");

  if (isDemo) {
    dot.classList.add("warning");
    label.textContent = "🔷 Mode Demo (Read-Only)";
    walletAddr.textContent = "Demo Mode";
    walletNet.textContent = "Tidak terhubung";
  } else if (currentUser) {
    try {
      const network = await provider.getNetwork();
      if (network.chainId === 80002) {
        dot.classList.remove("warning");
        dot.classList.add("connected");
        label.textContent = "🟢 Connected · Polygon Amoy";
        walletAddr.textContent = formatAddress(currentUser);
        walletNet.textContent = "Chain ID: 80002";
      } else {
        dot.classList.add("warning");
        label.textContent = `⚠️ Wrong Network (${network.chainId})`;
        walletAddr.textContent = formatAddress(currentUser);
        walletNet.textContent = `Chain ID: ${network.chainId}`;
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    dot.classList.remove("connected");
    label.textContent = "Belum terhubung ke MetaMask";
    walletAddr.textContent = "–";
    walletNet.textContent = "–";
  }
}

async function refreshChainData() {
  showToast("Refresh data...");
  if (currentRole === "mahasiswa") {
    await loadMahasiswaData();
  } else {
    await loadDosenPanel();
  }
  showToast("✅ Data di-refresh");
}
