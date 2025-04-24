import { env } from '@/config/env/server'
import http from '@/lib/http'
import type { User, CreateClerkUser, UpdateClerkUser } from '@/types/user.type'
import type { SuccessResApi } from '@/types/util.type'

export async function createClerkUser(createClerkUser: CreateClerkUser): Promise<User> {
  const res = await http.post<SuccessResApi<User>>('/user/create-clerk-user', createClerkUser, {
    headers: {
      apikey: env.CLERK_API_KEY,
    },
  })
  return res.payload.data
}

export async function updateClerkUser(updateClerkUser: UpdateClerkUser): Promise<string> {
  const res = await http.put<SuccessResApi<string>>('/user/update-clerk-user', updateClerkUser, {
    headers: {
      apikey: env.CLERK_API_KEY,
    },
  })
  return res.payload.data
}

export async function deleteClerkUser(clerkUserId: string): Promise<string> {
  const res = await http.delete<SuccessResApi<string>>(`/user/delete-clerk-user/${clerkUserId}`, {
    headers: {
      apikey: env.CLERK_API_KEY,
    },
  })
  return res.payload.data
}

export async function updateUser() {}
