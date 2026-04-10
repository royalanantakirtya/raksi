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
    handleInputChange,
    addFinding,
    updateFinding,
    removeFinding,
    submitForm,
  } = useVisitForm(scheduleId, locationId, visitTypeId);

  const [openSections, setOpenSections] = useState<string[]>(["kondisi"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

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
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 active:scale-95 transition-all text-xs flex items-center gap-2"
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
          <h2 className="text-2xl font-black tracking-tight text-white uppercase leading-tight">
            {schedule.location?.lokasi || "Lokasi"}
          </h2>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-wider bg-white/5 w-fit px-3 py-1 rounded-full">
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
            
            {/* 1. KONDISI LOKASI SECTION */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <button 
                type="button"
                onClick={() => toggleSection('kondisi')}
                className="w-full flex items-center justify-between p-6 text-left active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Kondisi Lokasi</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase">{kondisiFields.length} Parameter</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/30 transition-transform duration-300 ${openSections.includes('kondisi') ? 'rotate-180' : ''}`} />
              </button>
              
              {openSections.includes('kondisi') && (
                <div className="p-6 pt-0 space-y-6 border-t border-white/5">
                  {kondisiFields.map((field: ChecklistField) => (
                    <div key={field.id} className="space-y-3">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex justify-between">
                        {field.label}
                        {field.is_required && <span className="text-secondary text-[10px]">*Wajib</span>}
                      </label>
                      
                      {field.field_type === 'select' ? (
                        <div className="relative">
                          <select
                            required={field.is_required}
                            value={responses[field.id.toString()] as string || ""}
                            onChange={(e) => handleInputChange(field.id.toString(), e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all appearance-none"
                          >
                            <option value="" className="bg-zinc-900">-- Pilih Opsi --</option>
                            {field.options?.map(opt => <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                        </div>
                      ) : (
                        <input
                          type={field.field_type === 'number' ? 'number' : 'text'}
                          required={field.is_required}
                          placeholder={`Isi ${field.label.toLowerCase()}...`}
                          value={responses[field.id.toString()] as string || ""}
                          onChange={(e) => handleInputChange(field.id.toString(), e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/20"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. VISUAL LOKASI SECTION */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <button 
                type="button"
                onClick={() => toggleSection('visual')}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Visual Lokasi</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase">{visualFields.length} Foto Wajib</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/30 transition-transform duration-300 ${openSections.includes('visual') ? 'rotate-180' : ''}`} />
              </button>

              {openSections.includes('visual') && (
                <div className="p-6 pt-0 grid grid-cols-1 gap-4 border-t border-white/5">
                  {visualFields.map((field: ChecklistField) => (
                    <div key={field.id} className="relative group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="camera"
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleInputChange(field.id.toString(), e.target.files[0]);
                        }}
                      />
                      <div className={`p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between ${
                        responses[field.id.toString()] ? 'bg-success/5 border-success/30' : 'bg-white/5 border-white/10 group-hover:border-accent/40'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${responses[field.id.toString()] ? 'bg-success/20' : 'bg-white/5'}`}>
                            {responses[field.id.toString()] ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Camera className="w-5 h-5 text-white/20" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{field.label}</p>
                            <p className="text-[10px] text-white/40 uppercase font-black uppercase tracking-tighter">
                              {responses[field.id.toString()] ? (responses[field.id.toString()] as File).name : 'Ambil Foto'}
                            </p>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-white/20" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. TEMUAN SECTION */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <button 
                type="button"
                onClick={() => toggleSection('temuan')}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-danger" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Temuan Permasalahan</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase">{findings.length} Kasus Ditemukan</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/30 transition-transform duration-300 ${openSections.includes('temuan') ? 'rotate-180' : ''}`} />
              </button>

              {openSections.includes('temuan') && (
                <div className="p-6 pt-0 space-y-4 border-t border-white/5">
                  {findings.map((finding: ChecklistFinding) => (
                    <div key={finding.id} className="maroon-gradient rounded-2xl p-4 border border-white/10 relative space-y-4">
                      <button 
                        type="button" 
                        onClick={() => removeFinding(finding.id)}
                        className="absolute top-4 right-4 text-white/30 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-secondary tracking-[0.1em]">Jenis Temuan</label>
                        <select 
                          value={finding.temuan}
                          onChange={(e) => updateFinding(finding.id, { temuan: e.target.value })}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        >
                          <option value="" className="bg-zinc-800">-- Pilih Temuan --</option>
                          <option value="Kebersihan" className="bg-zinc-800">Kebersihan</option>
                          <option value="Kerusakan Fisik" className="bg-zinc-800">Kerusakan Fisik</option>
                          <option value="Kelistrikan" className="bg-zinc-800">Kelistrikan</option>
                          <option value="Lainnya" className="bg-zinc-800">Lainnya</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-secondary tracking-[0.1em]">Foto Temuan</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="camera"
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                            onChange={(e) => {
                              if (e.target.files?.[0]) updateFinding(finding.id, { foto_temuan: e.target.files[0] });
                            }}
                          />
                          <div className={`py-4 px-5 rounded-xl border border-dashed flex items-center gap-3 ${finding.foto_temuan ? 'bg-success/10 border-success/30' : 'bg-white/5 border-white/10'}`}>
                            <Camera className="w-4 h-4 text-white/20" />
                            <span className="text-[10px] text-white/50 uppercase font-black truncate max-w-[150px]">
                              {finding.foto_temuan ? finding.foto_temuan.name : 'Upload Foto'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-secondary tracking-[0.1em]">Catatan / Keterangan</label>
                        <textarea 
                          placeholder="Jelaskan temuan secara rinci..."
                          value={finding.keterangan}
                          onChange={(e) => updateFinding(finding.id, { keterangan: e.target.value })}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-xs text-white h-20"
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={addFinding}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4" /> Tambah Temuan Baru
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 rounded-3xl maroon-gradient text-white font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(150,0,0,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all mt-10 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5 shadow-lg" />
                  Kirim Laporan Akhir
                </>
              )}
            </button>
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
