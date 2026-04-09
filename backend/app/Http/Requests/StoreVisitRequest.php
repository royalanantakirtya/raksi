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
      'kode_kunjungan' => 'required|string|max:255',
      'responses' => 'required|array',
      'responses.*.template_id' => 'required|integer|exists:templates,id',
      'responses.*.value' => 'required|string',
    ];
  }
}
