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

import { Location, VisitType } from "@/types";
import PageWrapper from "@/components/PageWrapper";

export default function UnplannedVisitTypePage() {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [visitTypes, setVisitTypes] = useState<VisitType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const locResponse = await api.get('/locations');
      const loc = locResponse.data.find((l: { id: number | string }) => String(l.id) === params.locationId);
      setLocation(loc);

      const vtResponse = await api.get('/visit-types');
      setVisitTypes(vtResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestVisit = async (typeId: number, typeName: string) => {
    if (!confirm(`Kirim permintaan persetujuan untuk kunjungan ${typeName}?`)) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/visit-requests', {
        location_id: params.locationId,
        visit_type_id: typeId,
        notes: `Permintaan kunjungan tak terjadwal ke ${location?.lokasi || 'Lokasi'}`
      });
      alert("Permintaan kunjungan telah dikirim. Menunggu persetujuan admin.");
      router.push('/');
    } catch (err) {
      console.error("Error creating visit request:", err);
      alert("Gagal mengirim permintaan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center pt-40 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium animate-pulse">
          {isSubmitting ? "Mengirim Permintaan..." : "Menyiapkan Tipe Kunjungan..."}
        </p>
      </div>
    );
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageWrapper className="space-y-6">
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
        <div className="maroon-gradient p-6 rounded-[2rem] shadow-lg border border-white/10 space-y-2">
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
            Minta Persetujuan Kunjungan
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
            onClick={() => handleRequestVisit(type.id, type.nama_tipe)}
            className="maroon-gradient shadow-lg p-1 rounded-3xl border border-white/10 hover:border-secondary/30 transition-all group overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-secondary/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-white uppercase tracking-tight">{type.nama_tipe}</h4>
                  <p className="text-[10px] text-accent font-medium">Klik untuk minta izin kunjungan {type.nama_tipe}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-secondary" />
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
