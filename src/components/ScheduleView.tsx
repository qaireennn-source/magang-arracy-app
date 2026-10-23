import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Sparkles,
  BookOpen,
  Building2,
  Tag,
  AlertCircle,
  Trash2,
  List,
  CalendarDays,
} from 'lucide-react';
import { ScheduleItem, ScheduleType } from '../types';

interface ScheduleViewProps {
  schedules: ScheduleItem[];
  studentId: string;
  onAddSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedules,
  studentId,
  onAddSchedule,
  onToggleComplete,
  onDeleteSchedule,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [filterType, setFilterType] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new schedule note
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('09:00 - 11:00 WIB');
  const [newLocation, setNewLocation] = useState('Ruang Magang / Online');
  const [newType, setNewType] = useState<ScheduleType>('catatan_pribadi');

  const filteredSchedules = schedules.filter((s) => {
    if (filterType === 'Semua') return true;
    return s.type === filterType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddSchedule({
      studentId,
      programTitle: 'Kegiatan Mandiri Siswa',
      companyName: 'Catatan Siswa',
      title: newTitle.trim(),
      description: newDesc.trim(),
      date: newDate,
      time: newTime,
      location: newLocation,
      type: newType,
      isCompleted: false,
    });

    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const getTypeBadge = (type: ScheduleType) => {
    switch (type) {
      case 'orientasi':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
            Orientasi
          </span>
        );
      case 'mentoring':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
            Mentoring
          </span>
        );
      case 'tenggat_laporan':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
            Tenggat Laporan
          </span>
        );
      case 'kegiatan':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
            Kegiatan
          </span>
        );
      case 'catatan_pribadi':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
            Catatan Pribadi
          </span>
        );
    }
  };

  // Group schedules by month for nice calendar view
  const schedulesByDate = [...filteredSchedules].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-rose-500" />
            Jadwal & Agenda Magang Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau sesi orientasi, mentoring, tenggat laporan berkala, serta catatan mandirimu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Kalender</span>
            </button>
          </div>

          {/* Add schedule button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {['Semua', 'orientasi', 'mentoring', 'tenggat_laporan', 'kegiatan', 'catatan_pribadi'].map(
          (t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full font-semibold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white border border-rose-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Content */}
      {schedulesByDate.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            📅
          </div>
          <h3 className="font-bold text-base text-slate-800">Belum ada agenda pada kategori ini</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Jadwal kegiatan akan otomatis ditambahkan saat lamaranmu disetujui, atau kamu bisa membuat pengingat pribadi.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition-colors"
          >
            + Buat Pengingat Pertama
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE VIEW */
        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-rose-200">
          {schedulesByDate.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <button
                onClick={() => onToggleComplete(item.id)}
                title="Tandai selesai"
                className={`absolute -left-[29px] sm:-left-[33px] top-4 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center transition-all cursor-pointer ${
                  item.isCompleted
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : 'border-rose-400 hover:border-rose-600 text-rose-400'
                }`}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Card */}
              <div
                className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all space-y-3 ${
                  item.isCompleted
                    ? 'border-slate-200 bg-slate-50/70 opacity-75'
                    : 'border-rose-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getTypeBadge(item.type)}
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
                      {item.date}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.time}
                    </span>
                  </div>

                  {item.type === 'catatan_pribadi' && (
                    <button
                      onClick={() => onDeleteSchedule(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 self-end sm:self-auto"
                      title="Hapus catatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <h3
                    className={`font-extrabold text-sm sm:text-base ${
                      item.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {item.companyName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SIMPLE CALENDAR GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedulesByDate.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 ${
                item.isCompleted ? 'border-slate-200 bg-slate-50/60 opacity-80' : 'border-rose-100'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getTypeBadge(item.type)}
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className="cursor-pointer"
                    title="Tandai selesai"
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-rose-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm pt-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>

                <h3
                  className={`font-bold text-sm ${
                    item.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
                  }`}
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" /> {item.time}
                </p>
                <p className="flex items-center gap-1.5 line-clamp-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Personal Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Tambah Jadwal / Pengingat Baru</h3>
                <p className="text-xs text-rose-100">Catat agenda magang atau tugas mandirimu</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Kegiatan / Catatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Mengumpulkan draft laporan minggu 1"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="09:00 - 11:00 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Agenda
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ScheduleType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
                >
                  <option value="catatan_pribadi">Catatan Pribadi</option>
                  <option value="tenggat_laporan">Tenggat Laporan</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="kegiatan">Kegiatan Lapangan</option>
                  <option value="orientasi">Orientasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi / Ruang
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Contoh: Kantor Utama / Google Meet"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Bawa perlengkapan atau berkas tertentu..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
