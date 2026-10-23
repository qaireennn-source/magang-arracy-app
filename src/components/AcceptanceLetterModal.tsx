import React from 'react';
import {
  X,
  Award,
  Printer,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Application } from '../types';

interface AcceptanceLetterModalProps {
  application: Application | null;
  onClose: () => void;
}

export const AcceptanceLetterModal: React.FC<AcceptanceLetterModalProps> = ({
  application,
  onClose,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Actions */}
        <div className="px-6 py-3.5 bg-slate-800 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Surat Keterangan Diterima Magang (Simulasi Resmi)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-800 bg-white font-serif print:p-0">
          {/* Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-sans font-bold">
                {application.companyName.charAt(0)}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase font-sans tracking-wide text-slate-900">
                  {application.companyName}
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Divisi Pengembangan Sumber Daya Manusia & Kemitraan Sekolah Menengah Atas
                </p>
                <p className="text-[11px] text-slate-400 font-sans">
                  Portal Resmi Integrasi Magang Siswa — MagiSMA
                </p>
              </div>
            </div>
            <div className="text-right text-xs font-sans text-slate-500 hidden sm:block">
              <p>Nomor: MAGISMA/LOA/{new Date().getFullYear()}/{application.id.slice(-4)}</p>
              <p>Tanggal: {application.updatedAt || application.appliedAt}</p>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center space-y-1 font-sans">
            <h3 className="text-base sm:text-lg font-extrabold uppercase underline tracking-wider text-slate-900">
              SURAT PEMBERITAHUAN PENERIMAAN MAGANG SISWA
            </h3>
            <p className="text-xs text-slate-500">
              Lampiran: Rincian Jadwal & Syarat Orientasi Awal
            </p>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <p>Dengan hormat,</p>
            <p>
              Sehubungan dengan seleksi berkas administrasi dan surat motivasi program magang siswa SMA tahun ajaran 2026, panitia seleksi <strong>{application.companyName}</strong> bersama pihak pembimbing sekolah dengan bangga menyatakan bahwa:
            </p>

            {/* Candidate details */}
            <div className="my-3 p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs space-y-1.5">
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Nama Siswa:</span>
                <span className="col-span-2 font-bold text-slate-900">{application.studentName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">NISN / NIS:</span>
                <span className="col-span-2 font-bold text-slate-900">{application.studentNisn}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Asal Sekolah:</span>
                <span className="col-span-2 font-bold text-slate-900">{application.studentSchool}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Kelas / Jurusan:</span>
                <span className="col-span-2 font-bold text-slate-900">{application.studentGrade}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500">Program Diterima:</span>
                <span className="col-span-2 font-bold text-rose-700">{application.programTitle}</span>
              </div>
            </div>

            <p className="font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-sans">
              ✓ DINYATAKAN DITERIMA untuk mengikuti program magang praktik kerja lapangan.
            </p>

            <p>
              Peserta diharapkan hadir mengikuti agenda orientasi dan pembekalan teknis yang telah dijadwalkan. Siswa diwajibkan mematuhi tata tertib perusahaan serta arahan guru pembimbing sekolah.
            </p>

            {application.adminNotes && (
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 font-sans text-xs text-rose-900">
                <strong>Catatan Khusus Pembimbing:</strong> {application.adminNotes}
              </div>
            )}
          </div>

          {/* Signature Block */}
          <div className="pt-6 font-sans text-xs flex items-end justify-between">
            <div className="text-center space-y-1">
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-bold text-slate-800">Guru Pembimbing Magang SMA</p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-slate-300 font-serif italic">[Tanda Tangan Digital]</span>
              </div>
              <p className="font-bold underline text-slate-900">Ibu Retno Wulandari, S.Pd</p>
              <p className="text-[10px] text-slate-500">NIP. 19850412 201001 2 018</p>
            </div>

            <div className="text-center space-y-1">
              <p className="text-slate-500">Ditetapkan oleh,</p>
              <p className="font-bold text-slate-800">{application.companyName}</p>
              <div className="h-14 flex items-center justify-center">
                <div className="w-16 h-12 border-2 border-emerald-600 rounded-lg flex items-center justify-center text-emerald-700 font-bold rotate-[-6deg] text-[11px] opacity-80">
                  TERVERIFIKASI
                </div>
              </div>
              <p className="font-bold underline text-slate-900">Tim Seleksi Mitra Magang</p>
              <p className="text-[10px] text-slate-500">Divisi Sumber Daya Manusia</p>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Dokumen simulasi resmi ini dapat ditunjukkan ke pihak sekolah sebagai bukti verifikasi.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
