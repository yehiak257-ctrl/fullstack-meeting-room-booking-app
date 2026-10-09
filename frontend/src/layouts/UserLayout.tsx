import { PublicLayout } from './PublicLayout'

// Authenticated user pages share the public shell for a unified experience
export function UserLayout() {
  return <PublicLayout />
}
