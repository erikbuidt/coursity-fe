import type { COURSE_STATUS } from '@/constants/course'
import { z, ZodType } from 'zod' // Add new import

export type Course = {
  id: number
  slug: string
  category: string
  title: string
  description: string
  image_url: string
  promotion_video_url: string
  price: number | string
  discount_price: number
  duration: number
  will_learns: string[]
  requirements: string[]
  lesson_count: number
  chapters: Chapter[]
  is_enrolled: boolean
  status: COURSE_STATUS
}
export type Pagination<T> = {
  items: T[]
  meta: {
    total_items: number
    item_course: number
    items_per_page: number
    total_pages: number
    current_page: number
  }
}

export type Chapter = {
  id: number
  title: string
  position: number
  lessons?: Lesson[]
  chapter_lesson_count?: number
  chapter_completed_lesson_count?: number
}

export type Lesson = {
  id: number
  chapter_id: number
  duration: number
  video_url: string
  video_provider: string
  title: string
  position: number
  is_completed?: boolean
}
export type CourseProgress = {
  id: number
  course_id: number
  user_id: number
  progress_percent: string
  completed_at: string
  last_lesson_id: number
}

export type CreateCoursePayload = {
  title: string
  description: string
  thumbnail: File | null | undefined
  price: number
  category?: string
  will_learns: string[]
  requirements: string[]
}

export const createCourseSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  price: z.number({
    required_error: 'Price is required',
  }),
  thumbnail: z
    .any({
      required_error: 'Thumbnail is required',
    })
    .refine((file) => file instanceof File || file === null, {
      message: 'Thumbnail must be a file',
    }),
  will_learns: z.array(z.string()).min(1, { message: 'At least one is required' }),
  requirements: z.array(z.string()).min(1, { message: 'At least one is required' }),
})

export interface CourseListConfig {
  page?: number
  limit?: number
  status?: string
  search?: string
}
