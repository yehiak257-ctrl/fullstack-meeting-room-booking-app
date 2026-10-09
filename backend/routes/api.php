<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Support\Facades\Route;


Route::get('/rooms',[RoomController::class,'index']);
Route::get('/rooms/{room}',[RoomController::class,'show']);

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);


Route::middleware('auth:sanctum')->group(function(){

        Route::post('/bookings',[BookingController::class,'store']);
        Route::get('/my-bookings', [BookingController::class, 'index']);
        Route::get('/bookings/{booking}',[BookingController::class,'show']);
        Route::patch('/bookings/{booking}/cancel',[BookingController::class,'cancel']);
        Route::get('/user', [AuthController::class, 'me']);
});

