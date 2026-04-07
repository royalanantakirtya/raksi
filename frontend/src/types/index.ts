export interface User {
  id: number;
  kode_user: string;
  nama_user: string;
  peran: string;
  cabang: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: number;
  kode_lokasi: string;
  lokasi: string;
  alamat: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChecklistTemplate {
  id: number;
  visit_type_id: number;
  field_name: string;
  label: string;
  field_type: 'text' | 'number' | 'radio' | 'select' | 'file' | 'choice';
  options?: string[];
  is_required: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VisitType {
  id: number;
  nama_tipe: string;
  checklist_templates?: ChecklistTemplate[];
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  id: number;
  kode_jadwal: string;
  tanggal: string;
  user_id: number;
  user?: User;
  location_id: number;
  location: Location;
  id_mesin: string;
  visit_type_id: number;
  visit_type?: VisitType;
  periode_awal: string;
  periode_akhir: string;
  status?: string;
  sesi?: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface VisitRequest {
  id: number;
  user_id: number;
  user?: User;
  location_id: number;
  location: Location;
  visit_type_id: number;
  visit_type?: VisitType;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approved_by?: number;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VisitResponse {
  template_id: string | number;
  value: string;
}

export interface Visit {
  id: number;
  kode_kunjungan: string;
  tanggal: string;
  location_id: number;
  location?: Location;
  visit_type_id: number;
  visit_type?: VisitType;
  user_id: number;
  user?: User;
  schedule_id?: number;
  terjadwal: 'terjadwal' | 'tidak terjadwal';
  waktu_mulai: string;
  waktu_selesai?: string;
  created_at?: string;
  updated_at?: string;
  responses?: VisitResponse[];
}
