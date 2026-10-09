<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'room_id'=>'required|exists:rooms,id',
            'date'=>'required|date',
            'start_time'=>'required|date_format:H:i',
            'end_time'=>'required|date_format:H:i',
            
        ];
    }
}
