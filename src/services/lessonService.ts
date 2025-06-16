import http from '@/lib/http'
import type { Lesson } from '@/types/course.type'
import type { SuccessResApi } from '@/types/util.type'

async function completeLesson(
  courseId: number,
  chapterId: number,
  lessonId: number,
  token: string,
): Promise<unknown> {
  try {
    const res = await http.post<SuccessResApi<{ lesson_id: number }[]>>(
      `/lessons/${lessonId}/complete`,
      {
        course_id: courseId,
        chapter_id: chapterId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    )
    return res.payload.data
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

async function updateLessonPositions(
  payload: { lessons: Partial<Lesson>[] },
  token: string,
): Promise<Lesson[] | null> {
  try {
    const res = await http.patch<SuccessResApi<Lesson[]>>(
      '/lessons/positions',
      payload,
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
    console.error('Error update lesson positions:', error)

    if (error.response) {
      console.error('Status code:', error.response.status)
      console.error('Error data:', error.response.data)

      if (error.response.status === 404) {
        throw new Error('Lesson not found')
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

async function updateLesson(
  lessonId: number,
  payload: Partial<Lesson>,
  token: string,
): Promise<Lesson | null> {
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
    const res = await http.put<SuccessResApi<Lesson>>(
      `/lessons/${lessonId}`,
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
    console.error('Error update lesson:', error)

    if (error.response) {
      console.error('Status code:', error.response.status)
      console.error('Error data:', error.response.data)

      if (error.response.status === 404) {
        throw new Error('Lesson not found')
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

async function createLesson(payload: Partial<Lesson>, token: string): Promise<Lesson | null> {
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
    const res = await http.post<SuccessResApi<Lesson>>(
      '/lessons',
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
    console.error('Error update lesson:', error)

    if (error.response) {
      console.error('Status code:', error.response.status)
      console.error('Error data:', error.response.data)

      if (error.response.status === 404) {
        throw new Error('Lesson not found')
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
export const lessonApi = {
  completeLesson,
  updateLessonPositions,
  updateLesson,
  createLesson,
}
