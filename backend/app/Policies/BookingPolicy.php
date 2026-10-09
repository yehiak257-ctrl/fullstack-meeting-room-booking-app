<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function update(User $user, Booking $booking)
    {
        return $user->id === $booking->user_id;
    }
}