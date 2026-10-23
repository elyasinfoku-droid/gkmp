import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { AppSIUTAS } from './components/AppSIUTAS';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { AppsScriptCodeView } from './components/AppsScriptCodeView';
import { GoogleSiteGuideView } from './components/GoogleSiteGuideView';
import { LiveConnectionModal } from './components/LiveConnectionModal';
import { getLiveUrl } from './services/appsScriptApi';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('app');
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLive(!!getLiveUrl());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLive}
        onOpenLiveModal={() => setIsLiveModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'app' && <AppSIUTAS />}
        {activeTab === 'schema' && <DatabaseSchemaView />}
        {activeTab === 'script' && <AppsScriptCodeView />}
        {activeTab === 'guide' && <GoogleSiteGuideView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            &copy; 2026 Hak Cipta Magister Pendidikan Dasar • Universitas Sarjanawiyata Tamansiswa (UST)
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>SIUTASDIKDAS Platform</span>
            <span aria-hidden="true">·</span>
            <span>Google Sheets &amp; Apps Script Backend</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="hover:text-amber-700 transition-colors underline"
            >
              {isLive ? 'Online Mode' : 'Simulasi Mode'}
            </button>
          </div>
        </div>
      </footer>

      {/* Live Apps Script Connection Modal */}
      <LiveConnectionModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        onConnectionChange={(status) => setIsLive(status)}
      />
    </div>
  );
}
