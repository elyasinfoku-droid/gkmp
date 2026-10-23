import { SheetDefinition } from '../types';

export const SHEETS_SCHEMA: SheetDefinition[] = [
  {
    sheetName: 'DB_SUBMISSIONS',
    description: 'Tabel utama penyimpan seluruh data pengajuan naskah soal UTS/UAS, riwayat validator, file naskah, revisi, dan lembar validasi.',
    columns: [
      { letter: 'A', header: 'ID', type: 'String', description: 'ID unik berkas pengajuan', example: 'SUB-101' },
      { letter: 'B', header: 'Timestamp', type: 'DateTime', description: 'Waktu berkas diajukan', example: '2026-02-25 10:00:00' },
      { letter: 'C', header: 'Dosen_NIDN', type: 'String', description: 'NIDN Dosen pengampu', example: '0508128503' },
      { letter: 'D', header: 'Dosen_Nama', type: 'String', description: 'Nama lengkap dosen pengampu & gelar', example: 'Dr. Slamet Riyadi, M.Pd.' },
      { letter: 'E', header: 'Kode_MK', type: 'String', description: 'Kode mata kuliah UST', example: 'PSD 25101' },
      { letter: 'F', header: 'Nama_MK', type: 'String', description: 'Nama mata kuliah', example: 'Filsafat Ilmu Pendidikan' },
      { letter: 'G', header: 'Jenis_Ujian', type: 'String (UTS/UAS)', description: 'Tipe naskah soal ujian', example: 'UTS' },
      { letter: 'H', header: 'Semester', type: 'String', description: 'Tahun akademik dan semester berjalan', example: 'Genap 2025/2026' },
      { letter: 'I', header: 'File_Name', type: 'String', description: 'Nama file asli soal diunggah', example: 'Soal_UTS_Filsafat_Ilmu.docx' },
      { letter: 'J', header: 'File_Drive_URL', type: 'URL (Google Drive)', description: 'Link langsung file tersimpan di Google Drive', example: 'https://drive.google.com/file/d/1abc.../view' },
      { letter: 'K', header: 'Status', type: 'Enum', description: 'Status validasi soal (Menunggu Penugasan Validator, Menunggu Review Validator, Revisi, Menunggu Validasi Akhir Admin, Selesai Valid)', example: 'Menunggu Review Validator' },
      { letter: 'L', header: 'Validator_NIDN', type: 'String', description: 'NIDN validator yang ditugaskan Admin GKMP', example: '0512018801' },
      { letter: 'M', header: 'Validator_Nama', type: 'String', description: 'Nama validator yang ditugaskan', example: 'Dr. Ki Hajar Madya, M.Pd.' },
      { letter: 'N', header: 'Catatan_Revisi', type: 'Text', description: 'Komentar atau saran revisi dari validator', example: 'Perjelas rubrik soal nomor 4 dan sesuaikan CPL 3' },
      { letter: 'O', header: 'File_Revisi_Name', type: 'String', description: 'Nama file naskah revisi (jika ada)', example: 'Soal_UTS_Revisi_Slamet.docx' },
      { letter: 'P', header: 'File_Revisi_Drive_URL', type: 'URL (Google Drive)', description: 'Link Google Drive file naskah revisi', example: 'https://drive.google.com/file/d/2xyz.../view' },
      { letter: 'Q', header: 'Lembar_Validasi_Name', type: 'String', description: 'Nama file lembar validasi bertandatangan', example: 'Lembar_Validasi_Signed.pdf' },
      { letter: 'R', header: 'Lembar_Validasi_Drive_URL', type: 'URL (Google Drive)', description: 'Link Google Drive lembar validasi resmi', example: 'https://drive.google.com/file/d/3val.../view' },
    ],
  },
  {
    sheetName: 'DB_USERS',
    description: 'Tabel pengguna sistem: Admin GKMP, Dosen Pengampu, dan Dosen bertugas Validator.',
    columns: [
      { letter: 'A', header: 'Username', type: 'String', description: 'ID login (GKMP untuk Admin, NIDN untuk Dosen)', example: '0512018801' },
      { letter: 'B', header: 'Password', type: 'String', description: 'Kata sandi login akun', example: '123456' },
      { letter: 'C', header: 'Nama', type: 'String', description: 'Nama lengkap beserta gelar akademik', example: 'Dr. Ki Hajar Madya, M.Pd.' },
      { letter: 'D', header: 'Role', type: 'String (admin/dosen)', description: 'Peran akun dalam sistem', example: 'dosen' },
      { letter: 'E', header: 'Is_Validator', type: 'Boolean (TRUE/FALSE)', description: 'Apakah dosen ditugaskan sebagai reviewer validator', example: 'TRUE' },
      { letter: 'F', header: 'Email', type: 'String', description: 'Email untuk menerima notifikasi otomatis dari Apps Script', example: 'kihajar.madya@ustjogja.ac.id' },
    ],
  },
  {
    sheetName: 'DB_COURSES',
    description: 'Daftar master mata kuliah Magister Pendidikan Dasar Universitas Sarjanawiyata Tamansiswa (UST).',
    columns: [
      { letter: 'A', header: 'Kode_MK', type: 'String', description: 'Kode resmi mata kuliah', example: 'UST 25013' },
      { letter: 'B', header: 'Nama_MK', type: 'String', description: 'Nama lengkap mata kuliah', example: 'Pendidikan Ketamansiswaan' },
      { letter: 'C', header: 'SKS', type: 'Number', description: 'Bobot satuan kredit semester', example: '2' },
      { letter: 'D', header: 'Semester', type: 'String', description: 'Semester penawaran mata kuliah', example: '1' },
    ],
  },
  {
    sheetName: 'DB_LOGS',
    description: 'Audit trail / rekaman riwayat notifikasi & jejak aktivitas setiap aksi validator, dosen, dan admin.',
    columns: [
      { letter: 'A', header: 'Log_ID', type: 'String', description: 'ID unik baris riwayat aktivitas', example: 'LOG-881' },
      { letter: 'B', header: 'Submission_ID', type: 'String', description: 'ID berkas terkait di DB_SUBMISSIONS', example: 'SUB-101' },
      { letter: 'C', header: 'Timestamp', type: 'DateTime', description: 'Waktu riwayat dicatat', example: '2026-02-25 10:00:15' },
      { letter: 'D', header: 'Aktor', type: 'String', description: 'Nama pihak yang melakukan aksi (Dosen/Admin/Validator)', example: 'Admin GKMP' },
      { letter: 'E', header: 'Pesan_Aktivitas', type: 'Text', description: 'Keterangan isi perubahan status atau notifikasi', example: 'Soal ditugaskan ke Validator Dr. Ki Hajar Madya, M.Pd.' },
    ],
  },
  {
    sheetName: 'CONFIG_SETTINGS',
    description: 'Konfigurasi tautan folder Google Drive dan parameter aplikasi otomatis.',
    columns: [
      { letter: 'A', header: 'Setting_Key', type: 'String', description: 'Kunci konfigurasi', example: 'DRIVE_FOLDER_ID' },
      { letter: 'B', header: 'Setting_Value', type: 'String', description: 'Nilai konfigurasi (ID Folder Google Drive)', example: '1aB2cD3eFgHiJkLmNoPqRsTuVwXyZ' },
      { letter: 'C', header: 'Keterangan', type: 'Text', description: 'Penjelasan fungsi pengaturan', example: 'Folder induk Google Drive untuk menampung file upload' },
    ],
  },
];

export function generateCsvForSheet(sheetName: string): string {
  const sheet = SHEETS_SCHEMA.find((s) => s.sheetName === sheetName);
  if (!sheet) return '';
  const headers = sheet.columns.map((c) => `"${c.header}"`).join(',');
  const exampleRow = sheet.columns.map((c) => `"${c.example}"`).join(',');
  return `${headers}\n${exampleRow}`;
}
