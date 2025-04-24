export type User = {
  full_name: string
  email: string
  clerk_user_id: string
  role: string
  id: number
  image_url: string
}

export type CreateClerkUser = {
  full_name: string
  email: string
  role: string
  clerk_user_id: string
  image_url: string
}

export type UpdateClerkUser = Partial<CreateClerkUser>
