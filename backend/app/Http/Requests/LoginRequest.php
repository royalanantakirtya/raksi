<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_user' => 'required|string',
            'password'  => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_user.required' => 'Kode user wajib diisi.',
            'password.required'  => 'Password wajib diisi.',
        ];
    }
}
