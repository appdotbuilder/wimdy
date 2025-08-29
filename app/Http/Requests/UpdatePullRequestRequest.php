<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePullRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'source_branch' => 'required|string|max:255',
            'target_branch' => 'required|string|max:255',
            'status' => 'required|in:open,closed,merged',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Pull request title is required.',
            'description.required' => 'Pull request description is required.',
            'source_branch.required' => 'Source branch is required.',
            'target_branch.required' => 'Target branch is required.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be one of: open, closed, merged.',
        ];
    }
}