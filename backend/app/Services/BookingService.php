<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{

    public function isRoomAvailable(int $roomId , $date , $startTime , $endTime){
        $bookingRoom = Booking::
        where('room_id',$roomId)
        ->where('date',$date)
        ->where('start_time', '<' ,$endTime)
        ->where('end_time', '>' , $startTime)
        ->where('status','!=','cancelled')
        ->exists();

        return !$bookingRoom;
    }

    public function getRoomBookingsForDate(int $roomId, $date){
        return Booking::where('room_id',$roomId)
        ->where('date',$date)->orderBy('start_time','ASC')->get();
    }

    public function getRoomBookingByStatus(){
        return Booking::where('status','pending')
        ->where('created_at','<',Carbon::now()->subHours(24))->get();
    }

    public function createBooking(int $roomId  , $userId , $date , $startTime , $endTime){

        return DB::transaction(function () use ($roomId , $userId , $date , $startTime , $endTime) {

            Room::where('id', $roomId)->lockForUpdate()->first();

        if (!$this->isRoomAvailable($roomId, $date, $startTime, $endTime)) {
            throw new \Exception('الغرفه محجوزه بالفعل');
        }

            return Booking::create([
                    'room_id'=>$roomId,
                    'user_id'=>$userId,
                    'date' => $date,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => 'confirmed',
            ]);
        });
    }
    public function cancelBooking(Booking $booking){
        $booking->update([
            'status'=>'cancelled'
        ]);
    }
}
