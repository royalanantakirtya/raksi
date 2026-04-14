"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  ListChecks,
  Info,
  ChevronDown,
  Camera,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import { useVisitForm } from "@/hooks/useVisitForm";

interface ChecklistField {
  id: number;
  label: string;
  field_type: string;
  options?: string[];
  is_required: boolean;
}

function VisitCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("schedule_id");
  const locationId = searchParams.get("location_id");
  const visitTypeId = searchParams.get("visit_type_id");

  const {
    schedule,
    template,
    responses,
    findings,
    isLoading,
    isSubmitting,
    error,
    success,
    elapsedSeconds,
    validation,
    handleInputChange,
    addFinding,
    updateFinding,
    removeFinding,
    submitForm,
  } = useVisitForm(scheduleId, locationId, visitTypeId);

  const [openSection, setOpenSection] = useState<string>("kondisi");

  const toggleSection = (section: string) => {
    setOpenSection(prev => prev === section ? "" : section);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, 300 - elapsedSeconds);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-zinc-500 text-sm font-medium">
          Menyiapkan Checklist...
        </p>
      </div>
    );
  }

  if (!schedule || !template) {
    return (
      <div className="p-6 text-center">
        <p className="text-danger font-bold">Data tidak ditemukan.</p>
        <button onClick={() => router.back()} className="mt-4 text-accent underline underline-offset-4">Kembali</button>
      </div>
    );
  }

  const kondisiFields = template.checklist_templates?.filter((f: ChecklistField) => f.field_type !== 'file') || [];
  const visualFields = template.checklist_templates?.filter((f: ChecklistField) => f.field_type === 'file') || [];

  return (
    <div className="space-y-6 pb-24">
      {/* Header Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white/70 active:scale-95 transition-all text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Batal
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase font-black text-secondary tracking-widest px-2 py-0.5 rounded bg-secondary/10 border border-secondary/10">
            {scheduleId ? `Schedule #${scheduleId}` : "Unplanned"}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Page Title */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-[0.2em]">
            <ListChecks className="w-4 h-4 text-secondary" />
            <span>Laporan Kunjungan</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-tight">
            {schedule.location?.lokasi || "Lokasi"}
          </h2>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-white/40 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-white/5 w-fit px-3 py-1 rounded-full border border-zinc-200 dark:border-white/10">
            <Info className="w-3 h-3" />
            <span>{template.nama_tipe}</span>
          </div>
        </section>

        {/* Global Messages */}
        {success && (
          <div className="p-8 rounded-[2.5rem] maroon-gradient border border-white/10 text-white flex flex-col items-center gap-4 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center border border-success/30">
               <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-wider">Berhasil Terkirim!</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Laporan kunjungan Anda telah diverifikasi dan disimpan di server.
              </p>
              <button 
                onClick={() => router.push('/')}
                className="mt-6 w-full py-4 bg-white text-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-secondary transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!success && (
          <form onSubmit={submitForm} className="space-y-4">
            
            {/* Section: Kondisi Lokasi */}
            <section className="space-y-4">
              <button 
                type="button"
                onClick={() => toggleSection('kondisi')}
                className="w-full flex items-center justify-between p-2 group"
              >
                <h3 className="text-xs font-black text-zinc-800 dark:text-white/40 uppercase tracking-widest flex items-center gap-2 group-hover:text-secondary transition-colors">
                  <ListChecks className="w-4 h-4 text-secondary" /> 01. Kondisi Lokasi
                </h3>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${openSection === 'kondisi' ? 'rotate-180' : ''}`} />
              </button>
              
              {openSection === 'kondisi' && (
                <div className="space-y-3 animate-fade-in">
                  {kondisiFields.map((field: ChecklistField) => (
                    <div key={field.id} className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 p-4 rounded-3xl space-y-3">
                      <p className="text-[10px] font-black text-zinc-800 dark:text-white/70 uppercase leading-snug">
                        {field.label} {field.is_required && <span className="text-danger">*</span>}
                      </p>
                      
                      {field.field_type === 'select' ? (
                        <div className="relative">
                          <select
                            required={field.is_required}
                            value={responses[field.id.toString()] as string || ""}
                            onChange={(e) => handleInputChange(field.id.toString(), e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs text-zinc-800 dark:text-white focus:outline-none"
                          >
                            <option value="" className="bg-zinc-100 dark:bg-zinc-900">-- Pilih Opsi --</option>
                            {field.options?.map(opt => <option key={opt} value={opt} className="bg-zinc-100 dark:bg-zinc-900">{opt}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                      ) : (
                        <input
                          type={field.field_type === 'number' ? 'number' : 'text'}
                          required={field.is_required}
                          placeholder={`Isi ${field.label.toLowerCase()}...`}
                          value={responses[field.id.toString()] as string || ""}
                          onChange={(e) => handleInputChange(field.id.toString(), e.target.value)}
                          className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs text-zinc-800 dark:text-white focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-white/10"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section: Bukti Visual */}
            <section className="space-y-4">
              <button 
                type="button"
                onClick={() => toggleSection('visual')}
                className="w-full flex items-center justify-between p-2 group"
              >
                <h3 className="text-xs font-black text-zinc-800 dark:text-white/40 uppercase tracking-widest flex items-center gap-2 group-hover:text-secondary transition-colors">
                  <Camera className="w-4 h-4 text-secondary" /> 02. Bukti Visual (Foto)
                </h3>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${openSection === 'visual' ? 'rotate-180' : ''}`} />
              </button>

              {openSection === 'visual' && (
                <div className="grid grid-cols-1 gap-3 animate-fade-in">
                  {visualFields.map((field: ChecklistField) => (
                    <div key={field.id} className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 p-4 rounded-3xl space-y-4">
                      <p className="text-[10px] font-black text-zinc-800 dark:text-white/70 uppercase tracking-tight">
                        {field.label} {field.is_required && <span className="text-danger">*</span>}
                      </p>
                      
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleInputChange(field.id.toString(), file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full py-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all ${
                          responses[field.id.toString()] instanceof File
                            ? "bg-success/5 border-success/30 text-success"
                            : "bg-white dark:bg-white/5 border-zinc-300 dark:border-white/10 text-zinc-400 dark:text-white/20 group-hover:border-secondary/40"
                        }`}>
                          {responses[field.id.toString()] instanceof File ? (
                            <>
                              <CheckCircle2 className="w-8 h-8" />
                              <p className="text-[9px] font-black uppercase tracking-widest">Foto Tersimpan</p>
                            </>
                          ) : (
                            <>
                              <Camera className="w-8 h-8 mb-1" />
                              <p className="text-[9px] font-black uppercase tracking-widest">Ambil Gambar</p>
                              <p className="text-[8px] font-medium opacity-50 italic">Klik untuk membuka kamera</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section: Temuan Lapangan */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-zinc-800 dark:text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent" /> 03. Temuan Lapangan
                </h3>
                <button 
                  type="button"
                  onClick={addFinding}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-accent/10 text-accent rounded-full border border-accent/20 hover:bg-accent/20 transition-all text-[9px] font-black uppercase"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Temuan
                </button>
              </div>

              <div className="space-y-4">
                {findings.map((finding, index) => (
                  <div key={index} className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-5 space-y-4 animate-fade-in relative group/card">
                    <button 
                      type="button"
                      onClick={() => removeFinding(finding.id)}
                      className="absolute top-4 right-4 p-2 bg-danger/10 text-danger rounded-xl hover:bg-danger/20 transition-all opacity-0 group-hover/card:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      <div className="space-y-2 px-1">
                        <label className="text-[9px] font-black text-zinc-500 dark:text-white/30 uppercase tracking-widest">Deskripsi Temuan</label>
                        <textarea
                          value={finding.keterangan}
                          onChange={(e) => updateFinding(finding.id, { keterangan: e.target.value })}
                          placeholder="Jelaskan kondisi atau masalah yang ditemukan di lapangan..."
                          className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-xs text-zinc-800 dark:text-white focus:outline-none focus:border-secondary/30 transition-all min-h-[100px] placeholder:text-zinc-400 dark:placeholder:text-white/10"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 px-1">
                          <label className="text-[9px] font-black text-zinc-500 dark:text-white/30 uppercase tracking-widest">Kategori</label>
                          <div className="relative">
                            <select 
                              className="w-full appearance-none bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs text-zinc-800 dark:text-white focus:outline-none"
                              value={finding.temuan}
                              onChange={(e) => updateFinding(finding.id, { temuan: e.target.value })}
                            >
                              <option value="Kebersihan">Kebersihan</option>
                              <option value="Kerusakan Fisik">Kerusakan Fisik</option>
                              <option value="Kelistrikan">Kelistrikan</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="relative group overflow-hidden">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) updateFinding(finding.id, { foto_temuan: file });
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full py-6 border border-dashed rounded-3xl flex items-center justify-center gap-3 transition-all ${
                          finding.foto_temuan 
                            ? "bg-success/5 border-success/30 text-success" 
                            : "bg-white dark:bg-white/5 border-zinc-300 dark:border-white/10 text-zinc-500 dark:text-white/30"
                        }`}>
                          <Camera className="w-5 h-5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {finding.foto_temuan ? 'Foto Terlampir' : 'Lampirkan Foto Temuan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {findings.length === 0 && (
                  <div className="p-8 text-center bg-zinc-100 dark:bg-white/5 rounded-[2rem] border border-dashed border-zinc-200 dark:border-white/10">
                    <p className="text-[10px] text-zinc-400 dark:text-white/20 font-bold uppercase">Ketuk &quot;Tambah Temuan&quot; jika ada masalah di lokasi</p>
                  </div>
                )}
              </div>
            </section>

            {/* Submission Logic Display */}
            <div className="pt-6 space-y-4">
               {!validation.isTimeReached && (
                 <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center gap-3">
                   <Clock className="w-4 h-4 text-secondary animate-pulse" />
                   <p className="text-[10px] font-bold text-zinc-800 dark:text-white/60 uppercase tracking-widest">
                     Laporan dapat dikirim dalam <span className="text-secondary">{formatTime(remainingSeconds)}</span>
                   </p>
                 </div>
               )}

               {!validation.canSubmit && validation.isTimeReached && (
                 <div className="p-4 rounded-2xl bg-danger/5 border border-danger/20 flex items-center gap-3">
                   <AlertCircle className="w-4 h-4 text-danger" />
                   <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                     Lengkapi semua parameter wajib (Kondisi & Visual) sebelum mengirim laporan.
                   </p>
                 </div>
               )}

              <button
                type="submit"
                disabled={isSubmitting || !validation.canSubmit}
                className={`w-full py-6 rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(150,0,0,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all ${
                  isSubmitting || !validation.canSubmit 
                    ? "bg-zinc-800 text-white/20 cursor-not-allowed shadow-none border border-white/5" 
                    : "maroon-gradient shadow-[0_20px_50px_rgba(150,0,0,0.3)]"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {!validation.canSubmit && <Clock className="w-5 h-5" />}
                    {validation.canSubmit && <Save className="w-5 h-5 shadow-lg" />}
                    {validation.isTimeReached ? 'Kirim Laporan Akhir' : `Tunggu (${formatTime(remainingSeconds)})`}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VisitCreatePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-zinc-500 text-sm font-medium">Memuat Halaman...</p>
      </div>
    }>
      <VisitCreateContent />
    </Suspense>
  );
}
