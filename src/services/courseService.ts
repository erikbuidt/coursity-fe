import http from '@/lib/http'
import { createSearchParams } from '@/lib/utils'
import type { Course, Pagination } from '@/types/course.type'
import type { QueryParams, SuccessResApi } from '@/types/util.type'

export async function getCourses(queryParams: QueryParams): Promise<Pagination<Course>> {
  try {
    const res = await http.get<SuccessResApi<Pagination<Course>>>(
      `/courses?${createSearchParams(queryParams)}`,
      {},
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

export async function getCourse(slug: string, token?: string): Promise<Course | null> {
  try {
    const res = await http.get<SuccessResApi<Course>>(
      `/courses/${slug}`,
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
    console.error('Error fetching course:', error)

    if (error.response) {
      console.error('Status code:', error.response.status)
      console.error('Error data:', error.response.data)

      if (error.response.status === 404) {
        throw new Error('Course not found')
      }
    } else {
      console.error('Error message:', error.message)
    }

    return null
  }
}
