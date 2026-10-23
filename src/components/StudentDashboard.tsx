import React from 'react';
import {
  Briefcase,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  HeartHandshake,
} from 'lucide-react';
import { StudentProfile, InternshipProgram, Application, ScheduleItem } from '../types';

interface StudentDashboardProps {
  profile: StudentProfile | null;
  programs: InternshipProgram[];
  applications: Application[];
  schedules: ScheduleItem[];
  onNavigate: (tab: string) => void;
  onOpenProgramDetail: (program: InternshipProgram) => void;
  onOpenApply: (program: InternshipProgram) => void;
  onSelectApplication: (app: Application) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  programs,
  applications,
  schedules,
  onNavigate,
  onOpenProgramDetail,
  onOpenApply,
  onSelectApplication,
}) => {
  const firstName = profile?.fullName?.split(' ')[0] || 'Siswa';

  // Counts
  const totalPrograms = programs.length;
  const totalApplied = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'Diterima');
  const inProcessApps = applications.filter((a) => a.status === 'Sedang Diproses');
  const pendingApps = applications.filter((a) => a.status === 'Menunggu Review');
  const rejectedApps = applications.filter((a) => a.status === 'Ditolak');

  // Nearest upcoming schedules
  const upcomingSchedules = [...schedules]
    .filter((s) => !s.isCompleted)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Recommendations based on student interests or latest
  const recommendedPrograms = programs.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Personalized Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-6 sm:p-8 text-white shadow-lg shadow-rose-200">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
              <span>Portal Magang Siswa SMA Teladan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {firstName}! Siap Menemukan Magang Impianmu? ✨
            </h1>
            <p className="text-rose-100 text-sm leading-relaxed">
              Jelajahi beragam program magang yang ramah pelajar, asah portofoliomu, dan pantau status pendaftaran dengan mudah di sini.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => onNavigate('programs')}
              className="px-4 py-2.5 rounded-xl bg-white text-rose-600 font-bold text-sm shadow-md hover:bg-rose-50 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Briefcase className="w-4 h-4" />
              Jelajahi Program
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 rounded-xl bg-rose-600/40 hover:bg-rose-600/60 text-white font-semibold text-sm border border-white/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              Lihat Profil Saya
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Available Programs */}
        <div
          onClick={() => onNavigate('programs')}
          className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Program Tersedia
            </span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
            {totalPrograms}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <span>Lihat semua lowongan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Applications Sent */}
        <div
          onClick={() => onNavigate('applications')}
          className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lamaran Terkirim
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
            {totalApplied}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-600 font-medium">
            <span>Cek status berkas</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Accepted / Diterima */}
        <div
          onClick={() => onNavigate('applications')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Diterima Magang
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {acceptedApps.length}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <span>
              {acceptedApps.length > 0 ? 'Selamat! Siap orientasi' : 'Belum ada pengumuman'}
            </span>
          </div>
        </div>

        {/* Card 4: In Process & Pending */}
        <div
          onClick={() => onNavigate('applications')}
          className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Proses Seleksi
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {inProcessApps.length + pendingApps.length}
            </p>
            <span className="text-xs text-slate-500">
              ({inProcessApps.length} diproses, {pendingApps.length} review)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <span>Pantau secara berkala</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recommendations (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                Rekomendasi Program Magang SMA
              </h2>
              <p className="text-xs text-slate-500">
                Pilihan program ramah siswa yang sesuai dengan kurikulum & jadwal libur sekolah.
              </p>
            </div>
            <button
              onClick={() => onNavigate('programs')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua ({totalPrograms}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="space-y-4">
            {recommendedPrograms.map((prog) => {
              const hasApplied = applications.some((a) => a.programId === prog.id);
              const quotaPercentage = Math.round((prog.registeredCount / prog.quota) * 100);

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:items-center justify-between group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      {prog.companyLogo}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          {prog.sector}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {prog.workType}
                        </span>
                        {prog.status === 'Segera Ditutup' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Kuota Menipis
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {prog.companyName} • <span className="text-slate-500">{prog.city}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {prog.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {prog.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Quota */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right text-xs">
                      <p className="text-slate-500 text-[11px]">
                        Kuota: <strong className="text-slate-700">{prog.registeredCount}/{prog.quota}</strong> siswa
                      </p>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            quotaPercentage >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenProgramDetail(prog)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        Detail
                      </button>

                      {hasApplied ? (
                        <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terdaftar
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenApply(prog)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition-colors cursor-pointer"
                        >
                          Daftar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Tips Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-rose-500 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">
                Tips Lolos Magang untuk Siswa SMA 💡
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Pastikan kolom <em>Motivasi Diri</em> di formulir diisi dengan jujur dan antusias. Ceritakan kegiatan ekstrakurikuler atau minat belajarmu yang relevan dengan posisi yang dilamar!
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Jadwal Terdekat & Recent Applications Status (Span 1) */}
        <div className="space-y-6">
          {/* Schedule widget */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                Jadwal Magang Terdekat
              </h3>
              <button
                onClick={() => onNavigate('schedule')}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Lihat Kalender
              </button>
            </div>

            {upcomingSchedules.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500 space-y-1">
                <p className="font-medium">Belum ada agenda terdekat</p>
                <p className="text-[11px]">Jadwal akan muncul saat lamaranmu diterima.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSchedules.map((item) => {
                  const typeColors = {
                    orientasi: 'border-l-4 border-l-rose-500 bg-rose-50/50',
                    kegiatan: 'border-l-4 border-l-blue-500 bg-blue-50/50',
                    mentoring: 'border-l-4 border-l-purple-500 bg-purple-50/50',
                    tenggat_laporan: 'border-l-4 border-l-amber-500 bg-amber-50/50',
                    catatan_pribadi: 'border-l-4 border-l-emerald-500 bg-emerald-50/50',
                  };

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border border-slate-100 text-xs space-y-1 transition-all ${
                        typeColors[item.type] || 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{item.companyName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Applications Tracker */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-500" />
                Lamaran Terakhirmu
              </h3>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Semua ({applications.length})
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                Kamu belum mengirimkan lamaran magang. Silakan cari program yang cocok!
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => {
                  const statusBadges = {
                    'Menunggu Review': 'bg-amber-50 text-amber-700 border-amber-200',
                    'Sedang Diproses': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Diterima': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Ditolak': 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <div
                      key={app.id}
                      onClick={() => onSelectApplication(app)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                          {app.programTitle}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            statusBadges[app.status]
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{app.companyName}</p>
                      {app.adminNotes && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-md line-clamp-1 italic">
                          "{app.adminNotes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
