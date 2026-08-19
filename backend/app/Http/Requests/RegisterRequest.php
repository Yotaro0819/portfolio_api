<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ミドルウェアで認証不要なら常に true
    }

    public function rules(): array
    {
        return [
            'name'                  => 'required|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|confirmed|min:8',
            'password_confirmation' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'The email has already been taken.',
            'password.confirmed' => 'The password field confirmation does not match.',
        ];
    }
}
