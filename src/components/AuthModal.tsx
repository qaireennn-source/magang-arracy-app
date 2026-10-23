import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  Lock,
  Mail,
  School,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types';

interface AuthModalProps {
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regNisn, setRegNisn] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regGrade, setRegGrade] = useState('XI MIPA');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    const result = await storageService.loginWithGoogle(selectedRole);
    setIsLoading(false);
    if (result.success && result.user) {
      onSuccess(result.user);
    } else {
      setErrorMsg(result.message || 'Gagal masuk dengan Google via Firebase.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const email = role === 'siswa' ? 'siswa@magisma.id' : 'admin@magisma.id';
      const password = role === 'siswa' ? 'demo123' : 'admin123';
      const result = storageService.login(email, password, role);
      setIsLoading(false);
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setErrorMsg(result.message || 'Gagal masuk akun demo.');
      }
    }, 250);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Harap isi alamat email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = storageService.login(loginEmail, loginPassword, selectedRole);
      setIsLoading(false);
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setErrorMsg(result.message || 'Gagal masuk. Periksa kembali email dan kata sandi.');
      }
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim() || !regSchool.trim()) {
      setErrorMsg('Harap lengkapi semua kolom yang bertanda bintang (*).');
      return;
    }

    if (regPassword.length < 5) {
      setErrorMsg('Kata sandi minimal terdiri dari 5 karakter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = storageService.registerStudent({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        nisn: regNisn.trim(),
        school: regSchool.trim(),
        grade: regGrade.trim(),
        phone: regPhone.trim(),
      });
      setIsLoading(false);

      if (result.success && result.user) {
        setSuccessMsg('Pendaftaran akun siswa berhasil! Mengarahkan ke dashboard...');
        setTimeout(() => {
          onSuccess(result.user!);
        }, 800);
      } else {
        setErrorMsg(result.message || 'Pendaftaran gagal. Silakan coba kembali.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/40 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-rose-200/50 border border-rose-100 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-6 sm:p-8 text-white relative">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  MagiSMA
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/25 border border-white/30 text-white">
                    v1.0
                  </span>
                </h1>
                <p className="text-rose-100 text-xs sm:text-sm font-medium">
                  Sistem Informasi Magang Siswa SMA
                </p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-rose-200 animate-pulse hidden sm:block" />
          </div>

          <p className="mt-4 text-xs sm:text-sm text-rose-50/95 leading-relaxed">
            Platform modern bagi pelajar SMA untuk menemukan pengalaman magang impian, mendaftar langsung, dan memantau status secara mudah.
          </p>
        </div>

        {/* Demo Quick Access Bar */}
        <div className="bg-rose-50/80 px-6 py-3.5 border-b border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <span className="font-semibold text-rose-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
            Coba Cepat Akun Demo (1-Klik):
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleQuickDemoLogin('siswa')}
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 font-bold hover:bg-rose-100 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <UserIcon className="w-3.5 h-3.5 text-pink-500" />
              Siswa: Rian
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 font-bold hover:bg-rose-100 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Admin: Bu Retno
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk ke Akun
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSelectedRole('siswa');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Akun Siswa
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Peran Pengguna
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('siswa')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      selectedRole === 'siswa'
                        ? 'border-rose-400 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        selectedRole === 'siswa' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Siswa SMA</p>
                      <p className="text-[11px] text-slate-500">Pelajar pencari magang</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'border-rose-400 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        selectedRole === 'admin' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Admin Magang</p>
                      <p className="text-[11px] text-slate-500">Guru / Pembimbing</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={selectedRole === 'siswa' ? 'siswa@magisma.id' : 'admin@magisma.id'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <span className="text-[11px] text-rose-500">
                    Demo: {selectedRole === 'siswa' ? 'demo123' : 'admin123'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Sedang memproses...</span>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  atau
                </span>
              </div>

              {/* Google Sign In with Firebase Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk dengan Google (Firebase Cloud)</span>
              </button>
            </form>
          ) : (
            /* --- REGISTER FORM (Siswa Baru) --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Contoh: Aisyah Putri"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* NISN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NISN / NIS
                  </label>
                  <input
                    type="text"
                    value={regNisn}
                    onChange={(e) => setRegNisn(e.target.value)}
                    placeholder="Contoh: 0071234567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* School */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Asal Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="SMA Negeri 1 ..."
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas & Peminatan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
                  >
                    <option value="X Fase E">Kelas X (Fase E)</option>
                    <option value="XI MIPA">Kelas XI - MIPA</option>
                    <option value="XI IPS">Kelas XI - IPS</option>
                    <option value="XI Bahasa & Budaya">Kelas XI - Bahasa & Budaya</option>
                    <option value="XII MIPA">Kelas XII - MIPA</option>
                    <option value="XII IPS">Kelas XII - IPS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Siswa <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Buat Kata Sandi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 5 karakter"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Mendaftarkan akun...</span>
                ) : (
                  <>
                    <span>Daftar Akun Siswa Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Educational Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <BookOpen className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Data disimpan di penyimpanan lokal peramban (localStorage). Bebas digunakan untuk simulasi portofolio SMA.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
