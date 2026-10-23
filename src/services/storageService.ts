import {
  User,
  UserRole,
  StudentProfile,
  InternshipProgram,
  Application,
  ScheduleItem,
  ApplicationStatus,
} from '../types';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';

const STORAGE_KEYS = {
  USERS: 'magisma_users_v1',
  ACTIVE_USER: 'magisma_active_user_v1',
  STUDENT_PROFILES: 'magisma_student_profiles_v1',
  PROGRAMS: 'magisma_programs_v1',
  APPLICATIONS: 'magisma_applications_v1',
  SCHEDULES: 'magisma_schedules_v1',
  INITIALIZED: 'magisma_initialized_v1',
  FIREBASE_SYNCED: 'magisma_firebase_synced_v1',
};

// Default seed data
export const INITIAL_USERS: User[] = [
  {
    id: 'user_siswa_1',
    email: 'siswa@magisma.id',
    password: 'demo123',
    name: 'Rian Pratama',
    role: 'siswa',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-05-10T08:00:00Z',
  },
  {
    id: 'user_admin_1',
    email: 'admin@magisma.id',
    password: 'admin123',
    name: 'Ibu Retno Wulandari, S.Pd',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-05-01T08:00:00Z',
  },
];

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'prof_siswa_1',
    userId: 'user_siswa_1',
    fullName: 'Rian Pratama',
    nisn: '0067823910',
    school: 'SMA Negeri 1 Teladan',
    grade: 'XI MIPA 2',
    email: 'siswa@magisma.id',
    phone: '0812-3456-7890',
    interests: ['Desain Grafis & Kreatif', 'Media Sosial & Digital Marketing', 'Teknologi Informasi'],
    bio: 'Siswa kelas XI yang antusias dalam eksplorasi dunia digital kreatif dan teknologi. Aktif di ekstrakurikuler Jurnalistik Sekolah dan Desain Media OSIS. Ingin belajar dinamika kerja nyata di industri kreatif.',
    cvFileName: 'CV_Rian_Pratama_SMA1.pdf',
    cvFileSize: '1.2 MB',
    cvUploadDate: '2026-05-12',
    cvUrl: '#',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_PROGRAMS: InternshipProgram[] = [
  {
    id: 'prog_1',
    title: 'Desain Grafis & Kreatif Visual Muda',
    companyName: 'Studio Imaji Kreasi Nusantara',
    companyLogo: '🎨',
    sector: 'Desain Grafis dan Kreatif',
    description: 'Program magang khusus siswa SMA yang tertarik mempelajari proses pembuatan aset visual, konten infografis media sosial, dan branding dasar dengan bimbingan desainer grafis profesional.',
    responsibilities: [
      'Membantu mendesain template konten media sosial mingguan',
      'Mempelajari dasar tipografi, palet warna, dan komposisi visual',
      'Terlibat dalam sesi brainstorming ide kreatif proyek studio',
      'Mengorganisir aset grafis dan elemen desain tim',
    ],
    requirements: [
      'Siswa aktif SMA kelas X atau XI',
      'Memiliki minat besar di bidang seni grafis atau digital art',
      'Familiar dengan aplikasi seperti Canva, Figma, atau Photoshop',
      'Mendapat izin dari pihak sekolah dan orang tua',
    ],
    location: 'Jl. Pemuda No. 45, Menteng',
    city: 'Jakarta Pusat',
    workType: 'Hybrid',
    period: '1 Juli - 31 Agustus 2026',
    duration: '2 Bulan (8 Minggu)',
    deadline: '2026-06-25',
    quota: 6,
    registeredCount: 4,
    status: 'Buka',
    allowanceNotes: 'Uang saku transport + Sertifikat Magang Resmi + Portofolio Bersama',
    mentorName: 'Kak Dimas (Lead Illustrator)',
    contactEmail: 'intern@imajikreasi.id',
  },
  {
    id: 'prog_2',
    title: 'Media Sosial & Konten Digital Marketing',
    companyName: 'Agensi Cerita Muda Kreatif',
    companyLogo: '📱',
    sector: 'Media Sosial dan Digital Marketing',
    description: 'Kesempatan bagi pelajar SMA untuk terjun langsung mempraktikkan pembuatan konten video pendek (TikTok & Reels), copywriting kreatif, serta analisis tren media sosial.',
    responsibilities: [
      'Riset tren terkini yang sedang viral di kalangan Gen-Z',
      'Menyusun naskah pendek (storyboard) konten video pendek edukatif',
      'Membantu proses pengambilan gambar dan editing video dasar di CapCut',
      'Membantu membalas komentar audiens secara ramah dan sopan',
    ],
    requirements: [
      'Siswa aktif SMA semua jurusan',
      'Gemar membuat konten video kreatif di media sosial',
      'Percaya diri, komunikatif, dan up-to-date dengan tren digital',
      'Memiliki smartphone berkamera baik',
    ],
    location: 'Jl. Melati Baru Kav. 12',
    city: 'Bandung',
    workType: 'Hybrid',
    period: '5 Juli - 28 Agustus 2026',
    duration: '2 Bulan',
    deadline: '2026-06-20',
    quota: 5,
    registeredCount: 5,
    status: 'Segera Ditutup',
    allowanceNotes: 'Insentif pulsa/data + Goodie Bag merchandise + Sertifikat',
    mentorName: 'Kak Nadia (Social Media Specialist)',
    contactEmail: 'talent@ceritamuda.com',
  },
  {
    id: 'prog_3',
    title: 'Administrasi Perkantoran & Tata Kelola Dokumen',
    companyName: 'Dinas Arsip & Perpustakaan Kota',
    companyLogo: '🏢',
    sector: 'Administrasi Perkantoran',
    description: 'Belajar etika administrasi modern di instansi pemerintahan kota, pengarsipan surat dinas elektronik, serta pelayanan informasi publik yang tertib dan ramah.',
    responsibilities: [
      'Membantu pencatatan surat masuk dan surat keluar pada sistem komputer',
      'Melakukan scan digitalisasi arsip penting dokumen kota',
      'Membantu menyusun agenda rapat dan notulensi sederhana',
      'Mempraktikkan etika komunikasi telepon dan korespondensi formal',
    ],
    requirements: [
      'Siswa SMA/SMK (terbuka untuk peminatan IPS/Bahasa/MIPA)',
      'Teliti, rapi, dan bertanggung jawab terhadap kerahasiaan data',
      'Menguasai Microsoft Word dan Microsoft Excel dasar',
      'Berpenampilan rapi dan santun',
    ],
    location: 'Gedung Balaikota Blok C Lt. 2',
    city: 'Surabaya',
    workType: 'Onsite',
    period: '1 Juli - 15 Agustus 2026',
    duration: '1.5 Bulan (6 Minggu)',
    deadline: '2026-06-18',
    quota: 8,
    registeredCount: 3,
    status: 'Buka',
    allowanceNotes: 'Uang makan harian + Surat Pengantar Magang Dinas Resmi',
    mentorName: 'Bapak Hendra (Kepala Subbag Tata Usaha)',
    contactEmail: 'kepegawaian@arsipkota.go.id',
  },
  {
    id: 'prog_4',
    title: 'Asisten Teknisi IT & Jaringan Komputer',
    companyName: 'Pusat Jaringan Solusindo Mandiri',
    companyLogo: '💻',
    sector: 'Teknologi Informasi',
    description: 'Pelajari praktik perakitan PC, troubleshooting hardware & software, instalasi kabel LAN/Wi-Fi kantor, dan konfigurasi server lokal dasar.',
    responsibilities: [
      'Membantu teknisi senior memeriksa kesehatan perangkat komputer kantor',
      'Belajar crimping kabel UTP dan setting router Wi-Fi dasar',
      'Melakukan instalasi OS dan software pendukung produktivitas',
      'Mencatat inventaris perangkat keras dan perangkat lunak',
    ],
    requirements: [
      'Siswa SMA yang berminat di bidang komputer & hardware',
      'Suka memecahkan masalah teknis perangkat elektronik',
      'Disiplin, jujur, dan memiliki rasa ingin tahu tinggi',
      'Membawa laptop pribadi (opsional namun diutamakan)',
    ],
    location: 'Kompleks Ruko Sentra Tekno No. 8',
    city: 'Yogyakarta',
    workType: 'Onsite',
    period: '10 Juli - 31 Agustus 2026',
    duration: '2 Bulan',
    deadline: '2026-06-28',
    quota: 4,
    registeredCount: 2,
    status: 'Buka',
    allowanceNotes: 'Uang saku transport + Toolkit obeng teknisi pemula + Sertifikat',
    mentorName: 'Mas Fajar (Senior Network Engineer)',
    contactEmail: 'support@solusindo-it.id',
  },
  {
    id: 'prog_5',
    title: 'Perpustakaan & Pengelolaan Informasi Digital',
    companyName: 'Perpustakaan Daerah Cendekia Mulia',
    companyLogo: '📚',
    sector: 'Perpustakaan dan Pengelolaan Informasi',
    description: 'Menimba pengalaman seputar sistem katalog buku berbasis digital (Senayan Library Management System), pelayanan pemustaka ramah anak, dan bedah buku remaja.',
    responsibilities: [
      'Membantu proses barcode dan katalogisasi buku baru',
      'Mendampingi pengunjung dalam pencarian referensi di e-katalog',
      'Membantu mengelola pojok baca anak dan ruang baca remaja',
      'Ikut mempromosikan kegiatan literasi sekolah melalui mading digital',
    ],
    requirements: [
      'Siswa SMA yang gemar membaca dan cinta dunia literasi',
      'Ramah, sabar, dan komunikatif dalam menyapa pengunjung',
      'Mampu mengoperasikan komputer dasar dengan lancar',
      'Surat rekomendasi dari guru BK atau perpustakaan sekolah',
    ],
    location: 'Jl. Kusumanegara No. 102',
    city: 'Yogyakarta',
    workType: 'Onsite',
    period: '1 Juli - 15 Agustus 2026',
    duration: '1.5 Bulan',
    deadline: '2026-06-15',
    quota: 6,
    registeredCount: 5,
    status: 'Segera Ditutup',
    allowanceNotes: 'Gratis akses koleksi premium + Uang saku transport + Piagam apresiasi',
    mentorName: 'Ibu Ratna (Pustakawan Ahli Muda)',
    contactEmail: 'pustaka@cendekiamulia.org',
  },
  {
    id: 'prog_6',
    title: 'Public Relations & Komunikasi Media Sekolah',
    companyName: 'Lembaga Komunika Wicara Publik',
    companyLogo: '🎙️',
    sector: 'Public Relations dan Komunikasi',
    description: 'Asah kemampuan berbicara di depan umum, penyusunan siaran pers acara pemuda, pengelolaan tamu VIP seminar, dan media relations.',
    responsibilities: [
      'Menyusun draft rilis pers dan pesan undangan untuk narasumber',
      'Membantu mendampingi MC dan moderator acara talkshow edukasi',
      'Mendokumentasikan sesi tanya jawab dan testimonial peserta',
      'Berlatih teknik public speaking terstruktur di depan mentor',
    ],
    requirements: [
      'Siswa SMA yang percaya diri dan suka berkomunikasi dengan orang baru',
      'Memiliki kemampuan tata bahasa Indonesia yang santun dan jelas',
      'Aktif di kegiatan OSIS / Pramuka / Debat / Teater diutamakan',
    ],
    location: 'Kuningan Sentra Suite Lt. 5',
    city: 'Jakarta Selatan',
    workType: 'Hybrid',
    period: '8 Juli - 30 Agustus 2026',
    duration: '2 Bulan',
    deadline: '2026-06-22',
    quota: 4,
    registeredCount: 3,
    status: 'Buka',
    allowanceNotes: 'Pelatihan Public Speaking gratis senilai Rp 1.5jt + Sertifikat + Uang Saku',
    mentorName: 'Kak Sabrina (PR Consultant)',
    contactEmail: 'halo@komunikawicara.id',
  },
  {
    id: 'prog_7',
    title: 'Asisten Pengembang Web Pemula (Front-End Junior)',
    companyName: 'TechEdu Nusantara Labs',
    companyLogo: '🌐',
    sector: 'Teknologi Informasi',
    description: 'Belajar merancang tampilan website interaktif menggunakan HTML, CSS modern, dan dasar JavaScript dalam proyek website edukasi pelajar SMA.',
    responsibilities: [
      'Membantu merapikan tampilan responsive website dari desain Figma',
      'Menulis komponen halaman web sederhana menggunakan kode bersih',
      'Melakukan pengetesan tombol, form pendaftaran, dan link di HP & Laptop',
      'Mendiskusikan kode bersama tim developer dalam sesi review santai',
    ],
    requirements: [
      'Siswa SMA yang tertarik dengan coding dan web design',
      'Pernah belajar dasar HTML & CSS (otodidak / ekstrakurikuler)',
      'Memiliki ketelitian dan rasa penasaran bagaimana website bekerja',
    ],
    location: 'Gedung Inovasi Digital Lt. 3',
    city: 'Tangerang Selatan',
    workType: 'Remote',
    period: '1 Juli - 31 Agustus 2026',
    duration: '2 Bulan',
    deadline: '2026-06-25',
    quota: 5,
    registeredCount: 2,
    status: 'Buka',
    allowanceNotes: 'Akses kursus programming premium + Pendampingan portofolio',
    mentorName: 'Kak Reza (Fullstack Engineer)',
    contactEmail: 'talent@techedunusantara.id',
  },
  {
    id: 'prog_8',
    title: 'Dokumentasi & Fotografi Acara Komunitas Pelajar',
    companyName: 'Ruang Komunitas Muda Berdaya',
    companyLogo: '📸',
    sector: 'Desain Grafis dan Kreatif',
    description: 'Tingkatkan keahlian fotografi jurnalistik, pengaturan pencahayaan outdoor/indoor, dan pengarsipan galeri foto kegiatan anak muda positif.',
    responsibilities: [
      'Mengambil foto dokumentasi momen penting pada workshop dan festival pelajar',
      'Melakukan kurasi dan color grading cepat foto pilihan',
      'Membuat caption naratif yang menarik untuk album digital',
      'Mengelola penyimpanan cloud drive foto kegiatan',
    ],
    requirements: [
      'Siswa SMA hobi fotografi (bisa menggunakan kamera DSLR/Mirrorless/HP beresolusi baik)',
      'Suka berbaur di acara festival komunitas atau lomba sekolah',
      'Disiplin waktu dan inisiatif tinggi saat liputan lapangan',
    ],
    location: 'Taman Budaya Remaja',
    city: 'Semarang',
    workType: 'Onsite',
    period: '10 Juli - 25 Agustus 2026',
    duration: '1.5 Bulan',
    deadline: '2026-06-20',
    quota: 4,
    registeredCount: 4,
    status: 'Segera Ditutup',
    allowanceNotes: 'Biaya akomodasi liputan + Kaos official kru + Sertifikat portofolio',
    mentorName: 'Bang Yoga (Photojournalist)',
    contactEmail: 'komunitas@mudaberdaya.id',
  },
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_101',
    programId: 'prog_1',
    programTitle: 'Desain Grafis & Kreatif Visual Muda',
    companyName: 'Studio Imaji Kreasi Nusantara',
    studentId: 'prof_siswa_1',
    studentName: 'Rian Pratama',
    studentSchool: 'SMA Negeri 1 Teladan',
    studentGrade: 'XI MIPA 2',
    studentNisn: '0067823910',
    studentEmail: 'siswa@magisma.id',
    studentPhone: '0812-3456-7890',
    motivation: 'Saya ingin mengasah kemampuan visual yang selama ini saya pelajari di ekstrakurikuler majalah sekolah. Saya sangat mengagumi karya-karya Studio Imaji Kreasi dan ingin belajar alur kerja profesional bersama mentor berpengalaman.',
    targetInterest: 'Desain Grafis & Kreatif Visual',
    cvFileName: 'CV_Rian_Pratama_SMA1.pdf',
    cvFileSize: '1.2 MB',
    status: 'Diterima',
    appliedAt: '2026-05-15',
    updatedAt: '2026-05-18',
    adminNotes: 'Selamat Rian! Portofolio mading dan desain OSIS kamu dinilai sangat kreatif dan sesuai dengan kebutuhan studio kami. Jangan lupa hadir tepat waktu di sesi orientasi ya!',
    orientationDate: '2026-07-01 09:00 WIB',
  },
  {
    id: 'app_102',
    programId: 'prog_2',
    programTitle: 'Media Sosial & Konten Digital Marketing',
    companyName: 'Agensi Cerita Muda Kreatif',
    studentId: 'prof_siswa_1',
    studentName: 'Rian Pratama',
    studentSchool: 'SMA Negeri 1 Teladan',
    studentGrade: 'XI MIPA 2',
    studentNisn: '0067823910',
    studentEmail: 'siswa@magisma.id',
    studentPhone: '0812-3456-7890',
    motivation: 'Ingin mendalami bagaimana membuat konten video pendek edukasi yang diminati pelajar sebaya dan mengerti dasar analisis algoritma medsos.',
    targetInterest: 'Media Sosial & Digital Marketing',
    cvFileName: 'CV_Rian_Pratama_SMA1.pdf',
    cvFileSize: '1.2 MB',
    status: 'Sedang Diproses',
    appliedAt: '2026-05-20',
    updatedAt: '2026-05-22',
    adminNotes: 'Berkas dan CV kamu sudah masuk ke tahap peninjauan oleh Tim Marketing Cerita Muda. Hasil final diumumkan maksimal 10 Juni 2026.',
  },
  {
    id: 'app_103',
    programId: 'prog_3',
    programTitle: 'Administrasi Perkantoran & Tata Kelola Dokumen',
    companyName: 'Dinas Arsip & Perpustakaan Kota',
    studentId: 'prof_siswa_1',
    studentName: 'Rian Pratama',
    studentSchool: 'SMA Negeri 1 Teladan',
    studentGrade: 'XI MIPA 2',
    studentNisn: '0067823910',
    studentEmail: 'siswa@magisma.id',
    studentPhone: '0812-3456-7890',
    motivation: 'Tertarik mengenal sistem persuratan dinas dan etika perkantoran agar terbiasa dengan lingkungan kerja profesional sejak dini.',
    targetInterest: 'Administrasi Perkantoran',
    cvFileName: 'CV_Rian_Pratama_SMA1.pdf',
    cvFileSize: '1.2 MB',
    status: 'Menunggu Review',
    appliedAt: '2026-05-25',
    updatedAt: '2026-05-25',
    adminNotes: 'Pendaftaran diterima di sistem. Menunggu verifikasi berkas oleh panitia dinas.',
  },
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sched_1',
    studentId: 'prof_siswa_1',
    applicationId: 'app_101',
    programTitle: 'Desain Grafis & Kreatif Visual Muda',
    companyName: 'Studio Imaji Kreasi Nusantara',
    title: 'Orientasi Pengenalan Tempat Kerja & Tim Mentor',
    description: 'Sesi temu sapa dengan mentor Kak Dimas, pengenalan kultur studio, pembagian laptop kerja, dan akun akses server desain.',
    date: '2026-07-01',
    time: '09:00 - 12:00 WIB',
    location: 'Studio Imaji Kreasi, Ruang Kolaborasi Lt. 2',
    type: 'orientasi',
    isCompleted: false,
  },
  {
    id: 'sched_2',
    studentId: 'prof_siswa_1',
    applicationId: 'app_101',
    programTitle: 'Desain Grafis & Kreatif Visual Muda',
    companyName: 'Studio Imaji Kreasi Nusantara',
    title: 'Workshop Singkat: Standar Desain & Typography Studio',
    description: 'Belajar grid system, color harmony, dan pedoman gaya visual resmi yang digunakan studio.',
    date: '2026-07-07',
    time: '13:30 - 15:30 WIB',
    location: 'Online via Google Meet',
    type: 'mentoring',
    isCompleted: false,
  },
  {
    id: 'sched_3',
    studentId: 'prof_siswa_1',
    applicationId: 'app_101',
    programTitle: 'Desain Grafis & Kreatif Visual Muda',
    companyName: 'Studio Imaji Kreasi Nusantara',
    title: 'Tenggat Laporan Magang Mingguan (Minggu ke-2)',
    description: 'Unggah jurnal kegiatan harian dan rekap aset visual yang telah dibuat ke formulir pembimbing sekolah.',
    date: '2026-07-15',
    time: '23:59 WIB',
    location: 'Portal MagiSMA',
    type: 'tenggat_laporan',
    isCompleted: false,
  },
  {
    id: 'sched_4',
    studentId: 'prof_siswa_1',
    programTitle: 'Kegiatan Siswa',
    companyName: 'Catatan Pribadi',
    title: 'Konsultasi Buku Jurnal Magang dengan Guru Pembimbing SMA',
    description: 'Menemui Bu Retno di ruang guru untuk paraf lembar kehadiran magang minggu pertama.',
    date: '2026-07-18',
    time: '10:00 - 11:00 WIB',
    location: 'Ruang Guru SMAN 1 Teladan',
    type: 'catatan_pribadi',
    isCompleted: false,
  },
  {
    id: 'sched_5',
    studentId: 'prof_siswa_1',
    applicationId: 'app_101',
    programTitle: 'Desain Grafis & Kreatif Visual Muda',
    companyName: 'Studio Imaji Kreasi Nusantara',
    title: 'Presentasi Hasil Proyek Akhir Magang & Pelepasan Siswa',
    description: 'Pameran mini portofolio hasil magang di hadapan seluruh tim desainer studio dan penyerahan sertifikat kelulusan magang.',
    date: '2026-08-31',
    time: '14:00 - 16:30 WIB',
    location: 'Auditorium Studio Imaji Kreasi',
    type: 'kegiatan',
    isCompleted: false,
  },
];

// Helper to safely access localStorage
class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public initializeStorage(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(INITIAL_STUDENT_PROFILES));
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(INITIAL_USERS[0])); // Default login as demo student
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    if (!this.isBrowser()) return INITIAL_USERS;
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  }

  public getActiveUser(): User | null {
    if (!this.isBrowser()) return INITIAL_USERS[0];
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return data ? JSON.parse(data) : null;
  }

  public setActiveUser(user: User | null): void {
    if (!this.isBrowser()) return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
  }

  public login(email: string, pass: string, role?: string): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'Email tidak ditemukan. Silakan periksa kembali atau daftar akun baru.' };
    }

    if (found.password && found.password !== pass) {
      return { success: false, message: 'Kata sandi tidak sesuai. Silakan coba lagi.' };
    }

    if (role && found.role !== role) {
      return {
        success: false,
        message: `Akun ini terdaftar sebagai ${found.role.toUpperCase()}, bukan ${role.toUpperCase()}. Silakan sesuaikan pilihan peran Anda.`,
      };
    }

    this.setActiveUser(found);
    return { success: true, user: found };
  }

  public registerStudent(data: {
    fullName: string;
    email: string;
    password: string;
    nisn: string;
    school: string;
    grade: string;
    phone: string;
  }): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.' };
    }

    const newUserId = 'user_' + Date.now();
    const newUser: User = {
      id: newUserId,
      email: cleanEmail,
      password: data.password,
      name: data.fullName,
      role: 'siswa',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.fullName)}`,
      createdAt: new Date().toISOString(),
    };

    const newProfile: StudentProfile = {
      id: 'prof_' + Date.now(),
      userId: newUserId,
      fullName: data.fullName,
      nisn: data.nisn || '00' + Math.floor(10000000 + Math.random() * 90000000),
      school: data.school || 'SMA Negeri',
      grade: data.grade || 'XI MIPA',
      email: cleanEmail,
      phone: data.phone || '0812-0000-0000',
      interests: ['Teknologi Informasi', 'Administrasi Perkantoran'],
      bio: 'Siswa aktif yang siap mencari pengalaman magang baru dan mengembangkan keterampilan.',
      cvFileName: 'CV_' + data.fullName.replace(/\s+/g, '_') + '.pdf',
      cvFileSize: '850 KB',
      cvUploadDate: new Date().toISOString().split('T')[0],
      cvUrl: '#',
      avatarUrl: newUser.avatarUrl,
    };

    users.push(newUser);
    const profiles = this.getStudentProfiles();
    profiles.push(newProfile);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(profiles));
    }

    this.setActiveUser(newUser);
    return { success: true, user: newUser };
  }

  // --- Student Profile ---
  public getStudentProfiles(): StudentProfile[] {
    if (!this.isBrowser()) return INITIAL_STUDENT_PROFILES;
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
    return data ? JSON.parse(data) : INITIAL_STUDENT_PROFILES;
  }

  public getProfileByUserId(userId: string): StudentProfile | null {
    const profiles = this.getStudentProfiles();
    const found = profiles.find(p => p.userId === userId);
    if (found) return found;

    // Fallback if user profile doesn't exist yet, create one
    const active = this.getActiveUser();
    if (active && active.id === userId && active.role === 'siswa') {
      const fallback: StudentProfile = {
        id: 'prof_' + userId,
        userId: active.id,
        fullName: active.name,
        nisn: '0067823910',
        school: 'SMA Negeri 1',
        grade: 'XI MIPA 1',
        email: active.email,
        phone: '0812-3456-7890',
        interests: ['Desain Grafis dan Kreatif', 'Teknologi Informasi'],
        bio: 'Siswa SMA bersemangat untuk belajar dan berkontribusi di tempat magang.',
        cvFileName: 'CV_Siswa_SMA.pdf',
        cvFileSize: '1.0 MB',
        cvUploadDate: new Date().toISOString().split('T')[0],
      };
      profiles.push(fallback);
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(profiles));
      }
      return fallback;
    }
    return profiles[0] || null;
  }

  public updateStudentProfile(profile: StudentProfile): void {
    const profiles = this.getStudentProfiles();
    const index = profiles.findIndex(p => p.id === profile.id || p.userId === profile.userId);
    if (index !== -1) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(profiles));
    }

    // Also update active user display name if matching
    const active = this.getActiveUser();
    if (active && active.id === profile.userId) {
      active.name = profile.fullName;
      this.setActiveUser(active);
    }
  }

  // --- Internship Programs ---
  public getPrograms(): InternshipProgram[] {
    if (!this.isBrowser()) return INITIAL_PROGRAMS;
    const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    return data ? JSON.parse(data) : INITIAL_PROGRAMS;
  }

  public getProgramById(id: string): InternshipProgram | undefined {
    return this.getPrograms().find(p => p.id === id);
  }

  public addProgram(program: Omit<InternshipProgram, 'id' | 'registeredCount'>): InternshipProgram {
    const programs = this.getPrograms();
    const newProgram: InternshipProgram = {
      ...program,
      id: 'prog_' + Date.now(),
      registeredCount: 0,
    };
    programs.unshift(newProgram);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
    }
    return newProgram;
  }

  public updateProgram(updated: InternshipProgram): void {
    const programs = this.getPrograms();
    const index = programs.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      programs[index] = updated;
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
      }
    }
  }

  public deleteProgram(id: string): void {
    const programs = this.getPrograms().filter(p => p.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
    }
  }

  // --- Applications ---
  public getApplications(): Application[] {
    if (!this.isBrowser()) return INITIAL_APPLICATIONS;
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
  }

  public getApplicationsByStudent(studentIdOrUserId: string): Application[] {
    const apps = this.getApplications();
    const profile = this.getProfileByUserId(studentIdOrUserId);
    const targetStudentId = profile ? profile.id : studentIdOrUserId;
    return apps.filter(a => a.studentId === targetStudentId || a.studentEmail === studentIdOrUserId);
  }

  public hasApplied(programId: string, studentId: string): boolean {
    const apps = this.getApplications();
    return apps.some(a => a.programId === programId && a.studentId === studentId);
  }

  public applyToProgram(data: {
    programId: string;
    studentProfile: StudentProfile;
    motivation: string;
    targetInterest: string;
    cvFileName: string;
    cvFileSize?: string;
  }): { success: boolean; application?: Application; message?: string } {
    if (this.hasApplied(data.programId, data.studentProfile.id)) {
      return {
        success: false,
        message: 'Kamu sudah pernah mengirimkan pendaftaran untuk program magang ini! Silakan cek menu "Riwayat Pendaftaran".',
      };
    }

    const program = this.getProgramById(data.programId);
    if (!program) {
      return { success: false, message: 'Program magang tidak ditemukan.' };
    }

    const newApp: Application = {
      id: 'app_' + Date.now(),
      programId: program.id,
      programTitle: program.title,
      companyName: program.companyName,
      studentId: data.studentProfile.id,
      studentName: data.studentProfile.fullName,
      studentSchool: data.studentProfile.school,
      studentGrade: data.studentProfile.grade,
      studentNisn: data.studentProfile.nisn,
      studentEmail: data.studentProfile.email,
      studentPhone: data.studentProfile.phone,
      motivation: data.motivation,
      targetInterest: data.targetInterest || program.sector,
      cvFileName: data.cvFileName || data.studentProfile.cvFileName,
      cvFileSize: data.cvFileSize || data.studentProfile.cvFileSize,
      status: 'Menunggu Review',
      appliedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      adminNotes: 'Pendaftaran telah berhasil diterima oleh sistem. Tim seleksi akan segera memeriksa kelengkapan berkasmu.',
    };

    const apps = this.getApplications();
    apps.unshift(newApp);

    // Increase registered count on program
    program.registeredCount = (program.registeredCount || 0) + 1;
    this.updateProgram(program);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    }

    return { success: true, application: newApp };
  }

  public updateApplicationStatus(
    appId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    orientationDate?: string
  ): void {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === appId);
    if (index !== -1) {
      const app = apps[index];
      app.status = status;
      app.updatedAt = new Date().toISOString().split('T')[0];
      if (adminNotes !== undefined) app.adminNotes = adminNotes;
      if (orientationDate !== undefined) app.orientationDate = orientationDate;

      // If status changed to Diterima, automatically seed an orientation schedule item for the student!
      if (status === 'Diterima') {
        const schedules = this.getSchedules();
        const exists = schedules.some(s => s.applicationId === appId && s.type === 'orientasi');
        if (!exists) {
          const newSchedule: ScheduleItem = {
            id: 'sched_' + Date.now(),
            studentId: app.studentId,
            applicationId: app.id,
            programTitle: app.programTitle,
            companyName: app.companyName,
            title: `Orientasi Magang: ${app.programTitle}`,
            description: `Selamat bergabung! Sesi orientasi dan pembekalan awal di ${app.companyName}.`,
            date: orientationDate ? orientationDate.split(' ')[0] : '2026-07-01',
            time: '09:00 - 11:30 WIB',
            location: 'Lokasi Kantor / Online (cek detail catatan)',
            type: 'orientasi',
            isCompleted: false,
          };
          schedules.unshift(newSchedule);
          if (this.isBrowser()) {
            localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
          }
        }
      }

      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      }
    }
  }

  // --- Schedules ---
  public getSchedules(): ScheduleItem[] {
    if (!this.isBrowser()) return INITIAL_SCHEDULES;
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return data ? JSON.parse(data) : INITIAL_SCHEDULES;
  }

  public getSchedulesByStudent(studentId: string): ScheduleItem[] {
    const schedules = this.getSchedules();
    return schedules.filter(s => s.studentId === studentId);
  }

  public addScheduleItem(item: Omit<ScheduleItem, 'id'>): ScheduleItem {
    const schedules = this.getSchedules();
    const newItem: ScheduleItem = {
      ...item,
      id: 'sched_' + Date.now(),
    };
    schedules.push(newItem);
    // Sort by date ascending
    schedules.sort((a, b) => a.date.localeCompare(b.date));
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    }
    return newItem;
  }

  public toggleScheduleCompleted(id: string): void {
    const schedules = this.getSchedules();
    const item = schedules.find(s => s.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
      }
    }
  }

  public deleteScheduleItem(id: string): void {
    const schedules = this.getSchedules().filter(s => s.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    }
  }

  // --- Firebase Cloud Sync & Authentication ---
  public async loginWithGoogle(role: UserRole = 'siswa'): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const email = fbUser.email || '';
      const name = fbUser.displayName || (role === 'siswa' ? 'Siswa MagiSMA' : 'Admin Pembimbing');
      const avatarUrl = fbUser.photoURL || undefined;

      // Check if user already exists in storage or create
      const users = this.getUsers();
      let appUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!appUser) {
        appUser = {
          id: fbUser.uid,
          email,
          name,
          role,
          avatarUrl,
          createdAt: new Date().toISOString(),
        };
        users.push(appUser);
        if (this.isBrowser()) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }

        // Also create student profile if role is siswa
        if (role === 'siswa') {
          const profiles = this.getStudentProfiles();
          const newProfile: StudentProfile = {
            id: 'prof_' + fbUser.uid,
            userId: fbUser.uid,
            fullName: name,
            nisn: '00' + Math.floor(10000000 + Math.random() * 90000000),
            school: 'SMA Negeri 1 Teladan',
            grade: 'XI MIPA 1',
            email,
            phone: '0812-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
            interests: ['Teknologi Informasi', 'Desain Grafis & Kreatif'],
            bio: 'Siswa SMA aktif terdaftar melalui Firebase Google Authentication.',
            cvFileName: `CV_${name.replace(/\s+/g, '_')}.pdf`,
            cvFileSize: '1.1 MB',
            cvUploadDate: new Date().toISOString().split('T')[0],
            avatarUrl,
          };
          profiles.push(newProfile);
          if (this.isBrowser()) {
            localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(profiles));
          }

          // Also attempt to save to Firestore
          try {
            await setDoc(doc(db, 'student_profiles', newProfile.id), newProfile);
          } catch {
            // non-blocking
          }
        }

        // Try writing user to Firestore
        try {
          await setDoc(doc(db, 'users', appUser.id), appUser);
        } catch {
          // non-blocking
        }
      }

      this.setActiveUser(appUser);
      return { success: true, user: appUser };
    } catch (error: any) {
      console.error('Firebase Google login error:', error);
      return { success: false, message: error?.message || 'Gagal masuk dengan Google.' };
    }
  }

  public async syncToFirestore(): Promise<{ success: boolean; count: number }> {
    try {
      const programs = this.getPrograms();
      let count = 0;
      for (const p of programs) {
        const path = `programs/${p.id}`;
        try {
          await setDoc(doc(db, 'programs', p.id), p);
          count++;
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
      }
      return { success: true, count };
    } catch (err) {
      console.warn('Sync to Firestore skipped or partial:', err);
      return { success: false, count: 0 };
    }
  }

  public async syncFromFirestore(): Promise<boolean> {
    try {
      const snap = await getDocs(collection(db, 'programs'));
      if (!snap.empty) {
        const remotePrograms: InternshipProgram[] = [];
        snap.forEach((d) => remotePrograms.push(d.data() as InternshipProgram));
        if (remotePrograms.length > 0 && this.isBrowser()) {
          localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(remotePrograms));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.warn('Sync from Firestore skipped:', err);
      return false;
    }
  }

  // --- System Reset & Export ---
  public resetToDefault(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(INITIAL_STUDENT_PROFILES));
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  public exportAllData(): string {
    return JSON.stringify(
      {
        users: this.getUsers(),
        studentProfiles: this.getStudentProfiles(),
        programs: this.getPrograms(),
        applications: this.getApplications(),
        schedules: this.getSchedules(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      },
      null,
      2
    );
  }
}

export const storageService = new StorageService();
// Initialize immediately on module load
storageService.initializeStorage();
