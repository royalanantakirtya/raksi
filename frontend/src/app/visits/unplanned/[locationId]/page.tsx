"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  ChevronLeft, 
  CheckCircle2, 
  MapPin,
  ClipboardList,
  ChevronRight
} from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UnplannedVisitTypePage() {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [visitTypes, setVisitTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Location info (We use the schedules endpoint or similar, but for now we look for location in list)
      // Since we don't have a specific locations/{id} yet, we fetch all and find
      const locResponse = await api.get('/locations');
      const loc = locResponse.data.find((l: any) => l.id == params.locationId);
      setLocation(loc);

      // 2. Fetch Visit Types
      const vtResponse = await api.get('/visit-types');
      setVisitTypes(vtResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat tipe kunjungan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium animate-pulse">Menyiapkan Tipe Kunjungan...</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/70 active:scale-90 transition-all font-black text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      {/* Header Info */}
      <section className="space-y-4">
        <div className="glass-dark p-6 rounded-[2rem] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest">
            <MapPin className="w-4 h-4" />
            <span>Lokasi Dipilih</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase line-clamp-1">
            {location?.lokasi || "Lokasi"}
          </h2>
          <p className="text-[11px] text-accent/80 font-medium line-clamp-1">{location?.alamat}</p>
        </div>

        <div className="px-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-secondary" />
            Pilih Tipe Kunjungan
          </h3>
        </div>
      </section>

      {/* Visit Type List */}
      <div className="space-y-3 pb-8">
        {visitTypes.map((type) => (
          <motion.div
            key={type.id}
            variants={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/visits/create?location_id=${params.locationId}&visit_type_id=${type.id}`)}
            className="glass-dark p-1 rounded-3xl border border-white/5 hover:border-secondary/20 transition-all group overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-secondary/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-white uppercase tracking-tight">{type.nama_tipe}</h4>
                  <p className="text-[10px] text-accent font-medium">Buka form laporan untuk {type.nama_tipe}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-secondary" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
