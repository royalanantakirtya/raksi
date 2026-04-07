"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight,
  AlertCircle,
  Calendar,
  Filter
} from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Schedule } from "@/types";

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Gagal mengambil data jadwal.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchedules = schedules.filter(s => 
    s.location.lokasi.toLowerCase().includes(search.toLowerCase()) ||
    s.location.kode_lokasi.toLowerCase().includes(search.toLowerCase()) ||
    s.location.alamat.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium animate-pulse">Memuat Jadwal...</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header Info */}
      <section className="space-y-1">
        <motion.h2 variants={item} className="text-slate-800 dark:text-white text-2xl font-bold tracking-tight">
          Jadwal <span className="text-primary dark:gold-text uppercase">Kunjungan</span>
        </motion.h2>
        <motion.p variants={item} className="text-slate-500 dark:text-accent text-xs font-medium">
          Daftar lokasi yang harus dikunjungi hari ini
        </motion.p>
      </section>

      {/* Search Bar */}
      <motion.div variants={item} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-accent group-focus-within:text-secondary transition-colors" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lokasi atau alamat..."
          className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-secondary/30 focus:shadow-[0_0_15px_rgba(214,181,117,0.1)] transition-all placeholder:text-gray-500 dark:placeholder:text-white/20"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 dark:bg-white/5 rounded-lg border border-gray-300 dark:border-white/5 cursor-pointer hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">
          <Filter className="w-3.5 h-3.5 text-gray-600 dark:text-accent" />
        </div>
      </motion.div>

      {/* Schedule List */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {filteredSchedules.length === 0 ? (
          <div className="text-center py-20 maroon-gradient rounded-[2rem] border border-white/10 shadow-lg">
            <Calendar className="w-12 h-12 text-accent/20 mx-auto mb-3" />
            <p className="text-accent/60 text-sm">Tidak ada jadwal yang ditemukan</p>
          </div>
        ) : (
          filteredSchedules.map((schedule) => (
            <motion.div
              key={schedule.id}
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/schedules/${schedule.id}`)}
              className="maroon-gradient shadow-lg p-1 rounded-3xl border border-white/10 hover:border-secondary/30 transition-all group overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl maroon-gradient flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
                  <MapPin className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white truncate pr-2 uppercase">
                      {schedule.location.lokasi}
                    </h3>
                    <span className="text-[9px] font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {schedule.visit_type?.nama_tipe || "Tipe Kunjungan"}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-accent/80 font-medium line-clamp-1">
                    {schedule.location.alamat}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3 text-secondary" />
                      <span>Sesi {schedule.sesi || '1'}</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3 text-secondary" />
                      <span>{schedule.location.kode_lokasi}</span>
                    </div>
                  </div>
                </div>

                <div className="self-center pr-1">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <ChevronRight className="w-4 h-4 text-accent group-hover:text-secondary" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-4" />
    </motion.div>
  );
}
