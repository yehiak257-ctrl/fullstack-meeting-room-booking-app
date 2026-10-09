import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { roomSchema, type RoomFormValues } from '@/schemas/roomSchema'
import { getRoomById, createRoom, updateRoom } from '@/services/rooms/roomService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isApiError } from '@/services/api/httpClient'
import { ArrowLeft } from 'lucide-react'

export function AdminRoomFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: existing } = useQuery({
    queryKey: ['room', id],
    queryFn: () => getRoomById(id!),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    values: existing
      ? {
          name: existing.name,
          capacity: existing.capacity,
          location: existing.location,
          description: existing.description ?? '',
          amenities: existing.amenities?.join(', ') ?? '',
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: async (values: RoomFormValues) => {
      const payload = {
        name: values.name,
        capacity: values.capacity,
        location: values.location,
        description: values.description || undefined,
        amenities: values.amenities
          ? values.amenities.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
      }
      if (isEdit) return updateRoom(id!, payload)
      return createRoom(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success(isEdit ? 'Room updated' : 'Room created')
      navigate('/admin/rooms')
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Save failed'),
  })

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/rooms">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit room' : 'Create room'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" {...register('capacity')} />
              {errors.capacity && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.capacity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} />
              {errors.location && (
                <p className="text-sm text-[var(--color-destructive)]">{errors.location.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input id="amenities" {...register('amenities')} placeholder="Projector, Whiteboard" />
            </div>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
