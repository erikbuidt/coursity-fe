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
