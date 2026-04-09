"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  ListChecks,
  Info,
  ChevronRight,
} from "lucide-react";
import { useVisitForm } from "@/hooks/useVisitForm";
import cn from "classnames";

function VisitFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("schedule_id");
  const locationId = searchParams.get("location_id");
  const visitTypeId = searchParams.get("visit_type_id");

  const {
    schedule,
    template,
    responses,
    isLoading,
    isSubmitting,
    error,
    success,
    submitForm,
  } = useVisitForm(scheduleId, locationId, visitTypeId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        <p className="text-accent text-sm font-medium">
          Menyiapkan Checklist...
        </p>
      </div>
    );
  }

  if (!schedule || !template) return null;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/70 active:scale-90 transition-all font-black text-xs flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Batal
        </button>
        <span className="text-[10px] uppercase font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full tracking-wider border border-secondary/10">
          REPORT #{scheduleId}
        </span>
      </div>

      <div className="space-y-6">
        {/* Header Info */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest">
            <ListChecks className="w-4 h-4 text-secondary" />
            <span>Pengisian Laporan</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            {schedule.location?.lokasi || "Lokasi"}
          </h2>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-wider">
            <Info className="w-3 h-3" />
            <span>Target: {template.nama_tipe}</span>
          </div>
        </section>

        {/* Success / Error Messages */}
        {success && (
          <div className="p-6 rounded-[2rem] bg-success/10 border border-success/20 text-success flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="w-10 h-10" />
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-wider">
                Berhasil Disimpan!
              </p>
              <p className="text-xs opacity-80">
                Laporan Anda sedang kami proses...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs flex gap-3 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form */}
        {!success && (
          <form onSubmit={submitForm} className="space-y-4">
            {template.checklist_templates?.map(
              (field: ChecklistTemplate, idx: number) => (
                <div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="maroon-gradient p-6 rounded-4xl border border-white/10 space-y-4 shadow-xl"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">
                      Parameter {idx + 1}
                    </p>
                    <label className="text-sm font-bold leading-relaxed">
                      {field.label}
                    </label>
                  </div>

                  {/* Text Type */}
                  {field.field_type === "text" && (
                    <input
                      type="text"
                      required
                      value={responses[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      placeholder="Masukkan keterangan..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/20"
                    />
                  )}

                  {/* Number Type */}
                  {field.field_type === "number" && (
                    <input
                      type="number"
                      required
                      value={responses[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/20"
                    />
                  )}

                  {/* Select Type with dynamic options */}
                  {field.field_type === "select" && field.options && (
                    <div className="relative">
                      <select
                        value={responses[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        required
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all appearance-none"
                      >
                        <option value="" className="bg-surface text-white">
                          -- Pilih Status --
                        </option>
                        {field.options.map((opt: string) => (
                          <option
                            key={opt}
                            value={opt}
                            className="bg-surface text-white"
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 rotate-90" />
                    </div>
                  )}

                  {/* File / Camera Type */}
                  {field.field_type === "file" && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) =>
                          handleInputChange(
                            field.id,
                            e.target.files?.[0]?.name || "",
                          )
                        }
                        className="hidden"
                        id={`file-${field.id}`}
                      />
                      <label
                        htmlFor={`file-${field.id}`}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-accent hover:border-secondary/50 hover:bg-white/10 transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Save className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {responses[field.id]
                            ? "Ganti Foto"
                            : "Ambil Foto Sekarang"}
                        </span>
                      </label>
                      {responses[field.id] && (
                        <div className="flex items-center gap-2 px-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <p className="text-[10px] text-white/50 font-medium truncate">
                            {responses[field.id]}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Legacy Choice / Select Type (for backward compatibility) */}
                  {field.field_type === "choice" && (
                    <select
                      value={responses[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-secondary/30 transition-all appearance-none"
                    >
                      <option value="" className="bg-surface text-white">
                        -- Pilih Status --
                      </option>
                      <option value="BAIK" className="bg-surface text-white">
                        BAIK
                      </option>
                      <option value="RUSAK" className="bg-surface text-white">
                        RUSAK
                      </option>
                      <option
                        value="PERLU PERBAIKAN"
                        className="bg-surface text-white"
                      >
                        PERLU PERBAIKAN
                      </option>
                    </select>
                  )}
                </div>
              ),
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-5 rounded-[2rem] maroon-gradient text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all mt-6",
                isSubmitting && "opacity-70 cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Laporan
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VisitCreatePage() {
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("schedule_id");
  const locationId = searchParams.get("location_id");
  const visitTypeId = searchParams.get("visit_type_id");

  const {
    schedule,
    template,
    responses,
    isLoading,
    isSubmitting,
    error,
    success,
    submitForm,
  } = useVisitForm(scheduleId, locationId, visitTypeId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Create Visit</h1>
      {error && <p>{error}</p>}
      {success && <p>Visit created successfully!</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm(responses);
        }}
      >
        {/* Render form fields dynamically based on `template` */}
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
}

// Define 'ChecklistTemplate'
interface ChecklistTemplate {
  id: string;
  label: string;
  field_type: string;
  options?: string[];
}

// Define 'handleInputChange'
const handleInputChange = (id: string, value: string) => {
  // Implement the function
};

// Adjust 'submitForm' type
const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // Implement form submission logic
};
