import http from '@/lib/http'
import type { SuccessResApi } from '@/types/util.type'

export async function enroll(courseId: number, token: string): Promise<string> {
  console.log({ token })
  const res = await http.post<SuccessResApi<string>>(
    '/enrollments',
    { course_id: courseId },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  )
  return res.payload.data
}
