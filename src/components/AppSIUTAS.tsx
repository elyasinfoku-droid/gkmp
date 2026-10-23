import React, { useState, useEffect } from 'react';
import {
  User,
  Submission,
  Course,
  SubmissionStatus,
} from '../types';
import {
  getLocalState,
  saveLocalState,
  executeApiAction,
  getLiveUrl,
} from '../services/appsScriptApi';
import { DEFAULT_COURSES } from '../data/courses';
import { VALIDATION_TEMPLATE_URL } from '../data/initialState';
import {
  Shield,
  GraduationCap,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  UserPlus,
  Trash2,
  Download,
  Upload,
  LogOut,
  ExternalLink,
  RotateCcw,
  Check,
  FileCheck,
  History,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

export const AppSIUTAS: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [activeTabAdmin, setActiveTabAdmin] = useState<'overview' | 'users'>('overview');
  const [activeTabDosen, setActiveTabDosen] = useState<'list' | 'validator'>('list');

  // Modals
  const [assignSubId, setAssignSubId] = useState<string | null>(null);
  const [finalizeSubId, setFinalizeSubId] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [historySubId, setHistorySubId] = useState<string | null>(null);

  // Form states
  const [loginUser, setLoginUser] = useState<string>('GKMP');
  const [loginPass, setLoginPass] = useState<string>('135791');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dosen upload form
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [examType, setExamType] = useState<'UTS' | 'UAS'>('UTS');
  const [semester, setSemester] = useState<string>('Genap 2025/2026');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validator review form states
  const [validatorNotes, setValidatorNotes] = useState<{ [id: string]: string }>({});
  const [validatorSheetFiles, setValidatorSheetFiles] = useState<{ [id: string]: { name: string; base64: string } }>({});

  // Add user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserNidn, setNewUserNidn] = useState('');
  const [newUserPass, setNewUserPass] = useState('123456');
  const [newUserIsValidator, setNewUserIsValidator] = useState(false);

  // Load initial data
  const loadData = async () => {
    const liveUrl = getLiveUrl();
    if (liveUrl) {
      try {
        const res = await executeApiAction('getData');
        if (res && res.status === 'success') {
          if (res.submissions) setSubmissions(res.submissions);
          if (res.users) setUsers(res.users);
          if (res.courses) setCourses(res.courses);
          return;
        }
      } catch (e) {
        console.warn('Failed to load live data, fallback to local:', e);
      }
    }
    const local = getLocalState();
    setUsers(local.users);
    setSubmissions(local.submissions);
    setCourses(local.courses);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await executeApiAction('login', { username: loginUser, password: loginPass });
    if (res && res.status === 'success' && res.user) {
      setCurrentUser(res.user);
      showToast(`Selamat datang, ${res.user.name}!`);
    } else {
      showToast(res?.message || 'Username atau password salah!', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Berhasil keluar sistem.', 'info');
  };

  const quickLogin = (u: string, p: string) => {
    setLoginUser(u);
    setLoginPass(p);
  };

  // Dosen upload soal
  const handleUploadSoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!selectedCourse) {
      showToast('Pilih mata kuliah terlebih dahulu!', 'error');
      return;
    }
    if (!uploadedFile) {
      showToast('Pilih berkas soal terlebih dahulu!', 'error');
      return;
    }

    const [courseCode, courseName] = selectedCourse.split('|');
    setIsSubmitting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const res = await executeApiAction('uploadSoal', {
        dosenNidn: currentUser.nidn,
        dosenName: currentUser.name,
        courseCode,
        courseName,
        examType,
        semester,
        fileName: uploadedFile.name,
        fileBase64: base64,
      });

      setIsSubmitting(false);
      if (res && res.status === 'success') {
        showToast('Naskah soal berhasil diunggah ke database!');
        setUploadedFile(null);
        setSelectedCourse('');
        loadData();
      } else {
        showToast(res?.message || 'Gagal mengunggah soal', 'error');
      }
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Upload Revision
  const handleUploadRevision = (subId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const res = await executeApiAction('uploadRevision', {
        subId,
        fileName: file.name,
        fileBase64: base64,
      });
      if (res && res.status === 'success') {
        showToast('Naskah revisi berhasil diunggah!');
        loadData();
      } else {
        showToast(res?.message || 'Gagal mengunggah revisi', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // Assign validator
  const handleAssignValidator = async (subId: string, validatorNidn: string) => {
    const validatorObj = users.find((u) => u.nidn === validatorNidn);
    if (!validatorObj) return;

    const res = await executeApiAction('assignValidator', {
      subId,
      validatorNidn: validatorObj.nidn,
      validatorName: validatorObj.name,
    });

    if (res && res.status === 'success') {
      showToast(`Validator ${validatorObj.name} berhasil ditugaskan!`);
      setAssignSubId(null);
      loadData();
    } else {
      showToast(res?.message || 'Gagal menugaskan validator', 'error');
    }
  };

  // Validator decision
  const handleValidatorDecision = async (subId: string, decision: 'valid' | 'revisi') => {
    const notes = validatorNotes[subId] || '';
    const sheet = validatorSheetFiles[subId];

    if (decision === 'revisi' && !notes.trim()) {
      showToast('Catatan revisi wajib diisi jika soal belum sesuai!', 'error');
      return;
    }

    if (decision === 'valid') {
      if (!sheet || !sheet.base64) {
        showToast('Harap unggah file lembar validasi bertanda tangan terlebih dahulu!', 'error');
        return;
      }
    }

    const res = await executeApiAction('submitValidatorReview', {
      subId,
      decision,
      notes,
      sheetName: sheet?.name || 'Lembar_Validasi.pdf',
      sheetBase64: sheet?.base64 || '',
    });

    if (res && res.status === 'success') {
      showToast(
        decision === 'valid'
          ? 'Keputusan VALID dan Lembar Validasi berhasil disimpan!'
          : 'Status Revisi dikirimkan ke Dosen pengampu.'
      );
      loadData();
    } else {
      showToast(res?.message || 'Gagal menyimpan keputusan validator', 'error');
    }
  };

  // Admin finalize
  const handleFinalizeAdmin = async (subId: string) => {
    const res = await executeApiAction('finalizeAdmin', { subId });
    if (res && res.status === 'success') {
      showToast('Soal dan Lembar Validasi berhasil disahkan dan dikirimkan ke Dosen!');
      setFinalizeSubId(null);
      loadData();
    } else {
      showToast(res?.message || 'Gagal mengesahkan soal', 'error');
    }
  };

  // Add User
  const handleSaveNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await executeApiAction('manageUser', {
      subAction: 'addUser',
      name: newUserName,
      nidn: newUserNidn,
      password: newUserPass,
      isValidator: newUserIsValidator,
    });

    if (res && res.status === 'success') {
      showToast(`User ${newUserName} berhasil didaftarkan!`);
      setIsAddUserOpen(false);
      setNewUserName('');
      setNewUserNidn('');
      loadData();
    } else {
      showToast(res?.message || 'Gagal mendaftarkan user', 'error');
    }
  };

  // Toggle Validator
  const handleToggleValidator = async (username: string) => {
    const res = await executeApiAction('manageUser', {
      subAction: 'toggleValidator',
      username,
    });
    if (res && res.status === 'success') {
      showToast('Status validator berhasil diperbarui.');
      loadData();
    }
  };

  // Delete User
  const handleDeleteUser = async (username: string) => {
    if (confirm('Hapus pengguna ini dari database?')) {
      const res = await executeApiAction('manageUser', {
        subAction: 'deleteUser',
        username,
      });
      if (res && res.status === 'success') {
        showToast('Pengguna berhasil dihapus.');
        loadData();
      }
    }
  };

  // Download simulator or Drive link
  const handleDownloadFile = (fileName: string, fileData?: string, driveUrl?: string) => {
    if (driveUrl && driveUrl !== '#' && driveUrl.startsWith('http')) {
      window.open(driveUrl, '_blank');
      return;
    }
    showToast(`Mengunduh berkas: ${fileName}`);
    const element = document.createElement('a');
    if (fileData && fileData.startsWith('data:')) {
      element.href = fileData;
    } else {
      const blob = new Blob(
        [
          `DOKUMEN RESMI PENDIDIKAN DASAR UST\nNama Berkas: ${fileName}\nStatus: Terverifikasi oleh SIUTASDIKDAS UST`,
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      element.href = URL.createObjectURL(blob);
    }
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // RENDER: LOGIN VIEW
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-600 text-white text-2xl font-bold shadow-lg shadow-amber-600/30">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              SIUTASDIKDAS UST
            </h1>
            <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
              Pendidikan Dasar Universitas Sarjanawiyata Tamansiswa
            </p>
            <p className="text-xs text-slate-500">
              Sistem Validasi Soal UTS &amp; UAS Terintegrasi Google Sheets
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Username / NIDN
              </label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="NIDN Dosen atau GKMP"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Kata Sandi (Password)
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              Masuk Sistem SIUTASDIKDAS
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Pilih Akun Cepat (Klik untuk Mengisi):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickLogin('GKMP', '135791')}
                className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-left hover:bg-amber-100 transition-colors"
              >
                <div className="font-bold">Admin GKMP</div>
                <div className="text-[10px] text-amber-700 font-mono-tabular">User: GKMP</div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('0512018801', '123456')}
                className="p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-left hover:bg-slate-100 transition-colors"
              >
                <div className="font-bold">Dr. Ki Hajar (Validator)</div>
                <div className="text-[10px] text-slate-500 font-mono-tabular">NIDN: 0512018801</div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('0525049002', '123456')}
                className="p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-left hover:bg-slate-100 transition-colors"
              >
                <div className="font-bold">Nyi Hj. Ratna Sari</div>
                <div className="text-[10px] text-slate-500 font-mono-tabular">NIDN: 0525049002</div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('0508128503', '123456')}
                className="p-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-left hover:bg-slate-100 transition-colors"
              >
                <div className="font-bold">Dr. Slamet Riyadi</div>
                <div className="text-[10px] text-slate-500 font-mono-tabular">NIDN: 0508128503</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Toast Container
  const ToastContainer = (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold text-white flex items-center gap-2 animate-in slide-in-from-top-2 duration-150 ${
            t.type === 'success'
              ? 'bg-emerald-600'
              : t.type === 'error'
              ? 'bg-rose-600'
              : 'bg-amber-600'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );

  // RENDER: ADMIN DASHBOARD
  if (currentUser.role === 'admin') {
    const validators = users.filter((u) => u.isValidator);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {ToastContainer}

        {/* User bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{currentUser.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Admin GKMP</span>
                <span aria-hidden="true">·</span>
                <span>Program Studi Magister Pendidikan Dasar UST</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveTabAdmin('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTabAdmin === 'overview'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard &amp; Soal Masuk
              </button>
              <button
                onClick={() => setActiveTabAdmin('users')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTabAdmin === 'users'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kelola User &amp; Validator
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeTabAdmin === 'overview' ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Pengajuan
                </span>
                <div className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
                  {submissions.length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                  Menunggu Validator
                </span>
                <div className="text-2xl font-bold text-amber-600 font-mono-tabular mt-1">
                  {submissions.filter((s) => s.status.includes('Validator')).length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                  Perlu Revisi
                </span>
                <div className="text-2xl font-bold text-rose-600 font-mono-tabular mt-1">
                  {submissions.filter((s) => s.status === 'Revisi').length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                  Selesai Valid
                </span>
                <div className="text-2xl font-bold text-emerald-600 font-mono-tabular mt-1">
                  {submissions.filter((s) => s.status === 'Selesai Valid').length}
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Daftar Pengajuan Soal UTS &amp; UAS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sinkronisasi otomatis dengan Google Sheets DB_SUBMISSIONS
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">ID &amp; Dosen</th>
                      <th className="py-3 px-4">Mata Kuliah &amp; Ujian</th>
                      <th className="py-3 px-4">Berkas Naskah Soal</th>
                      <th className="py-3 px-4">Validator Bertugas</th>
                      <th className="py-3 px-4">Status &amp; Catatan</th>
                      <th className="py-3 px-4 text-center">Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Belum ada naskah soal yang diajukan.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono-tabular font-bold text-slate-900 block">
                              {s.id}
                            </span>
                            <span className="text-slate-700 font-medium">{s.dosenName}</span>
                            <span className="text-[11px] text-slate-400 block font-mono-tabular">
                              NIDN: {s.dosenNidn}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-900 block">{s.courseName}</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold mt-0.5">
                              <span>{s.courseCode}</span>
                              <span aria-hidden="true">·</span>
                              <span>{s.examType}</span>
                              <span aria-hidden="true">·</span>
                              <span>{s.semester}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 space-y-1">
                            <button
                              onClick={() => handleDownloadFile(s.fileName, s.fileData, s.fileUrl)}
                              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 text-[11px] bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{s.fileName}</span>
                            </button>
                            {s.revisionFileName && (
                              <button
                                onClick={() =>
                                  handleDownloadFile(
                                    s.revisionFileName,
                                    s.revisionFileData || s.fileData,
                                    s.revisionFileUrl
                                  )
                                }
                                className="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
                              >
                                <Download className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">Revisi: {s.revisionFileName}</span>
                              </button>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {s.validatorName ? (
                              <span className="text-slate-800 font-medium flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{s.validatorName}</span>
                              </span>
                            ) : (
                              <span className="text-rose-600 font-semibold text-[11px]">
                                Belum Ditunjuk
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                s.status === 'Selesai Valid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : s.status === 'Revisi'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {s.status}
                            </span>
                            {s.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                                &quot;{s.notes}&quot;
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {s.status === 'Menunggu Penugasan Validator' && (
                                <button
                                  onClick={() => setAssignSubId(s.id)}
                                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  <span>Tunjuk</span>
                                </button>
                              )}

                              {s.status === 'Menunggu Validasi Akhir Admin' && (
                                <button
                                  onClick={() => setFinalizeSubId(s.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Sahkan</span>
                                </button>
                              )}

                              <button
                                onClick={() => setHistorySubId(s.id)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Lihat Riwayat Notifikasi"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* User Management Tab */
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Kelola Dosen &amp; Validator
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar pengguna terdaftar di sheet DB_USERS. Tentukan dosen yang berhak menjadi reviewer validator soal.
                </p>
              </div>

              <button
                onClick={() => setIsAddUserOpen(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah Dosen Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Nama Lengkap &amp; Gelar</th>
                    <th className="py-3 px-4">Username / NIDN</th>
                    <th className="py-3 px-4">Peran Sistem</th>
                    <th className="py-3 px-4">Status Validator</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.map((u) => (
                    <tr key={u.username} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                      <td className="py-3 px-4 font-mono-tabular text-slate-600">{u.username}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.role === 'dosen' ? (
                          <button
                            onClick={() => handleToggleValidator(u.username)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              u.isValidator
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {u.isValidator ? '✓ Validator Aktif' : 'Bukan Validator'}
                          </button>
                        ) : (
                          <span className="text-slate-400">Admin Utama</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.username)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Assign Validator */}
        {assignSubId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Tunjuk Validator Naskah Soal</h3>
              <p className="text-xs text-slate-600">
                Pilih Dosen Validator untuk memeriksa naskah pengajuan <strong>{assignSubId}</strong>.
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Pilih Dosen Validator:
                </label>
                <select
                  id="assign-select"
                  defaultValue={validators[0]?.nidn || ''}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {validators.map((v) => (
                    <option key={v.nidn} value={v.nidn}>
                      {v.name} (NIDN: {v.nidn})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setAssignSubId(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const select = document.getElementById('assign-select') as HTMLSelectElement;
                    if (select) handleAssignValidator(assignSubId, select.value);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                >
                  Tugaskan &amp; Kirim Notifikasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Finalize Admin */}
        {finalizeSubId && (() => {
          const sub = submissions.find((s) => s.id === finalizeSubId);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Pengesahan &amp; Serah Terima Soal Valid
                </h3>
                <p className="text-xs text-slate-600">
                  Validator <strong>{sub?.validatorName}</strong> telah menyetujui naskah soal dan melampirkan lembar validasi bertandatangan. Periksa dokumen sebelum diteruskan kembali ke dosen pengampu.
                </p>

                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-amber-700" />
                    <span>Lembar Validasi Validator:</span>
                  </div>
                  <p className="text-slate-800 font-semibold">{sub?.validationSheetName || 'Lembar_Validasi.pdf'}</p>
                  {sub?.notes && <p className="text-slate-600 italic">&quot;{sub.notes}&quot;</p>}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setFinalizeSubId(null)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleFinalizeAdmin(finalizeSubId)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sahkan &amp; Kirimkan ke Dosen</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Modal Add User */}
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Tambah Dosen Pengampu Baru</h3>
              <form onSubmit={handleSaveNewUser} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Nama Lengkap &amp; Gelar
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Contoh: Dr. Budi Prasetyo, M.Pd."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    NIDN (Digunakan untuk Login)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserNidn}
                    onChange={(e) => setNewUserNidn(e.target.value)}
                    placeholder="Contoh: 0511098801"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Kata Sandi Default
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="new-validator"
                    checked={newUserIsValidator}
                    onChange={(e) => setNewUserIsValidator(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="new-validator" className="text-xs text-slate-700 font-medium">
                    Tugaskan langsung sebagai Validator Soal
                  </label>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                  >
                    Simpan User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal History Log */}
        {historySubId && (() => {
          const sub = submissions.find((s) => s.id === historySubId);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Riwayat Aktivitas [{sub?.id}]
                  </h3>
                  <button
                    onClick={() => setHistorySubId(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {sub?.notifications?.map((n, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                      <div className="font-mono-tabular text-[10px] text-amber-700 font-semibold">{n.time}</div>
                      <div className="text-slate-700 mt-0.5">{n.text}</div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => setHistorySubId(null)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // RENDER: DOSEN / VALIDATOR DASHBOARD
  const mySubmissions = submissions.filter((s) => s.dosenNidn === currentUser.nidn);
  const assignedSubmissions = submissions.filter((s) => s.validatorNidn === currentUser.nidn);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {ToastContainer}

      {/* Header bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{currentUser.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono-tabular">NIDN: {currentUser.nidn}</span>
              {currentUser.isValidator && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-700 font-semibold">Validator Resmi</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTabDosen('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTabDosen === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengajuan Soal Saya
            </button>
            {currentUser.isValidator && (
              <button
                onClick={() => setActiveTabDosen('validator')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTabDosen === 'validator'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Tugas Review Validator</span>
                <span className="font-mono-tabular text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded-full">
                  {assignedSubmissions.filter((s) => s.status === 'Menunggu Review Validator').length}
                </span>
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTabDosen === 'list' ? (
        /* Dosen Submission List & Upload */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs h-fit">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Unggah Naskah Soal Ujian</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unggah naskah soal UTS atau UAS langsung ke sistem. File otomatis tersimpan di Google Drive dan tercatat di Google Sheets.
            </p>

            <form onSubmit={handleUploadSoal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Mata Kuliah Pengampu
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="">-- Pilih Mata Kuliah UST --</option>
                  {courses.map((c) => (
                    <option key={c.code} value={`${c.code}|${c.name}`}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Jenis Ujian
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as 'UTS' | 'UAS')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="UTS">UTS (Tengah)</option>
                    <option value="UAS">UAS (Akhir)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Dokumen Soal (Word / PDF)
                </label>
                <input
                  type="file"
                  required
                  accept=".doc,.docx,.pdf"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Mengunggah ke Drive...' : 'Kirim Soal ke Admin GKMP'}
              </button>
            </form>
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Pengajuan Soal Anda</h3>
              <span className="text-xs text-slate-500 font-mono-tabular">
                Total: {mySubmissions.length} Berkas
              </span>
            </div>

            {mySubmissions.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Belum ada naskah soal yang Anda ajukan. Gunakan formulir di sebelah kiri untuk mengunggah naskah pertama Anda.
              </div>
            ) : (
              mySubmissions.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 hover:border-amber-300 transition-colors shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {s.courseCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {s.courseName} ({s.examType})
                      </h4>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        s.status === 'Selesai Valid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'Revisi'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  {/* Metadata info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <strong className="text-slate-800">Validator:</strong>{' '}
                      {s.validatorName || 'Menunggu penunjukan Admin GKMP'}
                    </div>
                    <div>
                      <strong className="text-slate-800">Berkas Soal:</strong>{' '}
                      <button
                        onClick={() => handleDownloadFile(s.fileName, s.fileData, s.fileUrl)}
                        className="text-amber-700 font-semibold underline"
                      >
                        {s.fileName}
                      </button>
                    </div>
                  </div>

                  {/* If revision requested */}
                  {s.status === 'Revisi' && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                      <div className="font-bold text-rose-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Catatan Revisi dari Validator:</span>
                      </div>
                      <p className="text-rose-800 italic">&quot;{s.notes}&quot;</p>
                      <div className="pt-2 border-t border-rose-200/60 flex items-center gap-2">
                        <input
                          type="file"
                          accept=".doc,.docx,.pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUploadRevision(s.id, f);
                          }}
                          className="text-xs text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* If validated completely */}
                  {s.status === 'Selesai Valid' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Soal Dinyatakan VALID &amp; Resmi Disetujui</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Lengkap &amp; Selesai
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60">
                        <button
                          onClick={() =>
                            handleDownloadFile(
                              s.revisionFileName || s.fileName,
                              s.revisionFileData || s.fileData,
                              s.revisionFileUrl || s.fileUrl
                            )
                          }
                          className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Naskah Soal Valid</span>
                        </button>

                        <button
                          onClick={() =>
                            handleDownloadFile(
                              s.validationSheetName || 'Lembar_Validasi.pdf',
                              s.validationSheetData,
                              s.validationSheetUrl
                            )
                          }
                          className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Unduh Lembar Validasi (TTD)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Validator Panel */
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Panel Telaah &amp; Validasi Soal</h3>
            <p className="text-xs text-slate-500">
              Periksa naskah soal yang ditugaskan kepada Anda. Berikan catatan jika perlu revisi, atau nyatakan Valid dan lampirkan Lembar Validasi resmi.
            </p>
          </div>

          <div className="space-y-6">
            {assignedSubmissions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada naskah soal yang ditugaskan kepada Anda.
              </div>
            ) : (
              assignedSubmissions.map((s) => (
                <div
                  key={s.id}
                  className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                        {s.courseCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">
                        {s.courseName} ({s.examType})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Dosen Pengampu: <strong>{s.dosenName}</strong>
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 w-fit">
                      {s.status}
                    </span>
                  </div>

                  {/* Naskah Soal Download Link */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 block">Berkas Naskah Soal:</span>
                      <button
                        onClick={() =>
                          handleDownloadFile(
                            s.revisionFileName || s.fileName,
                            s.revisionFileData || s.fileData,
                            s.revisionFileUrl || s.fileUrl
                          )
                        }
                        className="text-amber-700 font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{s.revisionFileName || s.fileName}</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400">{s.semester}</span>
                  </div>

                  {/* Official Template Download Banner */}
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-blue-900 block">
                        Template Lembar Validasi Resmi UST:
                      </strong>
                      <span className="text-blue-700 text-[11px]">
                        Unduh format dokumen resmi Program Studi sebelum mengisi telaah &amp; tanda tangan.
                      </span>
                    </div>
                    <a
                      href={VALIDATION_TEMPLATE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Template (Google Docs)</span>
                    </a>
                  </div>

                  {/* Validator Decision Form */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Keputusan Telaah Validator:
                    </h5>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Catatan / Komentar (Wajib diisi jika memilih Revisi):
                      </label>
                      <textarea
                        rows={2}
                        value={validatorNotes[s.id] || s.notes || ''}
                        onChange={(e) =>
                          setValidatorNotes({ ...validatorNotes, [s.id]: e.target.value })
                        }
                        placeholder="Tuliskan masukan atau telaah soal..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Unggah Lembar Validasi Bertandatangan (PDF / Word):
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setValidatorSheetFiles({
                                ...validatorSheetFiles,
                                [s.id]: {
                                  name: file.name,
                                  base64: ev.target?.result as string,
                                },
                              });
                              showToast(`Berkas ${file.name} disiapkan untuk validasi.`);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleValidatorDecision(s.id, 'revisi')}
                        className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Kirim Revisi (Belum Sesuai)</span>
                      </button>

                      <button
                        onClick={() => handleValidatorDecision(s.id, 'valid')}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valid (Lengkap &amp; TTD)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
