import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Code2,
  Settings2,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { GUIDE_STEPS, TROUBLESHOOTING_FAQS } from '../data/guideSteps';
import { GOOGLE_SITE_EMBED_SNIPPET } from '../data/appsScriptCode';
import { getLiveUrl } from '../services/appsScriptApi';

export const GoogleSiteGuideView: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [customWebUrl, setCustomWebUrl] = useState<string>(getLiveUrl() || '');
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);

  const embedCode = GOOGLE_SITE_EMBED_SNIPPET(
    customWebUrl.trim() || 'https://script.google.com/macros/s/AKfycb.../exec'
  );

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
          <span>Panduan Lengkap Publikasi</span>
          <span aria-hidden="true">·</span>
          <span>Google Sites Integration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Panduan Langkah Demi Langkah Online di Google Site
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Ikuti 6 langkah terpadu ini untuk menghubungkan Google Sheets, Google Apps Script, dan Google Site sehingga sistem SIUTASDIKDAS dapat diakses oleh dosen dan admin kapan saja secara online.
        </p>
      </div>

      {/* Step Navigation Pill Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {GUIDE_STEPS.map((step, idx) => (
          <button
            key={step.number}
            onClick={() => setActiveStepIndex(idx)}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              activeStepIndex === idx
                ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[11px] font-bold font-mono-tabular ${
                  activeStepIndex === idx ? 'text-amber-200' : 'text-slate-400'
                }`}
              >
                TAHAP {step.number}
              </span>
              {activeStepIndex === idx && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <div className="text-xs font-semibold line-clamp-2 leading-tight">
              {step.badge}
            </div>
          </button>
        ))}
      </div>

      {/* Active Step Content Card */}
      {(() => {
        const step = GUIDE_STEPS[activeStepIndex];
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold text-base flex items-center justify-center font-mono-tabular shadow-sm shadow-amber-600/20">
                  {step.number}
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{step.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{step.shortDesc}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit">
                {step.badge}
              </span>
            </div>

            {/* Instruction List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Instruksi Pengerjaan:
              </h3>
              <ol className="space-y-3">
                {step.instructions.map((inst, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips & Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tips Rekomendasi:</span>
                </div>
                <ul className="space-y-1.5 text-emerald-800 pl-6 list-disc">
                  {step.tips.map((tip, ti) => (
                    <li key={ti}>{tip}</li>
                  ))}
                </ul>
              </div>

              {step.warning && (
                <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Perhatian Khusus:</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">{step.warning}</p>
                </div>
              )}
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Tahap Sebelumnya
              </button>
              <button
                disabled={activeStepIndex === GUIDE_STEPS.length - 1}
                onClick={() =>
                  setActiveStepIndex((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1))
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
              >
                Tahap Selanjutnya &rarr;
              </button>
            </div>
          </div>
        );
      })()}

      {/* Embed Code Generator for Google Site */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Generator Kode Sematkan Google Site (Embed Iframe)
            </h2>
            <p className="text-xs text-slate-500">
              Salin kode ini dan masukkan ke Google Site melalui menu: <strong>Sisipkan &gt; &lt;&gt; Sematkan &gt; Sematkan Kode</strong>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase text-slate-600">
            Masukkan URL Web App Apps Script Anda:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={customWebUrl}
              onChange={(e) => setCustomWebUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
            <button
              onClick={handleCopyEmbed}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              {copiedEmbed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Kode HTML Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Kode Sematkan HTML</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Snippet box */}
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
          <pre>
            <code>{embedCode}</code>
          </pre>
        </div>
      </div>

      {/* Troubleshooting & FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Pertanyaan Umum &amp; Solusi Masalah (Troubleshooting)
            </h2>
            <p className="text-xs text-slate-500">
              Solusi kendala umum yang sering dihadapi pengguna saat pertama kali menghubungkan Google Sites dengan Apps Script
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {TROUBLESHOOTING_FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left flex items-start justify-between gap-4 group focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                  {faq.q}
                </span>
                <span className="p-1 rounded-md text-slate-400 group-hover:bg-slate-100 shrink-0">
                  {openFaqIndex === idx ? (
                    <ChevronDown className="w-4 h-4 text-amber-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              </button>
              {openFaqIndex === idx && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5 pl-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
