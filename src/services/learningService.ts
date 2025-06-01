import http from '@/lib/http'
import type { Course } from '@/types/course.type'
import type { SuccessResApi } from '@/types/util.type'
async function getLearningCourse(slug: string, token: string): Promise<Course> {
  const res = await http.get<SuccessResApi<Course>>(
    `/learn/${slug}`,
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
export const learningApi = {
  getLearningCourse,
}
