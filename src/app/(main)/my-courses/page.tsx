'use client'
import { ManagementCourseCard } from '@/components/custom/management-course-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { courseApi } from '@/services/courseService'
import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { MyCourseCard } from './components/MyCourseCard'

function MyCourse() {
  const { getToken } = useAuth()
  const { data: courses, isLoading } = useQuery({
    queryKey: ['myCourses'],
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getMyCourses(token || '')
    },
  })

  return (
    <>
      <div className="bg-stone-100">
        <div className="container px-4 md:max-w-5xl lg:max-w-6xl py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/my-courses">My Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-black">
        <div className="container px-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-white">
            <div className="relative col-span-12 md:col-span-8">
              <h1 className="text-2xl md:text-4xl font-bold">My Learning</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {courses?.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </>
  )
}

export default MyCourse
