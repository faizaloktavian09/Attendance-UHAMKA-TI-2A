/**
 * UI Interaction Logic
 */

function switchTab(tab) {
  const formMhs = document.getElementById("form-mhs");
  const formDosen = document.getElementById("form-dosen");
  const tabMhs = document.getElementById("tab-mhs");
  const tabDosen = document.getElementById("tab-dosen");

  if (tab === "mhs") {
    formMhs.style.display = "block";
    formDosen.style.display = "none";
    tabMhs.classList.add("active");
    tabDosen.classList.remove("active");
  } else {
    formMhs.style.display = "none";
    formDosen.style.display = "block";
    tabMhs.classList.remove("active");
    tabDosen.classList.add("active");
  }
}

function navigate(page) {
  const pages = ["dashboard", "kehadiran", "kartu", "dosen", "monitoring", "riwayat"];

  pages.forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.remove("active");
  });

  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) targetPage.classList.add("active");

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  const navItem = document.getElementById(`nav-${page}`);
  if (navItem) navItem.classList.add("active");

  const titles = {
    dashboard: "Dashboard",
    kehadiran: "Rekap Kehadiran",
    kartu: "Kartu Ujian",
    dosen: "Panel Dosen",
    monitoring: "Monitoring Kelas",
    riwayat: "Riwayat Transaksi",
  };
  document.getElementById("topbar-title").textContent = titles[page] || "–";

  closeSidebar();
}

function showMainLayout() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("main-layout").style.display = "flex";
}

function doLogout() {
  currentUser = null;
  currentRole = null;
  isDemo = false;
  provider = null;
  signer = null;
  contract = null;

  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("main-layout").style.display = "none";

  showToast("Berhasil logout");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
}

function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  const toastIcon = document.getElementById("toast-icon");

  toastMsg.textContent = msg;

  if (type === "success") {
    toastIcon.className = "ti ti-check";
  } else if (type === "error") {
    toastIcon.className = "ti ti-x";
  } else {
    toastIcon.className = "ti ti-info-circle";
  }

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function printCard() {
  window.print();
}

document.addEventListener("DOMContentLoaded", () => {
  const matkulSelect = document.getElementById("matkul-select");
  if (matkulSelect) {
    matkulSelect.addEventListener("change", loadDosenMatkulPanel);
  }

  const pertemuanInput = document.getElementById("input-pertemuan");
  if (pertemuanInput) {
    pertemuanInput.addEventListener("change", async () => {
      const pertemuan = pertemuanInput.value;
      const badge = document.getElementById("badge-pertemuan");
      if (badge) badge.textContent = `Pertemuan ${pertemuan}`;
    });
  }
});
