/**
 * Data Structures & Helpers untuk Frontend
 */

const DOSEN_LIST = {
  mugisidi: "Dr. Dan Mugisidi, S.T., M.Si. — Pembimbing",
  fauzi: "Dr. Ahmad Fauzi — Aljabar Linear",
  rahayu: "Dr. Siti Rahayu — Jaringan Komputer",
  hartono: "Prof. Budi Hartono — PBO",
  susanti: "Dr. Laila Susanti — Basis Data",
  puspita: "Dr. Dian Puspita — Komunikasi Data",
  hidayat: "Dr. Rahmat Hidayat — Matematika Diskrit",
};

const MAHASISWA_LIST = [
  { nim: "2503015002", nama: "Muhammad Balldan Muslim" },
  { nim: "2503015006", nama: "Vidky Oktavian Ramadan" },
  { nim: "2503015011", nama: "Fikri Fadhil Muhamad" },
  { nim: "2503015014", nama: "Rizkyana Yusran" },
  { nim: "2503015017", nama: "Muchamad Zein" },
  { nim: "2503015021", nama: "Regissya Anfieldasari Fahma Abidin" },
  { nim: "2503015025", nama: "Ahmad Fauzi Trismawan" },
  { nim: "2503015029", nama: "Hadiyan Ali Rizal" },
  { nim: "2503015032", nama: "Jelita Eka Putri Rahmadhani" },
  { nim: "2503015035", nama: "Hafids Arkan Wahid" },
  { nim: "2503015039", nama: "Abdul Robi Zakaria" },
  { nim: "2503015042", nama: "Arya Prasetya Alamsyah" },
  { nim: "2503015045", nama: "Muhammad Arif" },
  { nim: "2503015048", nama: "Ahmad Faizal Oktavian" },
  { nim: "2503015052", nama: "Agung Prakoso" },
  { nim: "2503015057", nama: "Muhammad Asyadien Daffa" },
  { nim: "2503015060", nama: "I Dewa Putu Adhitya" },
  { nim: "2503015063", nama: "Muhammad Rafi Maliki" },
  { nim: "2503015066", nama: "Nayla Nur Rahmah" },
  { nim: "2503015070", nama: "Nabil Ahmad Khahlil Gibran" },
  { nim: "2503015073", nama: "Fariz Rizki Aunurrachman" },
  { nim: "2503015077", nama: "Muhammad Ridho Alfaatih" },
  { nim: "2503015081", nama: "Muhammad Zaidan Zelda" },
  { nim: "2503015084", nama: "Varell Jovierlando" },
  { nim: "2503015087", nama: "Raflino Octa Ramadhana" },
  { nim: "2503015091", nama: "Giffari Zakaria Izzani" },
  { nim: "2503015094", nama: "Rivaldo Putra Laksana" },
];

function getNamaMahasiswa(index) {
  return MAHASISWA_LIST[index]
    ? `${MAHASISWA_LIST[index].nim} · ${MAHASISWA_LIST[index].nama}`
    : "–";
}

function getInitials(nama) {
  const parts = nama.split(" ");
  return parts.map((p) => p[0]).join("").substring(0, 2).toUpperCase();
}

function getAvatarColor(seed) {
  const colors = ["av-red", "av-blue", "av-green", "av-purple", "av-orange"];
  return colors[seed % colors.length];
}

async function loadMahasiswaData() {
  const selectedIdx = document.getElementById("sel-mhs").value;
  const mhs = MAHASISWA_LIST[selectedIdx];

  if (!mhs) return;

  document.getElementById("role-avatar").textContent = getInitials(mhs.nama);
  document.getElementById("role-name").textContent = mhs.nama;
  document.getElementById("role-nim").textContent = mhs.nim;
  document.getElementById("dash-greeting").textContent = `Selamat datang, ${mhs.nama} 👋`;

  document.getElementById("nav-dosen-section").style.display = "none";

  if (isDemo) {
    document.getElementById("demo-banner").style.display = "flex";
  }

  await loadDashboard(mhs.nim);
}

async function loadDashboard(nim) {
  let totalToken = 0;
  const matkul = await getAllMatkul();
  for (const m of matkul) {
    const balance = await getTokenBalance(currentUser, m.kodeTeks);
    totalToken += balance;
  }
  document.getElementById("m-token").textContent = totalToken;

  const eligibility = await checkAllEligibility(currentUser);
  const layakCount = eligibility.layakList.filter((b) => b).length;
  document.getElementById("m-layak").textContent = `${layakCount}/${matkul.length}`;

  let html = "";
  for (let i = 0; i < matkul.length; i++) {
    const m = matkul[i];
    const token = eligibility.tokenList[i];
    const minimum = eligibility.minimumList[i];
    const layak = eligibility.layakList[i];
    const persen = minimum > 0 ? Math.round((token / minimum) * 100) : 0;

    const badgeClass = layak ? "badge-green" : "badge-red";
    const status = layak ? "✅ Layak" : "❌ Belum";

    html += `
      <div class="subject-row">
        <div class="subject-name">${m.kodeTeks} - ${m.nama}</div>
        <div class="subject-stat">${token}/${minimum} token · ${persen}%</div>
        <span class="badge ${badgeClass}">${status}</span>
      </div>
    `;
  }
  document.getElementById("dash-subject-list").innerHTML = html;

  html = "";
  for (let i = 0; i < matkul.length; i++) {
    const m = matkul[i];
    const token = eligibility.tokenList[i];
    const minimum = eligibility.minimumList[i];
    const layak = eligibility.layakList[i];
    const persen = minimum > 0 ? Math.round((token / minimum) * 100) : 0;
    const status = layak ? "✅ LAYAK" : "❌ TIDAK LAYAK";
    const badgeClass = layak ? "badge-green" : "badge-red";

    html += `
      <div class="card">
        <div class="card-head">
          <div class="card-title">${m.kodeTeks} - ${m.nama}</div>
          <span class="badge ${badgeClass}">${status}</span>
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;margin-bottom:10px">
            <span>Token: <strong>${token}</strong></span>
            <span>Minimum: <strong>${minimum}</strong></span>
          </div>
          <div class="prog-bar">
            <div class="prog-fill" style="width:${persen}%;background:${layak ? "var(--green)" : "var(--red)"}"></div>
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:6px">${persen}%</div>
        </div>
      </div>
    `;
  }
  document.getElementById("full-subject-list").innerHTML = html;

  const allLayak = eligibility.layakList.every((b) => b);
  document.getElementById("exam-card-main").className = `exam-card-wrap ${allLayak ? "eligible" : "not-eligible"}`;
  document.getElementById("kartu-name").textContent = document.getElementById("role-name").textContent;
  document.getElementById("kartu-nim").textContent = nim;
  document.getElementById("kartu-icon").textContent = allLayak ? "✅" : "❌";
  document.getElementById("kartu-status").textContent = allLayak ? "LAYAK UAS" : "TIDAK LAYAK";
  document.getElementById("kartu-pct").textContent = `${layakCount}/${matkul.length} matkul`;

  html = "";
  for (let i = 0; i < matkul.length; i++) {
    const m = matkul[i];
    const layak = eligibility.layakList[i];
    const status = layak ? "✅ LAYAK" : "❌ TIDAK";
    html += `
      <div style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid var(--bg3)">
        <span>${m.kodeTeks} - ${m.nama}</span>
        <strong style="color:${layak ? "var(--green)" : "var(--red)"}">${status}</strong>
      </div>
    `;
  }
  document.getElementById("exam-subject-list").innerHTML = html;
}

async function loadDosenPanel() {
  const selectedDosen = document.getElementById("sel-dosen").value;
  const dosenNama = DOSEN_LIST[selectedDosen] || "Dosen";

  document.getElementById("nav-mhs-section").style.display = "none";
  document.getElementById("nav-dosen-section").style.display = "block";

  document.getElementById("role-avatar").textContent = getInitials(dosenNama);
  document.getElementById("role-name").textContent = dosenNama;
  document.getElementById("role-nim").textContent = "Dosen";

  document.getElementById("dosen-panel").style.display = "none";
}

async function loadDosenMatkulPanel() {
  const matkulCode = document.getElementById("matkul-select").value;
  if (!matkulCode) {
    document.getElementById("dosen-panel").style.display = "none";
    return;
  }

  const matkulDetail = await getMatkulDetail(matkulCode);
  if (!matkulDetail) return;

  document.getElementById("dosen-panel").style.display = "block";
  document.getElementById("dosen-matkul-name").textContent = `${matkulCode} · ${matkulDetail.nama}`;
  document.getElementById("dosen-matkul-detail").textContent = `${matkulDetail.totalPertemuan} pertemuan`;

  const pertemuan = document.getElementById("input-pertemuan").value;
  document.getElementById("badge-pertemuan").textContent = `Pertemuan ${pertemuan}`;

  let html = "";
  for (let i = 0; i < MAHASISWA_LIST.length; i++) {
    const mhs = MAHASISWA_LIST[i];
    html += `
      <div class="mhs-item">
        <input type="checkbox" id="chk-mhs-${i}" class="mhs-checkbox">
        <label for="chk-mhs-${i}" style="flex:1">${mhs.nim} · ${mhs.nama}</label>
      </div>
    `;
  }
  document.getElementById("mhs-list").innerHTML = html;
}

async function giveAllTokens() {
  const matkulCode = document.getElementById("matkul-select").value;
  const pertemuan = parseInt(document.getElementById("input-pertemuan").value);

  if (!matkulCode) {
    showToast("Pilih mata kuliah");
    return;
  }

  const checkedAddrs = [];
  for (let i = 0; i < MAHASISWA_LIST.length; i++) {
    const chk = document.getElementById(`chk-mhs-${i}`);
    if (chk && chk.checked) {
      checkedAddrs.push(`0x${(i + 1).toString().padStart(40, "0")}`);
    }
  }

  if (checkedAddrs.length === 0) {
    showToast("Pilih minimal 1 mahasiswa");
    return;
  }

  const success = await beriTokenBatch(checkedAddrs, matkulCode, pertemuan);

  if (success) {
    for (let i = 0; i < MAHASISWA_LIST.length; i++) {
      const chk = document.getElementById(`chk-mhs-${i}`);
      if (chk) chk.checked = false;
    }
  }
}
