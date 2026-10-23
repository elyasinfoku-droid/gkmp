import React from 'react';
import { Database, FileCode2, Globe, Laptop, PlugZap, CheckCircle2 } from 'lucide-react';

export type ActiveTab = 'app' | 'schema' | 'script' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLive: boolean;
  onOpenLiveModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLive,
  onOpenLiveModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm shadow-amber-600/20">
            <span className="text-base font-bold">UST</span>
          </div>
          <button
            onClick={() => setActiveTab('app')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors whitespace-nowrap block">
              SIUTASDIKDAS
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block whitespace-nowrap">
              Sistem Validasi Soal UTS/UAS • Pend. Dasar UST
            </span>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'app'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-4 h-4 text-amber-600" />
            <span>Aplikasi Sistem</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'schema'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-amber-600" />
            <span>Database Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'script'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-amber-600" />
            <span>Kode Apps Script</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'guide'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-600" />
            <span>Panduan Google Site</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenLiveModal}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm ${
              isLive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            title="Konfigurasi URL Google Apps Script Anda"
          >
            {isLive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Terhubung ke Google Sheets</span>
                <span className="md:hidden">Sheets Live</span>
              </>
            ) : (
              <>
                <PlugZap className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline">Hubungkan Apps Script</span>
                <span className="md:hidden">Koneksi API</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
