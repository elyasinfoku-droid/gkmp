export interface GuideStep {
  number: string;
  title: string;
  shortDesc: string;
  badge: string;
  instructions: string[];
  tips: string[];
  warning?: string;
  actionSnippet?: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    number: '01',
    title: 'Buat Spreadsheet Database & Folder Google Drive',
    shortDesc: 'Menyiapkan wadah penyimpanan data pengajuan dan file naskah soal.',
    badge: 'Langkah Awal',
    instructions: [
      'Buka Google Drive Anda (gunakan akun Google / Google Workspace kampus Anda, misalnya elyasinfoku@gmail.com atau akun @ustjogja.ac.id).',
      'Klik tombol "+ Baru" (+ New) di pojok kiri atas -> pilih "Google Spreadsheet" (Google Sheets).',
      'Beri nama spreadsheet tersebut: "DATABASE_SIUTASDIKDAS_PENDIDIKAN_DASAR_UST".',
      'Biarkan spreadsheet kosong sejenak, karena tabel dan kolom akan dibuatkan otomatis oleh kode Apps Script di langkah 3!',
    ],
    tips: [
      'Disarankan membuat folder khusus di Google Drive dengan nama "SISTEM_VALIDASI_SOAL_UST" agar file database rapi.',
      'Folder penampung dokumen naskah soal Word & PDF akan otomatis dibuatkan oleh script dengan nama "SIUTASDIKDAS_Storage_UST".',
    ],
  },
  {
    number: '02',
    title: 'Buka Editor Apps Script & Buat File Code.gs serta Index.html',
    shortDesc: 'Memasukkan script backend database dan file antarmuka web app.',
    badge: 'Code.gs & Index.html',
    instructions: [
      'Pada Google Spreadsheet yang baru dibuat, klik menu atas: "Ekstensi" (Extensions) -> pilih "Apps Script".',
      'Jendela baru editor Google Apps Script akan terbuka. Ubah nama proyek di bagian atas menjadi "API_SIUTASDIKDAS_UST".',
      '1. Pasang File Code.gs: Buka file bawaan "Code.gs", hapus semua kode bawaan, lalu salin dan tempelkan kode dari tab "Code.gs" pada aplikasi ini.',
      '2. Buat File Index.html: Di panel sebelah kiri (sebelah tulisan "File"), klik tanda tambah (+) -> pilih "HTML" -> ketik nama persis: "Index" (tanpa tanda kutip, Apps Script otomatis menambahkan .html).',
      '3. Tempel Kode HTML: Buka file Index.html yang baru dibuat, hapus isinya, lalu salin dan tempelkan seluruh kode dari tab "Index.html" pada aplikasi ini.',
      'Klik ikon Disket ("Simpan proyek" / Ctrl+S).',
    ],
    tips: [
      'Membuat file Index.html di Apps Script memungkinkan seluruh tampilan SIUTASDIKDAS berjalan langsung di server Google tanpa server eksternal!',
      'Fungsi doGet() di Code.gs sudah diatur dengan setXFrameOptionsMode(ALLOWALL) sehingga dapat langsung disematkan ke Google Site.',
    ],
  },
  {
    number: '03',
    title: 'Jalankan Fungsi Inisialisasi Database (setupDatabase)',
    shortDesc: 'Satu klik untuk otomatis membuat 5 sheet database dan folder Google Drive.',
    badge: 'Auto Installer',
    instructions: [
      'Di bagian atas toolbar Apps Script, perhatikan dropdown pemilih fungsi (di sebelah tombol Debug dan Jalankan).',
      'Pilih fungsi: "setupDatabase".',
      'Klik tombol "▷ Jalankan" (Run).',
      'Google akan memunculkan jendela pop-up "Otorisasi Diperlukan" (Authorization Required).',
      'Klik tombol "Tinjau Izin" (Review permissions) -> Pilih akun Google Anda.',
      'Akan muncul peringatan "Google belum memverifikasi aplikasi ini" (Google hasn\'t verified this app). JANGAN KHAWATIR, ini wajar untuk script pribadi!',
      'Klik tulisan kecil "Lanjutan" (Advanced) di kiri bawah -> lalu klik "Buka API_SIUTASDIKDAS_UST (tidak aman)" / "Go to ... (unsafe)".',
      'Klik tombol "Izinkan" (Allow).',
      'Tunggu 5 detik hingga log di bagian bawah menampilkan: "✅ Inisialisasi Database Google Sheets & Folder Drive Sukses!".',
    ],
    tips: [
      'Buka kembali tab spreadsheet Anda. Anda akan melihat 5 sheet otomatis tercipta: DB_SUBMISSIONS, DB_USERS, DB_COURSES, DB_LOGS, CONFIG_SETTINGS lengkap dengan header warna oranye khas UST dan data default!',
    ],
    warning: 'Langkah otorisasi "Lanjutan -> Buka ... (tidak aman)" hanya perlu dilakukan 1 kali saja untuk memberikan izin script membaca spreadsheet dan menyimpan file ke Google Drive Anda.',
  },
  {
    number: '04',
    title: 'Terapkan (Deploy) Sebagai Aplikasi Web (Web App)',
    shortDesc: 'Mempublikasikan endpoint online agar bisa diakses oleh Google Site.',
    badge: 'Deployment Online',
    instructions: [
      'Di pojok kanan atas jendela Apps Script, klik tombol biru: "Terapkan" (Deploy) -> pilih "Penerapan baru" (New deployment).',
      'Klik ikon Gerigi (⚙️) di sebelah "Pilih jenis" -> pilih "Aplikasi web" (Web app).',
      'Isi kolom konfigurasi sebagai berikut:',
      '• Deskripsi: "SIUTASDIKDAS Web App Produksi v1.0"',
      '• Jalankan sebagai (Execute as): "Saya (emailanda@gmail.com)" (PENTING! Agar naskah soal tersimpan menggunakan kapasitas Drive Anda)',
      '• Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) (PENTING! Agar dosen dan validator dapat mengunggah soal tanpa kendala login ganda)',
      'Klik tombol "Terapkan" (Deploy).',
      'Salin (Copy) "URL Aplikasi Web" yang dihasilkan (format: https://script.google.com/macros/s/.../exec).',
    ],
    tips: [
      'Simpan URL Aplikasi Web tersebut dengan aman. URL inilah yang akan kita sematkan ke Google Site atau masukkan ke box "Koneksi Live" aplikasi ini!',
    ],
    warning: 'Jika di masa mendatang Anda mengedit kode Apps Script, Anda WAJIB membuat penerapan baru (Deploy -> Kelola Penerapan -> Ikon Pensil -> Versi Baru) agar perubahan aktif!',
  },
  {
    number: '05',
    title: 'Sematkan & Pasang di Google Site',
    shortDesc: 'Menampilkan antarmuka SIUTASDIKDAS langsung di halaman web Google Sites Anda.',
    badge: 'Google Site Live',
    instructions: [
      'Buka situs Anda di Google Sites (sites.google.com).',
      'Pilih halaman tempat aplikasi ingin ditampilkan (misal halaman "Validasi Soal UTS/UAS").',
      'Di panel sebelah kanan, klik menu "Sisipkan" (Insert) -> pilih ikon "< > Sematkan" (Embed).',
      'Anda memiliki 2 metode yang sama-sama bagus:',
      '• CARA A (Berdasarkan URL): Pilih tab "Berdasarkan URL", tempelkan URL Web App dari langkah 4, lalu klik "Sisipkan".',
      '• CARA B (Sematkan Kode / Responsive Iframe): Pilih tab "Sematkan kode", salin kode HTML Iframe dari tab "Kode Sematkan Google Site", lalu klik "Berikutnya" -> "Sisipkan".',
      'Tarik kotak frame di editor Google Site hingga lebar maksimal dan tinggi sekitar 900px - 1000px agar tampilan leluasa.',
      'Klik tombol "Publikasikan" (Publish) di pojok kanan atas Google Site!',
    ],
    tips: [
      'Google Site sekarang sudah memiliki sistem validasi soal UTS & UAS resmi dengan database Google Sheets yang bekerja 24 jam nonstop!',
    ],
  },
  {
    number: '06',
    title: 'Uji Coba Alur Kerja Sistem (Workflow Verification)',
    shortDesc: 'Memastikan seluruh hak akses dan notifikasi bekerja sempurna.',
    badge: 'Uji Coba',
    instructions: [
      '1. Uji Login Dosen: Masuk dengan NIDN salah satu dosen (cth: 0508128503 / pass: 123456).',
      '2. Uji Upload Soal: Unggah salah satu file dokumen soal Word/PDF. Pastikan baris baru otomatis bertambah di Google Sheets "DB_SUBMISSIONS" dan file tersimpan di Google Drive.',
      '3. Uji Admin GKMP: Logout dan masuk sebagai Admin (GKMP / pass: 135791). Tunjuk Dosen Validator untuk soal tersebut.',
      '4. Uji Validator: Masuk sebagai validator terpilih (cth: 0512018801 / pass: 123456). Buka "Tugas Review Validator", unduh soal, lalu berikan keputusan (Valid dan lampirkan scan Lembar Validasi, atau Revisi).',
      '5. Uji Finalisasi Admin: Admin GKMP memverifikasi kelengkapan lembar validasi lalu mengklik "Teruskan Soal Valid & Lembar Validasi ke Dosen".',
      '6. Dosen dapat langsung mengunduh Naskah Soal Valid dan Lembar Validasi resmi bertandatangan!',
    ],
    tips: [
      'Notifikasi email otomatis terkirim di setiap tahap ke alamat email masing-masing yang terdaftar di sheet DB_USERS.',
    ],
  },
];

export const TROUBLESHOOTING_FAQS = [
  {
    q: 'Mengapa muncul tulisan "Google hasn\'t verified this app" saat menjalankan setupDatabase?',
    a: 'Ini adalah mekanisme pengamanan standar Google karena script dibuat oleh Anda sendiri (bukan aplikasi publik di Google Workspace Marketplace). Cukup klik "Advanced" (Lanjutan) lalu klik "Go to API_SIUTASDIKDAS_UST (unsafe)" lalu "Allow". Ini 100% aman karena Anda adalah pemilik script dan datanya.',
  },
  {
    q: 'Bagaimana cara menambahkan dosen atau validator baru?',
    a: 'Ada 2 cara: 1) Melalui antarmuka Admin GKMP di menu "Kelola User & Validator", atau 2) Langsung membuka spreadsheet tabel "DB_USERS" dan menambahkan baris baru dengan NIDN, Password, Nama, Role (dosen), dan Is_Validator (TRUE/FALSE).',
  },
  {
    q: 'Apakah dosen perlu memiliki akun editor di spreadsheet?',
    a: 'TIDAK PERLU! Karena Anda memilih opsi "Execute as: Me" dan "Who has access: Anyone", dosen dan validator hanya berinteraksi melalui Google Site. Database Google Sheets tetap aman dan terlindungi dari perubahan yang tidak disengaja.',
  },
  {
    q: 'Di mana file naskah soal dan lembar validasi tersimpan?',
    a: 'File tersimpan otomatis di Google Drive pemilik script dalam folder "SIUTASDIKDAS_Storage_UST". Link Google Drive yang dapat dibuka langsung dicatat di kolom J, P, dan R pada sheet DB_SUBMISSIONS.',
  },
  {
    q: 'Bagaimana jika saya melakukan perubahan pada kode Code.gs?',
    a: 'Setiap kali mengubah kode Apps Script, Anda harus membuat versi baru: Klik "Terapkan" -> "Kelola penerapan" -> klik ikon Pensil (Edit) -> pada Versi pilih "Versi baru" -> klik "Terapkan". URL Web App akan tetap sama dan otomatis memperbarui aplikasi Anda di Google Site.',
  },
];
