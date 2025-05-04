import http from '@/lib/http'
import type { Course, Pagination } from '@/types/course.type'
import type { SuccessResApi } from '@/types/util.type'

export async function getCourses(): Promise<Pagination<Course>> {
  const res = await http.get<SuccessResApi<Pagination<Course>>>('/courses')
  return res.payload.data
}
