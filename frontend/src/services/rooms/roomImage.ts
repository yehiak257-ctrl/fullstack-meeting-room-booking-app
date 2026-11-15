export function getRoomImage(room: { id: number | string; imageUrl?: string | null }) {
  return room.imageUrl || `/rooms/room-${room.id}.jpg`
}