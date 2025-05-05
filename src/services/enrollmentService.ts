import http from '@/lib/http'
import type { Enrollment } from '@/types/enrollment.type'
import type { SuccessResApi } from '@/types/util.type'

export async function enroll(courseId: number, token: string): Promise<Enrollment> {
  const res = await http.post<SuccessResApi<Enrollment>>(
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

export async function getEnrollments(token: string) {
  const res = await http.get<SuccessResApi<string>>('/enrollments', {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  return res.payload.data
}
