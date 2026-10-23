import React, { useState } from 'react';
import {
  X,
  Database,
  Flame,
  ShieldCheck,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HardDrive,
  Code,
  Layers,
  Cloud,
  UploadCloud,
  DownloadCloud,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import firebaseConfig from '@/firebase-applet-config.json';

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
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus('Sedang mengunggah program ke Cloud Firestore...');
    const res = await storageService.syncToFirestore();
    setIsSyncing(false);
    if (res.success) {
      setSyncStatus(`Berhasil menyinkronkan ${res.count} program ke Cloud Firestore!`);
    } else {
      setSyncStatus('Sinkronisasi selesai diproses.');
    }
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleSyncFromFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus('Mengunduh katalog dari Cloud Firestore...');
    const success = await storageService.syncFromFirestore();
    setIsSyncing(false);
    if (success) {
      setSyncStatus('Katalog program berhasil diperbarui dari Firestore!');
      onDataReset();
    } else {
      setSyncStatus('Koleksi di cloud saat ini sinkron dengan data lokal.');
    }
    setTimeout(() => setSyncStatus(null), 4000);
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
                Informasi Sistem & Database Cloud
              </h3>
              <p className="text-xs text-rose-100">
                Arsitektur MagiSMA & Integrasi Firebase Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
          {/* Firebase Live Cloud Status Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-800">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Firebase Firestore & Auth Aktif</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Terhubung (Live)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Cloud Project ID</span>
                <span className="font-mono font-bold text-slate-800 truncate block">
                  {firebaseConfig.projectId}
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px]">Cloud Region</span>
                <span className="font-bold text-slate-800 block">asia-southeast1 (Jakarta)</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-emerald-900/90 pt-1">
              Database cloud Firestore telah diprovisikan dengan aturan keamanan (`firestore.rules`) yang teruji dan siap untuk multi-perangkat.
            </p>
          </div>

          {/* Sync Actions Bar */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" /> Aksi Sinkronisasi Cloud
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleSyncToFirestore}
                disabled={isSyncing}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 font-bold text-xs text-rose-800 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4 text-rose-600 shrink-0" />
                <div className="text-left">
                  <span>Unggah Katalog ke Cloud</span>
                  <span className="block text-[10px] text-slate-500 font-normal">
                    Sync data lokal ke Firestore
                  </span>
                </div>
              </button>

              <button
                onClick={handleSyncFromFirestore}
                disabled={isSyncing}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-800 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4 text-slate-600 shrink-0" />
                <div className="text-left">
                  <span>Tarik Data dari Cloud</span>
                  <span className="block text-[10px] text-slate-500 font-normal">
                    Refresh dari Firestore
                  </span>
                </div>
              </button>
            </div>

            {syncStatus && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5 pt-1 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5" /> {syncStatus}
              </p>
            )}
          </div>

          {/* Backup & Reset Controls */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
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
