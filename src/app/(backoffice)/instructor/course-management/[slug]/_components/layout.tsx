'use client'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { courseApi } from '@/services/courseService'
import { CourseContext } from '@/contexts/course-context'
import Navigation from './navigation'
import Guard from '@/components/custom/guard'

export default function CourseManagementClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getToken } = useAuth()
  const { slug } = useParams()
  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getCourse(slug as string, token || '')
    },
    queryKey: ['course', slug],
    staleTime: 1000 * 60 * 5,
  })
  if (error) return <div>Something went wrong</div>
  if (!course) return <div>Course not found</div>

  return (
    <Guard
      action="read"
      resource="course"
      resourceAttributes={{ ownerId: course.instructor_id.toString() }}
    >
      <div className="grid md:grid-cols-12 gap-4">
        <CourseContext.Provider value={course ? course : null}>
          <div className="col-span-9 flex flex-col gap-4">
            {isLoading ? 'Loading...' : children}
          </div>
          <div className="col-span-3 hidden md:flex flex-col gap-12">
            <Navigation />
          </div>
        </CourseContext.Provider>
      </div>
    </Guard>
  )
}
