import React, { useState } from 'react';
import {
  User as UserIcon,
  School,
  Mail,
  Phone,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Download,
  Eye,
  Save,
  Tag,
  BookOpen,
  Camera,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileViewProps {
  profile: StudentProfile | null;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
  if (!profile) return null;

  const [fullName, setFullName] = useState(profile.fullName || '');
  const [nisn, setNisn] = useState(profile.nisn || '');
  const [school, setSchool] = useState(profile.school || '');
  const [grade, setGrade] = useState(profile.grade || 'XI MIPA');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [cvFileName, setCvFileName] = useState(profile.cvFileName || 'CV_Siswa_SMA.pdf');
  const [cvFileSize, setCvFileSize] = useState(profile.cvFileSize || '1.2 MB');
  const [cvUploadDate, setCvUploadDate] = useState(
    profile.cvUploadDate || new Date().toISOString().split('T')[0]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available interest options for students
  const availableInterests = [
    'Desain Grafis & Kreatif',
    'Media Sosial & Digital Marketing',
    'Administrasi Perkantoran',
    'Teknologi Informasi',
    'Perpustakaan & Literasi',
    'Public Relations & Humas',
    'Fotografi & Videografi',
    'Pemrograman Web Pemula',
  ];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorMsg('Harap pilih berkas dengan format PDF (.pdf).');
        return;
      }
      setErrorMsg(null);
      setCvFileName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setCvFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
      setCvUploadDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !school.trim() || !email.trim()) {
      setErrorMsg('Nama lengkap, asal sekolah, dan email tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updated: StudentProfile = {
        ...profile,
        fullName: fullName.trim(),
        nisn: nisn.trim(),
        school: school.trim(),
        grade: grade.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        interests,
        cvFileName,
        cvFileSize,
        cvUploadDate,
      };

      onUpdateProfile(updated);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }, 350);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={
              profile.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={profile.fullName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-200 shadow-md"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {fullName || 'Profil Siswa'}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {grade}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {school} • NISN: {nisn || '-'}
          </p>
          <p className="text-xs text-rose-600 font-semibold pt-1">
            {email} • {phone}
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Perubahan profil berhasil disimpan ke browser!</span>
          </div>
        )}

        {/* Section 1: Data Pokok */}
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider text-rose-600 mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Informasi Pribadi & Sekolah
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor Induk Siswa Nasional (NISN)
              </label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="00xxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Asal Sekolah SMA / SMK <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kelas & Peminatan <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
              >
                <option value="X Fase E">Kelas X (Fase E)</option>
                <option value="XI MIPA 1">Kelas XI - MIPA 1</option>
                <option value="XI MIPA 2">Kelas XI - MIPA 2</option>
                <option value="XI IPS 1">Kelas XI - IPS 1</option>
                <option value="XI IPS 2">Kelas XI - IPS 2</option>
                <option value="XI Bahasa & Budaya">Kelas XI - Bahasa & Budaya</option>
                <option value="XII MIPA">Kelas XII - MIPA</option>
                <option value="XII IPS">Kelas XII - IPS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Email Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp / Telepon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Minat Bidang Magang */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider text-rose-600 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Minat Bidang Magang
            </h2>
            <span className="text-xs text-slate-400">Pilih satu atau lebih</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableInterests.map((interest) => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Deskripsi Diri */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider text-rose-600 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Deskripsi Singkat Tentang Diri Siswa (Bio)
          </h2>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tuliskan pengalaman organisasi, minat belajar, kelebihan, serta harapanmu dalam mengikuti kegiatan magang siswa..."
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50/50 leading-relaxed"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Deskripsi ini akan dibaca oleh tim penyeleksi di perusahaan tempat magang.
          </p>
        </div>

        {/* Section 4: Upload CV PDF */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider text-rose-600 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Curriculum Vitae (CV) Siswa
          </h2>

          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white text-rose-600 shadow-xs flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs sm:text-sm">{cvFileName}</p>
                <p className="text-[11px] text-slate-500">
                  Ukuran: {cvFileSize} • Terakhir diunggah: {cvUploadDate}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                  Format PDF Valid
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Ganti Berkas PDF</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => alert(`Simulasi Preview: Menampilkan dokumen ${cvFileName}`)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <span>Menyimpan profil...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
