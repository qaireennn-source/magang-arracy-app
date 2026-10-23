import React, { useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
  MessageSquare,
  Award,
  Download,
  Eye,
  Filter,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

interface ApplicationsViewProps {
  applications: Application[];
  onNavigateToSchedule: () => void;
  onOpenAcceptanceLetter: (app: Application) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onNavigateToSchedule,
  onOpenAcceptanceLetter,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);

  const statusCategories: (ApplicationStatus | 'Semua')[] = [
    'Semua',
    'Menunggu Review',
    'Sedang Diproses',
    'Diterima',
    'Ditolak',
  ];

  const filteredApps = applications.filter((app) => {
    if (selectedFilter === 'Semua') return true;
    return app.status === selectedFilter;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Diterima':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Diterima
          </span>
        );
      case 'Sedang Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            Sedang Diproses
          </span>
        );
      case 'Menunggu Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Review
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Ditolak
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-rose-500" />
              Status & Riwayat Pendaftaran Magang
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pantau perkembangan seleksi berkas dan catatan verifikasi dari instansi tujuanmu.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Total: {applications.length} Pendaftaran</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-3 border-t border-slate-100 no-scrollbar">
          {statusCategories.map((status) => {
            const count =
              status === 'Semua'
                ? applications.length
                : applications.filter((a) => a.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === status
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedFilter === status
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List of Applications */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <h3 className="font-bold text-base text-slate-800">
            Tidak ada riwayat pendaftaran dengan status ini
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Kamu belum memiliki pendaftaran dalam kategori <strong>{selectedFilter}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Row 1: Title, Company & Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-rose-600 tracking-wide">
                    {app.targetInterest}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900">{app.programTitle}</h2>
                  <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.companyName}</span>
                  </p>
                </div>

                <div className="self-start sm:self-auto">{getStatusBadge(app.status)}</div>
              </div>

              {/* Row 2: Metadata Pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-2 border-y border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tanggal Daftar: <strong className="text-slate-700">{app.appliedAt}</strong>
                </span>

                {app.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Pembaruan Terakhir:{' '}
                    <strong className="text-slate-700">{app.updatedAt}</strong>
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Berkas CV: <strong className="text-slate-700">{app.cvFileName}</strong>
                </span>
              </div>

              {/* Row 3: Admin Note Box / Status Insight */}
              {app.adminNotes && (
                <div
                  className={`p-4 rounded-2xl text-xs space-y-1 ${
                    app.status === 'Diterima'
                      ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900'
                      : app.status === 'Ditolak'
                      ? 'bg-rose-50/70 border border-rose-200 text-rose-900'
                      : 'bg-blue-50/70 border border-blue-200 text-blue-900'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Catatan Pembimbing / Panitia Seleksi:
                  </p>
                  <p className="leading-relaxed italic">"{app.adminNotes}"</p>
                </div>
              )}

              {/* Row 4: Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-400">
                  ID Pendaftaran: <code className="text-slate-600 font-mono">{app.id}</code>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedAppDetail(app)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Lihat Rincian Lamaran
                  </button>

                  {app.status === 'Diterima' && (
                    <>
                      <button
                        onClick={() => onOpenAcceptanceLetter(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Surat Penerimaan Magang
                      </button>

                      <button
                        onClick={onNavigateToSchedule}
                        className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Jadwal Orientasi
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Rincian Lamaran */}
      {selectedAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-rose-100 font-semibold">Rincian Dokumen Pendaftaran</p>
                <h3 className="text-lg font-black text-white">{selectedAppDetail.programTitle}</h3>
                <p className="text-xs text-rose-100">{selectedAppDetail.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedAppDetail(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-600">Status Terkini:</span>
                <div>{getStatusBadge(selectedAppDetail.status)}</div>
              </div>

              {/* Data Pelamar */}
              <div className="space-y-2 bg-rose-50/40 p-4 rounded-2xl border border-rose-100 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] text-rose-700">
                  Data Siswa Pelamar
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px]">Nama:</span>
                    <p className="font-bold text-slate-800">{selectedAppDetail.studentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">NISN:</span>
                    <p className="font-bold text-slate-800">{selectedAppDetail.studentNisn}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Sekolah:</span>
                    <p className="font-bold text-slate-800">{selectedAppDetail.studentSchool}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Kelas:</span>
                    <p className="font-bold text-slate-800">{selectedAppDetail.studentGrade}</p>
                  </div>
                </div>
              </div>

              {/* Motivasi Siswa */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-rose-600">
                  Surat Motivasi / Alasan Magang
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed text-xs">
                  {selectedAppDetail.motivation}
                </div>
              </div>

              {/* Berkas CV */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-rose-600">
                  Dokumen CV Terlampir
                </h4>
                <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-rose-500" />
                    <div>
                      <p className="font-bold text-slate-800 text-xs">
                        {selectedAppDetail.cvFileName}
                      </p>
                      <p className="text-[11px] text-slate-400">Format PDF Resmi Siswa SMA</p>
                    </div>
                  </div>
                  <span className="text-xs text-rose-600 font-bold px-3 py-1 bg-rose-50 rounded-lg">
                    Tersimpan
                  </span>
                </div>
              </div>

              {/* Catatan Admin */}
              {selectedAppDetail.adminNotes && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-rose-600">
                    Feedback Resmi dari Penyeleksi
                  </h4>
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs leading-relaxed italic">
                    "{selectedAppDetail.adminNotes}"
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedAppDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
