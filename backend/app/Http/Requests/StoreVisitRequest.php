<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisitRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'kode_kunjungan'          => 'required|unique:visits',
      'tanggal'                 => 'required|date',
      'location_id'             => 'required|exists:locations,id',
      'visit_type_id'           => 'required|exists:visit_types,id',
      'terjadwal'               => 'required|in:terjadwal,tidak terjadwal',
      'waktu_mulai'             => 'nullable',
      'waktu_selesai'           => 'nullable',
      'durasi'                  => 'nullable',
      'responses'               => 'required|array',
      'responses.*.template_id' => 'required|exists:checklist_templates,id',
      'responses.*.value'       => 'nullable',
      // Findings support
      'findings'                => 'nullable|array',
      'findings.*.temuan'       => 'required|string',
      'findings.*.foto_temuan'  => 'nullable|file|image|max:5120',
      'findings.*.keterangan'   => 'nullable|string',
    ];
  }
}
