"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  LayoutDashboard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      router.replace("/login");
    } else {
      if (userData) setUser(JSON.parse(userData));
      fetchStats();
      setIsChecking(false);
    }
  }, [router]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/schedules');
      const schedules = response.data;
      
      // Calculate simple stats (this will be more complex later when we have Visit data)
      setStats({
        total: schedules.length,
        completed: 0, // Placeholder until visits are implemented
        pending: schedules.length
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <section className="space-y-1">
        <motion.p variants={item} className="text-secondary font-bold text-xs uppercase tracking-widest">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.p>
        <motion.h2 variants={item} className="text-2xl font-bold tracking-tight">
          Selamat Datang, <span className="gold-text uppercase">{user?.nama_user?.split(' ')[0]}</span>
        </motion.h2>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          variants={item}
          className="glass-dark p-4 rounded-3xl border border-white/5 space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Jadwal Hari Ini</p>
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          className="glass-dark p-4 rounded-3xl border border-white/5 space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.completed}</p>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Selesai</p>
          </div>
        </motion.div>
      </div>

      {/* Main Action Card */}
      <motion.div 
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/schedules')}
        className="maroon-gradient p-6 rounded-[2rem] shadow-xl relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Aksi Cepat</p>
            <h3 className="text-xl font-bold text-white">Mulai Kunjungan</h3>
            <p className="text-secondary text-xs">{stats.pending} lokasi menanti Anda</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Progress Section */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-white/70">Progres Kerja</h3>
          <span className="text-[10px] bg-secondary/20 px-2 py-0.5 rounded-full text-secondary font-bold">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Target
          </span>
        </div>
        <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold px-1">
              <span className="text-white/60">Pencapaian Hari Ini</span>
              <span>{stats.completed} / {stats.total}</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full maroon-gradient rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-2 text-xs text-secondary/80">
            <TrendingUp className="w-4 h-4" />
            <p>Ayo selesaikan kunjungan hari ini tepat waktu!</p>
          </div>
        </div>
      </motion.section>

      {/* Quick Access Grid */}
      <motion.section variants={item} className="grid grid-cols-2 gap-4 pb-4">
        <button 
          onClick={() => router.push('/locations')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-left active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-tight">Cek Lokasi</span>
        </button>
        
        <button 
          onClick={() => router.push('/history')}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-left active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-tight">Riwayat</span>
        </button>
      </motion.section>
    </motion.div>
  );
}
