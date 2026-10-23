import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileCode2,
  FileText,
  Play,
  Sparkles,
  Send,
  Mail,
  CheckCircle,
  Download,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { APPS_SCRIPT_CODE_GS } from '../data/appsScriptCode';
import { APPS_SCRIPT_INDEX_HTML } from '../data/appsScriptHtml';

export const AppsScriptCodeView: React.FC = () => {
  const [activeFileTab, setActiveFileTab] = useState<'html' | 'gs'>('html');
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedGs, setCopiedGs] = useState<boolean>(false);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_INDEX_HTML);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleCopyGs = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_GS);
    setCopiedGs(true);
    setTimeout(() => setCopiedGs(false), 2500);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([APPS_SCRIPT_INDEX_HTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadGs = () => {
    const blob = new Blob([APPS_SCRIPT_CODE_GS], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Code.gs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            <span>Paket Lengkap Google Apps Script</span>
            <span aria-hidden="true">·</span>
            <span>Index.html &amp; Code.gs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Kode HTML &amp; Script Google Apps Script
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Untuk menjalankan SIUTASDIKDAS sebagai Web App resmi di Google Sites, Anda memerlukan 2 file di editor Apps Script: <strong>Index.html</strong> (tampilan antarmuka) dan <strong>Code.gs</strong> (pengelola database Sheets &amp; Drive).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFileTab === 'html' ? (
            <button
              onClick={handleCopyHtml}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              {copiedHtml ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Index.html Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin File Index.html</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCopyGs}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              {copiedGs ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Code.gs Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin File Code.gs</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={activeFileTab === 'html' ? handleDownloadHtml : handleDownloadGs}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            title="Unduh file"
          >
            <Download className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Visual Setup 3-Step Mini Guide */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-5 space-y-3">
        <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Cara Memasang Kedua File Ini di Google Apps Script (Hanya 3 Menit):</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-amber-950">
          <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 space-y-1">
            <span className="font-bold text-amber-800 block">1. File Code.gs</span>
            <p className="text-slate-600 leading-relaxed">
              Buka Apps Script, buka file <strong>Code.gs</strong> bawaan. Hapus seluruh isinya, lalu salin dan tempelkan kode dari tab <strong>Code.gs</strong>.
            </p>
          </div>
          <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 space-y-1">
            <span className="font-bold text-amber-800 block">2. Buat File Index.html</span>
            <p className="text-slate-600 leading-relaxed">
              Di panel kiri sebelah tulisan &quot;File&quot;, klik tanda <strong>+</strong> &gt; pilih <strong>HTML</strong> &gt; ketik nama persis: <code className="bg-amber-100 text-amber-900 px-1 rounded font-bold">Index</code> (Apps Script otomatis menambahkan ekstensi .html). Tempelkan kode dari tab <strong>Index.html</strong>.
            </p>
          </div>
          <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 space-y-1">
            <span className="font-bold text-amber-800 block">3. Jalankan &amp; Deploy</span>
            <p className="text-slate-600 leading-relaxed">
              Pilih fungsi <strong>setupDatabase</strong> &gt; klik <strong>Jalankan</strong> (setujui izin). Lalu klik <strong>Terapkan</strong> &gt; <strong>Penerapan baru</strong> &gt; jenis <strong>Aplikasi web</strong> &gt; Akses: <strong>Siapa saja</strong>!
            </p>
          </div>
        </div>
      </div>

      {/* File Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFileTab('html')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeFileTab === 'html'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Index.html (Tampilan Google Site)</span>
            <span className="text-[10px] opacity-80 uppercase px-1.5 py-0.5 rounded bg-black/10">
              HTML File
            </span>
          </button>

          <button
            onClick={() => setActiveFileTab('gs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeFileTab === 'gs'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Code.gs (Backend Server &amp; Database)</span>
            <span className="text-[10px] opacity-80 uppercase px-1.5 py-0.5 rounded bg-black/10">
              Script File
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:block">
          {activeFileTab === 'html' ? 'Nama file di Apps Script: Index' : 'Nama file di Apps Script: Code'}
        </span>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="font-mono text-slate-400 pl-2">
              {activeFileTab === 'html' ? 'Index.html • Antarmuka Web App' : 'Code.gs • Server Apps Script'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={activeFileTab === 'html' ? handleCopyHtml : handleCopyGs}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs"
            >
              {(activeFileTab === 'html' ? copiedHtml : copiedGs) ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin {activeFileTab === 'html' ? 'HTML' : 'Script'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="max-h-[580px] overflow-y-auto p-5 font-mono text-xs text-slate-200 leading-relaxed select-all">
          <pre>
            <code>
              {activeFileTab === 'html' ? APPS_SCRIPT_INDEX_HTML : APPS_SCRIPT_CODE_GS}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
