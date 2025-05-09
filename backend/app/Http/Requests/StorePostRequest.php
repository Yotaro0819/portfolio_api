<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Tymon\JWTAuth\Facades\JWTAuth;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|max:255',
            'body'  => 'required',
            'image' => 'required|image',
            'price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'タイトルは必須です。',
            'body.required'  => '本文は必須です。',
            'image.required' => '画像は必須です。',
            'price.required' => '価格は必須です。',
        ];
    }

    protected function passedValidation(): void
    {
        // バリデーション通過後に認証ユーザーをマージしておく
        $this->merge([
            'user' => JWTAuth::parseToken()->authenticate(),
        ]);
    }
}
