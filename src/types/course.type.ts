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
}

export type Lesson = {
  id: number
  chapter_id: number
  duration: number
  image_url: string
  video_provider: string
  title: string
}
