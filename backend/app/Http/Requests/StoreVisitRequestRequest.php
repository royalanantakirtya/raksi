<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVisitRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'location_id'  => 'required|exists:locations,id',
            'visit_type_id' => 'required|exists:visit_types,id',
            'notes'        => 'nullable|string',
        ];
    }
}
