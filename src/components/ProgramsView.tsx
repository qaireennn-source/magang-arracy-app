import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  ChevronRight,
  Building2,
  FileText,
  Send,
  X,
  ExternalLink,
} from 'lucide-react';
import { InternshipProgram, Application } from '../types';

interface ProgramsViewProps {
  programs: InternshipProgram[];
  applications: Application[];
  onOpenDetail: (program: InternshipProgram) => void;
  onOpenApply: (program: InternshipProgram) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  programs,
  applications,
  onOpenDetail,
  onOpenApply,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('Semua');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Sectors list
  const sectors = [
    'Semua',
    'Desain Grafis dan Kreatif',
    'Media Sosial dan Digital Marketing',
    'Administrasi Perkantoran',
    'Teknologi Informasi',
    'Perpustakaan dan Pengelolaan Informasi',
    'Public Relations dan Komunikasi',
  ];

  const workTypes = ['Semua', 'Onsite', 'Hybrid', 'Remote'];
  const statuses = ['Semua', 'Buka', 'Segera Ditutup'];

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSector = selectedSector === 'Semua' || p.sector === selectedSector;
      const matchWorkType = selectedWorkType === 'Semua' || p.workType === selectedWorkType;
      const matchStatus = selectedStatus === 'Semua' || p.status === selectedStatus;

      return matchSearch && matchSector && matchWorkType && matchStatus;
    });
  }, [programs, searchQuery, selectedSector, selectedWorkType, selectedStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Simulation Notice Banner */}
      <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Data Simulasi Edukasi:</strong> Seluruh lowongan magang berikut dirancang khusus untuk simulasi pembelajaran siswa SMA, mencakup bidang administrasi, perpustakaan, media kreatif, IT, dan kehumasan.
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider bg-amber-200/60 px-2.5 py-1 rounded-full text-amber-900">
          Simulasi SMA
        </span>
      </div>

      {/* Header & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-rose-500" />
              Eksplorasi Program Magang Siswa
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Temukan pengalaman magang libur sekolah yang sesuai dengan bakat dan minatmu.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-rose-50 rounded-xl text-rose-700 border border-rose-100 self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Menampilkan {filteredPrograms.length} dari {programs.length} Program</span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul posisi, instansi, kota, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Bidang:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSector(s)}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSector === s
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Tipe Kerja:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {workTypes.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWorkType(w)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      selectedWorkType === w
                        ? 'bg-white text-rose-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Status:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      selectedStatus === st
                        ? 'bg-white text-rose-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {(selectedSector !== 'Semua' || selectedWorkType !== 'Semua' || selectedStatus !== 'Semua' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSector('Semua');
                  setSelectedWorkType('Semua');
                  setSelectedStatus('Semua');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 font-bold hover:underline ml-auto"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Programs */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="font-bold text-base text-slate-800">
            Tidak ada program magang yang cocok
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter bidang/tipe kerja untuk melihat pilihan lain.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSector('Semua');
              setSelectedWorkType('Semua');
              setSelectedStatus('Semua');
            }}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors"
          >
            Bersihkan Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const hasApplied = applications.some((a) => a.programId === prog.id);
            const quotaPercentage = Math.round((prog.registeredCount / prog.quota) * 100);

            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs hover:shadow-lg hover:border-rose-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                      {prog.companyLogo}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {prog.workType}
                      </span>
                      {prog.status === 'Segera Ditutup' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Segera Ditutup
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Buka
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Sector */}
                  <span className="text-[11px] font-bold text-rose-600 block mb-1">
                    {prog.sector}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mb-3 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prog.companyName}</span>
                  </p>

                  {/* Description preview */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {prog.description}
                  </p>

                  {/* Meta items */}
                  <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50/70 p-3 rounded-2xl mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokasi:
                      </span>
                      <span className="font-semibold text-slate-700">{prog.city}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Durasi:
                      </span>
                      <span className="font-semibold text-slate-700">{prog.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Batas Akhir:
                      </span>
                      <span className="font-semibold text-rose-600">{prog.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Section: Quota & Buttons */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Kuota Terisi</span>
                      <span className="font-bold text-slate-700">
                        {prog.registeredCount} dari {prog.quota} Siswa
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          quotaPercentage >= 90 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenDetail(prog)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Lihat Detail
                    </button>

                    {hasApplied ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terdaftar
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenApply(prog)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" /> Daftar Magang
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
