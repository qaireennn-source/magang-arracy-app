import React, { useState } from 'react';
import {
  X,
  Database,
  Flame,
  ShieldAlert,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HardDrive,
  Code,
  Layers,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  if (!isOpen) return null;

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleDownloadBackup = () => {
    const dataStr = storageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magisma_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Apakah kamu yakin ingin mengembalikan seluruh data program, lamaran, dan jadwal ke data awal bawaan demo MagiSMA?'
      )
    ) {
      storageService.resetToDefault();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        onDataReset();
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Informasi Sistem & Penyimpanan Data
              </h3>
              <p className="text-xs text-rose-100">
                Arsitektur data MagiSMA & Kesiapan Integrasi Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
          {/* Important Transparency Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Transparansi Penyimpanan Prototipe</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-800/90">
              Aplikasi ini menggunakan <strong>Browser LocalStorage</strong> untuk menyimpan data pengguna, profil siswa, lowongan magang, lamaran, dan jadwal. 
              Penyimpanan lokal ini sangat ideal untuk pengujian prototipe sekolah secara instan tanpa konfigurasi backend rumit, namun <em>tidak disinkronkan antar peramban/perangkat yang berbeda</em> dan <em>bukan pengganti sistem keamanan produksi</em>.
            </p>
          </div>

          {/* Architecture Roadmap / Firebase Ready */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-700">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Kesiapan Integrasi Firebase Firestore & Auth</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Arsitektur aplikasi telah dipisahkan secara modular melalui layanan <code>storageService.ts</code>. Seluruh model data (User, StudentProfile, InternshipProgram, Application, ScheduleItem) siap dipetakan langsung ke koleksi Firebase Firestore dan Firebase Authentication apabila sekolah ingin menghubungkannya ke cloud database.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-rose-100 space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-rose-500" /> Model Data
                </span>
                <p className="text-[11px] text-slate-500">Struktur relasional modular</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-rose-100 space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-rose-500" /> TypeScript
                </span>
                <p className="text-[11px] text-slate-500">Ketik data ketat (type-safe)</p>
              </div>
            </div>
          </div>

          {/* Backup & Reset Controls */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-rose-600">
              Kelola Cadangan & Data Demo
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadBackup}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Unduh Cadangan JSON</p>
                  <p className="text-[11px] text-slate-500">
                    Ekspor seluruh data magang & lamaran ke file .json
                  </p>
                </div>
              </button>

              <button
                onClick={handleResetData}
                className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-100/50 transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-white text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-rose-700 text-xs">Reset ke Data Awal Demo</p>
                  <p className="text-[11px] text-slate-500">
                    Kembalikan 8 lowongan, 3 lamaran, & agenda bawaan
                  </p>
                </div>
              </button>
            </div>

            {downloadSuccess && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 pt-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Berkas cadangan berhasil diunduh ke perangkatmu!
              </p>
            )}

            {resetSuccess && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 pt-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Data berhasil dikembalikan ke default!
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
};
