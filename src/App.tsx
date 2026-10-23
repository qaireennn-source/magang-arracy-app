/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { ProgramsView } from './components/ProgramsView';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { ApplicationModal } from './components/ApplicationModal';
import { ApplicationsView } from './components/ApplicationsView';
import { AcceptanceLetterModal } from './components/AcceptanceLetterModal';
import { ProfileView } from './components/ProfileView';
import { ScheduleView } from './components/ScheduleView';
import { AdminDashboard } from './components/AdminDashboard';
import { SystemInfoModal } from './components/SystemInfoModal';
import { storageService } from './services/storageService';
import { testFirestoreConnection } from './services/firebase';
import {
  User,
  StudentProfile,
  InternshipProgram,
  Application,
  ScheduleItem,
  ApplicationStatus,
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Global States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [allStudentProfiles, setAllStudentProfiles] = useState<StudentProfile[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<string>('admin-applications');

  // Modals
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<InternshipProgram | null>(null);
  const [selectedProgramToApply, setSelectedProgramToApply] = useState<InternshipProgram | null>(null);
  const [acceptanceLetterApp, setAcceptanceLetterApp] = useState<Application | null>(null);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(
    null
  );

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load data from storage
  const refreshData = () => {
    const active = storageService.getActiveUser();
    setCurrentUser(active);

    const progs = storageService.getPrograms();
    setPrograms(progs);

    const apps = storageService.getApplications();
    setApplications(apps);

    const scheds = storageService.getSchedules();
    setSchedules(scheds);

    const profs = storageService.getStudentProfiles();
    setAllStudentProfiles(profs);

    const usrs = storageService.getUsers();
    setAllUsers(usrs);

    if (active) {
      if (active.role === 'siswa') {
        const prof = storageService.getProfileByUserId(active.id);
        setStudentProfile(prof);
      } else {
        // If logged in as admin, set default tab to admin dashboard if currently on a student tab
        if (!activeTab.startsWith('admin-')) {
          setActiveTab('admin-dashboard');
        }
      }
    }
  };

  useEffect(() => {
    refreshData();
    testFirestoreConnection().catch((err) =>
      console.warn('Initial Firestore connection check:', err)
    );
  }, []);

  // Handle Login / Registration Success
  const handleAuthSuccess = (user: User) => {
    storageService.setActiveUser(user);
    setCurrentUser(user);

    if (user.role === 'siswa') {
      const prof = storageService.getProfileByUserId(user.id);
      setStudentProfile(prof);
      setActiveTab('dashboard');
      showToast(`Selamat datang kembali, ${user.name}!`);
    } else {
      setActiveTab('admin-dashboard');
      setAdminSubTab('admin-applications');
      showToast(`Masuk sebagai Admin Pengelola: ${user.name}`);
    }
  };

  // Logout
  const handleLogout = () => {
    storageService.setActiveUser(null);
    setCurrentUser(null);
    setStudentProfile(null);
    showToast('Anda telah berhasil keluar dari akun.', 'info');
  };

  // Quick switch role (between demo student and demo admin)
  const handleSwitchRole = () => {
    const users = storageService.getUsers();
    if (currentUser?.role === 'siswa') {
      const admin = users.find((u) => u.role === 'admin') || users[1];
      storageService.setActiveUser(admin);
      setCurrentUser(admin);
      setActiveTab('admin-dashboard');
      setAdminSubTab('admin-applications');
      showToast('Beralih ke tampilan Admin Pembimbing (Ibu Retno)');
    } else {
      const student = users.find((u) => u.role === 'siswa') || users[0];
      storageService.setActiveUser(student);
      setCurrentUser(student);
      const prof = storageService.getProfileByUserId(student.id);
      setStudentProfile(prof);
      setActiveTab('dashboard');
      showToast('Beralih ke tampilan Siswa (Rian Pratama)');
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = (updated: StudentProfile) => {
    storageService.updateStudentProfile(updated);
    setStudentProfile(updated);
    refreshData();
    showToast('Profil siswa berhasil diperbarui!');
  };

  // Handle Application Submit
  const handleApplicationSuccess = (newApp: Application) => {
    setSelectedProgramToApply(null);
    refreshData();
    showToast(`Pendaftaran untuk "${newApp.programTitle}" berhasil dikirim!`);
    setActiveTab('applications');
  };

  // Handle Admin updating status
  const handleAdminUpdateStatus = (
    appId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    orientationDate?: string
  ) => {
    storageService.updateApplicationStatus(appId, status, adminNotes, orientationDate);
    refreshData();
    showToast(`Status lamaran berhasil diubah menjadi: ${status}`);
  };

  // Handle Program Add / Update / Delete
  const handleAddProgram = (newProg: Omit<InternshipProgram, 'id' | 'registeredCount'>) => {
    storageService.addProgram(newProg);
    refreshData();
    showToast('Program magang baru berhasil dipublikasikan!');
  };

  const handleUpdateProgram = (prog: InternshipProgram) => {
    storageService.updateProgram(prog);
    refreshData();
    showToast('Program magang berhasil diperbarui!');
  };

  const handleDeleteProgram = (id: string) => {
    storageService.deleteProgram(id);
    refreshData();
    showToast('Program magang telah dihapus.');
  };

  // Schedule interactions
  const handleAddSchedule = (item: Omit<ScheduleItem, 'id'>) => {
    storageService.addScheduleItem(item);
    refreshData();
    showToast('Catatan jadwal baru berhasil ditambahkan!');
  };

  const handleToggleSchedule = (id: string) => {
    storageService.toggleScheduleCompleted(id);
    refreshData();
  };

  const handleDeleteSchedule = (id: string) => {
    storageService.deleteScheduleItem(id);
    refreshData();
    showToast('Catatan agenda telah dihapus.');
  };

  // If not logged in, render the Auth view
  if (!currentUser) {
    return <AuthModal onSuccess={handleAuthSuccess} />;
  }

  const isStudent = currentUser.role === 'siswa';

  // Filter applications for active student
  const studentApplications = studentProfile
    ? applications.filter(
        (a) => a.studentId === studentProfile.id || a.studentEmail === currentUser.email
      )
    : [];

  // Filter schedules for active student
  const studentSchedules = studentProfile
    ? schedules.filter((s) => s.studentId === studentProfile.id)
    : schedules;

  return (
    <div className="min-h-screen bg-[#FAF8F9] text-slate-800 flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenInfo={() => setIsSystemInfoOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- STUDENT VIEWS --- */}
        {isStudent && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                profile={studentProfile}
                programs={programs}
                applications={studentApplications}
                schedules={studentSchedules}
                onNavigate={setActiveTab}
                onOpenProgramDetail={(prog) => setSelectedProgramDetail(prog)}
                onOpenApply={(prog) => setSelectedProgramToApply(prog)}
                onSelectApplication={(app) => {
                  setActiveTab('applications');
                }}
              />
            )}

            {activeTab === 'programs' && (
              <ProgramsView
                programs={programs}
                applications={studentApplications}
                onOpenDetail={(prog) => setSelectedProgramDetail(prog)}
                onOpenApply={(prog) => setSelectedProgramToApply(prog)}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsView
                applications={studentApplications}
                onNavigateToSchedule={() => setActiveTab('schedule')}
                onOpenAcceptanceLetter={(app) => setAcceptanceLetterApp(app)}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                schedules={studentSchedules}
                studentId={studentProfile?.id || 'prof_siswa_1'}
                onAddSchedule={handleAddSchedule}
                onToggleComplete={handleToggleSchedule}
                onDeleteSchedule={handleDeleteSchedule}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                profile={studentProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </>
        )}

        {/* --- ADMIN VIEWS --- */}
        {!isStudent && (
          <AdminDashboard
            programs={programs}
            applications={applications}
            studentProfiles={allStudentProfiles}
            users={allUsers}
            currentSubTab={adminSubTab}
            onSetSubTab={setAdminSubTab}
            onAddProgram={handleAddProgram}
            onUpdateProgram={handleUpdateProgram}
            onDeleteProgram={handleDeleteProgram}
            onUpdateAppStatus={handleAdminUpdateStatus}
            onSwitchToStudentView={handleSwitchRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-rose-100 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            <strong>MagiSMA</strong> — Sistem Informasi Magang Siswa SMA Teladan
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Data Simulasi Edukasi</span>
            <span>•</span>
            <button
              onClick={() => setIsSystemInfoOpen(true)}
              className="text-rose-600 hover:underline cursor-pointer"
            >
              Info Sistem & Penyimpanan
            </button>
            <span>•</span>
            <button
              onClick={handleSwitchRole}
              className="text-slate-600 hover:text-rose-600 hover:underline cursor-pointer"
            >
              Mode {isStudent ? 'Admin' : 'Siswa'}
            </button>
          </div>
        </div>
      </footer>

      {/* Program Detail Modal */}
      <ProgramDetailModal
        program={selectedProgramDetail}
        hasApplied={
          selectedProgramDetail && studentProfile
            ? storageService.hasApplied(selectedProgramDetail.id, studentProfile.id)
            : false
        }
        onClose={() => setSelectedProgramDetail(null)}
        onApply={(prog) => {
          setSelectedProgramDetail(null);
          setSelectedProgramToApply(prog);
        }}
      />

      {/* Application Form Modal */}
      <ApplicationModal
        program={selectedProgramToApply}
        studentProfile={studentProfile}
        onClose={() => setSelectedProgramToApply(null)}
        onSuccess={handleApplicationSuccess}
      />

      {/* Acceptance Letter Modal */}
      <AcceptanceLetterModal
        application={acceptanceLetterApp}
        onClose={() => setAcceptanceLetterApp(null)}
      />

      {/* System Info & Reset Modal */}
      <SystemInfoModal
        isOpen={isSystemInfoOpen}
        onClose={() => setIsSystemInfoOpen(false)}
        onDataReset={refreshData}
      />
    </div>
  );
}
