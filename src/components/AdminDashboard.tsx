import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  FileText,
  Building2,
  Save,
  X,
  MessageSquare,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  User,
  StudentProfile,
  InternshipProgram,
  Application,
  ApplicationStatus,
  WorkType,
  ProgramStatus,
} from '../types';

interface AdminDashboardProps {
  programs: InternshipProgram[];
  applications: Application[];
  studentProfiles: StudentProfile[];
  users: User[];
  currentSubTab: string;
  onSetSubTab: (subTab: string) => void;
  onAddProgram: (program: Omit<InternshipProgram, 'id' | 'registeredCount'>) => void;
  onUpdateProgram: (program: InternshipProgram) => void;
  onDeleteProgram: (id: string) => void;
  onUpdateAppStatus: (
    appId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    orientationDate?: string
  ) => void;
  onSwitchToStudentView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  programs,
  applications,
  studentProfiles,
  users,
  currentSubTab,
  onSetSubTab,
  onAddProgram,
  onUpdateProgram,
  onDeleteProgram,
  onUpdateAppStatus,
  onSwitchToStudentView,
}) => {
  // Search & Filter in Applications
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('Semua');

  // Application Review Modal
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Menunggu Review');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [orientationDateInput, setOrientationDateInput] = useState('2026-07-01 09:00 WIB');
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  // Program Add / Edit Modal
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<InternshipProgram | null>(null);

  // Program form fields
  const [progTitle, setProgTitle] = useState('');
  const [progCompany, setProgCompany] = useState('');
  const [progLogo, setProgLogo] = useState('🏢');
  const [progSector, setProgSector] = useState('Administrasi Perkantoran');
  const [progDescription, setProgDescription] = useState('');
  const [progLocation, setProgLocation] = useState('');
  const [progCity, setProgCity] = useState('Jakarta Pusat');
  const [progWorkType, setProgWorkType] = useState<WorkType>('Hybrid');
  const [progPeriod, setProgPeriod] = useState('1 Juli - 31 Agustus 2026');
  const [progDuration, setProgDuration] = useState('2 Bulan');
  const [progDeadline, setProgDeadline] = useState('2026-06-25');
  const [progQuota, setProgQuota] = useState(6);
  const [progStatus, setProgStatus] = useState<ProgramStatus>('Buka');
  const [progAllowance, setProgAllowance] = useState('Uang saku transport + Sertifikat');
  const [progMentor, setProgMentor] = useState('');
  const [progReqs, setProgReqs] = useState('Siswa aktif SMA kelas X/XI\nDisiplin dan bertanggung jawab');

  // Open review modal
  const handleOpenReview = (app: Application) => {
    setReviewingApp(app);
    setNewStatus(app.status);
    setAdminNotesInput(app.adminNotes || '');
    setOrientationDateInput(app.orientationDate || '2026-07-01 09:00 WIB');
    setStatusSuccessMsg(null);
  };

  // Submit review update
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApp) return;

    onUpdateAppStatus(reviewingApp.id, newStatus, adminNotesInput.trim(), orientationDateInput);
    setStatusSuccessMsg('Status dan catatan seleksi berhasil diperbarui!');
    setTimeout(() => {
      setReviewingApp(null);
      setStatusSuccessMsg(null);
    }, 700);
  };

  // Open Add Program
  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgTitle('');
    setProgCompany('');
    setProgLogo('🏢');
    setProgSector('Administrasi Perkantoran');
    setProgDescription('');
    setProgLocation('Jl. Sudirman No. 10');
    setProgCity('Jakarta Pusat');
    setProgWorkType('Hybrid');
    setProgPeriod('1 Juli - 31 Agustus 2026');
    setProgDuration('2 Bulan');
    setProgDeadline('2026-06-30');
    setProgQuota(6);
    setProgStatus('Buka');
    setProgAllowance('Uang saku transport + Sertifikat Magang');
    setProgMentor('Mentor Perusahaan');
    setProgReqs('Siswa aktif SMA kelas X atau XI\nBerminat belajar dan disiplin');
    setProgramModalOpen(true);
  };

  // Open Edit Program
  const handleOpenEditProgram = (p: InternshipProgram) => {
    setEditingProgram(p);
    setProgTitle(p.title);
    setProgCompany(p.companyName);
    setProgLogo(p.companyLogo);
    setProgSector(p.sector);
    setProgDescription(p.description);
    setProgLocation(p.location);
    setProgCity(p.city);
    setProgWorkType(p.workType);
    setProgPeriod(p.period);
    setProgDuration(p.duration);
    setProgDeadline(p.deadline);
    setProgQuota(p.quota);
    setProgStatus(p.status);
    setProgAllowance(p.allowanceNotes || '');
    setProgMentor(p.mentorName || '');
    setProgReqs(p.requirements?.join('\n') || '');
    setProgramModalOpen(true);
  };

  // Save Program
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle.trim() || !progCompany.trim()) return;

    const reqArray = progReqs
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    if (editingProgram) {
      onUpdateProgram({
        ...editingProgram,
        title: progTitle.trim(),
        companyName: progCompany.trim(),
        companyLogo: progLogo,
        sector: progSector,
        description: progDescription.trim(),
        location: progLocation.trim(),
        city: progCity.trim(),
        workType: progWorkType,
        period: progPeriod.trim(),
        duration: progDuration.trim(),
        deadline: progDeadline,
        quota: Number(progQuota),
        status: progStatus,
        allowanceNotes: progAllowance.trim(),
        mentorName: progMentor.trim(),
        requirements: reqArray,
      });
    } else {
      onAddProgram({
        title: progTitle.trim(),
        companyName: progCompany.trim(),
        companyLogo: progLogo,
        sector: progSector,
        description: progDescription.trim(),
        responsibilities: [
          'Mempelajari alur kerja bidang magang bersama mentor',
          'Membantu tugas operasional harian instansi',
          'Menyusun jurnal kegiatan berkala',
        ],
        requirements: reqArray,
        location: progLocation.trim(),
        city: progCity.trim(),
        workType: progWorkType,
        period: progPeriod.trim(),
        duration: progDuration.trim(),
        deadline: progDeadline,
        quota: Number(progQuota),
        status: progStatus,
        allowanceNotes: progAllowance.trim(),
        mentorName: progMentor.trim(),
        contactEmail: 'kontak@instansi.id',
      });
    }

    setProgramModalOpen(false);
  };

  // Statistics
  const totalStudents = studentProfiles.length;
  const totalPrograms = programs.length;
  const totalApplications = applications.length;
  const pendingReviewCount = applications.filter((a) => a.status === 'Menunggu Review').length;
  const acceptedCount = applications.filter((a) => a.status === 'Diterima').length;

  const filteredApps = applications.filter((app) => {
    const matchSearch =
      app.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.studentSchool.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.programTitle.toLowerCase().includes(appSearch.toLowerCase());
    const matchStatus = appStatusFilter === 'Semua' || app.status === appStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-rose-900/40">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-xs font-semibold border border-rose-400/30 text-rose-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Pengelola Magang & Pembimbing Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Dashboard Administrasi MagiSMA
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Kelola program magang mitra, verifikasi berkas pendaftaran siswa SMA, serta berikan evaluasi langsung yang tersinkronisasi seketika.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onSwitchToStudentView}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Pratinjau Akun Siswa</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500">Siswa Terdaftar</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{totalStudents}</p>
          <span className="text-[10px] text-slate-400">Total profil siswa aktif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500">Program Magang</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{totalPrograms}</p>
          <span className="text-[10px] text-slate-400">Mitra instansi & studio</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500">Total Lamaran</span>
          <p className="text-2xl font-black text-slate-800 mt-1">{totalApplications}</p>
          <span className="text-[10px] text-slate-400">Pendaftaran masuk</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-amber-700">Perlu Review</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingReviewCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Menunggu penilaian</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase text-emerald-700">Siswa Diterima</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{acceptedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Lolos seleksi magang</span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="bg-white rounded-3xl p-3 border border-rose-100 shadow-xs flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => onSetSubTab('admin-applications')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentSubTab === 'admin-applications' || currentSubTab === 'admin-dashboard'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Kelola Lamaran Siswa ({applications.length})</span>
          </button>

          <button
            onClick={() => onSetSubTab('admin-programs')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentSubTab === 'admin-programs'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Kelola Program Magang ({programs.length})</span>
          </button>

          <button
            onClick={() => onSetSubTab('admin-students')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentSubTab === 'admin-students'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Siswa SMA ({studentProfiles.length})</span>
          </button>
        </div>

        {currentSubTab === 'admin-programs' && (
          <button
            onClick={handleOpenAddProgram}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program Baru</span>
          </button>
        )}
      </div>

      {/* --- SUB TAB 1: KELOLA LAMARAN SISWA --- */}
      {(currentSubTab === 'admin-applications' || currentSubTab === 'admin-dashboard') && (
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-rose-500" />
                Daftar Seluruh Lamaran Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Pilih lamaran untuk meninjau motivasi, berkas CV, dan mengubah status pendaftaran.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Cari siswa/sekolah/program..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white font-medium"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Review">Menunggu Review</option>
                <option value="Sedang Diproses">Sedang Diproses</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Sekolah & Kelas</th>
                  <th className="py-3 px-4">Program Dilamar</th>
                  <th className="py-3 px-4">Tgl Daftar</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Evaluasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div>{app.studentName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        NISN: {app.studentNisn}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{app.studentSchool}</div>
                      <span className="text-[11px] text-slate-400">{app.studentGrade}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{app.programTitle}</div>
                      <span className="text-[11px] text-slate-500">{app.companyName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{app.appliedAt}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Diterima'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Sedang Diproses'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tinjau & Ubah Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUB TAB 2: KELOLA PROGRAM MAGANG --- */}
      {currentSubTab === 'admin-programs' && (
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-500" />
                Manajemen Program Magang Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Tambah lowongan baru, ubah kuota, perbarui batas pendaftaran, atau hapus program.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-rose-200 shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-2xl">{prog.companyLogo}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prog.status === 'Buka'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prog.status}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-rose-600">{prog.sector}</span>
                  <h3 className="font-extrabold text-sm text-slate-800 line-clamp-1">{prog.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">{prog.companyName} • {prog.city}</p>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <strong>{prog.workType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Durasi:</span>
                      <strong>{prog.duration}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendaftar / Kuota:</span>
                      <strong className="text-rose-600">
                        {prog.registeredCount} / {prog.quota} Siswa
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEditProgram(prog)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus program "${prog.title}"?`)) {
                        onDeleteProgram(prog.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB TAB 3: DATA SISWA TERDAFTAR --- */}
      {currentSubTab === 'admin-students' && (
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-500" />
              Direktori Siswa SMA Terdaftar
            </h2>
            <p className="text-xs text-slate-500">
              Data seluruh akun siswa SMA yang terdaftar di platform MagiSMA.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4">Asal Sekolah</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Kontak (Email / No. HP)</th>
                  <th className="py-3 px-4">Minat Bidang</th>
                  <th className="py-3 px-4">Status Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentProfiles.map((s) => (
                  <tr key={s.id} className="hover:bg-rose-50/20">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <img
                        src={s.avatarUrl}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{s.fullName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{s.nisn}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{s.school}</td>
                    <td className="py-3 px-4 text-slate-600">{s.grade}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{s.email}</div>
                      <span className="text-[11px] text-slate-400">{s.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {s.interests?.slice(0, 2).map((interest, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CV Terunggah
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL REVIEW APPLICATION (EVALUASI ADMIN) --- */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-300 font-bold uppercase tracking-wider">
                  Evaluasi & Verifikasi Pendaftaran Magang
                </span>
                <h3 className="text-lg font-black text-white">{reviewingApp.programTitle}</h3>
                <p className="text-xs text-slate-300">{reviewingApp.companyName}</p>
              </div>
              <button
                onClick={() => setReviewingApp(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSaveReview} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {statusSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusSuccessMsg}</span>
                </div>
              )}

              {/* Data Siswa */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Profil Pelamar Siswa
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px]">Nama:</span>
                    <p className="font-bold text-slate-800">{reviewingApp.studentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">NISN:</span>
                    <p className="font-bold text-slate-800">{reviewingApp.studentNisn}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Asal Sekolah:</span>
                    <p className="font-bold text-slate-800">{reviewingApp.studentSchool}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Kelas:</span>
                    <p className="font-bold text-slate-800">{reviewingApp.studentGrade}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Email:</span>
                    <p className="font-medium text-slate-700">{reviewingApp.studentEmail}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Telepon / WA:</span>
                    <p className="font-medium text-slate-700">{reviewingApp.studentPhone}</p>
                  </div>
                </div>
              </div>

              {/* Motivasi & CV Siswa */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Surat Motivasi / Alasan Siswa:
                </label>
                <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-xl text-slate-700 text-xs leading-relaxed italic">
                  "{reviewingApp.motivation}"
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-slate-800">{reviewingApp.cvFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Simulasi Preview CV: Membuka ${reviewingApp.cvFileName}`)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 text-xs cursor-pointer"
                >
                  Lihat Berkas CV
                </button>
              </div>

              {/* Status Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider text-rose-600">
                  Ubah Keputusan Seleksi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Menunggu Review', 'Sedang Diproses', 'Diterima', 'Ditolak'] as ApplicationStatus[]).map(
                    (st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setNewStatus(st)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          newStatus === st
                            ? st === 'Diterima'
                              ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300'
                              : st === 'Ditolak'
                              ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300'
                              : st === 'Sedang Diproses'
                              ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300'
                              : 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Admin Notes to Student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Seleksi / Feedback untuk Siswa <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Tuliskan catatan kelengkapan berkas, arahan seleksi lanjutan, atau pesan penyambutan jika diterima..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Catatan ini akan langsung terlihat pada dashboard siswa bersangkutan.
                </p>
              </div>

              {newStatus === 'Diterima' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jadwal Orientasi Magang Siswa
                  </label>
                  <input
                    type="text"
                    value={orientationDateInput}
                    onChange={(e) => setOrientationDateInput(e.target.value)}
                    placeholder="2026-07-01 09:00 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-emerald-600 mt-1">
                    Jadwal orientasi ini akan otomatis masuk ke kalender siswa saat status Diterima disimpan.
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Keputusan & Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL ADD / EDIT PROGRAM MAGANG --- */}
      {programModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingProgram ? 'Edit Program Magang' : 'Tambah Program Magang Baru'}
                </h3>
                <p className="text-xs text-rose-100">Lengkapi informasi lowongan mitra untuk siswa SMA</p>
              </div>
              <button
                onClick={() => setProgramModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSaveProgram} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Program / Posisi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={progTitle}
                    onChange={(e) => setProgTitle(e.target.value)}
                    placeholder="Contoh: Desain Grafis Kreatif"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Logo / Emoji
                  </label>
                  <input
                    type="text"
                    value={progLogo}
                    onChange={(e) => setProgLogo(e.target.value)}
                    placeholder="🎨"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-center text-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Perusahaan / Instansi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={progCompany}
                    onChange={(e) => setProgCompany(e.target.value)}
                    placeholder="Contoh: Dinas Komunikasi & Informatika"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bidang Magang
                  </label>
                  <select
                    value={progSector}
                    onChange={(e) => setProgSector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
                  >
                    <option value="Administrasi Perkantoran">Administrasi Perkantoran</option>
                    <option value="Perpustakaan dan Pengelolaan Informasi">Perpustakaan dan Pengelolaan Informasi</option>
                    <option value="Desain Grafis dan Kreatif">Desain Grafis dan Kreatif</option>
                    <option value="Media Sosial dan Digital Marketing">Media Sosial dan Digital Marketing</option>
                    <option value="Teknologi Informasi">Teknologi Informasi</option>
                    <option value="Public Relations dan Komunikasi">Public Relations dan Komunikasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Program Magang <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={progDescription}
                  onChange={(e) => setProgDescription(e.target.value)}
                  placeholder="Jelaskan gambaran umum kegiatan magang siswa..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kota</label>
                  <input
                    type="text"
                    value={progCity}
                    onChange={(e) => setProgCity(e.target.value)}
                    placeholder="Jakarta"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model Kerja</label>
                  <select
                    value={progWorkType}
                    onChange={(e) => setProgWorkType(e.target.value as WorkType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Lowongan</label>
                  <select
                    value={progStatus}
                    onChange={(e) => setProgStatus(e.target.value as ProgramStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
                  >
                    <option value="Buka">Buka</option>
                    <option value="Segera Ditutup">Segera Ditutup</option>
                    <option value="Ditutup">Ditutup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Durasi</label>
                  <input
                    type="text"
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    placeholder="2 Bulan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batas Akhir</label>
                  <input
                    type="date"
                    value={progDeadline}
                    onChange={(e) => setProgDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kuota Peserta</label>
                  <input
                    type="number"
                    min={1}
                    value={progQuota}
                    onChange={(e) => setProgQuota(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Persyaratan (Satu baris per syarat)
                </label>
                <textarea
                  rows={2}
                  value={progReqs}
                  onChange={(e) => setProgReqs(e.target.value)}
                  placeholder="Siswa kelas X atau XI&#10;Disiplin dan bertanggung jawab"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uang Saku / Fasilitas
                </label>
                <input
                  type="text"
                  value={progAllowance}
                  onChange={(e) => setProgAllowance(e.target.value)}
                  placeholder="Uang saku transport + Sertifikat Magang"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProgramModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
