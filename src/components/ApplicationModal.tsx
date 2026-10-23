import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Send,
  Building2,
  User,
  School,
  Mail,
  Phone,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { InternshipProgram, StudentProfile, Application } from '../types';
import { storageService } from '../services/storageService';

interface ApplicationModalProps {
  program: InternshipProgram | null;
  studentProfile: StudentProfile | null;
  onClose: () => void;
  onSuccess: (newApp: Application) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  program,
  studentProfile,
  onClose,
  onSuccess,
}) => {
  if (!program || !studentProfile) return null;

  const [motivation, setMotivation] = useState('');
  const [targetInterest, setTargetInterest] = useState(program.sector);
  const [useProfileCv, setUseProfileCv] = useState(true);
  const [customCvFileName, setCustomCvFileName] = useState('');
  const [customCvFileSize, setCustomCvFileSize] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if already applied
  const isAlreadyApplied = storageService.hasApplied(program.id, studentProfile.id);

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorMsg('Harap unggah berkas dalam format PDF (.pdf).');
        return;
      }
      setCustomCvFileName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setCustomCvFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
      setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isAlreadyApplied) {
      setErrorMsg('Kamu sudah terdaftar di program ini sebelumnya!');
      return;
    }

    if (!motivation.trim() || motivation.trim().length < 20) {
      setErrorMsg('Harap tuliskan alasan/motivasi mengikuti magang minimal 20 karakter.');
      return;
    }

    if (!useProfileCv && !customCvFileName) {
      setErrorMsg('Harap lampirkan berkas CV dalam format PDF.');
      return;
    }

    if (!agreementChecked) {
      setErrorMsg('Harap centang persetujuan izin orang tua & komitmen magang.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const activeCvName = useProfileCv
        ? studentProfile.cvFileName || `CV_${studentProfile.fullName.replace(/\s+/g, '_')}.pdf`
        : customCvFileName;

      const activeCvSize = useProfileCv
        ? studentProfile.cvFileSize || '1.2 MB'
        : customCvFileSize;

      const result = storageService.applyToProgram({
        programId: program.id,
        studentProfile,
        motivation: motivation.trim(),
        targetInterest,
        cvFileName: activeCvName,
        cvFileSize: activeCvSize,
      });

      setIsSubmitting(false);

      if (result.success && result.application) {
        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#38bdf8', '#34d399'],
          });
        } catch {
          // ignore if canvas not supported
        }

        onSuccess(result.application);
      } else {
        setErrorMsg(result.message || 'Pendaftaran gagal diproses. Silakan coba lagi.');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-rose-100 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-rose-100 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formulir Pendaftaran Magang Siswa</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {program.title}
          </h2>
          <p className="text-xs text-rose-100 mt-0.5">
            {program.companyName} • {program.city} ({program.workType})
          </p>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isAlreadyApplied && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Kamu telah mengirim lamaran untuk program ini. Cek perkembangannya di menu <strong>Riwayat & Status</strong>.
              </span>
            </div>
          )}

          {/* Section 1: Data Diri Siswa (Auto-filled from Profile) */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-500" />
                Data Pelamar (Otomatis dari Profil)
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400 text-[10px]">Nama Lengkap</p>
                <p className="font-bold text-slate-800">{studentProfile.fullName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">NISN / NIS</p>
                <p className="font-bold text-slate-800">{studentProfile.nisn}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Asal Sekolah</p>
                <p className="font-bold text-slate-800">{studentProfile.school}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Kelas & Jurusan</p>
                <p className="font-bold text-slate-800">{studentProfile.grade}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Email Siswa</p>
                <p className="font-medium text-slate-700">{studentProfile.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">No. WhatsApp</p>
                <p className="font-medium text-slate-700">{studentProfile.phone}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Motivation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alasan Ingin Mengikuti Magang <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Ceritakan mengapa kamu tertarik dengan program ini dan apa yang ingin kamu pelajari selama magang..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Minimal 20 karakter. Tulis dengan sopan dan penuh antusiasme.
            </p>
          </div>

          {/* Section 3: Target Interest Focus */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fokus Minat yang Ingin Dipelajari
            </label>
            <input
              type="text"
              value={targetInterest}
              onChange={(e) => setTargetInterest(e.target.value)}
              placeholder="Contoh: Desain Grafis, Administrasi Digital, dll."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          {/* Section 4: CV Document Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Lampiran Dokumen CV (PDF) <span className="text-rose-500">*</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50/40 cursor-pointer">
                <input
                  type="radio"
                  name="cvChoice"
                  checked={useProfileCv}
                  onChange={() => setUseProfileCv(true)}
                  className="text-rose-500 focus:ring-rose-400"
                />
                <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-800">
                    Gunakan CV Profil: {studentProfile.cvFileName || 'CV_Siswa.pdf'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {studentProfile.cvFileSize || '1.2 MB'} • Diperbarui {studentProfile.cvUploadDate}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                <input
                  type="radio"
                  name="cvChoice"
                  checked={!useProfileCv}
                  onChange={() => setUseProfileCv(false)}
                  className="mt-1 text-rose-500 focus:ring-rose-400"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Unggah CV Khusus Lainnya (.pdf)</span>
                  </div>

                  {!useProfileCv && (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleCustomFileUpload}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 cursor-pointer"
                      />
                      {customCvFileName && (
                        <p className="text-[11px] text-emerald-600 font-medium mt-1">
                          ✓ Berkas terpilih: {customCvFileName} ({customCvFileSize})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Section 5: Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-1 rounded text-rose-600 focus:ring-rose-400"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                Saya menyatakan bahwa data yang saya kirimkan adalah benar, telah mendapatkan izin dari orang tua/wali serta pihak sekolah, dan berkomitmen mematuhi tata tertib selama periode magang.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isAlreadyApplied}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Mengirim pendaftaran...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pendaftaran</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
