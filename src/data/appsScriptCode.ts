export const APPS_SCRIPT_CODE_GS = `/**
 * =========================================================================
 * SIUTASDIKDAS - BACKEND GOOGLE APPS SCRIPT & GOOGLE SHEETS DATABASE ENGINE
 * Magister Pendidikan Dasar - Universitas Sarjanawiyata Tamansiswa (UST)
 * =========================================================================
 * File ini ditempelkan pada Google Apps Script (Ekstensi > Apps Script).
 * 
 * FITUR UTAMA:
 * 1. setupDatabase()       : Sekali klik otomatis membuat 5 Tabel Sheet & Folder Google Drive.
 * 2. doGet(e) & doPost(e)  : Endpoint REST API & Web App untuk Google Sites.
 * 3. File Upload Engine    : Menyimpan naskah soal Word/PDF langsung ke Google Drive.
 * 4. Notifikasi Email      : Otomatis kirim email ke Admin, Dosen, dan Validator.
 */

// Konfigurasi Nama Sheet Database
const SHEET_SUBMISSIONS = "DB_SUBMISSIONS";
const SHEET_USERS = "DB_USERS";
const SHEET_COURSES = "DB_COURSES";
const SHEET_LOGS = "DB_LOGS";
const SHEET_CONFIG = "CONFIG_SETTINGS";

// Folder Utama di Google Drive untuk menyimpan dokumen soal & lembar validasi
const DRIVE_ROOT_FOLDER_NAME = "SIUTASDIKDAS_Storage_UST";

/**
 * -------------------------------------------------------------------------
 * 1. FUNGSI SETUP OTOMATIS (JALANKAN SEKALI SAAT PERTAMA KALI)
 * Klik 'Pilih fungsi yang akan dijalankan' -> 'setupDatabase' -> Klik 'Jalankan'
 * -------------------------------------------------------------------------
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup Folder Google Drive
  let folderId = "";
  const existingFolders = DriveApp.getFoldersByName(DRIVE_ROOT_FOLDER_NAME);
  if (existingFolders.hasNext()) {
    folderId = existingFolders.next().getId();
  } else {
    const newFolder = DriveApp.createFolder(DRIVE_ROOT_FOLDER_NAME);
    newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    folderId = newFolder.getId();
  }

  // 2. Setup Tabel DB_SUBMISSIONS
  let subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  if (!subSheet) {
    subSheet = ss.insertSheet(SHEET_SUBMISSIONS);
    subSheet.appendRow([
      "ID", "Timestamp", "Dosen_NIDN", "Dosen_Nama", "Kode_MK", "Nama_MK",
      "Jenis_Ujian", "Semester", "File_Name", "File_Drive_URL", "Status",
      "Validator_NIDN", "Validator_Nama", "Catatan_Revisi", "File_Revisi_Name",
      "File_Revisi_Drive_URL", "Lembar_Validasi_Name", "Lembar_Validasi_Drive_URL"
    ]);
    formatHeader(subSheet);
  }

  // 3. Setup Tabel DB_USERS
  let userSheet = ss.getSheetByName(SHEET_USERS);
  if (!userSheet) {
    userSheet = ss.insertSheet(SHEET_USERS);
    userSheet.appendRow(["Username", "Password", "Nama", "Role", "Is_Validator", "Email"]);
    formatHeader(userSheet);
    // Tambah Akun Default
    userSheet.appendRow(["GKMP", "135791", "Tim GKMP Pend. Dasar UST", "admin", "TRUE", Session.getActiveUser().getEmail() || "gkmp.dikdas@ustjogja.ac.id"]);
    userSheet.appendRow(["0512018801", "123456", "Dr. Ki Hajar Madya, M.Pd.", "dosen", "TRUE", "kihajar.madya@ustjogja.ac.id"]);
    userSheet.appendRow(["0525049002", "123456", "Nyi Hj. Ratna Sari, M.Sc.", "dosen", "TRUE", "ratna.sari@ustjogja.ac.id"]);
    userSheet.appendRow(["0508128503", "123456", "Dr. Slamet Riyadi, M.Pd.", "dosen", "FALSE", "slamet.riyadi@ustjogja.ac.id"]);
  }

  // 4. Setup Tabel DB_COURSES
  let courseSheet = ss.getSheetByName(SHEET_COURSES);
  if (!courseSheet) {
    courseSheet = ss.insertSheet(SHEET_COURSES);
    courseSheet.appendRow(["Kode_MK", "Nama_MK", "SKS", "Semester"]);
    formatHeader(courseSheet);
    // Tambah Master Mata Kuliah UST
    const defaultCourses = [
      ["UST 25013", "Pendidikan Ketamansiswaan", 2, "1"],
      ["PSD 25101", "Filsafat Ilmu Pendidikan", 3, "1"],
      ["PSD 25102", "Pengembangan Kurikulum Pendidikan Dasar", 3, "1"],
      ["PSD 25103", "Psikologi Pendidikan dan Perkembangan", 3, "1"],
      ["PSD 25104", "Statistik Pendidikan", 3, "1"],
      ["PSD 25105", "Metodologi Penelitian Pendidikan", 3, "2"],
      ["PSD 25106", "Penulisan Artikel Ilmiah", 2, "2"],
      ["PSD 25107", "Manajemen dan Kebijakan Pendidikan Dasar", 3, "2"],
      ["PSD 25208", "Pengembangan Pembelajaran IPA SD", 3, "2"],
      ["PSD 25209", "Pengembangan Pembelajaran IPS SD", 3, "2"],
      ["PSD 25210", "Pengembangan Pembelajaran Matematika SD", 3, "2"],
      ["PSD 25211", "Pengembangan Pembelajaran Pendidikan Pancasila SD", 3, "2"],
      ["PSD 25212", "Pengembangan Pembelajaran Bahasa dan Sastra Indonesia SD", 3, "2"],
      ["PSD 25213", "Pengembangan Pembelajaran Seni Budaya dan Prakarya SD", 3, "2"],
      ["PSD 25214", "Asesmen Pendidikan", 3, "3"],
      ["PSD 25315", "Pengembangan Pembelajaran Berbasis Teknologi Digital di SD", 3, "3"],
      ["PSD 25316", "Pendidikan Anak Berkebutuhan Khusus", 3, "3"],
      ["PSD 25317", "Literasi Multidimensional", 2, "3"],
      ["PSD 25318", "Pengembangan Pembelajaran Berbasis Muatan Lokal di SD", 2, "3"],
      ["PSD 25319", "English for Children", 2, "3"],
      ["PSD 25320", "Seminar Proposal Tugas Akhir Magister", 2, "3"],
      ["PSD 25321", "Tugas Akhir Magister", 6, "4"]
    ];
    defaultCourses.forEach(c => courseSheet.appendRow(c));
  }

  // 5. Setup Tabel DB_LOGS
  let logSheet = ss.getSheetByName(SHEET_LOGS);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_LOGS);
    logSheet.appendRow(["Log_ID", "Submission_ID", "Timestamp", "Aktor", "Pesan_Aktivitas"]);
    formatHeader(logSheet);
    logSheet.appendRow(["LOG-001", "SYSTEM", new Date().toISOString(), "System Admin", "Inisialisasi Database SIUTASDIKDAS Berhasil."]);
  }

  // 6. Setup Tabel CONFIG_SETTINGS
  let configSheet = ss.getSheetByName(SHEET_CONFIG);
  if (!configSheet) {
    configSheet = ss.insertSheet(SHEET_CONFIG);
    configSheet.appendRow(["Setting_Key", "Setting_Value", "Keterangan"]);
    formatHeader(configSheet);
    configSheet.appendRow(["DRIVE_FOLDER_ID", folderId, "ID Folder Google Drive untuk menampung file upload"]);
    configSheet.appendRow(["APP_TITLE", "SIUTASDIKDAS UST", "Judul Aplikasi Validasi Soal"]);
    configSheet.appendRow(["ADMIN_EMAIL", Session.getActiveUser().getEmail() || "gkmp.dikdas@ustjogja.ac.id", "Email Admin GKMP untuk notifikasi"]);
  }

  Logger.log("✅ Inisialisasi Database Google Sheets & Folder Drive Sukses!");
}

function formatHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground("#D97706");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

/**
 * -------------------------------------------------------------------------
 * 2. ENDPOINT GET (Untuk Ping Tes Koneksi atau Menampilkan UI Sederhana)
 * -------------------------------------------------------------------------
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action);

  if (action === 'ping') {
    return createJsonResponse({
      status: "success",
      message: "Koneksi Google Apps Script & Google Sheets Aktif!",
      app: "SIUTASDIKDAS UST",
      timestamp: new Date().toISOString(),
      spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
    });
  }

  if (action === 'getData') {
    return handleGetData();
  }

  // Melayani antarmuka lengkap dari file Index.html untuk disematkan di Google Sites
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle("SIUTASDIKDAS - Sistem Validasi Soal UST")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch(err) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;text-align:center;padding:50px;">' +
      '<h2>File Index.html Belum Dibuat</h2>' +
      '<p>Klik tanda <strong>+</strong> di Apps Script > pilih <strong>HTML</strong> > beri nama <strong>Index</strong> > tempelkan kode Index.html yang disediakan.</p>' +
      '</div>'
    ).setTitle("SIUTASDIKDAS API");
  }
}

/**
 * Wrapper API untuk pemanggilan langsung dari Index.html via google.script.run
 */
function apiLogin(username, password) {
  return JSON.parse(handleLogin(username, password).getContent());
}
function apiGetData() {
  return JSON.parse(handleGetData().getContent());
}
function apiUploadSoal(payload) {
  return JSON.parse(handleUploadSoal(payload).getContent());
}
function apiAssignValidator(payload) {
  return JSON.parse(handleAssignValidator(payload).getContent());
}
function apiSubmitValidatorReview(payload) {
  return JSON.parse(handleSubmitValidatorReview(payload).getContent());
}
function apiUploadRevision(payload) {
  return JSON.parse(handleUploadRevision(payload).getContent());
}
function apiFinalizeAdmin(payload) {
  return JSON.parse(handleFinalizeAdmin(payload).getContent());
}
function apiManageUser(payload) {
  return JSON.parse(handleManageUser(payload).getContent());
}

/**
 * -------------------------------------------------------------------------
 * 3. ENDPOINT POST (Untuk Operasi Login, Upload Soal, Review, dan Finalisasi)
 * -------------------------------------------------------------------------
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;

    switch (action) {
      case 'ping':
        return createJsonResponse({ status: 'success', message: 'Backend connected!' });

      case 'login':
        return handleLogin(payload.username, payload.password);

      case 'getData':
        return handleGetData();

      case 'uploadSoal':
        return handleUploadSoal(payload);

      case 'assignValidator':
        return handleAssignValidator(payload);

      case 'submitValidatorReview':
        return handleSubmitValidatorReview(payload);

      case 'uploadRevision':
        return handleUploadRevision(payload);

      case 'finalizeAdmin':
        return handleFinalizeAdmin(payload);

      case 'manageUser':
        return handleManageUser(payload);

      default:
        return createJsonResponse({ status: 'error', message: 'Aksi tidak dikenal: ' + action });
    }
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Kesalahan server Apps Script: ' + err.toString()
    });
  }
}

/**
 * -------------------------------------------------------------------------
 * 4. HANDLER IMPLEMENTASI CRUD & DRIVE
 * -------------------------------------------------------------------------
 */

// A. Login
function handleLogin(username, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(SHEET_USERS);
  if (!userSheet) return createJsonResponse({ status: 'error', message: 'Tabel DB_USERS tidak ditemukan. Jalankan setupDatabase() terlebih dahulu.' });

  const data = userSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowUser = String(data[i][0]).trim().toLowerCase();
    const rowPass = String(data[i][1]).trim();
    if (rowUser === String(username).trim().toLowerCase() && rowPass === String(password).trim()) {
      return createJsonResponse({
        status: 'success',
        user: {
          username: data[i][0],
          name: data[i][2],
          role: data[i][3],
          isValidator: data[i][4] === true || String(data[i][4]).toUpperCase() === 'TRUE',
          nidn: data[i][0],
          email: data[i][5] || ''
        }
      });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Username atau password salah!' });
}

// B. Ambil Seluruh Data (Submissions, Courses, Users, Logs)
function handleGetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Ambil Submissions
  const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  const submissions = [];
  if (subSheet) {
    const data = subSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      submissions.push({
        id: data[i][0],
        createdAt: data[i][1],
        dosenNidn: String(data[i][2]),
        dosenName: data[i][3],
        courseCode: data[i][4],
        courseName: data[i][5],
        examType: data[i][6],
        semester: data[i][7],
        fileName: data[i][8],
        fileUrl: data[i][9],
        status: data[i][10],
        validatorNidn: String(data[i][11] || ''),
        validatorName: data[i][12] || '',
        notes: data[i][13] || '',
        revisionFileName: data[i][14] || '',
        revisionFileUrl: data[i][15] || '',
        validationSheetName: data[i][16] || '',
        validationSheetUrl: data[i][17] || '',
        notifications: getLogsForSubmission(data[i][0])
      });
    }
  }

  // Ambil Users
  const userSheet = ss.getSheetByName(SHEET_USERS);
  const users = [];
  if (userSheet) {
    const data = userSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      users.push({
        username: data[i][0],
        name: data[i][2],
        role: data[i][3],
        isValidator: data[i][4] === true || String(data[i][4]).toUpperCase() === 'TRUE',
        nidn: data[i][0],
        email: data[i][5] || ''
      });
    }
  }

  // Ambil Courses
  const courseSheet = ss.getSheetByName(SHEET_COURSES);
  const courses = [];
  if (courseSheet) {
    const data = courseSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      courses.push({
        code: data[i][0],
        name: data[i][1],
        sks: data[i][2],
        semester: data[i][3]
      });
    }
  }

  return createJsonResponse({
    status: 'success',
    submissions: submissions.reverse(),
    users: users,
    courses: courses
  });
}

// C. Upload Soal Baru & Simpan ke Google Drive
function handleUploadSoal(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  const folder = getStorageFolder();

  // Simpan File ke Google Drive
  let fileUrl = "#";
  if (payload.fileBase64 && payload.fileName) {
    fileUrl = saveBase64ToDrive(folder, payload.fileName, payload.fileBase64);
  }

  const subId = "SUB-" + Math.floor(100 + Math.random() * 900);
  const timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

  subSheet.appendRow([
    subId,
    timestamp,
    payload.dosenNidn,
    payload.dosenName,
    payload.courseCode,
    payload.courseName,
    payload.examType,
    payload.semester,
    payload.fileName,
    fileUrl,
    "Menunggu Penugasan Validator",
    "", "", "", "", "", "", ""
  ]);

  addLog(subId, payload.dosenName, "Soal berhasil diunggah langsung ke sistem dan diteruskan ke Admin GKMP.");

  // Kirim Notifikasi Email ke Admin GKMP
  sendNotificationEmail(
    getConfigValue("ADMIN_EMAIL", "gkmp.dikdas@ustjogja.ac.id"),
    "[SIUTASDIKDAS] Naskah Soal Baru Menunggu Penugasan Validator (" + payload.courseName + ")",
    "Yth. Tim GKMP Pendidikan Dasar UST,\\n\\n" +
    "Dosen " + payload.dosenName + " baru saja mengunggah naskah soal ujian:\\n" +
    "- Mata Kuliah: " + payload.courseCode + " - " + payload.courseName + "\\n" +
    "- Jenis Ujian: " + payload.examType + " (" + payload.semester + ")\\n" +
    "- Tautan Berkas: " + fileUrl + "\\n\\n" +
    "Mohon segera membuka SIUTASDIKDAS di Google Site untuk menunjuk validator."
  );

  return createJsonResponse({ status: 'success', message: 'Soal berhasil diunggah dan disimpan ke database!', subId: subId, fileUrl: fileUrl });
}

// D. Tunjuk Validator oleh Admin
function handleAssignValidator(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  const data = subSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.subId) {
      const rowIndex = i + 1;
      subSheet.getRange(rowIndex, 11).setValue("Menunggu Review Validator"); // Status
      subSheet.getRange(rowIndex, 12).setValue(payload.validatorNidn);      // Validator NIDN
      subSheet.getRange(rowIndex, 13).setValue(payload.validatorName);      // Validator Nama

      addLog(payload.subId, "Admin GKMP", "Soal ditugaskan ke Validator: " + payload.validatorName);

      // Cari email validator
      const validatorEmail = getUserEmailByNidn(payload.validatorNidn);
      if (validatorEmail) {
        sendNotificationEmail(
          validatorEmail,
          "[SIUTASDIKDAS] Penugasan Validator Soal: " + data[i][5],
          "Yth. " + payload.validatorName + ",\\n\\n" +
          "Anda telah ditugaskan sebagai Validator untuk naskah soal:\\n" +
          "- Mata Kuliah: " + data[i][4] + " - " + data[i][5] + " (" + data[i][6] + ")\\n" +
          "- Dosen Pengampu: " + data[i][3] + "\\n\\n" +
          "Silakan login ke SIUTASDIKDAS melalui Google Site untuk melakukan telaah dan validasi."
        );
      }

      return createJsonResponse({ status: 'success', message: 'Validator berhasil ditugaskan!' });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Data submission tidak ditemukan.' });
}

// E. Review Validator (Revisi atau Valid + Upload Lembar Validasi)
function handleSubmitValidatorReview(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  const data = subSheet.getDataRange().getValues();
  const folder = getStorageFolder();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.subId) {
      const rowIndex = i + 1;
      const dosenEmail = getUserEmailByNidn(data[i][2]);

      if (payload.decision === 'valid') {
        // Simpan Lembar Validasi ke Drive
        let sheetUrl = "#";
        if (payload.sheetBase64 && payload.sheetName) {
          sheetUrl = saveBase64ToDrive(folder, "Lembar_Validasi_" + payload.subId + "_" + payload.sheetName, payload.sheetBase64);
        }

        subSheet.getRange(rowIndex, 11).setValue("Menunggu Validasi Akhir Admin");
        subSheet.getRange(rowIndex, 14).setValue(payload.notes || "");
        subSheet.getRange(rowIndex, 17).setValue(payload.sheetName || "Lembar_Validasi.pdf");
        subSheet.getRange(rowIndex, 18).setValue(sheetUrl);

        addLog(payload.subId, data[i][12], "Validator menyatakan VALID dan melampirkan Lembar Validasi. Diteruskan ke Admin GKMP.");

        // Kirim Notifikasi ke Admin
        sendNotificationEmail(
          getConfigValue("ADMIN_EMAIL", "gkmp.dikdas@ustjogja.ac.id"),
          "[SIUTASDIKDAS] Soal Dinyatakan Valid oleh Validator (" + data[i][5] + ")",
          "Yth. Tim GKMP,\\n\\n" +
          "Validator " + data[i][12] + " telah menyetujui soal " + data[i][5] + " dan melampirkan lembar validasi.\\n" +
          "Mohon lakukan verifikasi akhir sebelum diteruskan ke dosen."
        );

        return createJsonResponse({ status: 'success', message: 'Keputusan VALID dan Lembar Validasi tersimpan di Google Drive!' });
      } else {
        // Keputusan REVISI
        subSheet.getRange(rowIndex, 11).setValue("Revisi");
        subSheet.getRange(rowIndex, 14).setValue(payload.notes);

        addLog(payload.subId, data[i][12], "Validator meminta REVISI. Catatan: " + payload.notes);

        if (dosenEmail) {
          sendNotificationEmail(
            dosenEmail,
            "[SIUTASDIKDAS] Catatan Revisi Naskah Soal: " + data[i][5],
            "Yth. " + data[i][3] + ",\\n\\n" +
            "Naskah soal " + data[i][5] + " memerlukan revisi sesuai catatan validator (" + data[i][12] + "):\\n\\n" +
            "Catatan: \\"" + payload.notes + "\\"\\n\\n" +
            "Silakan unggah naskah revisi di SIUTASDIKDAS Google Site."
          );
        }

        return createJsonResponse({ status: 'success', message: 'Status Revisi dikirimkan ke Dosen pengampu.' });
      }
    }
  }
  return createJsonResponse({ status: 'error', message: 'Data submission tidak ditemukan.' });
}

// F. Upload File Revisi oleh Dosen
function handleUploadRevision(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  const data = subSheet.getDataRange().getValues();
  const folder = getStorageFolder();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.subId) {
      const rowIndex = i + 1;
      let revUrl = "#";
      if (payload.fileBase64 && payload.fileName) {
        revUrl = saveBase64ToDrive(folder, "Revisi_" + payload.subId + "_" + payload.fileName, payload.fileBase64);
      }

      subSheet.getRange(rowIndex, 11).setValue("Menunggu Review Validator");
      subSheet.getRange(rowIndex, 15).setValue(payload.fileName);
      subSheet.getRange(rowIndex, 16).setValue(revUrl);

      addLog(payload.subId, data[i][3], "Dosen mengunggah file revisi (" + payload.fileName + ") dan diteruskan ke Validator.");

      return createJsonResponse({ status: 'success', message: 'File revisi berhasil diunggah!' });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Data submission tidak ditemukan.' });
}

// G. Verifikasi & Finalisasi oleh Admin GKMP
function handleFinalizeAdmin(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const subSheet = ss.getSheetByName(SHEET_SUBMISSIONS);
  const data = subSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.subId) {
      const rowIndex = i + 1;
      subSheet.getRange(rowIndex, 11).setValue("Selesai Valid");

      addLog(payload.subId, "Admin GKMP", "Admin GKMP telah memeriksa lembar validasi. Soal dinyatakan Valid & Lengkap.");

      const dosenEmail = getUserEmailByNidn(data[i][2]);
      if (dosenEmail) {
        sendNotificationEmail(
          dosenEmail,
          "[SIUTASDIKDAS - RESMI] Soal Anda Telah Selesai Divalidasi (" + data[i][5] + ")",
          "Yth. " + data[i][3] + ",\\n\\n" +
          "Selamat! Naskah soal ujian untuk mata kuliah " + data[i][5] + " telah resmi dinyatakan VALID dan disetujui.\\n\\n" +
          "Anda dapat mengunduh berkas soal final dan Lembar Validasi bertandatangan resmi melalui portal SIUTASDIKDAS.\\n\\n" +
          "Salam,\\nTim GKMP Pendidikan Dasar UST"
        );
      }

      return createJsonResponse({ status: 'success', message: 'Soal dan lembar validasi lengkap berhasil disahkan dan diteruskan ke Dosen!' });
    }
  }
  return createJsonResponse({ status: 'error', message: 'Data submission tidak ditemukan.' });
}

// H. Kelola User
function handleManageUser(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(SHEET_USERS);
  const data = userSheet.getDataRange().getValues();

  if (payload.subAction === 'toggleValidator') {
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(payload.username)) {
        const current = data[i][4] === true || String(data[i][4]).toUpperCase() === 'TRUE';
        userSheet.getRange(i + 1, 5).setValue(!current);
        return createJsonResponse({ status: 'success', message: 'Status validator diperbarui.' });
      }
    }
  } else if (payload.subAction === 'addUser') {
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).toLowerCase() === String(payload.nidn).toLowerCase()) {
        return createJsonResponse({ status: 'error', message: 'NIDN sudah terdaftar!' });
      }
    }
    userSheet.appendRow([
      payload.nidn,
      payload.password || '123456',
      payload.name,
      'dosen',
      payload.isValidator ? 'TRUE' : 'FALSE',
      payload.email || ''
    ]);
    return createJsonResponse({ status: 'success', message: 'User berhasil ditambahkan ke database!' });
  }

  return createJsonResponse({ status: 'error', message: 'Aksi kelola user tidak valid.' });
}

/**
 * -------------------------------------------------------------------------
 * 5. FUNGSI PEMBANTU (DRIVE, LOG, EMAIL, DAN JSON OUTPUT)
 * -------------------------------------------------------------------------
 */
function getStorageFolder() {
  const folderId = getConfigValue("DRIVE_FOLDER_ID", "");
  if (folderId) {
    try {
      return DriveApp.getFolderById(folderId);
    } catch(e) {}
  }
  const existing = DriveApp.getFoldersByName(DRIVE_ROOT_FOLDER_NAME);
  if (existing.hasNext()) return existing.next();
  const newF = DriveApp.createFolder(DRIVE_ROOT_FOLDER_NAME);
  newF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newF;
}

function saveBase64ToDrive(folder, fileName, base64Data) {
  try {
    let contentType = "application/octet-stream";
    let pureBase64 = base64Data;
    if (base64Data.indexOf(';base64,') > -1) {
      const parts = base64Data.split(';base64,');
      contentType = parts[0].replace('data:', '');
      pureBase64 = parts[1];
    }
    const decodedBytes = Utilities.base64Decode(pureBase64);
    const blob = Utilities.newBlob(decodedBytes, contentType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saveBase64ToDrive: " + err.toString());
    return "#";
  }
}

function addLog(subId, aktor, pesan) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName(SHEET_LOGS);
  if (logSheet) {
    const logId = "LOG-" + Math.floor(1000 + Math.random() * 9000);
    const timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd MMM yyyy HH:mm");
    logSheet.appendRow([logId, subId, timestamp, aktor, pesan]);
  }
}

function getLogsForSubmission(subId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName(SHEET_LOGS);
  const logs = [];
  if (logSheet) {
    const data = logSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]) === String(subId)) {
        logs.push({
          time: data[i][2],
          text: "[" + data[i][3] + "] " + data[i][4]
        });
      }
    }
  }
  return logs;
}

function getUserEmailByNidn(nidn) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(SHEET_USERS);
  if (!userSheet) return "";
  const data = userSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(nidn).trim()) {
      return data[i][5] || "";
    }
  }
  return "";
}

function getConfigValue(key, defaultValue) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(SHEET_CONFIG);
  if (!configSheet) return defaultValue;
  const data = configSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === key) {
      return data[i][1] || defaultValue;
    }
  }
  return defaultValue;
}

function sendNotificationEmail(recipient, subject, body) {
  if (!recipient || recipient.indexOf('@') === -1) return;
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body
    });
  } catch(e) {
    Logger.log("Gagal mengirim email ke " + recipient + ": " + e.toString());
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const GOOGLE_SITE_EMBED_SNIPPET = (webAppUrl: string = 'MASUKKAN_URL_WEB_APP_APPS_SCRIPT_ANDA') => `<!-- ============================================================= -->
<!-- KODE SEMATKAN (EMBED) SIUTASDIKDAS UNTUK GOOGLE SITE           -->
<!-- Cara: Di Google Site, pilih menu Sisipkan > Sematkan > Kode   -->
<!-- ============================================================= -->
<div style="width: 100%; min-height: 850px; position: relative; overflow: hidden; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; background: #ffffff;">
  <iframe 
    src="${webAppUrl}" 
    style="width: 100%; height: 950px; border: none; display: block;" 
    allow="clipboard-write; camera; microphone" 
    title="SIUTASDIKDAS - Sistem Validasi Soal UTS & UAS UST"
    loading="lazy">
  </iframe>
</div>
`;
