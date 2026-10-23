import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Info,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onSwitchRole: () => void;
  onOpenInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onSwitchRole,
  onOpenInfo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStudent = currentUser?.role === 'siswa';

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Cari Magang', icon: Briefcase },
    { id: 'applications', label: 'Riwayat & Status', icon: ClipboardList },
    { id: 'schedule', label: 'Jadwal Magang', icon: Calendar },
    { id: 'profile', label: 'Profil Saya', icon: UserIcon },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'admin-applications', label: 'Kelola Lamaran', icon: ClipboardList },
    { id: 'admin-programs', label: 'Kelola Program', icon: Briefcase },
    { id: 'admin-students', label: 'Data Siswa', icon: UserIcon },
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top micro banner for prototype notice */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          <strong>MagiSMA Prototipe:</strong> Platform Edukasi Simulasi Magang Siswa SMA — Data tersimpan aman di browser Anda.
        </span>
        <button
          onClick={onOpenInfo}
          className="ml-2 underline hover:text-rose-100 cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
        >
          <Info className="w-3 h-3" /> Info Sistem
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(isStudent ? 'dashboard' : 'admin-dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    MagiSMA
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    SMA / SMK
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal hidden sm:block">
                  Sistem Informasi Magang Siswa SMA
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 shadow-xs ring-1 ring-rose-200'
                      : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Controls & Role Quick Switch */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher Button */}
            <button
              onClick={onSwitchRole}
              title="Beralih peran untuk mencoba sudut pandang Siswa atau Admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
              <span>Ganti ke {isStudent ? 'Admin' : 'Siswa'}</span>
            </button>

            {/* Current User Badge & Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="relative">
                <img
                  src={
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-200"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    isStudent ? 'bg-pink-500' : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div className="text-left text-xs">
                <p className="font-bold text-slate-800 line-clamp-1 max-w-[120px]">
                  {currentUser?.name || 'Pengguna'}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  {isStudent ? (
                    <span className="text-pink-600 font-medium">Siswa SMA</span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 inline" /> Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Keluar dari akun"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onSwitchRole}
              className="text-[11px] px-2 py-1 bg-rose-50 text-rose-700 rounded-md font-semibold border border-rose-200"
            >
              {isStudent ? 'Mode Admin' : 'Mode Siswa'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3 p-3 bg-rose-50/60 rounded-xl mb-3">
            <img
              src={currentUser?.avatarUrl}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-300"
            />
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-800">{currentUser?.name}</p>
              <p className="text-xs text-rose-600 font-medium">
                {isStudent ? 'Siswa SMA' : 'Pembimbing / Admin Magang'} • {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenInfo();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-500 flex items-center gap-1.5 py-1"
            >
              <Info className="w-4 h-4 text-rose-500" />
              Info Sistem & Cadangan
            </button>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 px-3 py-1.5 bg-rose-50 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
