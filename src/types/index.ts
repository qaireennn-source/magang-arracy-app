export type UserRole = 'siswa' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  nisn: string;
  school: string;
  grade: string;
  email: string;
  phone: string;
  interests: string[];
  bio: string;
  cvFileName: string;
  cvFileSize: string;
  cvUploadDate: string;
  cvUrl?: string;
  avatarUrl?: string;
}

export type WorkType = 'Onsite' | 'Hybrid' | 'Remote';
export type ProgramStatus = 'Buka' | 'Segera Ditutup' | 'Ditutup';

export interface InternshipProgram {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  sector: string; // e.g., 'Administrasi Perkantoran', 'Desain Grafis & Kreatif', etc.
  description: string;
  responsibilities: string[];
  requirements: string[];
  location: string;
  city: string;
  workType: WorkType;
  period: string; // e.g. '1 Juli - 31 Agustus 2026'
  duration: string; // e.g. '2 Bulan'
  deadline: string; // e.g. '2026-06-20'
  quota: number;
  registeredCount: number;
  status: ProgramStatus;
  allowanceNotes?: string;
  mentorName?: string;
  contactEmail?: string;
}

export type ApplicationStatus = 'Menunggu Review' | 'Sedang Diproses' | 'Diterima' | 'Ditolak';

export interface Application {
  id: string;
  programId: string;
  programTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentSchool: string;
  studentGrade: string;
  studentNisn: string;
  studentEmail: string;
  studentPhone: string;
  motivation: string;
  targetInterest: string;
  cvFileName: string;
  cvFileSize?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  adminNotes?: string;
  orientationDate?: string;
}

export type ScheduleType = 'orientasi' | 'kegiatan' | 'mentoring' | 'tenggat_laporan' | 'catatan_pribadi';

export interface ScheduleItem {
  id: string;
  studentId: string;
  applicationId?: string;
  programTitle: string;
  companyName: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. '09:00 - 11:30 WIB'
  location: string;
  type: ScheduleType;
  isCompleted?: boolean;
}
