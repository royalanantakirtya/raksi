import { useState, useEffect } from "react";
import * as visitService from "../services/visitService";
import { compressImage } from "../lib/imageCompression";

// Define 'Schedule' and 'VisitType'
interface ChecklistTemplate {
  id: number;
  label: string;
  field_type: string;
  options?: string[];
  is_required: boolean;
}

interface Schedule {
  id: string;
  location_id: number;
  location: { id: number; lokasi: string };
  visit_type?: VisitType;
}

interface VisitType {
  id: string;
  nama_tipe: string;
  checklist_templates: ChecklistTemplate[];
}

export interface ChecklistFinding {
  id: string;
  temuan: string;
  foto_temuan: File | null;
  keterangan: string;
}

// Separate interface for Log Storage to avoid File vs string conflict
export interface StoredFinding {
  id: string;
  temuan: string;
  foto_temuan: string | null;
  keterangan: string;
}

export interface LocalResponse {
  template_id: string | number;
  value: string | number | File;
}

export interface StoredResponse {
  template_id: string | number;
  value: string | number;
}

export interface VisitLog {
  id: number;
  kode_kunjungan: string;
  location_name: string;
  submitted_at: string;
  responses: StoredResponse[];
  findings: StoredFinding[];
}

export interface VisitLogPayload {
  kode_kunjungan: string;
  location_name: string;
  responses: LocalResponse[];
  findings: ChecklistFinding[];
}

export function useVisitForm(
  scheduleId: string | null,
  locationId: string | null,
  visitTypeId: string | null,
) {
  const [schedule, setSchedule] = useState<Partial<Schedule> | null>(null);
  const [template, setTemplate] = useState<VisitType | null>(null);
  const [responses, setResponses] = useState<Record<string, string | number | File>>({});
  const [findings, setFindings] = useState<ChecklistFinding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Time tracking
  const [startTime] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (!scheduleId && (!locationId || !visitTypeId)) {
      setIsLoading(false);
      return;
    }

    visitService
      .fetchData(scheduleId, locationId, visitTypeId)
      .then((data) => {
        setSchedule(data.schedule);
        setTemplate(data.template);
      })
      .catch(() => {
        setError("Failed to fetch data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [scheduleId, locationId, visitTypeId]);

  const handleInputChange = async (id: string, value: string | number | File) => {
    if (value instanceof File && value.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(value);
        setResponses(prev => ({ ...prev, [id]: compressed }));
      } catch (err) {
        console.error("Compression error:", err);
        setResponses(prev => ({ ...prev, [id]: value })); // Fallback
      } finally {
        setIsCompressing(false);
      }
    } else {
      setResponses(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const addFinding = () => {
    const newFinding: ChecklistFinding = {
      id: Math.random().toString(36).substr(2, 9),
      temuan: "",
      foto_temuan: null,
      keterangan: ""
    };
    setFindings(prev => [...prev, newFinding]);
  };

  const updateFinding = async (id: string, data: Partial<ChecklistFinding>) => {
    if (data.foto_temuan instanceof File && data.foto_temuan.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(data.foto_temuan);
        setFindings(prev => prev.map(f => f.id === id ? { ...f, ...data, foto_temuan: compressed } : f));
      } catch (err) {
        console.error("Compression error:", err);
        setFindings(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
      } finally {
        setIsCompressing(false);
      }
    } else {
      setFindings(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    }
  };

  const removeFinding = (id: string) => {
    setFindings(prev => prev.filter(f => f.id !== id));
  };

  // Validation Logic
  const getValidationStatus = () => {
    if (!template?.checklist_templates) return { isKondisiComplete: false, isVisualComplete: false, isFindingsValid: true, canSubmit: false };

    const isKondisiComplete = template.checklist_templates
      .filter(f => f.field_type !== 'file' && f.is_required)
      .every(f => responses[f.id.toString()] !== undefined && responses[f.id.toString()] !== "");

    const isVisualComplete = template.checklist_templates
      .filter(f => f.field_type === 'file' && f.is_required)
      .every(f => responses[f.id.toString()] instanceof File);

    const isFindingsValid = findings.every(f => f.temuan !== "" && f.keterangan !== "");
    
    const isTimeReached = elapsedSeconds >= 300; // 5 minutes (300 seconds)

    return {
      isKondisiComplete,
      isVisualComplete,
      isFindingsValid,
      isTimeReached,
      canSubmit: isKondisiComplete && isVisualComplete && isFindingsValid && isTimeReached && !isCompressing
    };
  };

  const validation = getValidationStatus();

  const saveLocalLog = (payload: VisitLogPayload) => {
    try {
      const logsStr = localStorage.getItem('visit_logs') || '[]';
      const initialLogs: VisitLog[] = JSON.parse(logsStr);
      
      const newLog: VisitLog = {
        id: Date.now(),
        kode_kunjungan: payload.kode_kunjungan,
        location_name: payload.location_name,
        submitted_at: new Date().toISOString(),
        responses: payload.responses.map((r: LocalResponse) => ({
          template_id: r.template_id,
          value: r.value instanceof File ? `[File: ${r.value.name}]` : r.value
        })),
        findings: (payload.findings || []).map((f: ChecklistFinding) => ({
          id: f.id,
          temuan: f.temuan,
          keterangan: f.keterangan,
          foto_temuan: f.foto_temuan instanceof File ? f.foto_temuan.name : null
        }))
      };
      
      const allLogs = [newLog, ...initialLogs];
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const filteredLogs = allLogs.filter((log: VisitLog) => {
        try {
          return new Date(log.submitted_at) > twoDaysAgo;
        } catch { return false; }
      });
      
      localStorage.setItem('visit_logs', JSON.stringify(filteredLogs.slice(0, 50)));
    } catch (e) {
      console.error("Failed to save local log:", e);
    }
  };

  const submitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validation.canSubmit) return;

    setIsSubmitting(true);
    setError("");
    
    try {
      const formData = new FormData();
      const currentKode = `V-${Date.now()}`;
      const endTime = new Date();
      const durationFormatted = `${Math.floor(elapsedSeconds / 60)} menit ${elapsedSeconds % 60} detik`;

      formData.append('kode_kunjungan', currentKode);
      formData.append('tanggal', new Date().toISOString().split('T')[0]);
      
      const locId = schedule?.location_id || (locationId ? parseInt(locationId) : null);
      if (locId) formData.append('location_id', locId.toString());
      
      const vtId = template?.id ? parseInt(template.id) : (visitTypeId ? parseInt(visitTypeId) : null);
      if (vtId) formData.append('visit_type_id', vtId.toString());
      
      formData.append('terjadwal', scheduleId ? 'terjadwal' : 'tidak terjadwal');
      
      // Work duration fields
      formData.append('waktu_mulai', startTime.toISOString());
      formData.append('waktu_selesai', endTime.toISOString());
      formData.append('durasi', durationFormatted);

      const currentResponses = Object.entries(responses).map(([id, val]) => ({ 
        template_id: id, 
        value: val 
      }));

      currentResponses.forEach((resp, index) => {
        formData.append(`responses[${index}][template_id]`, resp.template_id);
        formData.append(`responses[${index}][value]`, resp.value as string | Blob);
      });

      findings.forEach((finding, index) => {
        formData.append(`findings[${index}][temuan]`, finding.temuan);
        if (finding.foto_temuan) {
          formData.append(`findings[${index}][foto_temuan]`, finding.foto_temuan);
        }
        formData.append(`findings[${index}][keterangan]`, finding.keterangan);
      });

      // Explicitly typed payload for saveLocalLog
      const logPayload: VisitLogPayload = {
        kode_kunjungan: currentKode,
        location_name: schedule?.location?.lokasi || "Unknown",
        responses: currentResponses as LocalResponse[],
        findings: [...findings]
      };
      saveLocalLog(logPayload);

      await visitService.createVisit(formData);
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Submit error:", err);
      setError("Failed to submit visit form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    schedule,
    template,
    responses,
    findings,
    isLoading,
    isSubmitting,
    isCompressing,
    error,
    success,
    elapsedSeconds,
    validation,
    handleInputChange,
    addFinding,
    updateFinding,
    removeFinding,
    submitForm,
  };
}
