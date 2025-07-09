import http from '@/lib/http'
import { createSearchParams } from '@/lib/utils'
import type { Course, CourseProgress, CreateCoursePayload, Pagination } from '@/types/course.type'
import type { QueryParams, SuccessResApi } from '@/types/util.type'

async function getPublishedCourses(queryParams: QueryParams): Promise<Pagination<Course>> {
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
async function getAllCourses(queryParams: QueryParams, token: string): Promise<Pagination<Course>> {
  try {
    const res = await http.get<SuccessResApi<Pagination<Course>>>(
      `/courses/all?${createSearchParams(queryParams)}`,
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

async function getCourseProgress(slug: string, token: string): Promise<CourseProgress> {
  const res = await http.get<SuccessResApi<CourseProgress>>(
    `/courses/${slug}/progress`,
    token
      ? {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      : {},
  )
  return res.payload.data
}

async function getCourse(slug: string, token?: string): Promise<Course | null> {
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

async function updateCourse(
  slug: string,
  payload: Partial<Course>,
  token: string,
): Promise<Course | null> {
  try {
    const formData = new FormData()
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        value.forEach((item) => {
          if (item) formData.append(`${key}[]`, item as string)
        })
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob)
      }
    })
    const res = await http.put<SuccessResApi<Course>>(
      `/courses/${slug}`,
      formData,
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
      if (error.response.status === 400) {
        console.log(error.response.data)
        throw new Error('Bad request')
      }
    }

    return null
  }
}

async function submitToReview(slug: string, token: string): Promise<Course | null> {
  try {
    // biome-ignore lint/complexity/noForEach: <explanation>
    console.log('here')
    const res = await http.post<SuccessResApi<Course>>(
      `/courses/${slug}/submit-to-review`,
      {},
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
      if (error.response.status === 400) {
        console.log(error.response.data)
        throw new Error('Bad request')
      }
    }

    return null
  }
}

async function createCourse(payload: CreateCoursePayload, token: string): Promise<Course | null> {
  try {
    const formData = new FormData()
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        value.forEach((item) => {
          formData.append(`${key}[]`, item)
        })
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob)
      }
    })
    const res = await http.post<SuccessResApi<Course>>(
      '/courses',
      formData,
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
export const courseApi = {
  getCourse,
  getAllCourses,
  getPublishedCourses,
  getCourseProgress,
  createCourse,
  updateCourse,
  submitToReview,
}
