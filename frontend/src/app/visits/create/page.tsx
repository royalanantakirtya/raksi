"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Loader2, 
  ChevronLeft, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  ListChecks,
  Info
} from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function VisitFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("schedule_id");
  const locationId = searchParams.get("location_id");
  const visitTypeId = searchParams.get("visit_type_id");

  const [schedule, setSchedule] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!scheduleId && (!locationId || !visitTypeId)) {
      router.push("/schedules");
      return;
    }
    fetchData();
  }, [scheduleId, locationId, visitTypeId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let vtId = visitTypeId;
      
      if (scheduleId) {
        // 1a. Get Schedule details (Scheduled Visit)
        const schResponse = await api.get(`/schedules/${scheduleId}`);
        setSchedule(schResponse.data);
        vtId = schResponse.data.visit_type_id;
      } else {
        // 1b. Get Location details (Unplanned Visit)
        const locResponse = await api.get(`/locations`);
        const loc = locResponse.data.find((l: any) => l.id == locationId);
        setSchedule({ location: loc, location_id: locationId });
      }

      // 2. Get VisitType templates
      const vtResponse = await api.get(`/visit-types/${vtId}`);
      setTemplate(vtResponse.data);

      // Initialize responses state
      const initialResponses: Record<string, string> = {};
      vtResponse.data.checklist_templates.forEach((t: any) => {
        initialResponses[t.id] = "";
      });
      setResponses(initialResponses);
    } catch (err) {
      console.error("Error fetching visit data:", err);
      setError("Gagal memuat template laporan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (templateId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [templateId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formattedResponses = Object.entries(responses).map(([id, val]) => ({
        template_id: id,
        value: val
      }));

      const payload = {
        kode_kunjungan: `KUNJ-${scheduleId || locationId}-${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        location_id: schedule.location_id,
        visit_type_id: template.id,
        schedule_id: scheduleId || null,
        terjadwal: scheduleId ? 'terjadwal' : 'tidak terjadwal',
        waktu_mulai: new Date().toLocaleTimeString('id-id', { hour12: false }),
        responses: formattedResponses
      };

      await api.post('/visits', payload);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error("Error submitting visit:", err);
      setError("Gagal menyimpan laporan. Pastikan semua data valid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium">Menyiapkan Checklist...</p>
      </div>
    );
  }

  if (!schedule || !template) return null;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/70 active:scale-90 transition-all font-black text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Batal
        </button>
        <span className="text-[10px] uppercase font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full tracking-wider border border-secondary/10">
          REPORT #{scheduleId}
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        {/* Header Info */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest">
            <ListChecks className="w-4 h-4 text-secondary" />
            <span>Pengisian Laporan</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">{schedule.location.lokasi}</h2>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <Info className="w-3 h-3" />
            <span>Target: {template.nama_tipe}</span>
          </div>
        </section>

        {/* Success / Error Messages */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[2rem] bg-success/10 border border-success/20 text-success flex flex-col items-center gap-3 text-center"
          >
            <CheckCircle2 className="w-10 h-10" />
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-wider">Berhasil Disimpan!</p>
              <p className="text-xs opacity-80">Laporan Anda sedang kami proses...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {template.checklist_templates.map((field: any, idx: number) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl"
              >
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Parameter {idx + 1}</p>
                  <label className="text-sm font-bold leading-relaxed">{field.label}</label>
                </div>

                {/* Text Type */}
                {field.field_type === 'text' && (
                  <input
                    type="text"
                    required
                    value={responses[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder="Masukkan keterangan..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/20"
                  />
                )}

                {/* Radio Type */}
                {field.field_type === 'radio' && (
                  <div className="grid grid-cols-2 gap-3">
                    {['YA', 'TIDAK'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange(field.id, option)}
                        className={cn(
                          "py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest border transition-all active:scale-95",
                          responses[field.id] === option 
                            ? "maroon-gradient text-white border-white/20 shadow-lg" 
                            : "bg-white/5 text-white/30 border-white/5"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Choice / Select Type */}
                {field.field_type === 'choice' && (
                  <select
                    value={responses[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all appearance-none"
                  >
                    <option value="" className="bg-surface text-white">-- Pilih Status --</option>
                    <option value="BAIK" className="bg-surface text-white">BAIK</option>
                    <option value="RUSAK" className="bg-surface text-white">RUSAK</option>
                    <option value="PERLU PERBAIKAN" className="bg-surface text-white">PERLU PERBAIKAN</option>
                  </select>
                )}
              </motion.div>
            ))}

            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-5 rounded-[2rem] maroon-gradient text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all mt-6",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Laporan
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function VisitCreatePage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center text-accent">Menyiapkan Ruang Laporan...</div>}>
      <VisitFormContent />
    </Suspense>
  );
}
