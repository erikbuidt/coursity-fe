import http from '@/lib/http'
import { createSearchParams } from '@/lib/utils'
import type { Course, Pagination } from '@/types/course.type'
import type { QueryParams, SuccessResApi } from '@/types/util.type'

export async function getCourses(queryParams: QueryParams): Promise<Pagination<Course>> {
  const res = await http.get<SuccessResApi<Pagination<Course>>>(
    `/courses?${createSearchParams(queryParams)}`,
    {},
  )
  return res.payload.data
}

export async function getCourse(slug: string): Promise<Course> {
  const res = await http.get<SuccessResApi<Course>>(`/courses/${slug}`, {})
  return res.payload.data
}
