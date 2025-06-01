export type Course = {
  id: number
  slug: string
  title: string
  description: string
  image_url: string
  price: number
  discount_price: number
  duration: number
  will_learns: string[]
  requirements: string[]
  lesson_count: number
  chapters: Chapter[]
  is_enrolled: boolean
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
  lessons: Lesson[]
  chapter_lesson_count: number
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
