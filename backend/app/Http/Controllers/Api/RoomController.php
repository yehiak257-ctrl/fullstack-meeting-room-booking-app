<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(){
        $rooms = Room::all();
        return response()->json([
            'data'=>RoomResource::collection($rooms),
        ]);
    }
    public function show(Room $room){
        return response()->json([
            'data'=>new RoomResource($room)
        ]);
    }
}
