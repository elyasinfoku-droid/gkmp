import { Submission, User, Course } from '../types';
import { DEFAULT_USERS, DEFAULT_SUBMISSIONS } from '../data/initialState';
import { DEFAULT_COURSES } from '../data/courses';

const LIVE_URL_KEY = 'siutasdikdas_apps_script_url';
const LOCAL_STORAGE_KEY = 'siutasdikdas_app_state';

export interface LocalState {
  users: User[];
  submissions: Submission[];
  courses: Course[];
  activeTabAdmin: 'overview' | 'users';
  activeTabDosen: 'list' | 'validator';
}

export function getLiveUrl(): string {
  return localStorage.getItem(LIVE_URL_KEY) || '';
}

export function setLiveUrl(url: string): void {
  localStorage.setItem(LIVE_URL_KEY, url.trim());
}

export function clearLiveUrl(): void {
  localStorage.removeItem(LIVE_URL_KEY);
}

export function getLocalState(): LocalState {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        users: parsed.users || DEFAULT_USERS,
        submissions: parsed.submissions || DEFAULT_SUBMISSIONS,
        courses: parsed.courses || DEFAULT_COURSES,
        activeTabAdmin: parsed.activeTabAdmin || 'overview',
        activeTabDosen: parsed.activeTabDosen || 'list',
      };
    } catch (e) {
      console.error('Failed to parse local state:', e);
    }
  }
  return {
    users: DEFAULT_USERS,
    submissions: DEFAULT_SUBMISSIONS,
    courses: DEFAULT_COURSES,
    activeTabAdmin: 'overview',
    activeTabDosen: 'list',
  };
}

export function saveLocalState(state: LocalState): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

// Test Live Google Apps Script connection
export async function testAppsScriptConnection(url: string): Promise<{ success: boolean; message: string; details?: any }> {
  if (!url || !url.startsWith('http')) {
    return { success: false, message: 'URL Apps Script tidak valid. Format harus diawali dengan https://script.google.com/...' };
  }

  try {
    const testUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Koneksi ke Google Apps Script dan Google Sheets berhasil!',
      details: data,
    };
  } catch (err: any) {
    // If CORS or redirect occurs (typical for Apps Script first setup), try POST ping
    try {
      const postRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ping' }),
      });
      const data = await postRes.json();
      return {
        success: true,
        message: 'Koneksi POST ke Google Apps Script aktif!',
        details: data,
      };
    } catch (postErr: any) {
      return {
        success: false,
        message: `Gagal terhubung ke Apps Script: ${err.message || err}. Pastikan Web App di-deploy dengan hak akses 'Anyone' (Siapa saja).`,
      };
    }
  }
}

// Execute an API action (Online Live or Fallback Local)
export async function executeApiAction(action: string, payload: any = {}): Promise<any> {
  const liveUrl = getLiveUrl();

  if (liveUrl) {
    try {
      const response = await fetch(liveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, ...payload }),
      });
      const json = await response.json();
      return json;
    } catch (err) {
      console.warn('Live API call failed, falling back to local simulation:', err);
    }
  }

  // Local Simulation execution
  return executeLocalAction(action, payload);
}

function executeLocalAction(action: string, payload: any): any {
  const state = getLocalState();

  switch (action) {
    case 'login': {
      const user = state.users.find(
        (u) =>
          u.username.toLowerCase() === String(payload.username).trim().toLowerCase() &&
          u.password === String(payload.password).trim()
      );
      if (user) {
        return { status: 'success', user };
      }
      return { status: 'error', message: 'Username / NIDN atau password salah!' };
    }

    case 'getData': {
      return {
        status: 'success',
        submissions: state.submissions,
        users: state.users,
        courses: state.courses,
      };
    }

    case 'uploadSoal': {
      const newSub: Submission = {
        id: 'SUB-' + Math.floor(100 + Math.random() * 900),
        dosenNidn: payload.dosenNidn,
        dosenName: payload.dosenName,
        courseCode: payload.courseCode,
        courseName: payload.courseName,
        examType: payload.examType,
        semester: payload.semester,
        fileName: payload.fileName,
        fileData: payload.fileBase64 || '#',
        fileUrl: payload.fileUrl || '#',
        status: 'Menunggu Penugasan Validator',
        validatorNidn: '',
        validatorName: '',
        notes: '',
        revisionFileName: '',
        validationSheetName: '',
        notifications: [
          {
            time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            text: 'Soal berhasil diunggah dan diteruskan ke Admin GKMP.',
          },
        ],
        createdAt: new Date().toISOString(),
      };
      state.submissions.unshift(newSub);
      saveLocalState(state);
      return { status: 'success', message: 'Naskah soal berhasil disimpan!', submission: newSub };
    }

    case 'assignValidator': {
      const sub = state.submissions.find((s) => s.id === payload.subId);
      if (sub) {
        sub.validatorNidn = payload.validatorNidn;
        sub.validatorName = payload.validatorName;
        sub.status = 'Menunggu Review Validator';
        sub.notifications.push({
          time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          text: `Soal ditugaskan ke Validator: ${payload.validatorName}. Notifikasi diteruskan ke validator dan dosen.`,
        });
        saveLocalState(state);
        return { status: 'success', message: `Validator ${payload.validatorName} berhasil ditugaskan!` };
      }
      return { status: 'error', message: 'Pengajuan tidak ditemukan.' };
    }

    case 'submitValidatorReview': {
      const sub = state.submissions.find((s) => s.id === payload.subId);
      if (sub) {
        if (payload.decision === 'valid') {
          sub.validationSheetName = payload.sheetName || 'Lembar_Validasi.pdf';
          sub.validationSheetData = payload.sheetBase64 || '';
          sub.status = 'Menunggu Validasi Akhir Admin';
          sub.notes = payload.notes || '';
          sub.notifications.push({
            time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            text: `Validator menyatakan VALID dan melampirkan Lembar Validasi (${payload.sheetName}). Diteruskan ke Admin GKMP.`,
          });
          saveLocalState(state);
          return { status: 'success', message: 'Keputusan VALID dan Lembar Validasi berhasil disimpan!' };
        } else {
          sub.status = 'Revisi';
          sub.notes = payload.notes;
          sub.notifications.push({
            time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            text: `Validator meminta REVISI. Catatan: "${payload.notes}". Notifikasi terkirim ke Dosen.`,
          });
          saveLocalState(state);
          return { status: 'success', message: 'Catatan Revisi berhasil dikirimkan ke Dosen pengampu.' };
        }
      }
      return { status: 'error', message: 'Pengajuan tidak ditemukan.' };
    }

    case 'uploadRevision': {
      const sub = state.submissions.find((s) => s.id === payload.subId);
      if (sub) {
        sub.revisionFileName = payload.fileName;
        sub.revisionFileData = payload.fileBase64;
        sub.fileData = payload.fileBase64;
        sub.status = 'Menunggu Review Validator';
        sub.notifications.push({
          time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          text: `Dosen mengunggah file revisi (${payload.fileName}) dan diteruskan kembali ke Validator.`,
        });
        saveLocalState(state);
        return { status: 'success', message: 'File revisi berhasil diunggah!' };
      }
      return { status: 'error', message: 'Pengajuan tidak ditemukan.' };
    }

    case 'finalizeAdmin': {
      const sub = state.submissions.find((s) => s.id === payload.subId);
      if (sub) {
        sub.status = 'Selesai Valid';
        sub.notifications.push({
          time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          text: 'Admin GKMP telah memeriksa lembar validasi. Soal dinyatakan Valid & Lengkap dan diteruskan ke Dosen pengampu.',
        });
        saveLocalState(state);
        return { status: 'success', message: 'Soal dan lembar validasi berhasil disahkan dan dikirim ke Dosen!' };
      }
      return { status: 'error', message: 'Pengajuan tidak ditemukan.' };
    }

    case 'manageUser': {
      if (payload.subAction === 'toggleValidator') {
        const u = state.users.find((x) => x.username === payload.username);
        if (u) {
          u.isValidator = !u.isValidator;
          saveLocalState(state);
          return { status: 'success', message: `Status validator ${u.name} diperbarui.` };
        }
      } else if (payload.subAction === 'addUser') {
        if (state.users.some((x) => x.username.toLowerCase() === payload.nidn.toLowerCase())) {
          return { status: 'error', message: 'NIDN sudah terdaftar!' };
        }
        const newUser: User = {
          username: payload.nidn,
          password: payload.password || '123456',
          role: 'dosen',
          name: payload.name,
          nidn: payload.nidn,
          isValidator: !!payload.isValidator,
          email: payload.email || '',
        };
        state.users.push(newUser);
        saveLocalState(state);
        return { status: 'success', message: `User ${newUser.name} berhasil ditambahkan!` };
      } else if (payload.subAction === 'deleteUser') {
        state.users = state.users.filter((x) => x.username !== payload.username);
        saveLocalState(state);
        return { status: 'success', message: 'User berhasil dihapus.' };
      }
      return { status: 'error', message: 'Aksi kelola user tidak valid.' };
    }

    default:
      return { status: 'error', message: 'Aksi lokal tidak dikenal.' };
  }
}
