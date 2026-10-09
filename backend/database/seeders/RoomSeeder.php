<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            ['name' => 'Horizon Conference Room', 'capacity' => 20, 'location' => 'Floor 12, East Wing'],
            ['name' => 'Focus Pod Alpha', 'capacity' => 6, 'location' => 'Floor 5, West Wing'],
            ['name' => 'Innovation Lab', 'capacity' => 15, 'location' => 'Floor 3, Innovation Hub'],
            ['name' => 'Boardroom', 'capacity' => 12, 'location' => 'Floor 10, North Wing'],
            ['name' => 'Huddle Space', 'capacity' => 4, 'location' => 'Floor 2, Main Lobby'],
            ['name' => 'Training Hall', 'capacity' => 30, 'location' => 'Ground Floor'],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate(['name' => $room['name']], $room);
        }
    }
}