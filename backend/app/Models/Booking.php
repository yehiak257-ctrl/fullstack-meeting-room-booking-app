<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable= [
        'user_id',
        'room_id',
        'status',
        'date',
        'start_time',
        'end_time'
    ];
    public function room(){
        return $this->belongsTo(Room::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
