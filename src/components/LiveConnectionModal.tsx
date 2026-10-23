import React, { useState } from 'react';
import { X, PlugZap, CheckCircle2, AlertCircle, RefreshCw, Trash2, ExternalLink } from 'lucide-react';
import {
  getLiveUrl,
  setLiveUrl,
  clearLiveUrl,
  testAppsScriptConnection,
} from '../services/appsScriptApi';

interface LiveConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: (isLive: boolean) => void;
}

export const LiveConnectionModal: React.FC<LiveConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [urlInput, setUrlInput] = useState<string>(getLiveUrl());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!urlInput.trim()) {
      setTestResult({
        success: false,
        message: 'Masukkan URL Web App Google Apps Script terlebih dahulu.',
      });
      return;
    }
    setTesting(true);
    setTestResult(null);

    const res = await testAppsScriptConnection(urlInput.trim());
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      setLiveUrl(urlInput.trim());
      onConnectionChange(true);
    }
  };

  const handleDisconnect = () => {
    clearLiveUrl();
    setUrlInput('');
    setTestResult(null);
    onConnectionChange(false);
  };

  const isConnected = !!getLiveUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <PlugZap className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Koneksi Google Apps Script &amp; Sheets
              </h2>
              <p className="text-xs text-slate-500">
                Hubungkan langsung sistem ke spreadsheet database aktif Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status indicator */}
        <div
          className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
            isConnected
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {isConnected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <span className="font-bold">
              {isConnected
                ? 'Status: Mode Online (Tersambung ke Google Sheets)'
                : 'Status: Mode Simulasi Demo (Data Tersimpan Lokal)'}
            </span>
            <p className="text-[11px] opacity-80 leading-relaxed">
              {isConnected
                ? 'Aksi pengajuan soal, validasi, dan kelola user akan langsung memperbarui Google Spreadsheet & Google Drive Anda.'
                : 'Anda dapat mencoba seluruh alur validasi sekarang dengan data demo, atau tempelkan URL Web App Anda untuk mulai bekerja langsung dengan spreadsheet asli.'}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase text-slate-600">
            URL Aplikasi Web (Web App Deployment URL):
          </label>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
          <p className="text-[11px] text-slate-500">
            Didapat dari editor Apps Script: <strong>Terapkan &gt; Penerapan Baru &gt; Aplikasi Web</strong>.
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{testResult.message}</p>
              {testResult.details && (
                <div className="text-[11px] opacity-80 font-mono">
                  App: {testResult.details.app} • Status: {testResult.details.status}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Putuskan Koneksi</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menguji...</span>
                </>
              ) : (
                <>
                  <PlugZap className="w-3.5 h-3.5" />
                  <span>Uji &amp; Simpan Koneksi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
