import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Gift,
  UserCheck,
  Mail,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';
import { InternshipProgram } from '../types';

interface ProgramDetailModalProps {
  program: InternshipProgram | null;
  hasApplied: boolean;
  onClose: () => void;
  onApply: (program: InternshipProgram) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  hasApplied,
  onClose,
  onApply,
}) => {
  if (!program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              {program.companyLogo}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-rose-200" />
                <span>{program.sector}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {program.title}
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium flex items-center gap-2 mt-1">
                <span>{program.companyName}</span> • <span>{program.city}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Simulation disclaimer */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Lowongan simulasi terverifikasi khusus pembelajaran siswa SMA.</span>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-xs">
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase">Model Kerja</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{program.workType}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase">Durasi</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{program.duration}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase">Batas Akhir</p>
              <p className="font-extrabold text-rose-600 mt-0.5">{program.deadline}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase">Sisa Kuota</p>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {Math.max(0, program.quota - program.registeredCount)} Siswa
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider text-rose-600">
              Tentang Program Ini
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {program.description}
            </p>
          </div>

          {/* Tanggung Jawab / Yang Dipelajari */}
          {program.responsibilities && program.responsibilities.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider text-rose-600">
                Yang Akan Kamu Pelajari & Praktikkan
              </h3>
              <ul className="space-y-2">
                {program.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Persyaratan */}
          {program.requirements && program.requirements.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider text-rose-600">
                Kualifikasi & Persyaratan Siswa
              </h3>
              <ul className="space-y-2">
                {program.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fasilitas & Benefit */}
          {program.allowanceNotes && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-pink-500" />
                Benefit & Fasilitas Magang:
              </h4>
              <p className="text-slate-600 text-xs">{program.allowanceNotes}</p>
            </div>
          )}

          {/* Mentor & Alamat Lengkap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-700">Alamat Instansi</p>
                <p className="text-slate-500">{program.location}, {program.city}</p>
              </div>
            </div>

            {program.mentorName && (
              <div className="flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-700">Mentor Pembimbing</p>
                  <p className="text-slate-500">{program.mentorName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {hasApplied ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kamu Sudah Mendaftar Program Ini</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onApply(program);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Daftar Magang Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
