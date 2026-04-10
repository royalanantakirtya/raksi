import { useState, useEffect } from "react";
import * as visitService from "../services/visitService";

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

  const handleInputChange = (id: string, value: string | number | File) => {
    setResponses(prev => ({
      ...prev,
      [id]: value
    }));
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

  const updateFinding = (id: string, data: Partial<ChecklistFinding>) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const removeFinding = (id: string) => {
    setFindings(prev => prev.filter(f => f.id !== id));
  };

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
    setIsSubmitting(true);
    setError("");
    
    try {
      const formData = new FormData();
      const currentKode = `V-${Date.now()}`;
      formData.append('kode_kunjungan', currentKode);
      formData.append('tanggal', new Date().toISOString().split('T')[0]);
      
      const locId = schedule?.location_id || (locationId ? parseInt(locationId) : null);
      if (locId) formData.append('location_id', locId.toString());
      
      const vtId = template?.id ? parseInt(template.id) : (visitTypeId ? parseInt(visitTypeId) : null);
      if (vtId) formData.append('visit_type_id', vtId.toString());
      
      formData.append('terjadwal', scheduleId ? 'terjadwal' : 'tidak terjadwal');

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
    error,
    success,
    handleInputChange,
    addFinding,
    updateFinding,
    removeFinding,
    submitForm,
  };
}
