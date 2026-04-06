"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Search, 
  MapPin, 
  ChevronRight,
  AlertCircle,
  Building2,
  Navigation
} from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/locations');
      setLocations(response.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Gagal mengambil daftar lokasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLocations = locations.filter(l => 
    l.lokasi.toLowerCase().includes(search.toLowerCase()) ||
    l.kode_lokasi.toLowerCase().includes(search.toLowerCase()) ||
    l.alamat.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium animate-pulse">Memuat Data Lokasi...</p>
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
        <motion.h2 variants={item} className="text-2xl font-bold tracking-tight">
          Cari <span className="gold-text uppercase">Lokasi</span>
        </motion.h2>
        <motion.p variants={item} className="text-accent text-xs font-medium">
          Pilih lokasi untuk memulai kunjungan tak terjadwal
        </motion.p>
      </section>

      {/* Search Bar */}
      <motion.div variants={item} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent group-focus-within:text-secondary transition-colors" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ATM atau Kantor..."
          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-secondary/30 focus:shadow-[0_0_15px_rgba(214,181,117,0.1)] transition-all placeholder:text-white/20"
        />
      </motion.div>

      {/* Locations List */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {filteredLocations.length === 0 ? (
          <div className="text-center py-20 glass-dark rounded-[2rem] border border-white/5">
            <Building2 className="w-12 h-12 text-accent/20 mx-auto mb-3" />
            <p className="text-accent/60 text-sm">Tidak ada lokasi yang ditemukan</p>
          </div>
        ) : (
          filteredLocations.map((location) => (
            <motion.div
              key={location.id}
              variants={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/visits/unplanned/${location.id}`)}
              className="glass-dark p-1 rounded-3xl border border-white/5 hover:border-secondary/20 transition-all group overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <Navigation className="w-6 h-6 text-accent group-hover:text-secondary" />
                </div>
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white truncate pr-2 uppercase">
                      {location.lokasi}
                    </h3>
                    <span className="text-[9px] font-black bg-white/5 text-white/40 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {location.kode_lokasi}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-accent/80 font-medium line-clamp-1">
                    {location.alamat}
                  </p>
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
