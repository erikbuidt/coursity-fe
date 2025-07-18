import http from '@/lib/http'
import { createSearchParams } from '@/lib/utils'
import type { Course, Pagination } from '@/types/course.type'
import type { QueryParams, SuccessResApi } from '@/types/util.type'

async function getTaughtCourses(
  queryParams: QueryParams,
  token: string,
): Promise<Pagination<Course>> {
  try {
    const res = await http.get<SuccessResApi<Pagination<Course>>>(
      `/instructor/taught-courses?${createSearchParams(queryParams)}`,
      token
        ? {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        : {},
    )
    return res.payload.data
  } catch (error: any) {
    console.error('Error fetching courses:', error)

    if (error.response) {
      console.error('Status code:', error.response.status)
      console.error('Error data:', error.response.data)
    } else {
      console.error('Error message:', error.message)
    }

    throw new Error('Failed to fetch courses. Please try again later.')
  }
}

export const instructorApi = {
  getTaughtCourses,
}
