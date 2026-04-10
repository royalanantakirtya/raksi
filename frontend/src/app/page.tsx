"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Bell,
  Info,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { user, isChecking } = useAuth();
  const { stats, approvedRequests, news, isLoading } = useDashboardStats();


  if (isChecking || isLoading) {
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
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  // Replace 'nama_user' with a valid property or add a fallback
  const userName = user?.nama_user?.split(" ")[0] || "Guest";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <section className="space-y-1">
        <motion.p
          variants={item}
          className="text-zinc-500 dark:gold-text font-bold text-xs uppercase tracking-widest"
        >
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>
        <motion.h2
          variants={item}
          className="text-zinc-800 dark:text-white text-2xl font-bold tracking-tight"
        >
          Selamat Datang,{" "}
          <span className="gold-text-dark dark:gold-text uppercase">
            {userName}
          </span>
        </motion.h2>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          variants={item}
          className="maroon-gradient p-4 rounded-3xl border border-white/10 shadow-lg space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-white text-3xl font-bold">{stats.total}</p>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
              Jadwal Hari Ini
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="maroon-gradient p-4 rounded-3xl border border-white/10 shadow-lg space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-white text-3xl font-bold">{stats.completed}</p>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
              Selesai
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Action Card */}
      <motion.div
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/schedules")}
        className="maroon-gradient p-6 rounded-4xl shadow-xl relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
              Aksi Cepat
            </p>
            <h3 className="text-xl font-bold text-white">Mulai Kunjungan</h3>
            <p className="text-secondary text-xs">
              {stats.pending} lokasi menanti Anda
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* News & Info Card */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-white/70 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary dark:text-secondary" />
            Berita & Info Kantor
          </h3>
        </div>
        <div className="maroon-gradient p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center">
                <Info className="w-5 h-5 text-secondary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-secondary transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[10px] text-accent font-medium uppercase tracking-tighter">
                  {new Date(item.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Unplanned Request Status (Approved & Pending) */}
      {stats.unplanned_requests > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-white/70 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary dark:text-secondary" />
              Permintaan Kunjungan
            </h3>
          </div>

          <div className="space-y-3">
            {/* Approved Requests - Clickable */}
            {approvedRequests.map((req) => (
              <motion.div
                key={req.id}
                variants={item}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  router.push(
                    `/visits/create?location_id=${req.location_id}&visit_type_id=${req.visit_type_id}`,
                  )
                }
                className="bg-success/10 border border-success/30 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-success/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1">
                      {req.location.lokasi}
                    </p>
                    <p className="text-[10px] text-success font-black uppercase tracking-widest">
                      Disetujui - Mulai Checklist
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-success animate-pulse" />
              </motion.div>
            ))}

            {/* Pending Requests - Info Only */}
            {stats.unplanned_requests > approvedRequests.length && (
              <motion.div
                variants={item}
                className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between opacity-80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-tight">
                      Kunjungan Lainnya
                    </p>
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest">
                      Menunggu Persetujuan Admin
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Progress Section */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-white/70">
            Progres Kerja
          </h3>
          <span className="text-[10px] bg-secondary/20 px-2 py-0.5 rounded-full text-primary dark:text-secondary font-bold">
            {stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0}
            % Target
          </span>
        </div>
        <div className="maroon-gradient p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold px-1">
              <span className="text-white">Pencapaian Hari Ini</span>
              <span className="text-white">
                {stats.completed} / {stats.total}
              </span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                }}
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
          onClick={() => router.push("/locations")}
          className="flex items-center gap-3 p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-left active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-accent/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary dark:text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-tight text-slate-800 dark:text-white">
            Cek Lokasi
          </span>
        </button>

        <button
          onClick={() => router.push("/history")}
          className="flex items-center gap-3 p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-left active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-accent/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary dark:text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-tight text-slate-800 dark:text-white">
            Riwayat
          </span>
        </button>
      </motion.section>
    </motion.div>
  );
}
