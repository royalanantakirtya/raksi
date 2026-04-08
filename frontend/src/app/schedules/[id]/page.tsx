"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  Info,
  Play
} from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Haversine Formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  const GEOFENCE_RADIUS = 250; // meters

  useEffect(() => {
    fetchSchedule();
    watchLocation();
  }, [params.id]);

  const fetchSchedule = async () => {
    try {
      const response = await api.get(`/schedules/${params.id}`);
      setSchedule(response.data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError("Gagal mengambil rincian jadwal.");
    } finally {
      setIsLoading(false);
    }
  };

  const watchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Gagal mengakses lokasi GPS Anda.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (userLocation && schedule?.location) {
      const d = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        parseFloat(schedule.location.latitude),
        parseFloat(schedule.location.longitude)
      );
      setDistance(d);
    }
  }, [userLocation, schedule]);

  const openInMaps = () => {
    if (!schedule?.location) return;
    const { latitude, longitude } = schedule.location;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
  };

  const startVisit = () => {
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && (!distance || distance > GEOFENCE_RADIUS)) {
      if (!confirm("Anda berada di luar radius lokasi (250m). Lanjutkan tetap mengisi laporan?")) {
        return;
      }
    }
    router.push(`/visits/create?schedule_id=${schedule.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium">Memuat Detail Lokasi...</p>
      </div>
    );
  }

  if (!schedule) return null;

  const isWithinRadius = process.env.NODE_ENV === 'development' || (distance !== null && distance <= GEOFENCE_RADIUS);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/70 active:scale-90 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[10px] uppercase font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full tracking-wider border border-secondary/10">
          ID: {schedule.location.kode_lokasi}
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Summary */}
        <section className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">{schedule.location.lokasi}</h2>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-secondary" />
            <span>Tipe: {schedule.visit_type.nama_tipe}</span>
          </div>
        </section>

        {/* Location Card */}
        <div className="maroon-gradient rounded-[2.5rem] p-6 border border-white/10 space-y-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Alamat Lengkap</p>
                <p className="text-sm font-medium leading-relaxed">{schedule.location.alamat}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Koordinat Lokasi</p>
                <p className="text-xs font-mono text-accent">{schedule.location.latitude}, {schedule.location.longitude}</p>
              </div>
              <button 
                onClick={openInMaps}
                className="self-center bg-accent/20 text-accent px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-accent/30 transition-all border border-accent/10"
              >
                Navigasi
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Geofencing Status */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Radius Keamanan</p>
              {isLocating ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-accent" />
                  <span className="text-[10px] text-accent font-bold">Mencari GPS...</span>
                </div>
              ) : (
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full uppercase",
                  isWithinRadius ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                )}>
                  {isWithinRadius ? 'Dalam Area' : 'Luar Area'}
                </span>
              )}
            </div>

            <div className={cn(
              "p-4 rounded-3xl border flex items-center justify-between transition-all duration-500",
              isWithinRadius ? "bg-success/5 border-success/20" : "bg-white/5 border-white/5"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg",
                  isWithinRadius ? "maroon-gradient" : "bg-white/5"
                )}>
                  <CheckCircle2 className={cn("w-5 h-5", isWithinRadius ? "text-white" : "text-white/20")} />
                </div>
                <div>
                  <p className="text-xs font-bold">Jarak Anda</p>
                  <p className="text-lg font-black gold-text">
                    {distance !== null ? `${Math.round(distance)} Meter` : '...'}
                  </p>
                </div>
              </div>
              {distance !== null && distance > GEOFENCE_RADIUS && (
                <AlertTriangle className="w-6 h-6 text-secondary animate-pulse" />
              )}
            </div>
            
            <p className="text-[10px] text-accent italic px-2">
              * Tombol laporan akan aktif otomatis jika Anda berada dalam radius {GEOFENCE_RADIUS} meter dari lokasi target.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button 
          onClick={startVisit}
          className={cn(
            "w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all",
            isWithinRadius 
              ? "maroon-gradient text-white border border-white/10" 
              : "bg-white/5 text-white/30 border border-white/5"
          )}
        >
          <Play className={cn("w-5 h-5", isWithinRadius ? "fill-white" : "")} />
          Mulai Kunjungan
        </button>
      </motion.div>
    </div>
  );
}
