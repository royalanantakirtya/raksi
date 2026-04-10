"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface UserSession {
  id: number;
  nama_user: string;
  kode_user: string;
  peran: string;
  cabang: string;
}

export default function MorePage() {
  const router = useRouter();
  
  // Lazy initialization to prevent cascading renders
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const menuItems = [
    { 
      title: "Profil Saya", 
      subtitle: "Lihat detail akun dan jabatan", 
      icon: User, 
      action: () => {}, 
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    { 
      title: "Pengaturan Utama", 
      subtitle: "Tema, Notifikasi, dan Keamanan", 
      icon: Settings, 
      action: () => {}, 
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    { 
      title: "Bantuan & Dukungan", 
      subtitle: "Hubungi admin atau baca FAQ", 
      icon: HelpCircle, 
      action: () => {}, 
      color: "text-success",
      bg: "bg-success/10"
    },
    { 
      title: "Informasi Aplikasi", 
      subtitle: "Versi 1.0.4 - Build Stable", 
      icon: Smartphone, 
      action: () => {}, 
      color: "text-accent",
      bg: "bg-accent/10"
    },
  ];

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
      className="space-y-6 pb-20"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/70 active:scale-90 transition-all font-black text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Menu Lainnya</h2>
      </div>

      {/* Profile Card Summary */}
      <section className="maroon-gradient shadow-xl p-6 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-5 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 p-0.5 border border-white/10">
            <div className="w-full h-full rounded-[0.9rem] bg-secondary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{user?.nama_user || "Nama Petugas"}</h3>
            <p className="text-xs text-secondary font-bold uppercase tracking-widest">{user?.peran || "Petugas"} • {user?.cabang || "Cabang"}</p>
            <p className="text-[10px] text-white/40 mt-1 font-medium italic">ID: {user?.kode_user || "-"}</p>
          </div>
        </div>
      </section>

      {/* Main Menu List */}
      <div className="space-y-3">
        {menuItems.map((menu, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileTap={{ scale: 0.98 }}
            onClick={menu.action}
            className="maroon-gradient shadow-md p-4 rounded-3xl border border-white/10 hover:border-secondary/30 transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", menu.bg)}>
                <menu.icon className={cn("w-6 h-6", menu.color)} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-white group-hover:text-secondary transition-colors uppercase tracking-tight">{menu.title}</h4>
                <p className="text-[10px] text-accent font-medium">{menu.subtitle}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-secondary transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Logout Action */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full mt-4 p-5 rounded-[2rem] bg-danger/10 border border-danger/20 flex items-center justify-between group group-hover:bg-danger/20 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center group-hover:bg-danger/30 transition-colors">
            <LogOut className="w-5 h-5 text-danger" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-sm text-danger uppercase tracking-wider">Keluar Aplikasi</h4>
            <p className="text-[10px] text-danger/60 font-medium">Selesaikan sesi kerja sekarang</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-danger/30 group-hover:text-danger" />
      </motion.button>

      <div className="text-center pt-4">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">Developed by RAK Team</p>
      </div>
    </motion.div>
  );
}
