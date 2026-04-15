"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Clock, 
  Calendar, 
  Loader2,
  AlertCircle,
  Camera,
  FileText,
  User as UserIcon,
  Tag
} from "lucide-react";
import api from "@/lib/api";
import { Visit } from "@/types";

export default function VisitDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/visits/${id}`);
      setVisit(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch visit detail:", err);
      setError("Gagal memuat detail kunjungan.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVisitDetail();
  }, [fetchVisitDetail]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-[10px] text-zinc-500 dark:text-white/40 font-black uppercase tracking-widest">Memuat Detail...</p>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[var(--background)]">
        <AlertCircle className="w-16 h-16 text-zinc-300 dark:text-white/10" />
        <h2 className="text-xl font-black text-zinc-800 dark:text-white uppercase italic">Opps! Terjadi Kesalahan</h2>
        <p className="text-sm text-zinc-500 dark:text-white/40 font-medium">{error || "Data tidak ditemukan"}</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 bg-secondary text-white rounded-2xl font-black uppercase text-[10px] shadow-lg active:scale-95 transition-all"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto">
      {/* Header Overlay */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white/70 active:scale-95 transition-all text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <span className="text-[10px] uppercase font-black text-secondary tracking-widest px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
          Detail Laporan
        </span>
      </div>

      {/* Main Info Card */}
      <div className="maroon-gradient p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-16 -translate-y-16" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit">
                <Tag className="w-3 h-3 text-secondary" />
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">{visit.kode_kunjungan}</span>
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                {visit.location?.lokasi}
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[9px] font-black bg-success/20 text-success border border-success/20 px-3 py-1 rounded-lg uppercase">
                COMPLETED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Tanggal</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs text-white font-bold">{visit.tanggal}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Petugas</p>
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs text-white font-bold">{visit.user?.nama_user?.split(' ')[0]}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Durasi</p>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs text-white font-bold">{visit.durasi || "-"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Waktu</p>
              <div className="flex items-center gap-2 text-xs text-white font-bold">
                <span>{visit.waktu_mulai}</span>
                <span className="text-white/30 px-1">→</span>
                <span>{visit.waktu_selesai}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Responses Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-zinc-400 dark:text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
          <FileText className="w-4 h-4 text-secondary" /> Hasil Pemeriksaan
        </h3>
        
        <div className="space-y-3">
          {visit.responses && visit.responses.length > 0 ? (
            visit.responses.map((resp) => {
              // Robust file check: includes uploads/ OR is a common image extension
              const val = resp.value || "";
              const isFile = val.includes('uploads/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(val);
              
              const getFileUrl = (path: string) => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
                return `${baseUrl}/storage/${path}`;
              };

              return (
                <div key={resp.id} className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 p-4 rounded-3xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-zinc-950 dark:text-white uppercase leading-snug">
                      {resp.template?.label || `Parameter #${resp.template_id}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {isFile ? (
                      <button 
                        onClick={() => window.open(getFileUrl(val), '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 border border-zinc-300 dark:border-white/10 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10 transition-all group shadow-sm"
                      >
                        <Camera className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-black text-zinc-700 dark:text-white/70 uppercase tracking-tighter">Lihat Foto</span>
                      </button>
                    ) : (
                        <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-success bg-success/10 border border-success/10 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20">
                          {resp.value}
                        </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center bg-zinc-100 dark:bg-white/5 rounded-3xl border border-dashed border-zinc-300 dark:border-white/10">
              <p className="text-[10px] text-zinc-400 dark:text-white/30 font-bold uppercase">Tidak ada data checklist</p>
            </div>
          )}
        </div>
      </section>

      {/* Findings Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-zinc-400 dark:text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent" /> Temuan di Lapangan
        </h3>

        {visit.findings && visit.findings.length > 0 ? (
          <div className="space-y-4">
            {visit.findings.map((finding) => {
              const getFileUrl = (path: string) => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
                return `${baseUrl}/storage/${path}`;
              };

              return (
                <div key={finding.id} className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[2rem] overflow-hidden">
                  <div className="p-5 flex gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-black text-zinc-400 dark:text-white/30 uppercase tracking-widest">TIKET: {finding.nomor_tiket}</span>
                        <div className="flex items-center gap-2">
                          {finding.foto_temuan && (
                            <button 
                              onClick={() => finding.foto_temuan && window.open(getFileUrl(finding.foto_temuan), '_blank')}
                              className="flex items-center gap-1.5 px-3 py-1 bg-white/50 dark:bg-white/5 border border-zinc-300 dark:border-white/20 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 transition-all group"
                            >
                              <Camera className="w-3 h-3 text-secondary" />
                              <span className="text-[8px] font-black text-zinc-600 dark:text-white/70 uppercase">Foto</span>
                            </button>
                          )}
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${finding.status === 'open' ? 'bg-accent/20 text-accent border border-accent/20' : 'bg-success/20 text-success border border-success/20'}`}>
                            {finding.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-800 dark:text-white font-medium leading-relaxed italic line-clamp-2">
                         &quot;{finding.temuan}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-100 dark:bg-white/5 rounded-3xl border border-dashed border-zinc-300 dark:border-white/10">
            <p className="text-[10px] text-zinc-400 dark:text-white/30 font-bold uppercase">Semua Kondisi Normal / Tidak Ada Temuan</p>
          </div>
        )}
      </section>
    </div>
  );
}
