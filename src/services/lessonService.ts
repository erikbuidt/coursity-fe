import http from '@/lib/http'
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
export const lessonApi = {
  completeLesson,
}
