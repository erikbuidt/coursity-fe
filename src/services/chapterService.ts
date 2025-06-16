import http from '@/lib/http'
import type { Chapter } from '@/types/course.type'
import type { SuccessResApi } from '@/types/util.type'

async function upsertChapters(
  courseId: number,
  payload: { chapters: Partial<Chapter & { is_new: boolean }>[] },
  token: string,
): Promise<Chapter[] | null> {
  try {
    const res = await http.post<SuccessResApi<Chapter[]>>(
      `/chapters/course/${courseId}`,
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
    console.error('Error upsert chapter:', error)

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
export const chapterApi = {
  upsertChapters,
}
