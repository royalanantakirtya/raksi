"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Database, 
  Smartphone,
  AlertCircle,
  Loader2,
  Info
} from "lucide-react";
import api from "@/lib/api";
import { Visit } from "@/types";

import { VisitLog } from "@/hooks/useVisitForm";

export default function HistoryPage() {
  const router = useRouter();
  const [serverVisits, setServerVisits] = useState<Visit[]>([]);
  const [localLogs, setLocalLogs] = useState<VisitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'server' | 'local'>('server');

  useEffect(() => {
    fetchHistory();
    loadLocalLogs();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/visits');
      const data = response.data.data || response.data;
      setServerVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch server history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalLogs = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('visit_logs') || '[]');
      setLocalLogs(logs);
    } catch (e) {
      console.error("Failed to load local logs:", e);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 active:scale-95 transition-all text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <span className="text-[10px] uppercase font-black text-secondary tracking-widest px-3 py-1 rounded-full bg-secondary/10 border border-secondary/10">
          Riwayat Kunjungan
        </span>
      </div>

      <div className="space-y-4">
        <section className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Pekerjaan Saya</h2>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Daftar kunjungan yang telah diselesaikan</p>
        </section>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setTab('server')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'server' ? 'bg-secondary text-white shadow-lg' : 'text-white/40'}`}
          >
            <Database className="w-3.5 h-3.5" /> Database
          </button>
          <button 
            onClick={() => setTab('local')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'local' ? 'bg-secondary text-white shadow-lg' : 'text-white/40'}`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Log Lokal
          </button>
        </div>

        {tab === 'server' ? (
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <p className="text-[10px] text-white/40 font-black uppercase">sinkronisasi server...</p>
              </div>
            ) : serverVisits.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-white/10 mx-auto" />
                <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Belum ada riwayat tercatat</p>
              </div>
            ) : (
              serverVisits.map((visit) => (
                <div 
                  key={visit.id} 
                  onClick={() => router.push(`/history/${visit.id}`)}
                  className="maroon-gradient p-5 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-12 -translate-y-12" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <MapPin className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{visit.location?.lokasi || "Lokasi"}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase">
                          <Calendar className="w-3 h-3" />
                          <span>{visit.tanggal}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-success/10 px-3 py-1 rounded-full border border-success/20">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span className="text-[10px] font-black text-success uppercase">CLOSED</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-[10px] text-white font-bold uppercase">
                        {visit.responses?.length || 0} Param / {visit.findings?.length || 0} Temuan
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Durasi</p>
                      <p className="text-[10px] text-white font-bold uppercase">{visit.durasi || "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-accent/20 border border-accent/20 rounded-2xl flex gap-3 items-start">
               <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
               <p className="text-[10px] text-accent leading-relaxed font-bold uppercase">
                 Log lokal menyimpan bukti pengiriman 48 jam terakhir sebagai antisipasi kendala sinkronisasi.
               </p>
            </div>

            {localLogs.length === 0 ? (
               <div className="py-20 text-center space-y-3">
                 <Smartphone className="w-12 h-12 text-white/10 mx-auto" />
                 <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Log lokal kosong</p>
               </div>
            ) : (
              localLogs.map((log) => (
                <div key={log.id} className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white uppercase">{log.location_name}</h4>
                      <p className="text-[9px] text-white/40 font-bold tracking-widest uppercase">ID: {log.kode_kunjungan}</p>
                    </div>
                    <span className="text-[9px] font-black bg-white/10 text-white/70 px-2 py-1 rounded-lg">
                      {new Date(log.submitted_at).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="h-px bg-white/5 w-full" />
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_5px_rgba(255,200,0,0.5)]" />
                      <span className="text-[9px] text-white/60 font-black uppercase tracking-tighter">
                        {log.responses?.length || 0} Param
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                      <span className="text-[9px] text-white/60 font-black uppercase tracking-tighter">
                        {log.findings?.length || 0} Temuan
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
