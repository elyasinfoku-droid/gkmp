/**
 * File Index.html standalone untuk Google Apps Script
 * Dibuat di Apps Script dengan klik tanda [+] di panel File -> pilih HTML -> beri nama "Index"
 */
export const APPS_SCRIPT_INDEX_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIUTASDIKDAS - Sistem Validasi Soal UTS & UAS Pendidikan Dasar UST</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .font-mono-tabular {
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900">

  <!-- Toast Notification Container -->
  <div id="toast-container" class="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"></div>

  <!-- Loading Overlay -->
  <div id="loading-overlay" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center hidden">
    <div class="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-200">
      <div class="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      <span id="loading-text" class="text-xs font-semibold text-slate-700">Memproses ke Google Sheets & Drive...</span>
    </div>
  </div>

  <!-- App Main Mount Point -->
  <div id="app" class="flex-1 flex flex-col">
    <!-- Rendered dynamically by JavaScript -->
  </div>

  <!-- Institutional Footer -->
  <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div>&copy; 2026 Hak Cipta Magister Pendidikan Dasar • Universitas Sarjanawiyata Tamansiswa (UST)</div>
      <div class="text-[11px] text-slate-400">SIUTASDIKDAS Engine • Google Sheets & Google Drive Terintegrasi</div>
    </div>
  </footer>

  <script>
    // --- MASTER COURSES UST ---
    const DEFAULT_COURSES = [
      { code: "UST 25013", name: "Pendidikan Ketamansiswaan" },
      { code: "PSD 25101", name: "Filsafat Ilmu Pendidikan" },
      { code: "PSD 25102", name: "Pengembangan Kurikulum Pendidikan Dasar" },
      { code: "PSD 25103", name: "Psikologi Pendidikan dan Perkembangan" },
      { code: "PSD 25104", name: "Statistik Pendidikan" },
      { code: "PSD 25105", name: "Metodologi Penelitian Pendidikan" },
      { code: "PSD 25106", name: "Penulisan Artikel Ilmiah" },
      { code: "PSD 25107", name: "Manajemen dan Kebijakan Pendidikan Dasar" },
      { code: "PSD 25208", name: "Pengembangan Pembelajaran IPA SD" },
      { code: "PSD 25209", name: "Pengembangan Pembelajaran IPS SD" },
      { code: "PSD 25210", name: "Pengembangan Pembelajaran Matematika SD" },
      { code: "PSD 25211", name: "Pengembangan Pembelajaran Pendidikan Pancasila SD" },
      { code: "PSD 25212", name: "Pengembangan Pembelajaran Bahasa dan Sastra Indonesia SD" },
      { code: "PSD 25213", name: "Pengembangan Pembelajaran Seni Budaya dan Prakarya SD" },
      { code: "PSD 25214", name: "Asesmen Pendidikan" },
      { code: "PSD 25315", name: "Pengembangan Pembelajaran Berbasis Teknologi Digital di SD" },
      { code: "PSD 25316", name: "Pendidikan Anak Berkebutuhan Khusus" },
      { code: "PSD 25317", name: "Literasi Multidimensional" },
      { code: "PSD 25318", name: "Pengembangan Pembelajaran Berbasis Muatan Lokal di SD" },
      { code: "PSD 25319", name: "English for Children" },
      { code: "PSD 25320", name: "Seminar Proposal Tugas Akhir Magister" },
      { code: "PSD 25321", name: "Tugas Akhir Magister" }
    ];

    // State aplikasi
    let state = {
      currentUser: null,
      users: [
        { username: "GKMP", password: "135791", role: "admin", name: "Tim GKMP Pend. Dasar UST", nidn: "ADMIN01" },
        { username: "0512018801", password: "123456", role: "dosen", name: "Dr. Ki Hajar Madya, M.Pd.", nidn: "0512018801", isValidator: true },
        { username: "0525049002", password: "123456", role: "dosen", name: "Nyi Hj. Ratna Sari, M.Sc.", nidn: "0525049002", isValidator: true },
        { username: "0508128503", password: "123456", role: "dosen", name: "Dr. Slamet Riyadi, M.Pd.", nidn: "0508128503", isValidator: false }
      ],
      submissions: [
        {
          id: "SUB-101",
          dosenNidn: "0508128503",
          dosenName: "Dr. Slamet Riyadi, M.Pd.",
          courseCode: "PSD 25101",
          courseName: "Filsafat Ilmu Pendidikan",
          examType: "UTS",
          semester: "Genap 2025/2026",
          fileName: "Soal_UTS_Filsafat_Ilmu_Slamet.docx",
          fileUrl: "#",
          status: "Menunggu Penugasan Validator",
          validatorNidn: "",
          validatorName: "",
          notes: "",
          revisionFileName: "",
          revisionFileUrl: "",
          validationSheetName: "",
          validationSheetUrl: "",
          notifications: [
            { time: "25 Feb 2026 10:00", text: "Soal berhasil diunggah dan diteruskan ke Admin GKMP." }
          ]
        }
      ],
      courses: DEFAULT_COURSES,
      activeTabAdmin: 'overview',
      activeTabDosen: 'list'
    };

    // Deteksi apakah sedang berjalan di dalam Google Apps Script Web App
    const isInsideAppsScript = typeof google !== 'undefined' && google.script && google.script.run;

    // Toast function
    function showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      const bgCol = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-amber-600';
      toast.className = \`pointer-events-auto \${bgCol} text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold transition-all duration-200 transform translate-y-2 opacity-0\`;
      toast.innerHTML = \`<i class="fas fa-\${type === 'success' ? 'circle-check' : type === 'error' ? 'circle-exclamation' : 'circle-info'} text-sm"></i> <span>\${message}</span>\`;
      container.appendChild(toast);
      setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 20);
      setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 250);
      }, 4000);
    }

    function showLoading(text = 'Memproses data...') {
      document.getElementById('loading-text').innerText = text;
      document.getElementById('loading-overlay').classList.remove('hidden');
    }
    function hideLoading() {
      document.getElementById('loading-overlay').classList.add('hidden');
    }

    // Ambil data dari server jika berjalan di Apps Script
    function syncServerData() {
      if (isInsideAppsScript) {
        showLoading('Menghubungkan ke Google Sheets...');
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            if (res && res.status === 'success') {
              if (res.submissions) state.submissions = res.submissions;
              if (res.users) state.users = res.users;
              if (res.courses) state.courses = res.courses;
              render();
            }
          })
          .withFailureHandler((err) => {
            hideLoading();
            console.warn('Gagal memuat dari Google Sheets:', err);
          })
          .apiGetData();
      }
    }

    // --- RENDER CONTROLLER ---
    function render() {
      const app = document.getElementById('app');
      if (!state.currentUser) {
        app.innerHTML = renderLogin();
      } else if (state.currentUser.role === 'admin') {
        app.innerHTML = renderAdmin();
      } else {
        app.innerHTML = renderDosen();
      }
    }

    // --- VIEW: LOGIN ---
    function renderLogin() {
      return \`
        <div class="flex-1 flex items-center justify-center p-4 min-h-[85vh]">
          <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
            <div class="text-center space-y-2">
              <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-600 text-white text-2xl font-bold shadow-lg shadow-amber-600/30">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">SIUTASDIKDAS</h1>
              <p class="text-xs text-amber-800 font-semibold uppercase tracking-wider">Pendidikan Dasar Universitas Sarjanawiyata Tamansiswa</p>
              <p class="text-xs text-slate-500">Sistem Validasi Soal UTS & UAS Terintegrasi Google Sheets</p>
            </div>

            <form onsubmit="handleLogin(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Username / NIDN</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400"><i class="fas fa-user"></i></span>
                  <input type="text" id="login-user" required value="GKMP" class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Masukkan NIDN atau GKMP">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Password</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400"><i class="fas fa-lock"></i></span>
                  <input type="password" id="login-pass" required value="135791" class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none" placeholder="••••••••">
                </div>
              </div>
              <button type="submit" class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
                <i class="fas fa-right-to-bracket mr-1.5"></i> Masuk Sistem SIUTASDIKDAS
              </button>
            </form>

            <div class="pt-4 border-t border-slate-100 space-y-2">
              <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Pilih Akun Demo (Klik untuk Mengisi):</span>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button type="button" onclick="setQuickLogin('GKMP', '135791')" class="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-left hover:bg-amber-100">
                  <div class="font-bold">Admin GKMP</div>
                  <div class="text-[10px] text-amber-700 font-mono-tabular">User: GKMP</div>
                </button>
                <button type="button" onclick="setQuickLogin('0512018801', '123456')" class="p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-left hover:bg-slate-100">
                  <div class="font-bold">Dr. Ki Hajar (Validator)</div>
                  <div class="text-[10px] text-slate-500 font-mono-tabular">NIDN: 0512018801</div>
                </button>
                <button type="button" onclick="setQuickLogin('0525049002', '123456')" class="p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-left hover:bg-slate-100">
                  <div class="font-bold">Nyi Hj. Ratna Sari</div>
                  <div class="text-[10px] text-slate-500 font-mono-tabular">NIDN: 0525049002</div>
                </button>
                <button type="button" onclick="setQuickLogin('0508128503', '123456')" class="p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-left hover:bg-slate-100">
                  <div class="font-bold">Dr. Slamet Riyadi</div>
                  <div class="text-[10px] text-slate-500 font-mono-tabular">NIDN: 0508128503</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function setQuickLogin(u, p) {
      document.getElementById('login-user').value = u;
      document.getElementById('login-pass').value = p;
    }

    function handleLogin(e) {
      e.preventDefault();
      const u = document.getElementById('login-user').value.trim();
      const p = document.getElementById('login-pass').value.trim();

      if (isInsideAppsScript) {
        showLoading('Memverifikasi akun ke Google Sheets...');
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            if (res && res.status === 'success' && res.user) {
              state.currentUser = res.user;
              showToast(\`Selamat datang, \${res.user.name}!\`);
              render();
              syncServerData();
            } else {
              showToast(res ? res.message : 'Username atau password salah!', 'error');
            }
          })
          .withFailureHandler((err) => {
            hideLoading();
            showToast('Gagal menghubungi Apps Script: ' + err, 'error');
          })
          .apiLogin(u, p);
      } else {
        const found = state.users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);
        if (found) {
          state.currentUser = found;
          showToast(\`Selamat datang, \${found.name}!\`);
          render();
        } else {
          showToast('Username atau password salah!', 'error');
        }
      }
    }

    function handleLogout() {
      state.currentUser = null;
      showToast('Berhasil keluar sistem.', 'info');
      render();
    }

    // --- VIEW: ADMIN GKMP ---
    function renderAdmin() {
      const subs = state.submissions;
      const validators = state.users.filter(u => u.isValidator);

      return \`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
          <!-- Top bar -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <i class="fas fa-shield-halved"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold text-slate-900">\${state.currentUser.name}</h2>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span>Admin GKMP</span>
                  <span aria-hidden="true">·</span>
                  <span>Magister Pendidikan Dasar UST</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button onclick="setAdminTab('overview')" class="px-3 py-1.5 rounded-md transition-colors \${state.activeTabAdmin === 'overview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                  Dashboard & Soal Masuk
                </button>
                <button onclick="setAdminTab('users')" class="px-3 py-1.5 rounded-md transition-colors \${state.activeTabAdmin === 'users' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                  Kelola User & Validator
                </button>
              </div>
              <button onclick="handleLogout()" class="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Keluar">
                <i class="fas fa-power-off"></i>
              </button>
            </div>
          </div>

          \${state.activeTabAdmin === 'overview' ? \`
            <!-- KPI Strip -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Pengajuan</span>
                <div class="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">\${subs.length}</div>
              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <span class="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Menunggu Validator</span>
                <div class="text-2xl font-bold text-amber-600 font-mono-tabular mt-1">\${subs.filter(s => s.status.includes('Validator')).length}</div>
              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <span class="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Perlu Revisi</span>
                <div class="text-2xl font-bold text-rose-600 font-mono-tabular mt-1">\${subs.filter(s => s.status === 'Revisi').length}</div>
              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <span class="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Selesai Valid</span>
                <div class="text-2xl font-bold text-emerald-600 font-mono-tabular mt-1">\${subs.filter(s => s.status === 'Selesai Valid').length}</div>
              </div>
            </div>

            <!-- Table Submissions -->
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-sm">Daftar Naskah Soal UTS & UAS</h3>
                  <p class="text-xs text-slate-500">Sinkronisasi Database Google Sheets DB_SUBMISSIONS</p>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                      <th class="py-3 px-4">ID & Dosen</th>
                      <th class="py-3 px-4">Mata Kuliah & Ujian</th>
                      <th class="py-3 px-4">Berkas Naskah Soal</th>
                      <th class="py-3 px-4">Validator Bertugas</th>
                      <th class="py-3 px-4">Status & Catatan</th>
                      <th class="py-3 px-4 text-center">Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-xs">
                    \${subs.length === 0 ? '<tr><td colspan="6" class="p-8 text-center text-slate-400">Belum ada pengajuan naskah soal.</td></tr>' : 
                      subs.map(s => \`
                        <tr class="hover:bg-slate-50/70 transition-colors">
                          <td class="py-3 px-4">
                            <span class="font-mono-tabular font-bold text-slate-900 block">\${s.id}</span>
                            <span class="text-slate-700 font-medium">\${s.dosenName}</span>
                            <span class="text-[11px] text-slate-400 block font-mono-tabular">NIDN: \${s.dosenNidn}</span>
                          </td>
                          <td class="py-3 px-4">
                            <span class="font-medium text-slate-900 block">\${s.courseName}</span>
                            <div class="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold mt-0.5">
                              <span>\${s.courseCode}</span>
                              <span aria-hidden="true">·</span>
                              <span>\${s.examType}</span>
                              <span aria-hidden="true">·</span>
                              <span>\${s.semester}</span>
                            </div>
                          </td>
                          <td class="py-3 px-4 space-y-1">
                            <button onclick="downloadFile('\${s.fileName}', '\${s.fileData}', '\${s.fileUrl}')" class="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 text-[11px] bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
                              <i class="fas fa-file-arrow-down"></i> <span class="truncate max-w-[140px]">\${s.fileName}</span>
                            </button>
                            \${s.revisionFileName ? \`
                              <button onclick="downloadFile('\${s.revisionFileName}', '\${s.revisionFileData}', '\${s.revisionFileUrl}')" class="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200">
                                <i class="fas fa-file-arrow-down"></i> <span class="truncate max-w-[140px]">Revisi: \${s.revisionFileName}</span>
                              </button>
                            \` : ''}
                          </td>
                          <td class="py-3 px-4">
                            \${s.validatorName ? \`
                              <span class="text-slate-800 font-medium flex items-center gap-1">
                                <i class="fas fa-user-check text-emerald-600 text-xs"></i> <span>\${s.validatorName}</span>
                              </span>
                            \` : '<span class="text-rose-600 font-semibold text-[11px]">Belum Ditunjuk</span>'}
                          </td>
                          <td class="py-3 px-4">
                            <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold \${
                              s.status === 'Selesai Valid' ? 'bg-emerald-100 text-emerald-800' :
                              s.status === 'Revisi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }">\${s.status}</span>
                            \${s.notes ? \`<p class="text-[11px] text-slate-500 italic mt-1 line-clamp-2">"\${s.notes}"</p>\` : ''}
                          </td>
                          <td class="py-3 px-4 text-center">
                            <div class="flex items-center justify-center gap-1.5">
                              \${s.status === 'Menunggu Penugasan Validator' ? \`
                                <button onclick="openAssignModal('\${s.id}')" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1">
                                  <i class="fas fa-user-plus text-[10px]"></i> <span>Tunjuk</span>
                                </button>
                              \` : ''}
                              \${s.status === 'Menunggu Validasi Akhir Admin' ? \`
                                <button onclick="openFinalizeModal('\${s.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1">
                                  <i class="fas fa-check text-[10px]"></i> <span>Sahkan</span>
                                </button>
                              \` : ''}
                              <button onclick="viewHistory('\${s.id}')" class="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg" title="Riwayat Notifikasi">
                                <i class="fas fa-clock-rotate-left"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      \`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          \` : \`
            <!-- User Management -->
            <div class="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-base">Kelola Dosen & Validator</h3>
                  <p class="text-xs text-slate-500">Tabel DB_USERS Google Sheets. Tetapkan dosen yang bertindak sebagai reviewer validator.</p>
                </div>
                <button onclick="openAddUserModal()" class="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                  <i class="fas fa-user-plus text-xs"></i> <span>Tambah Dosen Baru</span>
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                      <th class="py-3 px-4">Nama Lengkap & Gelar</th>
                      <th class="py-3 px-4">Username / NIDN</th>
                      <th class="py-3 px-4">Peran Sistem</th>
                      <th class="py-3 px-4">Status Validator</th>
                      <th class="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-xs">
                    \${state.users.map(u => \`
                      <tr class="hover:bg-slate-50/70">
                        <td class="py-3 px-4 font-semibold text-slate-900">\${u.name}</td>
                        <td class="py-3 px-4 font-mono-tabular text-slate-600">\${u.username}</td>
                        <td class="py-3 px-4">
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold \${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                            \${u.role.toUpperCase()}
                          </span>
                        </td>
                        <td class="py-3 px-4">
                          \${u.role === 'dosen' ? \`
                            <button onclick="toggleValidator('\${u.username}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold \${u.isValidator ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                              \${u.isValidator ? '✓ Validator Aktif' : 'Bukan Validator'}
                            </button>
                          \` : '<span class="text-slate-400">Admin Utama</span>'}
                        </td>
                        <td class="py-3 px-4 text-center">
                          \${u.role !== 'admin' ? \`
                            <button onclick="deleteUser('\${u.username}')" class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                              <i class="fas fa-trash"></i>
                            </button>
                          \` : '-'}
                        </td>
                      </tr>
                    \`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          \`}
        </div>

        <!-- Modals -->
        <div id="modal-container"></div>
      \`;
    }

    function setAdminTab(tab) {
      state.activeTabAdmin = tab;
      render();
    }

    // Modal Tunjuk Validator
    function openAssignModal(subId) {
      const validators = state.users.filter(u => u.isValidator);
      const container = document.getElementById('modal-container');
      container.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 class="text-base font-bold text-slate-900">Tunjuk Validator Naskah Soal</h3>
            <p class="text-xs text-slate-600">Pilih Dosen Validator untuk memeriksa naskah <strong>\${subId}</strong>.</p>
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Pilih Validator:</label>
              <select id="assign-val-select" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500">
                \${validators.map(v => \`<option value="\${v.nidn}">\${v.name} (NIDN: \${v.nidn})</option>\`).join('')}
              </select>
            </div>
            <div class="flex items-center justify-end gap-2 pt-2">
              <button onclick="closeModal()" class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
              <button onclick="submitAssign('\${subId}')" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs">Tugaskan & Kirim Notifikasi</button>
            </div>
          </div>
        </div>
      \`;
    }

    function submitAssign(subId) {
      const validatorNidn = document.getElementById('assign-val-select').value;
      const validatorObj = state.users.find(u => u.nidn === validatorNidn);

      if (isInsideAppsScript) {
        showLoading('Menugaskan validator di Google Sheets...');
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            closeModal();
            showToast(\`Validator \${validatorObj.name} berhasil ditugaskan!\`);
            syncServerData();
          })
          .withFailureHandler((err) => {
            hideLoading();
            showToast('Gagal menugaskan: ' + err, 'error');
          })
          .apiAssignValidator({ subId, validatorNidn, validatorName: validatorObj.name });
      } else {
        const sub = state.submissions.find(s => s.id === subId);
        if (sub && validatorObj) {
          sub.validatorNidn = validatorObj.nidn;
          sub.validatorName = validatorObj.name;
          sub.status = "Menunggu Review Validator";
          sub.notifications.push({
            time: new Date().toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'}),
            text: \`Soal ditugaskan ke Validator: \${validatorObj.name}.\`
          });
          closeModal();
          showToast(\`Validator \${validatorObj.name} berhasil ditugaskan!\`);
          render();
        }
      }
    }

    // Modal Sahkan Admin
    function openFinalizeModal(subId) {
      const sub = state.submissions.find(s => s.id === subId);
      const container = document.getElementById('modal-container');
      container.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 class="text-base font-bold text-slate-900">Pengesahan & Serah Terima Soal Valid</h3>
            <p class="text-xs text-slate-600">Validator <strong>\${sub.validatorName}</strong> telah menyetujui soal dan melampirkan lembar validasi bertandatangan.</p>
            <div class="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
              <div class="font-bold text-amber-900"><i class="fas fa-file-pdf mr-1"></i> Lembar Validasi Validator:</div>
              <p class="text-slate-800 font-semibold">\${sub.validationSheetName || 'Lembar_Validasi.pdf'}</p>
              \${sub.notes ? \`<p class="text-slate-600 italic">"\${sub.notes}"</p>\` : ''}
            </div>
            <div class="flex items-center justify-end gap-2 pt-2">
              <button onclick="closeModal()" class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
              <button onclick="submitFinalize('\${subId}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5">
                <i class="fas fa-circle-check"></i> <span>Sahkan & Teruskan ke Dosen</span>
              </button>
            </div>
          </div>
        </div>
      \`;
    }

    function submitFinalize(subId) {
      if (isInsideAppsScript) {
        showLoading('Mengesahkan naskah soal...');
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            closeModal();
            showToast('Soal dan Lembar Validasi berhasil disahkan dan dikirim ke Dosen!');
            syncServerData();
          })
          .withFailureHandler((err) => {
            hideLoading();
            showToast('Gagal mengesahkan: ' + err, 'error');
          })
          .apiFinalizeAdmin({ subId });
      } else {
        const sub = state.submissions.find(s => s.id === subId);
        if (sub) {
          sub.status = "Selesai Valid";
          sub.notifications.push({
            time: new Date().toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'}),
            text: "Admin GKMP memeriksa lembar validasi. Soal dinyatakan Valid & Lengkap."
          });
          closeModal();
          showToast('Soal dan lembar validasi berhasil disahkan!');
          render();
        }
      }
    }

    function closeModal() {
      document.getElementById('modal-container').innerHTML = '';
    }

    // Modal Tambah User
    function openAddUserModal() {
      const container = document.getElementById('modal-container');
      container.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 class="text-base font-bold text-slate-900">Tambah Dosen Baru</h3>
            <form onsubmit="submitAddUser(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                <input type="text" id="add-name" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500" placeholder="Dr. Budi Prasetyo, M.Pd.">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">NIDN (Username Login)</label>
                <input type="text" id="add-nidn" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500" placeholder="0511098801">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Password Default</label>
                <input type="text" id="add-pass" value="123456" required class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500">
              </div>
              <div class="flex items-center gap-2 pt-1">
                <input type="checkbox" id="add-isval" class="rounded border-slate-300 text-amber-600 focus:ring-amber-500">
                <label for="add-isval" class="text-xs text-slate-700 font-medium">Tugaskan sebagai Validator</label>
              </div>
              <div class="flex items-center justify-end gap-2 pt-3">
                <button type="button" onclick="closeModal()" class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                <button type="submit" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs">Simpan User</button>
              </div>
            </form>
          </div>
        </div>
      \`;
    }

    function submitAddUser(e) {
      e.preventDefault();
      const name = document.getElementById('add-name').value.trim();
      const nidn = document.getElementById('add-nidn').value.trim();
      const pass = document.getElementById('add-pass').value.trim();
      const isVal = document.getElementById('add-isval').checked;

      if (isInsideAppsScript) {
        showLoading('Menyimpan user ke Google Sheets...');
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            closeModal();
            showToast(\`User \${name} berhasil disimpan!\`);
            syncServerData();
          })
          .withFailureHandler((err) => {
            hideLoading();
            showToast('Gagal simpan user: ' + err, 'error');
          })
          .apiManageUser({ subAction: 'addUser', name, nidn, password: pass, isValidator: isVal });
      } else {
        state.users.push({
          username: nidn,
          password: pass,
          role: 'dosen',
          name: name,
          nidn: nidn,
          isValidator: isVal
        });
        closeModal();
        showToast(\`User \${name} berhasil ditambahkan!\`);
        render();
      }
    }

    function toggleValidator(username) {
      const user = state.users.find(u => u.username === username);
      if (!user) return;

      if (isInsideAppsScript) {
        showLoading('Memperbarui status validator...');
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            showToast('Status validator berhasil diperbarui.');
            syncServerData();
          })
          .withFailureHandler((err) => {
            hideLoading();
            showToast('Gagal memperbarui: ' + err, 'error');
          })
          .apiManageUser({ subAction: 'toggleValidator', username });
      } else {
        user.isValidator = !user.isValidator;
        showToast('Status validator berhasil diperbarui.');
        render();
      }
    }

    function deleteUser(username) {
      if (confirm('Hapus dosen ini dari sistem?')) {
        state.users = state.users.filter(u => u.username !== username);
        showToast('User berhasil dihapus.');
        render();
      }
    }

    function viewHistory(subId) {
      const sub = state.submissions.find(s => s.id === subId);
      const text = sub.notifications.map(n => \`[\${n.time}] \${n.text}\`).join('\\n\\n');
      alert(\`Riwayat Aktivitas [\${sub.id}]:\\n\\n\` + text);
    }

    // --- VIEW: DOSEN & VALIDATOR ---
    function renderDosen() {
      const user = state.currentUser;
      const mySubs = state.submissions.filter(s => s.dosenNidn === user.nidn);
      const assignedSubs = state.submissions.filter(s => s.validatorNidn === user.nidn);

      return \`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
          <!-- User header -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <i class="fas fa-chalkboard-user"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold text-slate-900">\${user.name}</h2>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span class="font-mono-tabular">NIDN: \${user.nidn}</span>
                  \${user.isValidator ? '<span aria-hidden="true">·</span><span class="text-purple-700 font-semibold">Validator Resmi</span>' : ''}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button onclick="setDosenTab('list')" class="px-3 py-1.5 rounded-md transition-colors \${state.activeTabDosen === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                  Pengajuan Soal Saya
                </button>
                \${user.isValidator ? \`
                  <button onclick="setDosenTab('validator')" class="px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 \${state.activeTabDosen === 'validator' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}">
                    <span>Tugas Review Validator</span>
                    <span class="font-mono-tabular text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded-full">
                      \${assignedSubs.filter(s => s.status === 'Menunggu Review Validator').length}
                    </span>
                  </button>
                \` : ''}
              </div>
              <button onclick="handleLogout()" class="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Keluar">
                <i class="fas fa-power-off"></i>
              </button>
            </div>
          </div>

          \${state.activeTabDosen === 'list' ? \`
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Upload Soal -->
              <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs h-fit">
                <div class="flex items-center gap-2">
                  <i class="fas fa-cloud-arrow-up text-amber-600"></i>
                  <h3 class="font-bold text-slate-900 text-sm">Unggah Naskah Soal Ujian</h3>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Unggah naskah soal UTS atau UAS langsung ke sistem. Berkas otomatis tersimpan di Google Drive dan tercatat di Google Sheets.
                </p>

                <form onsubmit="handleUploadSoal(event)" class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Mata Kuliah Pengampu</label>
                    <select id="up-course" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none">
                      <option value="">-- Pilih Mata Kuliah UST --</option>
                      \${state.courses.map(c => \`<option value="\${c.code}|\${c.name}">\${c.code} - \${c.name}</option>\`).join('')}
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Jenis Ujian</label>
                      <select id="up-type" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none">
                        <option value="UTS">UTS (Tengah)</option>
                        <option value="UAS">UAS (Akhir)</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Semester</label>
                      <input type="text" id="up-sem" value="Genap 2025/2026" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none">
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Dokumen Soal (Word / PDF)</label>
                    <input type="file" id="up-file" required accept=".doc,.docx,.pdf" class="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer">
                  </div>

                  <button type="submit" class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all">
                    <i class="fas fa-paper-plane mr-1.5"></i> Kirim Soal ke Admin GKMP
                  </button>
                </form>
              </div>

              <!-- List Pengajuan Saya -->
              <div class="lg:col-span-2 space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-slate-900 text-sm">Riwayat Pengajuan Soal Anda</h3>
                  <span class="text-xs text-slate-500 font-mono-tabular">Total: \${mySubs.length} Berkas</span>
                </div>

                \${mySubs.length === 0 ? \`
                  <div class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                    Belum ada naskah soal yang diajukan. Gunakan formulir di sebelah kiri untuk mengunggah naskah pertama Anda.
                  </div>
                \` : mySubs.map(s => \`
                  <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-3 hover:border-amber-300 transition-colors shadow-2xs">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span class="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">\${s.courseCode}</span>
                        <h4 class="font-bold text-slate-900 text-sm mt-1">\${s.courseName} (\${s.examType})</h4>
                      </div>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold w-fit \${
                        s.status === 'Selesai Valid' ? 'bg-emerald-100 text-emerald-800' :
                        s.status === 'Revisi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }">\${s.status}</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div><strong class="text-slate-800">Validator:</strong> \${s.validatorName || 'Menunggu penunjukan Admin GKMP'}</div>
                      <div><strong class="text-slate-800">Berkas Soal:</strong> <button onclick="downloadFile('\${s.fileName}', '\${s.fileData}', '\${s.fileUrl}')" class="text-amber-700 font-semibold underline">\${s.fileName}</button></div>
                    </div>

                    \${s.status === 'Revisi' ? \`
                      <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                        <div class="font-bold text-rose-900"><i class="fas fa-triangle-exclamation mr-1"></i> Catatan Revisi dari Validator:</div>
                        <p class="text-rose-800 italic">"\${s.notes}"</p>
                        <div class="pt-2 border-t border-rose-200/60 flex items-center gap-2">
                          <input type="file" id="rev-file-\${s.id}" accept=".doc,.docx,.pdf" onchange="submitRevision('\${s.id}')" class="text-xs text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white cursor-pointer">
                        </div>
                      </div>
                    \` : ''}

                    \${s.status === 'Selesai Valid' ? \`
                      <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                        <div class="flex items-center justify-between text-xs font-bold text-emerald-900">
                          <span><i class="fas fa-circle-check text-emerald-600 mr-1.5"></i> Soal Dinyatakan VALID & Resmi Disetujui</span>
                          <span class="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Lengkap & Selesai</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60">
                          <button onclick="downloadFile('\${s.revisionFileName || s.fileName}', '\${s.revisionFileData || s.fileData}', '\${s.revisionFileUrl || s.fileUrl}')" class="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors">
                            <i class="fas fa-file-arrow-down"></i> <span>Unduh Naskah Soal Valid</span>
                          </button>
                          <button onclick="downloadFile('\${s.validationSheetName || 'Lembar_Validasi.pdf'}', '\${s.validationSheetData}', '\${s.validationSheetUrl}')" class="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors">
                            <i class="fas fa-file-pdf"></i> <span>Unduh Lembar Validasi (TTD)</span>
                          </button>
                        </div>
                      </div>
                    \` : ''}
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : \`
            <!-- Review Validator -->
            <div class="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div>
                <h3 class="font-bold text-slate-900 text-base">Panel Telaah & Validasi Soal</h3>
                <p class="text-xs text-slate-500">Periksa naskah soal yang ditugaskan kepada Anda. Berikan catatan jika perlu revisi, atau nyatakan Valid dan lampirkan Lembar Validasi resmi.</p>
              </div>

              <div class="space-y-6">
                \${assignedSubs.length === 0 ? \`
                  <div class="p-8 text-center text-slate-400 text-xs">Belum ada naskah soal yang ditugaskan kepada Anda.</div>
                \` : assignedSubs.map(s => \`
                  <div class="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <span class="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">\${s.courseCode}</span>
                        <h4 class="font-bold text-slate-900 text-base mt-1">\${s.courseName} (\${s.examType})</h4>
                        <p class="text-xs text-slate-500">Dosen Pengampu: <strong>\${s.dosenName}</strong></p>
                      </div>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 w-fit">\${s.status}</span>
                    </div>

                    <div class="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span class="font-semibold text-slate-700 block">Berkas Naskah Soal:</span>
                        <button onclick="downloadFile('\${s.revisionFileName || s.fileName}', '\${s.revisionFileData || s.fileData}', '\${s.revisionFileUrl || s.fileUrl}')" class="text-amber-700 font-bold hover:underline flex items-center gap-1 mt-0.5">
                          <i class="fas fa-file-arrow-down"></i> <span>\${s.revisionFileName || s.fileName}</span>
                        </button>
                      </div>
                      <span class="text-[11px] text-slate-400">\${s.semester}</span>
                    </div>

                    <div class="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <strong class="text-blue-900 block">Template Lembar Validasi Resmi UST:</strong>
                        <span class="text-blue-700 text-[11px]">Unduh format dokumen resmi Program Studi sebelum mengisi telaah & tanda tangan.</span>
                      </div>
                      <a href="https://docs.google.com/document/d/1yLXfxsZ8EbWe96g-X36KifF3zSd5WsHp/edit?usp=sharing&ouid=107839986455260993727&rtpof=true&sd=true" target="_blank" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs">
                        <i class="fas fa-download"></i> <span>Unduh Template (Google Docs)</span>
                      </a>
                    </div>

                    <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <h5 class="text-xs font-bold uppercase text-slate-700 tracking-wider">Keputusan Telaah Validator:</h5>
                      <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Catatan / Komentar (Wajib diisi jika memilih Revisi):</label>
                        <textarea id="val-notes-\${s.id}" rows="2" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Tuliskan masukan atau telaah soal...">\${s.notes || ''}</textarea>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Unggah Lembar Validasi Bertandatangan (PDF / Word):</label>
                        <input type="file" id="val-sheet-\${s.id}" accept=".pdf,.doc,.docx" class="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer">
                      </div>

                      <div class="grid grid-cols-2 gap-2 pt-2">
                        <button onclick="submitReview('\${s.id}', 'revisi')" class="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5">
                          <i class="fas fa-rotate-left"></i> <span>Kirim Revisi (Belum Sesuai)</span>
                        </button>
                        <button onclick="submitReview('\${s.id}', 'valid')" class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5">
                          <i class="fas fa-circle-check"></i> <span>Valid (Lengkap & TTD)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`}
        </div>
      \`;
    }

    function setDosenTab(tab) {
      state.activeTabDosen = tab;
      render();
    }

    function handleUploadSoal(e) {
      e.preventDefault();
      const courseVal = document.getElementById('up-course').value;
      const [courseCode, courseName] = courseVal.split('|');
      const examType = document.getElementById('up-type').value;
      const semester = document.getElementById('up-sem').value;
      const file = document.getElementById('up-file').files[0];

      if (!file) {
        showToast('Pilih berkas soal terlebih dahulu!', 'error');
        return;
      }

      showLoading('Mengunggah naskah soal ke Google Drive...');
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64 = event.target.result;

        if (isInsideAppsScript) {
          google.script.run
            .withSuccessHandler((res) => {
              hideLoading();
              showToast('Naskah soal berhasil disimpan di Google Drive & Sheets!');
              syncServerData();
            })
            .withFailureHandler((err) => {
              hideLoading();
              showToast('Gagal mengunggah: ' + err, 'error');
            })
            .apiUploadSoal({
              dosenNidn: state.currentUser.nidn,
              dosenName: state.currentUser.name,
              courseCode,
              courseName,
              examType,
              semester,
              fileName: file.name,
              fileBase64: base64
            });
        } else {
          hideLoading();
          const newSub = {
            id: "SUB-" + Math.floor(100 + Math.random() * 900),
            dosenNidn: state.currentUser.nidn,
            dosenName: state.currentUser.name,
            courseCode,
            courseName,
            examType,
            semester,
            fileName: file.name,
            fileData: base64,
            status: "Menunggu Penugasan Validator",
            validatorNidn: "",
            validatorName: "",
            notes: "",
            revisionFileName: "",
            validationSheetName: "",
            notifications: [
              { time: new Date().toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'}), text: "Soal berhasil diunggah langsung ke sistem dan diteruskan ke Admin GKMP." }
            ]
          };
          state.submissions.unshift(newSub);
          showToast('Naskah soal berhasil diunggah ke database!');
          render();
        }
      };
      reader.readAsDataURL(file);
    }

    function submitRevision(subId) {
      const fileInput = document.getElementById(\`rev-file-\${subId}\`);
      const file = fileInput.files[0];
      if (!file) return;

      showLoading('Mengunggah revisi ke Google Drive...');
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64 = event.target.result;
        if (isInsideAppsScript) {
          google.script.run
            .withSuccessHandler((res) => {
              hideLoading();
              showToast('Berkas revisi berhasil diunggah ke Google Drive!');
              syncServerData();
            })
            .withFailureHandler((err) => {
              hideLoading();
              showToast('Gagal kirim revisi: ' + err, 'error');
            })
            .apiUploadRevision({ subId, fileName: file.name, fileBase64: base64 });
        } else {
          hideLoading();
          const sub = state.submissions.find(s => s.id === subId);
          if (sub) {
            sub.revisionFileName = file.name;
            sub.revisionFileData = base64;
            sub.status = "Menunggu Review Validator";
            sub.notifications.push({
              time: new Date().toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'}),
              text: \`Dosen mengunggah revisi (\${file.name}).\`
            });
            showToast('Berkas revisi berhasil diunggah!');
            render();
          }
        }
      };
      reader.readAsDataURL(file);
    }

    function submitReview(subId, decision) {
      const notes = document.getElementById(\`val-notes-\${subId}\`).value.trim();
      const sheetFile = document.getElementById(\`val-sheet-\${subId}\`).files[0];

      if (decision === 'revisi' && !notes) {
        showToast('Catatan revisi wajib diisi jika soal belum sesuai!', 'error');
        return;
      }

      if (decision === 'valid' && !sheetFile) {
        showToast('Harap unggah berkas Lembar Validasi bertandatangan terlebih dahulu!', 'error');
        return;
      }

      showLoading('Menyimpan keputusan telaah validator...');

      if (sheetFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
          sendDecision(subId, decision, notes, sheetFile.name, event.target.result);
        };
        reader.readAsDataURL(sheetFile);
      } else {
        sendDecision(subId, decision, notes, '', '');
      }
    }

    function sendDecision(subId, decision, notes, sheetName, sheetBase64) {
      if (isInsideAppsScript) {
        google.script.run
          .withSuccessHandler((res) => {
            hideLoading();
            showToast(decision === 'valid' ? 'Keputusan VALID dan Lembar Validasi berhasil disimpan!' : 'Status Revisi berhasil dikirimkan ke Dosen.');
            syncServerData();
          })
          .withFailureHandler((err) => {
            hideLoading();
            showToast('Gagal simpan telaah: ' + err, 'error');
          })
          .apiSubmitValidatorReview({ subId, decision, notes, sheetName, sheetBase64 });
      } else {
        hideLoading();
        const sub = state.submissions.find(s => s.id === subId);
        if (sub) {
          if (decision === 'valid') {
            sub.status = "Menunggu Validasi Akhir Admin";
            sub.notes = notes;
            sub.validationSheetName = sheetName || "Lembar_Validasi.pdf";
            sub.validationSheetData = sheetBase64;
            sub.notifications.push({
              time: new Date().toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'}),
              text: \`Validator menyatakan VALID dan melampirkan Lembar Validasi.\`
            });
            showToast('Keputusan VALID dan Lembar Validasi berhasil disimpan!');
          } else {
            sub.status = "Revisi";
            sub.notes = notes;
            sub.notifications.push({
              time: new Date().toLocaleString('id-ID', {dateStyle:'medium', timeStyle:'short'}),
              text: \`Validator meminta REVISI. Catatan: "\${notes}".\`
            });
            showToast('Catatan Revisi dikirimkan ke Dosen pengampu.');
          }
          render();
        }
      }
    }

    function downloadFile(name, data, driveUrl) {
      if (driveUrl && driveUrl !== '#' && driveUrl.startsWith('http')) {
        window.open(driveUrl, '_blank');
        return;
      }
      showToast(\`Mengunduh berkas: \${name}\`);
      const element = document.createElement('a');
      if (data && data.startsWith('data:')) {
        element.href = data;
      } else {
        const blob = new Blob([\`Dokumen Resmi UST\\nNama Berkas: \${name}\\nProgram Studi Magister Pendidikan Dasar UST\`], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(blob);
      }
      element.download = name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    // First load
    render();
    if (isInsideAppsScript) {
      syncServerData();
    }
  </script>
</body>
</html>
`;
