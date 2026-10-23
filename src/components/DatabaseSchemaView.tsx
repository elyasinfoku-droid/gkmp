import React, { useState } from 'react';
import { Database, Download, Copy, Check, FolderGit2, Table, Layers, ExternalLink } from 'lucide-react';
import { SHEETS_SCHEMA, generateCsvForSheet } from '../data/sheetsSchema';

export const DatabaseSchemaView: React.FC = () => {
  const [selectedSheetName, setSelectedSheetName] = useState<string>('DB_SUBMISSIONS');
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const currentSheet = SHEETS_SCHEMA.find((s) => s.sheetName === selectedSheetName) || SHEETS_SCHEMA[0];

  const handleDownloadCsv = (sheetName: string) => {
    const csvContent = generateCsvForSheet(sheetName);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${sheetName}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyHeaders = (sheet: typeof currentSheet) => {
    const headersText = sheet.columns.map((c) => c.header).join('\t');
    navigator.clipboard.writeText(headersText);
    setCopiedHeader(sheet.sheetName);
    setTimeout(() => setCopiedHeader(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
          <span>Arsitektur Data Google Site</span>
          <span aria-hidden="true">·</span>
          <span>Google Sheets Database Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Struktur Database Google Sheets & Google Drive
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Karena Google Sites tidak memiliki server database lokal, kami merancang Google Sheets sebagai database relasional berbasis spreadsheet dan Google Drive sebagai penyimpanan aman berkas naskah soal Word/PDF. Seluruh tabel ini dibuat otomatis oleh skrip Apps Script.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">5 Tabel Terintegrasi</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menyimpan pengajuan soal, data login dosen/admin, 22 mata kuliah UST, riwayat log notifikasi, dan pengaturan sistem.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Penyimpanan Google Drive</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Naskah soal ujian, berkas revisi, dan Lembar Validasi resmi tersimpan langsung di folder Drive milik akun institusi UST.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Sinkronisasi Real-Time</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap ada dosen yang mengunggah soal atau validator memberikan catatan, Google Sheets otomatis terupdate secara langsung.
          </p>
        </div>
      </div>

      {/* Main Table Viewer */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Table selector bar */}
        <div className="border-b border-slate-200 p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {SHEETS_SCHEMA.map((sheet) => (
              <button
                key={sheet.sheetName}
                onClick={() => setSelectedSheetName(sheet.sheetName)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                  selectedSheetName === sheet.sheetName
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>{sheet.sheetName}</span>
                <span className="text-[10px] opacity-80 font-mono-tabular">
                  ({sheet.columns.length} kolom)
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyHeaders(currentSheet)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Salin semua nama kolom untuk ditempelkan ke baris 1 Spreadsheet"
            >
              {copiedHeader === currentSheet.sheetName ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Header Kolom</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadCsv(currentSheet.sheetName)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template CSV</span>
            </button>
          </div>
        </div>

        {/* Sheet description */}
        <div className="px-6 py-4 bg-amber-50/40 border-b border-amber-100/60 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="font-mono-tabular text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs font-semibold">
                Sheet: {currentSheet.sheetName}
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{currentSheet.description}</p>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
            Baris 1 = Baris Judul Kolom (Header)
          </span>
        </div>

        {/* Column specification table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
                <th className="py-3 px-4 w-16 text-center font-mono-tabular">Kolom</th>
                <th className="py-3 px-4 w-48">Nama Header</th>
                <th className="py-3 px-4 w-36">Tipe Data</th>
                <th className="py-3 px-6">Deskripsi & Fungsi</th>
                <th className="py-3 px-4">Contoh Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {currentSheet.columns.map((col) => (
                <tr key={col.header} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-center font-mono-tabular font-bold text-amber-800 bg-amber-50/30">
                    {col.letter}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {col.header}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-slate-700 leading-relaxed">{col.description}</td>
                  <td className="py-3 px-4 font-mono-tabular text-slate-500 text-[11px]">
                    {col.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Drive Folder Explanation Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Struktur Folder Dokumen di Google Drive
              </h3>
              <p className="text-xs text-slate-500">
                Otomatis diinisialisasi saat fungsi <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800 font-mono">setupDatabase()</code> dijalankan
              </p>
            </div>
          </div>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Buka Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs font-mono text-slate-700 space-y-2">
          <div className="font-semibold text-slate-900">📁 Google Drive Saya/</div>
          <div className="pl-4">└── 📁 SIUTASDIKDAS_Storage_UST/ <span className="text-slate-400">(Akses: Siapa saja yang memiliki link dapat melihat)</span></div>
          <div className="pl-8">├── 📄 Soal_UTS_Filsafat_Ilmu_Slamet.docx <span className="text-slate-400">(Naskah asli dari dosen)</span></div>
          <div className="pl-8">├── 📄 Revisi_SUB-101_Soal_UTS_Filsafat_Ilmu_v2.docx <span className="text-slate-400">(Naskah perbaikan jika ada revisi)</span></div>
          <div className="pl-8">└── 📄 Lembar_Validasi_SUB-101_Signed.pdf <span className="text-slate-400">(Lembar validasi resmi dari validator)</span></div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Keamanan & Privasi Dokumen:</strong> File yang diunggah disimpan di Google Drive pemilik script (admin), bukan server pihak ketiga. URL publik langsung dicatat ke kolom <code>File_Drive_URL</code> pada spreadsheet sehingga dosen dan validator dapat langsung mengunduhnya hanya dengan mengklik tombol di Google Site.
        </p>
      </div>
    </div>
  );
};
