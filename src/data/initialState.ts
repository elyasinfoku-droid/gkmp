import { Submission, User } from '../types';

export const DEFAULT_USERS: User[] = [
  {
    username: 'GKMP',
    password: '135791',
    role: 'admin',
    name: 'Tim GKMP Pend. Dasar UST',
    nidn: 'ADMIN01',
    isValidator: true,
    email: 'gkmp.dikdas@ustjogja.ac.id',
  },
  {
    username: '0512018801',
    password: '123456',
    role: 'dosen',
    name: 'Dr. Ki Hajar Madya, M.Pd.',
    nidn: '0512018801',
    isValidator: true,
    email: 'kihajar.madya@ustjogja.ac.id',
  },
  {
    username: '0525049002',
    password: '123456',
    role: 'dosen',
    name: 'Nyi Hj. Ratna Sari, M.Sc.',
    nidn: '0525049002',
    isValidator: true,
    email: 'ratna.sari@ustjogja.ac.id',
  },
  {
    username: '0508128503',
    password: '123456',
    role: 'dosen',
    name: 'Dr. Slamet Riyadi, M.Pd.',
    nidn: '0508128503',
    isValidator: false,
    email: 'slamet.riyadi@ustjogja.ac.id',
  },
];

export const DEFAULT_SUBMISSIONS: Submission[] = [
  {
    id: 'SUB-101',
    dosenNidn: '0508128503',
    dosenName: 'Dr. Slamet Riyadi, M.Pd.',
    courseCode: 'PSD 25101',
    courseName: 'Filsafat Ilmu Pendidikan',
    examType: 'UTS',
    semester: 'Genap 2025/2026',
    fileName: 'Soal_UTS_Filsafat_Ilmu_Slamet.docx',
    fileData: '#',
    status: 'Menunggu Penugasan Validator',
    validatorNidn: '',
    validatorName: '',
    notes: '',
    revisionFileName: '',
    validationSheetName: '',
    notifications: [
      {
        time: '25 Feb 2026 10:00',
        text: 'Soal berhasil diunggah dan diteruskan ke Admin GKMP.',
      },
    ],
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'SUB-102',
    dosenNidn: '0512018801',
    dosenName: 'Dr. Ki Hajar Madya, M.Pd.',
    courseCode: 'UST 25013',
    courseName: 'Pendidikan Ketamansiswaan',
    examType: 'UAS',
    semester: 'Genap 2025/2026',
    fileName: 'Soal_UAS_Ketamansiswaan_KiHajar.docx',
    fileData: '#',
    status: 'Menunggu Review Validator',
    validatorNidn: '0525049002',
    validatorName: 'Nyi Hj. Ratna Sari, M.Sc.',
    notes: '',
    revisionFileName: '',
    validationSheetName: '',
    notifications: [
      {
        time: '24 Feb 2026 09:15',
        text: 'Soal diunggah oleh Dr. Ki Hajar Madya, M.Pd.',
      },
      {
        time: '24 Feb 2026 11:30',
        text: 'Admin GKMP menugaskan Validator: Nyi Hj. Ratna Sari, M.Sc.',
      },
    ],
    createdAt: '2026-02-24T09:15:00Z',
  },
  {
    id: 'SUB-103',
    dosenNidn: '0525049002',
    dosenName: 'Nyi Hj. Ratna Sari, M.Sc.',
    courseCode: 'PSD 25104',
    courseName: 'Statistik Pendidikan',
    examType: 'UTS',
    semester: 'Genap 2025/2026',
    fileName: 'Soal_UTS_Statistik_Pendidikan.pdf',
    fileData: '#',
    status: 'Selesai Valid',
    validatorNidn: '0512018801',
    validatorName: 'Dr. Ki Hajar Madya, M.Pd.',
    notes: 'Soal telah sesuai dengan CPL dan rubrik penilaian Program Studi.',
    revisionFileName: '',
    validationSheetName: 'Lembar_Validasi_Statistik_Signed.pdf',
    validationSheetData: 'Simulasi Dokumen Lembar Validasi Tertandatangan',
    notifications: [
      {
        time: '20 Feb 2026 08:00',
        text: 'Soal berhasil diunggah ke sistem.',
      },
      {
        time: '20 Feb 2026 10:20',
        text: 'Admin GKMP menugaskan Dr. Ki Hajar Madya, M.Pd.',
      },
      {
        time: '21 Feb 2026 14:00',
        text: 'Validator menyatakan VALID dan mengunggah Lembar Validasi.',
      },
      {
        time: '22 Feb 2026 09:00',
        text: 'Admin GKMP memverifikasi dan meneruskan soal final ke Dosen pengampu.',
      },
    ],
    createdAt: '2026-02-20T08:00:00Z',
  },
];

export const VALIDATION_TEMPLATE_URL =
  'https://docs.google.com/document/d/1yLXfxsZ8EbWe96g-X36KifF3zSd5WsHp/edit?usp=sharing&ouid=107839986455260993727&rtpof=true&sd=true';
