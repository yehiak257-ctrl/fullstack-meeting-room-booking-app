<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Support\Facades\Auth;


class BookingController extends Controller
{
    public function index(){
        $userBooking = Booking::with('room')->where('user_id',Auth::id())->get();
        return response()->json([
            'data'=> BookingResource::collection($userBooking),
        ],200);
    }

    public function show(Booking $booking){
        return response()->json([
            'data'=>new BookingResource($booking),
        ]);
    }

    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService){
        $this->bookingService = $bookingService;
    }
    public function store(StoreBookingRequest $request){
        try{
            $data =$this->bookingService->createBooking(
                $request->room_id,
                auth()->id(),
                $request->date,
                $request->start_time,
                $request->end_time
            );
            $data->load('room');
            return response()->json([
                'message'=>'تم حجز الروم بنجاح',
                'data'=>new BookingResource($data),
            ],201);
        }
        catch(\Exception $e){
            return response()->json([
                'message'=>$e->getMessage()
            ],409);
        }
    }
    public function cancel(Booking $booking){

        $this->authorize('update',$booking);

        $this->bookingService->cancelBooking($booking);
        return response()->json([
            'message'=>'تم الغاء الحجز بنجاح'
        ]);
    }
}
