import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getRooms, deleteRoom } from '@/services/rooms/roomService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { RoomFilters } from '@/types'
import { isApiError } from '@/services/api/httpClient'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export function AdminRoomsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<RoomFilters>({ page: 1, perPage: 15 })
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rooms', filters],
    queryFn: () => getRooms(filters),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room deleted')
      setDeletingId(null)
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Delete failed'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('admin.rooms')}</h1>
        <Button asChild>
          <Link to="/admin/rooms/create">
            <Plus className="h-4 w-4" />
            Add room
          </Link>
        </Button>
      </div>

      <Input
        placeholder="Search rooms…"
        className="max-w-sm"
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
      />

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/50">
            <tr>
              <th className="px-4 py-3 text-start font-medium">Name</th>
              <th className="px-4 py-3 text-start font-medium">Location</th>
              <th className="px-4 py-3 text-start font-medium">Capacity</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                  Loading…
                </td>
              </tr>
            )}
            {data?.data.map((room) => (
              <tr key={room.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-medium">{room.name}</td>
                <td className="px-4 py-3 text-[var(--color-muted-foreground)]">{room.location}</td>
                <td className="px-4 py-3">{room.capacity}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/rooms/${room.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    {deletingId === room.id ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(room.id)}
                        >
                          Confirm
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => setDeletingId(room.id)}>
                        <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data && data.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
